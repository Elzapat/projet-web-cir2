class Cookies {
    static set(key, value) {
        // Set the Cookie expiration date to a week from now
        let expire_date = new Date();
        expire_date.setDate(expire_date.getDate() + 7);
        let expires = "expires=" + expire_date.toUTCString();

        document.cookie = `${key}=${value};SameSite=Lax;${expires};path=/`;
    }

    static get(key) {
        if (!Cookies.exists(key))
            return null;

        return document.cookie
            .split(';')
            .find(row => row.trim().startsWith(key + '='))
            .split('=')[1];
    }

    static exists(key) {
        return document.cookie.split(';').some(item => item.trim().startsWith(key + '='))
    }
}
