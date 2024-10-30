import {getBooleanCookie, setCookie, setCookieUntilMidnight, deleteCookie} from "./storageUtils"

window.onload = function() {
    activateDevOptionsFromURL();
}

function checkForDevOptions(): void {
    const devOptionStatus = getBooleanCookie("devOptions");
    const displayStyle = devOptionStatus ? "block" : "none";

    document.querySelectorAll<HTMLElement>(".devOption").forEach(element => {
        element.style.display = displayStyle;
    });
}

// Can be called from the console, doesn't need any usages
function enableDevOptions(): void {
    setCookie("devOptions", "true");
    checkForDevOptions();
}

function disableDevOptions(): void {
    deleteCookie("devOptions");
    checkForDevOptions();
}

// Example URL: index.html?param1=devOptions&param2=true
function activateDevOptionsFromURL(): void {
    const url = new URL(window.location.href);
    const key = url.searchParams.get('param1');
    const value = url.searchParams.get('param2');

    if (key && value) {
        activateDevMode(url, key, value);
    }
}

function activateDevMode(url: URL, key: string, value: string): void {
    setCookieUntilMidnight(key, value);

    url.searchParams.delete('param1');
    url.searchParams.delete('param2');

    window.history.replaceState({}, document.title, url.pathname + url.search);
    window.location.reload();
}

export function resetCookies(): void {
    const cookiesToDelete= [
        "monday", "tuesday", "wednesday", "thursday", "friday",
        "todayTimeStamp", "modus", "float", "gleittage", "pause", "pauseTime", "start"
    ];

    cookiesToDelete.forEach(cookie => deleteCookie(cookie));
    setCookie("todayTimeStamp", new Date().getTime().toString());
}

export function deleteDataFromStorages(): void {
    // TODO: Remove after the next update, should just clean up
    localStorage.clear();
    sessionStorage.clear();
}

function resetPage(): void {
    resetCookies();
    window.location.reload();
}
