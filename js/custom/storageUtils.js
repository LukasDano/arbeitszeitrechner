/**
 * Gibt den Wert des Cookies als String zurück.
 * Wenn der Cookie nicht existiert, wird ein leer String **""** zurück gegeben.
 *
 * @param {string} name Name unter dem der Cookie gespeichert wurde
 * @returns {string} Der Wert des Cookies
 */
function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
}

/**
 * Gibt den Wert eines Cookies als boolean zurück.
 * Es wird auch **false** zurück gegeben, wenn der Cookie nicht existiert
 *
 * @param {string} name Name unter dem der Cookie gespeichert wurde
 * @returns {boolean} Den Wert des Cookies
 */
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

/**
 * Gibt den Wert des Cookies als number zurück. Wenn der Cookie nicht existiert wird **0** zurückgegeben.
 *
 * @param {string} name Name unter dem der Cookie gespeichert wurde
 * @returns {number} Den Wert des Cookies
 */
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
 * @return {string|null} Den reinen IconNamen, so wie er auch in der JSON Datei steht oder NULL,
 * wenn keiner vorhanden ist
 */
function getJSONIconNameCookie(name) {
    const originalCookie = getCookie(name);

    if (originalCookie) {
        const fileNameWithExtension = originalCookie.split("/").pop();
        return fileNameWithExtension.split(".")[0];
    }
    return null;
}


/**
 * Setzt den Wert für einen Cookie unter einem angegebenen Namen.
 * Optional kann man auch ein Ablaufdatum mitgeben.
 *
 * @param {string} name Der Name, unter dem der Cookie gespeichert werden soll
 * @param {string} value Der Wert, der gespeichert werden soll
 * @param {Date} expirationDate (Optional): Der Zeitpunkt, zu dem der Cookie abläuft bzw. er gelöscht wird.
 */
function setCookie(name, value, expirationDate) {
    const cookiePath = getCurrentPath();
    let expires = "";

    if (expirationDate instanceof Date) {
        expires = "; expires=" + expirationDate.toUTCString();
    }
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}

/**
 * Setzt einen Cookie, der sich nach 10 Minuten löscht
 *
 * @param {string} name Name des Cookies
 * @param {string} value Wert des Cookies
 */
function setCookieFor10Minutes(name, value) {
    const cookiePath = getCurrentPath();
    const now = new Date();
    const expiresDate = new Date(now.getTime() + (10 * 60 * 1000));
    const expires = "; expires=" + expiresDate.toUTCString();
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}

/**
 * Setzt einen Cookie für den Rest des Tages
 *
 * @param {string} name Name des Cookies
 * @param {string} value Wert des Cookies
 */
function setCookieUntilMidnight(name, value) {
    const cookiePath = getCurrentPath();
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
        name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}

/**
 * Setzt einen Cookie bis zum Ende der aktuellen Woche (Sonntag um Mitternacht)
 *
 * @param {string} name Name des Cookies
 * @param {string} value Wert des Cookies
 */
function setCookieUntilEndOfWeek(name, value) {
    const cookiePath = getCurrentPath();
    const now = new Date();
    const endOfWeek = new Date(now);

    // Berechne die Anzahl der Tage bis zum nächsten Sonntag
    const daysUntilSunday = 7 - now.getDay();

    // Setze das Datum auf den nächsten Sonntag um Mitternacht
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(0, 0, 0, 0);

    const expires = "; expires=" + endOfWeek.toUTCString();
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}


/**
 * Setzt einen Cookie bis zum Ende des Monats
 *
 * @param {string} name Name des Cookies
 * @param {string} value Wert des Cookies
 */
function setCookieUntilEndOfMonth(name, value) {
    const cookiePath = getCurrentPath();
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const expires = "; expires=" + endOfMonth.toUTCString();
    document.cookie =
        name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}

/**
 * Setzt das Ablaufdatum des Cookies auf in 366 Tagen
 *
 * @param {string} name Name unter dem der Cookie gespeichert wird
 * @param {string} value Wert der als gespeichert wird
 */
function setCookieForMaximumTime(name, value) {
    const cookiePath = getCurrentPath();
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 366 * 24 * 60 * 60 * 1000); // 366 days in milliseconds
    const expires = "; expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=" + cookiePath;
}

/**
 * Löscht einen Cookie unter dem angegebenen Namen
 *
 * @param {string} name Name unter dem der Cookie gespeichert wurde
 */
function deleteCookie(name) {
    const cookiePath = getCurrentPath();
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + cookiePath;
}

/**
 * Gibt den aktuellen Pfad aus der URL aus.
 * Das genaue HTML-Dokument wird dabei ignoriert.
 *
 * @return {string} Den aktuellen Pfad
 */
function getCurrentPath() {
    const fullPath = window.location.pathname;
    return fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
}

/**
 * Setzt einen ForeverCookie neu, sodass der Zeitraum wieder auf das maximum gesetzt wird.
 *
 * @param {string} cookieName Der Name des Cookies, der aktualisiert werden soll
 */
function updateForeverCookie(cookieName) {
    const cookieValue = getCookie(cookieName);
    setCookieForever(cookieName, cookieValue);
}

/**
 * Prüft, ob ein CookieName in einem ListenCookie enthalten ist.
 *
 * @param {string} listCookieName Der Name des ListenCookies
 * @param {string} cookieName Der Name des Cookies der in der Liste sein soll
 * @return {boolean} Ob der Cookiename in der übergebenen Cookieliste ist
 */
function isItemInCookieList(listCookieName, cookieName) {
    const list = getListCookie(listCookieName);

    if (Array.isArray(list)) {
        return list.includes(cookieName);
    }
    return false;
}

/**
 * Setzt das Ablaufdatum für alle ForeverCookies auf das maximum.
 */
function updateForeverCookies() {
    const foreverCookiesListName = "foreverCookies";
    const listOfForeverCookies = getListCookie(foreverCookiesListName);

    if (listOfForeverCookies !== null) {
        listOfForeverCookies.forEach(element => {
            updateForeverCookie(element);
        });
    }
}

/**
 * Erstellt einen Cookie, der für immer gespeichert wird.
 *
 * @param {string} cookieName Der Name des Cookies
 * @param {string|number|boolean} cookieValue Der Wert des Cookies
 */
function setCookieForever(cookieName, cookieValue) {
    const foreverCookiesListName = "foreverCookies";

    setCookieForMaximumTime(cookieName, cookieValue);
    putInCookieList(foreverCookiesListName, cookieName);
}

/**
 * Gibt eine Liste aus, die als Cookie gespeichert wurde.
 *
 * @param {string} listCookieName Der Name des Cookies mit der Liste
 * @return {[] | null} Der Wert des Cookies
 */
function getListCookie(listCookieName) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(listCookieName + '='))
        ?.split('=')[1];

    if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue));
    }

    return null;
}

/**
 * Speichert einen neuen Eintrag in einer Liste in einem Cookie.
 *
 * @param {string} listCookieName Der Name der Liste mit dem Cookies
 * @param {string} value Der Wert, der in der Liste gespeichert werden soll
 */
function putInCookieList(listCookieName, value) {
    let list = getListCookie(listCookieName);
    if (!Array.isArray(list)) {
        list = [];
    }
    if (!list.includes(value)) {
        list.push(value);
        setCookieForMaximumTime(listCookieName, JSON.stringify(list));
    }
}

/**
 * Löscht einen Eintrag aus einer Cookieliste
 *
 * @param {string} listCookieName Der Name der Liste mit dem Cookies
 * @param {string} value Der Wert, der aus Liste gelöscht werden soll
 */
function removeFromCookieList(listCookieName, value) {
    let list = getListCookie(listCookieName);
    if (Array.isArray(list)) {
        const index = list.indexOf(value);
        if (index > -1) {
            list.splice(index, 1);
            setCookieForMaximumTime(listCookieName, JSON.stringify(list));
        }
    }
}

/**
 * Löscht Forevercookies.
 *
 * @param {string} cookieName Der Name des Forevercookies
 */
function deleteForeverCookie(cookieName) {
    const foreverCookiesListName = "foreverCookies";
    deleteCookie(cookieName);
    removeFromCookieList(foreverCookiesListName, cookieName);
}

/**
 * Löscht alle Cookies
 */
function deleteAllCookies() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        deleteCookie(name);
    }
}
