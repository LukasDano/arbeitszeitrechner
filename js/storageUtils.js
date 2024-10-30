function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
}

function getBooleanCookie(name){
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            if (cookieValue === "true") {
                return true;
            } else if (cookieValue === "false" || cookieValue === null) {
                return false;
            }
        }
    }
}

function setCookie(name, value, expirationDate) {
    let expires = '';
    if (expirationDate instanceof Date) {
        expires = '; expires=' + expirationDate.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function setCookieUntilMidnight(name, value) {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const expires = '; expires=' + midnight.toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
