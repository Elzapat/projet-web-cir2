// Keep the ID of the timeout, to stop it if the user starts typing again
let timeout = 0;
// Autocomplete addresses when the user starts typing an adress
function autocomplete_addresses(event) {
    let input = event.target.value;
    // Stop the queued timeout so as not to spam the API
    clearTimeout(timeout);
    timeout = setTimeout(() => fetch_matching_addresses(event.target, input), 1000);
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

// Close the autocomplete when the page is clicked
document.onclick = () => {
    close_all_lists();
}
