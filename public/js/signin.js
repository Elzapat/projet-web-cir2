document.getElementsByClassName("sign-in")[0].onsubmit = () => {
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    let info = document.getElementById("info"); 

    validate_login(login, password)
        .then(() => {
            info.innerHTML = "Vous êtes connecté";
            info.style.opacity = 1;

            log_in();
            history.go(-1);
        })
        .catch(error => {
            info.innerHTML = error.message;
            info.style.opacity = 1;
        });

    return false;
}
