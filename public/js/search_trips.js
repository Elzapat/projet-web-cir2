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
                <a id="nb-results" class="brut-input">${nb_results} résultat${nb_results > 1 ? 's' : ''}</a>
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
                <span id="button-trip">
                <button
                    id="choise-button"
                    data-start-loc="${depart}"
                    data-end-loc="${arrivee}"
                    data-start-time="${heure_depart}"
                    data-end-time="${heure_arrivee}"
                    data-price="${trip.prix}"
                    data-trip-id="${trip.id_trajet}"
                    class="choice"
                ></span>
                    Choisir
                </button>
            </div>
        `;
    }

    // Validation page when choosing a trip
    for (let button of document.getElementsByClassName("choice")) {
        
        if (!Cookies.exists("login") && !Cookies.exists("token")) {
            document.getElementById("choise-button").innerHTML = "Se connecter";
            button.setAttribute('onclick',"window.location.href='signin.html';");
        } else {
            button.addEventListener("click", event => {
                display_validation_page(event.target);
            });
        }
    }

}

function display_validation_page(button) {
    document.getElementById("search-trips-results").style.transform = "translateX(-100vw)";

    setTimeout(() => {
        document.getElementsByTagName("main")[0].innerHTML = `
            <section id="validation">
                <div class="publish-row">
                    <a  class="text-valid">
                        <svg id="logo" class="link-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-car fa-w-16 fa-9x"><path fill="currentColor" d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z" class=""></path></svg>
                    </a>
                    <a class="text-valid">${button.dataset.price}</a>
                </div>
                <div class="publish-row">
                    <div id="loc">
                        <div class="publish-row text-valid">
                            <div>
                                <a>${button.dataset.startLoc}</a><br>
                                <a>${button.dataset.startTime}</a>
                            </div>
                            <div>
                                <a>${button.dataset.endLoc}</a><br>
                                <a>${button.dataset.endTime}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="publish-row">
                    <a class="text-valid">5,00€</a>
                </div>
                <div class="publish-row">
                    <button id="validate-trip">Valider</button>
                </div>
                <div class="publish-row">
                    <button>Télécharger le récapitulatif</button>
                </div>
            </section>
        `;

        document.getElementById("validate-trip").addEventListener("click", () => {
            let options = {
                method: "POST",
                body: JSON.stringify({
                    id_trajet: button.dataset.tripId,
                    login: Cookies.get("login")
                }),
                headers: new Headers({ "Authorization": "Bearer " + Cookies.get("token") })
            };
            fetch(`../api/v1/request.php/trajets/passagers`, options)
                .then(response => {
                    if (!response.ok)
                        throw new Error("Erreur à la validation");
                    alert("Inscription validée ! Vous partez pour " + button.dataset.endLoc);
                    location.replace("search_trips.html");
                })
                .catch(err => {
                    alert("Erreur: " + err.message);
                });
        });
    }, 500);
}

function prettier_time(time) {
    let hours_mins = time.split(':');
    hours_mins.pop();
    return hours_mins.join('h');
}
