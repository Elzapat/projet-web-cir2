document.getElementsByClassName("sign-in")[0].onsubmit = () => {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    let info = document.getElementById("info"); 

    validate_login(login, password)
        .then(() => {
            //info.innerHTML = "Vous êtes connecté";
            //info.style.opacity = 1;

            log_in(); //ici jsp si on peut regrouper les deux fonctions
            change();
            history.go(-1);
        })
        .catch(error => {
            info.innerHTML = error.message;
            info.style.opacity = 1;
        });

    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    change();
});

function change() {
    if (Cookies.exists("login") && Cookies.exists("token")) {
        let main = document.getElementsByTagName("main")[0];
        
        let username = Cookies.get("login");

        let user_infos = new Array();
        fetch(`../api/v1/request.php/utilisateurs/${username}`, { method: "GET" })
            .then(response => response.json())
            .then(infos => {
                infos.forEach(inf => {
                    user_infos.push(inf["nom"]);
                    user_infos.push(inf["prenom"]);
                    user_infos.push(inf["num_tel"]);
                });
            })
            .catch(err => {
                info.innerHTML = `Erreur à l'obtention des infos utilisateurs (${err.message})`;
                info.style.opacity = 1;
            });
        
        //faut aller chercher le reste dans la base
        let first_name = user_infos[1]; 
        let last_name = user_infos[0];
        let phone = user_infos[2];
    
        main.innerHTML = `
            <form class="sign-up">
                <a id="username" class="input-text">${username}</a>
                <a id="first-name" class="input-text">${first_name}</a>
                <a id="last-name" class="input-text">${last_name}</a>
                <a id="phone" class="input-text">${phone}</a>
                <button id="disconnect" type="submit" onclick="Cookies.delete_all()">Se déconnecter</button>
            </form>
    `;
    }
}