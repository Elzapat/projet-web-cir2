// Get all the ISEN places

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

        if (event.target.value == "from_ISEN") {
            let start_loc_container = document.getElementById("start-loc");
            start_loc_container.innerHTML = ""
        } else if (event.target.value == "to_ISEN") {
            let end_loc_container = document.getElementById("end-loc");
            end_loc_container.innerHTML = "";
        }
    });
}

document.getElementById("search-trip").onsubmit = () => {
    // If no choice button is selected, show an error and abort
    let selected = false;
    for (let button of choice_buttons) {
        if (button.classList.contains("selected")) {
            selected = true
            break;
        }
    }
    if (!selected) {
        let error_placeholder = document.getElementById("error");
        error_placeholder.innerHTML = "Aller à l'ISEN ou partir de l'ISEN,\
            il faut choisir !";
        error_placeholder.style.opacity = 1;
        return false;
    }

    let footer_height = getComputedStyle(document.getElementsByClassName("footer")[0]).height;
    let navbar_height = getComputedStyle(document.getElementsByClassName("navbar")[0]).height;
    let container = document.getElementById("search-trip");
    container.style.borderRadius = 0;
    container.style.width = "100%";
    container.style.height = `calc(100vh - ${footer_height} - ${navbar_height})`;

    return false;
}
