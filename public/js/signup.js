document.getElementsByClassName("sign-up")[0].onsubmit = () => {
    let username = document.getElementById("username").value;
    let first_name = document.getElementById("first-name").value;
    let last_name = document.getElementById("last-name").value;
    let password = document.getElementById("password").value;
    let password_confirm = document.getElementById("password-confirm").value;
    let phone = document.getElementById("phone").value;

    let error_container = document.getElementById("error");

    if (password != password_confirm) {
        error_container.innerHTML = "Les deux mots de passe rentrés sont différents";
        error_container.style.opacity = 1;
        return false;
    }

    fetch(`../../api/v1/request.php/utilisateurs/pseudo/${username}`, { method: "GET"})
        .then(response => {
            if (!response.ok)
                throw new Error("Erreur interne");
            return response.json();
        })
        .then(async user_exists => {
            console.log(user_exists);
            if (user_exists)
                throw new Error("Ce pseudo est déjà pris");
            return fetch("../../api/v1/request.php/utilisateurs", {
                method: "POST",
                body: JSON.stringify({ username: username, first_name: first_name,
                        last_name: last_name, password: password, phone, phone })
            })
            .then(response => response.text())
            .then(creation_success => {
                if (!creation_success)
                    throw new Error("Errur à la création du compte");
                error_container.innerHTML = "Compte créé avec succès";
                error_container.style.opacity = 1;
            });
        })
        .catch(error => {
            error_container.innerHTML = error.message;
            error_container.style.opacity = 1;
        });

    return false;
}
