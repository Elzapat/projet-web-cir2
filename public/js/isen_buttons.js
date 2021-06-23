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

        let loc_input = "<input autocomplete='off' id=':id' class='location input-text' placeholder=\"Adresse :dest\" type='text' oninput='autocomplete_addresses(event)'>";

        let start_loc_container = document.getElementById("start-loc");

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
