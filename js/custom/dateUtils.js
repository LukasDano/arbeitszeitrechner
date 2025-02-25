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