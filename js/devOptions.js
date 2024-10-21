window.onload = function() {
    activateDevOptionsFromURL();
}

function checkForDevOptions() {
    const devOptionStatus = readBooleanFromLocalStorage("devOptions");
    const displayStyle = devOptionStatus ? "block" : "none";

    document.querySelectorAll(".devOption").forEach(element => {
        element.style.display = displayStyle;
    });
}

// Kann in der Console Aufgerufen werden, soll/muss keine usages haben
function enableDevOptions(){
    writeToLocalStorage("devOptions", true);
    checkForDevOptions();
}

function disableDevOptions(){
    deleteFromLocalStorage("devOptions");
    checkForDevOptions();
}

// ...index.html?param1=devOptions&param2=true
function activateDevOptionsFromURL(){

    const url = new URL(window.location.href);
    const key = url.searchParams.get('param1');
    const value = url.searchParams.get('param2');

    if (key && value) {
        activateDevMode(url, key, value);
    }
}

function activateDevMode(url, key, value){

    writeToLocalStorage(key, value);

    url.searchParams.delete('param1');
    url.searchParams.delete('param2');

    window.history.replaceState({}, document.title, url.pathname + url.search);
    window.location.href="";
}
