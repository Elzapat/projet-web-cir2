let info = document.getElementById("info");

// Get all the ISEN locations
let isen_locations = new Array();
fetch("../api/v1/request.php/sites_isen", { method: "GET" })
    .then(response => response.json())
    .then(locations => {
        locations.forEach(loc => {
            isen_locations.push(loc["nom"]);
        });
    })
    .catch(err => {
        info.innerHTML = `Erreur à l'obtention des sites ISEN (${err.message})`;
        info.style.opacity = 1;
    });
    
// Variable to keep track whether we go to ISEN or start from ISEN
let start_ISEN = false;

// Get all the elements with the dest-choice class
let choice_buttons = document.getElementsByClassName("dest-choice");
// Loop over the elements and add an event when they're clicked
for (let button of choice_buttons) {
    button.addEventListener("click", event => {
        // Remove the "selected" class to all the buttons
        for (let button of choice_buttons) 
            button.classList.remove("selected");
        // Add the "selected" class to the clicked button
        event.target.classList.add("selected");

        let isen_select = "<select id=':id' class='location input-text'>"
        for (let isen_loc of isen_locations)
            isen_select += `<option value="${isen_loc}">${isen_loc}</option>`;
        isen_select += "</select>"

        let loc_input = "<input id=':id' class='location input-text' placeholder=\"Adresse :dest\" type='text' oninput='autocomplete_addresses(event)'>";

        let start_loc_container = document.getElementById("start-loc");
        let start_loc_container_p = document.getElementById("start-loc");

        let end_loc_container = document.getElementById("end-loc");

        if (event.target.value == "from_ISEN") {
            start_ISEN = true;
            start_loc_container.innerHTML = isen_select.replace(":id", "start-input");
            end_loc_container.innerHTML = loc_input
                .replace(":dest", "d'arrivée")
                .replace(":id", "end-input");
        } else if (event.target.value == "to_ISEN") {
            start_ISEN = false;
            end_loc_container.innerHTML = isen_select.replace(":id", "end-input");
            start_loc_container.innerHTML = loc_input
                .replace(":dest", "de départ")
                .replace(":id", "start-input");
        }
    });
}

document.getElementById("search-trip").onsubmit = event => {
    // If no choice button is selected, show an error and abort
    let selected = false;
    for (let button of choice_buttons) {
        if (button.classList.contains("selected")) {
            selected = true
            break;
        }
    }

    if (!selected) {
        info.innerHTML = "Aller à l'ISEN ou partir de l'ISEN, il faut choisir !";
        info.style.opacity = 1;
        return false;
    }

    // Make the inside of the form disappear
    for (let child of event.target.childNodes) {
        if (child.nodeName.toLowerCase() == "div")
            child.style.opacity = 0;
    }

    // Get the search parameters
    let start_input = document.getElementById("start-input");
    let end_input = document.getElementById("end-input");
    let start_loc = start_input.dataset.pos ?? start_input.value;
    let end_loc = end_input.dataset.pos ?? end_input.value;
    let date = document.getElementById("date-input").value;

    // 500ms after, grow the form to the maximum
    setTimeout(() => {
        let footer_height = getComputedStyle(document.getElementsByClassName("footer")[0]).height;
        let navbar_height = getComputedStyle(document.getElementsByClassName("navbar")[0]).height;
        let container = document.getElementById("search-trip");
        container.style.borderRadius = 0;
        container.style.width = "100%";
        container.style.height = `calc(100vh - ${footer_height} - ${navbar_height})`;
    }, 500);

    // 500ms after, display a loading icon and start fetching the trips
    setTimeout(() => {
        let main = document.getElementsByTagName("main")[0];
        main.style.background = "var(--background-color)";
        main.innerHTML = "<img class='loading-icon' src='images/loading.svg'>";

        get_city(start_loc, end_loc, date);
    }, 1000);

    return false;
}

function get_city(start_loc, end_loc, date) {
    let isen = start_ISEN ? start_loc : end_loc;
    // Get the city from the gps coordinates we got from the input
    let request;
    if (start_ISEN)
        request = `https://photon.komoot.io/reverse?lat=${end_loc.split(';')[0]}&lon=${end_loc.split(';')[1]}`;
    else 
        request = `https://photon.komoot.io/reverse?lat=${start_loc.split(';')[0]}&lon=${start_loc.split(';')[1]}`;

    fetch(request, { method: "GET" })
        .then(response => {
            if (response.status === 400)
                throw new Error("wrong coords");
            else if (response.ok)
                return response.json();
        })
        .then(data => get_trips(extract_city_from_api_results(data), isen, date))
        .catch(err => {
            // If, for some reason, the coords passed are not valid,
            // try to get the city name another way
            request = `https://photon.komoot.io/api/?q=${start_ISEN ? end_loc : start_loc}&limit=5&lang=fr&lat=48.202047&lon=-2.932644`;
            fetch(request, { method: "GET" })
                .then(response => response.json())
                .then(data => get_trips(extract_city_from_api_results(data), isen, date));
        })
        .catch(err => {
            // get_trips(start_ISEN ? end_loc : start_loc, isen, date);
            document.getElementsByTagName("main")[0].innerHTML = 
                `<div id='error'>Location de départ / arrivée invalide (${err.message})</div>`;
        });
}

function extract_city_from_api_results(data) {
    if (data.features.length == 0)
        throw new Error("empty data");
    for (let result of data.features) {
        if (result.properties.type == "city")
            return result.properties.name;
        else if (result.properties.city != undefined)
            return result.properties.city;
    }
    throw new Error("no valid result");
}

function get_trips(city, isen, date) {
    let request = `../api/v1/request.php/trajets?date=${date}
&depart=${start_ISEN ? isen : city}&arrivee=${start_ISEN ? city : isen}
&depart_isen=${start_ISEN ? 1 : 0}`;

    fetch(request, { method: "GET" })
        .then(response => response.json())
        .then(data => display_trips_results(city, isen, date, data))
        .catch(err => {
            console.log(err);
            document.getElementsByTagName("main")[0].innerHTML = 
                `<div id='error'>Erreur à la recherche de trajets (${err.message})</div>`;
        });
}

function display_trips_results(search_city, search_isen, search_date, trips) {
    let main = document.getElementsByTagName("main")[0];

    let start = start_ISEN ? search_isen : search_city;
    let end = start_ISEN ? search_city : search_isen;
    let nb_results = trips.length.toString();
    nb_results += " resultat" + nb_results > 1 ? 's' : '';
    main.innerHTML = `
        <section id="search-trips-results">
            <div class="result-row" id="recap">
                <a id="start-loc-res" class="brut-input">${start}</a>
                <img id="arrow" src="images/fleches.png">
                <a id="end-loc-res" class="brut-input">${end}</a>
                <a id="date-search" class="brut-input">${search_date}</a>
                <a id="nb-results" class="brut-input">${nb_results}</a>
            </div>
        </section>
    `;
    let container = document.getElementById("search-trips-results");

    for (let trip of trips) {
        let depart_isen = parseInt(trip.depart_isen);
        let depart = depart_isen ? trip.isen : trip.ville;
        let arrivee = depart_isen ? trip.ville : trip.isen;

        let heure_depart = prettier_time(trip.date_depart.split(' ')[1]);
        let heure_arrivee = prettier_time(trip.date_arrivee.split(' ')[1]);
        let duree_trajet = prettier_time(trip.duree_trajet);

        let nb_places = parseInt(trip.nb_places_restantes);

        container.innerHTML += `
            <div class="result-row result">
                <span class="city">${depart}</span>
                <span class="time">${heure_depart}</span>
                <span class="arrow">></span>
                <span class="city">${arrivee}</span>
                <span class="time">${heure_arrivee}</span>
                <span class="duration">Durée : ${duree_trajet}</span>
                <span class="price">Prix : ${trip.prix}€</span>
                <span class="seats">${nb_places} place${nb_places > 1 ? 's' : ''}</span>
                <span class="driver">par ${trip.pseudo}</span>
                <button class="choice">Choisir</button>
            </div>
        `;
    }
}

function prettier_time(time) {
    let hours_mins = time.split(':');
    hours_mins.pop();
    return hours_mins.join('h');
}

// Keep the ID of the timeout, to stop it if the user starts typing again
let timeout = 0;
// Autocomplete addresses when the user starts typing an adress
function autocomplete_addresses(event) {
    let input = event.target.value;
    // Stop the queued timeout so as not to spam the API
    clearTimeout(timeout);
    timeout = setTimeout(() => fetch_matching_addresses(event.target, input), 1000);
}

function fetch_matching_addresses(input, query) {
    // Using the photon API, which uses OpenStreetMap
    // Limiting the number of results to 10 and putting priority to BRETAGNE
    let request = `https://photon.komoot.io/api/?q=${query}&limit=10&lang=fr&lat=48.202047&lon=-2.932644`;

    fetch(request, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            let results = new Array();
            data.features.forEach(res => {
                let street = res.properties.street ?? res.properties.name ?? "";
                let city = res.properties.city ?? "";
                results.push({
                    name: `${street} <strong>${city}</strong>`,
                    lon: res.geometry.coordinates[0] ?? 0.0,
                    lat: res.geometry.coordinates[1] ?? 0.0
                });
            });
            autocomplete(input, results);
        });
        // .catch(err => console.log(err));
}

// Functions to handle the autocomplete list
// ---------------------------------------------

// Remove all autocomplete items
function close_all_lists() {
    let items = document.getElementsByClassName("autocomplete-items");
    for (let item of items)
        item.parentNode.removeChild(item);
}

// Add autocomplete results under a desired input
function autocomplete(input, results) {
    close_all_lists();

    let list = document.createElement("div");
    list.setAttribute("id", "autocomplete-list");
    list.setAttribute("class", "autocomplete-items");
    input.parentNode.appendChild(list);

    for (let res of results) {
        let item = document.createElement("div");
        item.innerHTML = res.name;
        item.dataset.pos = res.lat + ';' + res.lon;
        item.onclick = event => {
            // Remove HTML tags
            input.dataset.pos = item.dataset.pos;
            input.value = event.target.innerHTML.replace(/(<([^>]+)>)/ig, '');
            close_all_lists();
        }
        list.appendChild(item);
    }
}

// Close the autocomplete when the page is clicked
document.onclick = () => {
    close_all_lists();
}
