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

        let isen_select = "<select class='location input-text'>"
        for (let isen_loc of isen_locations)
            isen_select += `<option value="${isen_loc}">${isen_loc}</option>`;
        isen_select += "</select>"

        let loc_input = "<input class='location input-text' placeholder=\"Adresse :dest\" type='text' oninput='autocomplete_addresses(event)'>";

        let start_loc_container = document.getElementById("start-loc");
        let end_loc_container = document.getElementById("end-loc");

        if (event.target.value == "from_ISEN") {
            start_loc_container.innerHTML = isen_select;
            end_loc_container.innerHTML = loc_input.replace(":dest", "d'arrivée");
        } else if (event.target.value == "to_ISEN") {
            end_loc_container.innerHTML = isen_select;
            start_loc_container.innerHTML = loc_input.replace(":dest", "de départ:");
        }
    });
}

// Controller to abort addresses fetch request so as not to
// do a lot of requests at once
let controller = new AbortController();
let signal = controller.signal;

// Autocomplete addresses when the user starts typing an adress
function autocomplete_addresses(event) {
    // Abort all current address fetch requests;
    // controller.abort();

    let input = event.target.value;
    // Base OpenStreetMap API request
    let request = "https://nominatim.openstreetmap.org/search.php?";
    // Add the address the user is typing 
    request += "street=" + input;
    // Format the response to JSON
    request += "&format=jsonv2";
    // Limit the number of results to 5
    request += "&limit=5";
    // Limit the search to only France
    request += "&countrycodes=FR";
    // Break the address into componants
    request += "&addressdetails=1";
    // Insert my email address so they can track who makes requests
    request += "&email=vanamerongen.morgan@gmail.com"

    fetch(request, { method: "GET", signal: signal })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err.message));
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
    }, 1000);

    return false;
}

function get_trips() {

}
