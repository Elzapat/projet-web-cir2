// Variable that I'm going to use in other scripts to let them know
// when the navbar has finished loading

fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.querySelector("nav").innerHTML = data;
        // Try to log in when the page loads
        // Only works if there are login and token cookies
        // The navbar has to finish loading before logging in
        // because the program is accessing its elements
        log_in();
    });

fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.querySelector("footer").innerHTML = data;
    });
