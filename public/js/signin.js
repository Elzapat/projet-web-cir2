document.getElementsByClassName("sign-in")[0].onsubmit = () => {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    let info = document.getElementById("info"); 

    validate_login(login, password)
        .then(() => {
            //info.innerHTML = "Vous êtes connecté";
            //info.style.opacity = 1;

            log_in();
            change_connect_page();
            console.log(document.referrer);
            //history.go(-1);
        })
        .catch(error => {
            info.innerHTML = error.message;
            info.style.opacity = 1;
        });

    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    change_connect_page();
});

function change_connect_page() {
    if (Cookies.exists("login") && Cookies.exists("token")) {
        let main = document.getElementsByTagName("main")[0];
        let username = Cookies.get("login");

        fetch(`../api/v1/request.php/utilisateurs/${username}`, { method: "GET" })
            .then(response => response.json())
            .then(infos => {
                infos.forEach(inf => {
                    let last_name =inf["nom"];
                    let first_name = inf["prenom"];
                    let phone = inf["num_tel"];
  
                    main.innerHTML = `
                    <form class="sign-up">
                        <a id="username" class="input-text">Pseudo : ${username}</a>
                        <a id="first-name" class="input-text">Prénom : ${first_name}</a>
                        <a id="last-name" class="input-text">Nom : ${last_name}</a>
                        <a id="phone" class="input-text">Tél : ${phone}</a>
                        <button id="disconnect" type="submit" onclick="Cookies.delete_all()">Se déconnecter</button>
                    </form>
                    `;

                });
            })
            .catch(err => {
                info.innerHTML = `Erreur à l'obtention des infos utilisateurs (${err.message})`;
                info.style.opacity = 1;
            });
        
    }
}