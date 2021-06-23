// Keep the ID of the timeout, to stop it if the user starts typing again
let timeout = 0;
// Autocomplete addresses when the user starts typing an adress
function autocomplete_addresses(event) {
    let input = event.target.value;
    // Stop the queued timeout so as not to spam the API
    clearTimeout(timeout);
    timeout = setTimeout(() => fetch_matching_addresses(event.target, input), 300);
}

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

function fetch_matching_addresses(input, query) {
    if (query == "")
        return;
    // Using the photon API, which uses OpenStreetMap
    // Limiting the number of results to 10 and puttkjdqmlksjdqlmsng priority to BRETAGNE
    let request = `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=10`;

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

// Close the autocomplete when the page is clicked
document.onclick = () => {
    close_all_lists();
}
