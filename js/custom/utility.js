/**
 * Vergleicht zwei Time Werte miteinander und gibt den späteren zurück.
 * Wenn, beide übereinstimmen wird der erste timeOne zurückgegeben.
 *
 * @param {Time} timeOne Der erste Zeitpunkt für den Vergleich.
 * @param {Time} timeTwo Der erste Zeitpunkt für den Vergleich.
 * @return {Time} Der später Zeitpunkt/ timeOne, wenn beide gleich sind
 */
function getLaterTime(timeOne, timeTwo) {
    for (let i = 0; i < Math.min(timeOne.length, timeTwo.length); i++) {
        if (timeOne[i] < timeTwo[i]) return timeTwo;
        if (timeOne[i] > timeTwo[i]) return timeOne;
    }

    return timeOne.length >= timeTwo.length ? timeOne : timeTwo;
}

/**
 * Formatiert einen Time value, der zu einem String,
 * bei dem die Minuten immer zweistellig sind
 *
 * @param {Time} time Die Zeit, die formatiert werden soll
 * @return {String} Die Zeit als Formatierter String
 */
function formatTime(time) {
    const [hours, mins] = time;
    const formattedMins = formatNumber(mins);
    return `${hours}.${formattedMins}`;
}

/**
 * Gibt die übergebene Zahl mit einer 0 davor aus, sofern die Zahl einstellig ist
 *
 * @param number Die Zahl
 * @returns {string} Eine schönere Darstellung der Zahl
 */
function formatNumber(number) {
    if (number < 10 && number >= 0) {
        return "0" + number;
    } else {
        return number.toString();
    }
}

/**
 * Konvertiert Minuten in Stunden und Minuten
 *
 * @param {number} minutes Die Minuten, die konvertiert werden sollen
 * @returns {Time} Die Minuten im Time Format
 */
function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes < 0 ) {
        hours++;
    }

    return [hours, remainingMinutes];
}

module.exports = {
    getLaterTime,
    formatTime,
    formatNumber,
    minutesToTime
};
