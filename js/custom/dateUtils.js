/**
 * Gibt die aktuelle Kalenderwoche zurück
 *
 * @return {number} Die Aktuelle KW
 */
function getCurrentKW() {
    return Math.ceil((((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000) + new Date(new Date().getFullYear(), 0, 1).getDay() + 1) / 7)
}

/**
 * Gibt die Tage des aktuellen Monats aus
 *
 * @returns {number} Tage des aktuellen Monats
 */
function getDaysInMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

/**
 * Gibt die aktuelle Zeit als Time Wert aus
 *
 * @return {Time} Die aktuelle Uhrzeit in Stunden und Minuten
 */
function getCurrentTime(){
    return [new Date().getHours(), new Date().getMinutes()];
}

/**
 * Gibt den aktuellen Monat aus
 *
 * @return {number} Die Nummer des aktuellen Monats
 */
function getCurrentMonth(){
    return new Date().getMonth() + 1;
}

/**
 * Welches Jahr hatten wir als es das letzte Mal dieser Monat war
 *
 * @param {number} month Der fragliche Monat
 * @return {number} Das Jahr
 */
function getYearForLastTimeMonth(month){
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();

    if (currentMonth < month) {
        return currentYear - 1;
    }

    return currentYear;
}

/**
 * Welches Jahr haben wir es das nächste Mal dieser Monat ist
 *
 * @param {number} month Der fragliche Monat
 * @return {number} Das Jahr
 */
function getYearForNextTimeMonth(month){
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();

    if (currentMonth > month) {
        return currentYear - 1;
    }

    return currentYear;
}
