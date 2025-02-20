/**
 * Berechnet das Osterdatum zu einem gegebenen Jahr
 *
 * @param {number} year Das Jahr zu in dem man das Osterdatum wissen will
 * @returns {Date} Das Osterdatum
 */
function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Berechnet das Osterdatum zu einem gegebenen Jahr
 *
 * @param {number} year Das Jahr in dem man die Feiertage wissen will
 * @returns {FeiertageHamburg} Ein Objekt mit den Feiertagen
 */
function getHamburgHolidays(year) {

    const easterDate = getEasterDate(year);
    const holidays = {
        "Neujahr": new Date(Date.UTC(year, 0, 1)),
        "Karfreitag": new Date(easterDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        "Ostermontag": new Date(easterDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        "Tag der Arbeit": new Date(Date.UTC(year, 4, 1)),
        "Christi Himmelfahrt": new Date(easterDate.getTime() + 39 * 24 * 60 * 60 * 1000),
        "Pfingstmontag": new Date(easterDate.getTime() + 50 * 24 * 60 * 60 * 1000),
        "Tag der Deutschen Einheit": new Date(Date.UTC(year, 9, 3)),
        "Reformationstag": new Date(Date.UTC(year, 9, 31)),
        "Heiligabend": new Date(Date.UTC(year, 11, 24)),
        "1. Weihnachtstag": new Date(Date.UTC(year, 11, 25)),
        "2. Weihnachtstag": new Date(Date.UTC(year, 11, 26)),
        "Silvester": new Date(Date.UTC(year, 11, 31))
    };

    // Formatiere die Daten als Strings im Format "YYYY-MM-DD"
    for (let holiday in holidays) {
        holidays[holiday] = holidays[holiday].toISOString().split('T')[0];
    }

    return holidays;
}

/**
 * Berechnet die Anzahl der Arbeitstage für den aktuellen Monat
 *
 * @returns {number} Die Anzahl der Arbeitstage für den aktuellen Monat
 */
function getWorkDaysInMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const holidays = getHamburgHolidays(year);
    const holidayDates = new Set(Object.values(holidays));

    let workDays = 0;

    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0];

        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
            workDays++;
        }
    }

    return workDays;
}

/**
 * Liefert die Anzahl der Arbeitstage des laufenden Monats
 *
 * @deprecated The Function funktioniert aktuell nicht, und wird zu einem späteren Zeitpunkt eingebunden
 * @returns {Promise<number>} Arbeitstage des aktuellen Monats
 */
async function getWorkDaysInMonthFromAPI() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const lastDay = new Date(year, month + 1, 0).getDate();
    let workDays = 0;

    const publicHolidaysUrl = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=DE&subdivisionCode=DE-HH&validFrom=${year}-${month + 1}-01&validTo=${year}-${month + 1}-${lastDay}`;

    try {
        const response = await fetch(publicHolidaysUrl);
        const publicHolidays = await response.json();

        const holidayDates = new Set(publicHolidays.map(h => h.startDate.split('T')[0]));

        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const dateString = date.toISOString().split('T')[0];

            if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
                workDays++;
            }
        }
    } catch (error) {
        console.error('Error fetching holiday data:', error);
    }

    return workDays;
}

/**
 * Konvertiert Minuten in Stunden und Minuten
 *
 * @param {number} minutes Die Minuten, die konvertiert werden sollen
 * @returns {Time} Die Minuten im Time Format
 */
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return [hours, remainingMinutes];
}

/**
 * Rechnet in Prozent den Anteil vom "flexTime" an "workTimeMonth"
 *
 * @param {Time} flexTime Die Arbeitszeit, die diesen Monat im Flex office erbracht wurde
 * @param {Time} workTimeMonth Die gesamte Arbeitszeit, die diesen Monat erbracht werden muss
 * @returns {number} Den prozentualen Anteil der Zeit im Flex office
 */
function calculatePercentage(flexTime, workTimeMonth) {
    const flexTimeMinutes = flexTime[0] * 60 + flexTime[1];
    const workTimeMonthMinutes = workTimeMonth[0] * 60 + workTimeMonth[1];

    return (flexTimeMinutes / workTimeMonthMinutes) * 100;
}

/**
 * Berechnet die Arbeitszeit, die diesen Monat noch erbracht werden kann,
 * bis die maximalen Prozent erreicht werden
 *
 * @param {number} currentPercentage Die bereits erbrachten Prozent
 * @param {number} targetPercentage Die maximalen Prozent
 * @param {Time} workTimeMonth Die zu erbringende Arbeitszeit im Monat
 * @returns {Time} Die Zeit, die noch aus dem Flex office erbracht werden kann
 */
function timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth) {
    const workTimeMonthMinutes = workTimeMonth[0] * 60 + workTimeMonth[1];
    const currentMinutes = (workTimeMonthMinutes * currentPercentage) / 100;
    const targetMinutes = (workTimeMonthMinutes * targetPercentage) / 100;

    const remainingMinutes = Math.max(0, targetMinutes - currentMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinutesLeft = Math.round(remainingMinutes % 60);

    return [remainingHours, remainingMinutesLeft];
}

/**
 *  Gibt die Arbeitszeit, die diesen Monat erbracht werden muss
 *
 * @param {number} daysOff Tage die diesen Monat nicht gearbeitet wurde
 * @returns {Time} Arbeitszeit des aktuellen Monats
 */
function getWorkTimePerMonth(daysOff) {
    const workTimePerDay = [7, 6];
    const [workHoursTimePerDay, workMinsTimePerDay] = workTimePerDay;
    const workDaysInCurrentMonth = getWorkDaysInMonth();

    const countingDaysForCurrentMonth = workDaysInCurrentMonth - daysOff
    let workHours = workHoursTimePerDay * countingDaysForCurrentMonth;
    let workMins = workMinsTimePerDay * countingDaysForCurrentMonth;

    const [hoursFromMinutes, remainingMinutes] = minutesToTime(workMins);
    workHours = workHours + hoursFromMinutes;
    workMins = remainingMinutes;

    return [workHours, workMins];
}

/**
 * Die Arbeitszeit, die diesen Monat noch im Flex office erbracht werden darf
 *
 * @param {number} daysOff Tage die diesen Monat nicht gearbeitet wurde
 * @param {Time} flexTime Zeit die diesen Monat schon im Flex office gearbeitet wurde
 * @param {number} flexOfficeQuote Die maximale Quote, die im Flex office gearbeitet werden darf
 * @returns {Promise<Time>} Die restliche Flex office Arbeitszeit diesen Monat
 */
function calculateFlexOfficeStats(daysOff, flexTime, flexOfficeQuote) {
    const workTimeMonth = getWorkTimePerMonth(daysOff);
    const percent = calculatePercentage(flexTime, workTimeMonth);
    const timeLeft = timeLeftToReachPercentage(percent, flexOfficeQuote, workTimeMonth);
    return timeLeft;
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
 * Gibt den aktuellen Monat mit einer 0 davor aus, sofern die Zahl einstellig ist
 *
 * @returns {string} Eine schönere Ausgabe für die Monatszahl
 */
function getValidCurrentMonthOutPut() {
    const currentMonthNumber = new Date().getMonth() + 1;

    if (currentMonthNumber < 10) {
        return "0" + currentMonthNumber;
    } else {
        return currentMonthNumber.toString();
    }
}

/**
 * Formatiert ein Time Value zu einem schöneren String
 *
 * @param {Time} time Die Zeit, die formatiert werden soll
 * @returns {string} Die Zeit nach dem Format: h.mm oder hh.mm
 */
function formatTimeValueToString(time) {
    const [hours, mins] = time;

    if (mins < 10) {
        return hours + ".0" + mins;
    }

    return hours + "." + mins;
}

/**
 * Prüft, ob ein Time Value unter 0 ist.
 * Wenn der Wert nicht unter 0 ist, wird die Zeit einfach wieder zurückgegeben.
 * Wenn der Wert unter 0 ist, wird der Wert für 0 Stunden und 0 Minuten zurückgegeben.
 *
 * @param {Time} time Die Zeit, die geprüft werden soll
 * @returns {Time} "time" oder 0 Stunden und 0 Minuten
 */
function checkIfTimeIsBelowZero(time) {
    const [hours, mins] = time;

    if (hours < 0 || mins < 0) {
        return [0,0]
    }

    return time;
}

module.exports = {
    minutesToTime,
    calculatePercentage,
    timeLeftToReachPercentage,
    formatTimeValueToString,
    checkIfTimeIsBelowZero
};
