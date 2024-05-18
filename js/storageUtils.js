function writeToSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

function readFromSessionStorage(key) {
    return sessionStorage.getItem(key);
}

function deleteFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

function writeToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function readFromlocalStorage(key) {
    return localStorage.getItem(key);
}