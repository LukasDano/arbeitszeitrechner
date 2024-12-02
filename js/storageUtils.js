function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
}

function getBooleanCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
            if (cookieValue === "true") {
                return true;
            } else if (cookieValue === "false" || cookieValue === null) {
                return false;
            }
        }
    }
}

function getIntCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
            return parseInt(decodeURIComponent(cookieValue));
        }
    }
}


/**
 * Gibt den Namen des Icons aus der JSON Datei zurück.
 * (Wenn der Pfad zum Icon abgespeichert wurde)
 *
 * @param {string} name Der Name unter dem der Cookie gespeichert wurde
 * @return Den reinen IconNamen, so wie er auch in der JSON Datei steht oder NULL,
 * wenn keiner vorhanden ist
 */
function getJSONIconNameCookie(name){
    const originalCookie = getCookie(name);

    if (originalCookie) {
        const fileNameWithExtension = originalCookie.split("/").pop();
        return fileNameWithExtension.split(".")[0];
    }
     return null;
}

function setCookie(name, value, expirationDate) {
    let expires = "";
    if (expirationDate instanceof Date) {
        expires = "; expires=" + expirationDate.toUTCString();
    }
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function setCookieUntilMidnight(name, value) {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
    );
    const expires = "; expires=" + midnight.toUTCString();
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Setzt das Abaufdatum des Cookies auf in 366 Tagen
 *
 * @param {string} name Name unter dem der Cookie gespeichert wird
 * @param {string} value Wert der als gespeichert wird
 */
function setCookieForMaximumTime(name, value) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 366 * 24 * 60 * 60 * 1000); // 366 days in milliseconds
    const expires = "; expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Löscht einen Cookie unter dem angegebenen Namen
 *
 * @param name Name unter dem der Cookie gespeichert wurde
 */
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Gibt die aktuelle Kalenderwoche zurück
 *
 * @return {number} Die Aktuelle KW
 */
function getCurrentKW() {
    return Math.ceil((((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000) + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)
}
