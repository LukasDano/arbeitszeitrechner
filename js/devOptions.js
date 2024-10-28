window.onload = function() {
    activateDevOptionsFromURL();
}

function checkForDevOptions() {
    const devOptionStatus = getBooleanCookie("devOptions");
    const displayStyle = devOptionStatus ? "block" : "none";

    document.querySelectorAll(".devOption").forEach(element => {
        element.style.display = displayStyle;
    });
}

// Kann in der Console Aufgerufen werden, soll/muss keine usages haben
function enableDevOptions(){
    setCookie("devOptions", true);
    checkForDevOptions();
}

function disableDevOptions(){
    deleteCookie("devOptions");
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

    setCookieUntilMidnight(key, value);

    url.searchParams.delete('param1');
    url.searchParams.delete('param2');

    window.history.replaceState({}, document.title, url.pathname + url.search);
    window.location.reload();
}

function resetCookies(){
    deleteCookie("monday");
    deleteCookie("tuesday");
    deleteCookie("wednesday");
    deleteCookie("thursday");
    deleteCookie("friday");

    deleteCookie("todayTimeStamp");
    deleteCookie("modus");
    deleteCookie("float");
    deleteCookie("gleittage");
    deleteCookie("pause");
    deleteCookie("pauseTime");
    deleteCookie("start");

    setCookie("todayTimeStamp", new Date().getTime());
}

function deleteDataFromStorages(){
    // TODO nach dem nächsten Update entfernen, soll nur aufräumen
    localStorage.clear();
    sessionStorage.clear();
}

function resetPage(){
    resetCookies();
    window.location.reload();
}
