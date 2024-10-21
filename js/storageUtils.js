function writeToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function readFromLocalStorage(key) {
    return localStorage.getItem(key);
}

function deleteFromLocalStorage(key) {
    localStorage.removeItem(key);
}

function readBooleanFromLocalStorage(key) {
    const value= localStorage.getItem(key);

    if (value === "true") {
        return true;
    } else if (value === "false" || value === null) {
        return false;
    }
    console.log("Kein Boolean Wert")
}

function readIntFromLocalStorage(key) {
    return parseInt(localStorage.getItem(key), 10);
}