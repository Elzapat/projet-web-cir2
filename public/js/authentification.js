async function validate_login(login, password) {
    Cookies.set("login", login);

    let options = {
        headers: new Headers({"Authorization": "Basic " + btoa(login + ':' + password)})
    };

    return fetch("../auth/auth.php/authenticate", options)
        .then(response => {
            if (!response.ok)
                throw new Error(response.status == 401 ?
                    "Pseudo ou mot de passe incorrect" : "Erreur interne");
            return response.text();
        })
        .then(token => {
            Cookies.set("token", token);
        });
}

function log_in() {
    if (!Cookies.exists("login") && !Cookies.exists("token"))
        return;

    document.getElementById("account-username").innerHTML = Cookies.get("login");
    // document.getElementById("account-signin").href = "";
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
