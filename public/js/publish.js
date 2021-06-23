let info = document.getElementById("info");

document.addEventListener('DOMContentLoaded', function() {
    if (!Cookies.exists("login") && !Cookies.exists("token")) {

        let elems = document.getElementsByClassName('input-text');
        disable(elems);

        elems = document.getElementsByClassName('dest-choice');
        disable(elems);
   
        document.getElementById("publish-trip").style.action = "signup.html";

        publish_button = document.getElementById("publish");
        publish_button.innerHTML = "Se connecter";
        publish_button.type = "button";
        publish_button.setAttribute('onclick',"window.location.href='signin.html';");

        info.style.opacity = 0;

        no_connect = document.getElementById("no-connect");
        no_connect.style.display = "flex";
    }
});

function disable(elems) {
    for (let i=0 ; i<elems.length ; i+=1){
        elems[i].style.opacity = "0.5";
        elems[i].disabled = "true";
    }
}

document.getElementById("publish-trip").onsubmit = event => {
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

    // Make sure the user has selected a location from the list
    let address_input = document.getElementById(start_ISEN ? "end-input" : "start-input");
    let isen_input = document.getElementById(start_ISEN ? "start-input" : "end-input");
    if (address_input.dataset.pos == undefined) {
        info.innerHTML = "Veuillez selectionner une location à partir de la liste de choix"; 
        info.style.opacity = 1;
    }

    let city, isen_city;
    get_city(address_input.dataset.pos)
        .then(city_name => get_city_info(city_name))
        .then(city_info => {
            city = city_info;
            return get_city_info(isen_input.value.split(' ')[1]);
        })
        .then(isen_city_info => {
            isen_city = isen_city_info;
            return add_trip(city, isen_city);
        })
        .then(success => {
            if (success) {
                info.innerHTML = "Votre trajet a été publié avec succès";
                info.style.opacity = 1;
                event.target.reset();
            } else
                throw new Error("Erreur interne");
        })
        .catch(err => {
            console.log(err);
            info.innerHTML = err.message;
            info.style.opacity = 1;
        })

    return false;
}

async function get_city(coords) {
    request = `https://photon.komoot.io/reverse?lat=${coords.split(';')[0]}&lon=${coords.split(';')[1]}`;

    return fetch(request, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            for (let res of data.features) {
                if (res.properties.city != undefined)
                    return res.properties.city
                if (res.properties.type = "city")
                    return res.properties.name
                throw new Error("Veuillez choisir une ville ou adresse parmi la liste");
            }
        });
}

async function get_city_info(city) {
    let request = `../api/v1/request.php/villes/${city}`
    return fetch(request, { method: "GET" })
        .then(response => {
            if (!response.ok)
                throw new Error("Ville inconnue");
            return response.json();
        });
}

async function add_trip(city, isen_city) {
    // TODO: use an API to automate this
    let start_time = document.getElementById("time").value.split(':');
    let start_date = document.getElementById("date").value;
    let duration = "01:30".split(':');
    let end_time = [(parseInt(start_time[0]) + parseInt(duration[0])).toString(),
                    (parseInt(start_time[1]) + parseInt(duration[0])).toString()];
    let end_datetime = start_date + ' ' + end_time.join(':');

    let options = {
        method: "POST",
        body: JSON.stringify({
            login: Cookies.get("login"),
            price: document.getElementById("price").value,
            nb_seats: document.getElementById("seats").value,
            start_datetime: start_date + ' ' + start_time.join(':'),
            end_datetime: end_datetime,
            duration: duration.join(':'),
            start_address: city.nom,
            end_address: isen_city.nom,
            city: city.code_insee,
            isen: isen_city.code_insee,
            isen_start: start_ISEN ? 1 : 0
        }),
        headers: new Headers({ "Authorization": "Bearer " + Cookies.get("token") })
    };

    return fetch("../api/v1/request.php/trajets", options)
        .then(response => {
            if (response.status == 401)
                throw new Error("Votre session a expiré, reconnectez vous");
            else if (!response.ok)
                throw new Error("Erreur interne");

            return response.text();
        })
}
