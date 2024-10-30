export function getCookie(name: string): string {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
}

export function getBooleanCookie(name: string): boolean{
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

export function setCookie(name: string, value: string, expirationDate?: Date): void {
    let expires = '';
    if (expirationDate instanceof Date) {
        expires = '; expires=' + expirationDate.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

export function setCookieUntilMidnight(name: string, value: string): void {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const expires = '; expires=' + midnight.toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

export function deleteCookie(name: string): void {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

