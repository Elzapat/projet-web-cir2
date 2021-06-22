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