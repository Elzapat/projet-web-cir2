fetch("html/navbar.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("nav").innerHTML = data;
    });

fetch("html/footer.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("footer").innerHTML = data;
    });
