/**
 * Liefert die Arbeitszeit für die Woche
 *
 * @param {WeekTime} weekTime Ein Objekt mit "hours" und "mins" Werten für jeden Wochentag
 * @returns {Time} Die komplette Arbeitszeit in Stunden und Minuten
 */
function getWeekWorkTime(weekTime) {
    let totalHours = 0;
    let totalMins = 0;

    // Iterate through the week
    for (const day in weekTime) {
        if (weekTime.hasOwnProperty(day)) {
            totalHours += weekTime[day].hours;
            totalMins += weekTime[day].mins;
        }
    }

    totalHours += Math.floor(totalMins / 60);
    totalMins = totalMins % 60;

    return [totalHours, totalMins];
}

/**
 * Rechnet die Gleitzeit für diese Woche aus (Kann nicht getestet werden)
 *
 * @param {number} floatDaysThisWeek Die Anzahl der Gleittage diese Woche
 * @param {Time} weekWorkTime Gesamt Arbeitszeit einer Woche
 * @returns Die Überstunden der gesamten Woche in Stunden und Minuten
 */
function calculateWeekOverTime(floatDaysThisWeek, weekWorkTime) {

    const shouldHours = 35;
    const shouldMins = 30;
    const [istHours, istMins] = weekWorkTime;

    let overTimeHours = istHours - shouldHours;
    let overTimeMins = istMins - shouldMins;

    if (overTimeMins < 0) {
        overTimeHours--;
        overTimeMins += 60;
    } else if (overTimeMins >= 60) {
        overTimeHours++;
        overTimeMins -= 60;
    }

    if (overTimeHours < 0 && overTimeMins !== 0) {
        overTimeHours++;
        overTimeMins -= 60;
    }

    return [overTimeHours, overTimeMins];
}

/**
 * Formatiert die Arbeits- bzw. die Gleitzeit der Woche
 *
 * @param {Time} weekTime Die Arbeitszeit/Gleitzeit der Woche
 *
 * @return {string} Wochen-/Gleitzeit als lesbarer String
 */
function formatWeekTime(weekTime) {
    let [weekHours, weekMins] = weekTime;
    let weekOverTimeAusgabe;

    if (weekHours <= 9 && weekHours > 0) {
        weekHours = "0" + weekHours;
    }

    if (weekMins <= 9 && weekHours > 0) {
        weekMins = "0" + weekMins;
    }

    if (weekHours < 0 || weekMins < 0) {
        weekHours = Math.abs(weekHours);
        weekMins = Math.abs(weekMins);

        weekOverTimeAusgabe = "-" + weekHours + "." + weekMins + " h";
    } else if (weekHours > 0 || weekMins > 0) {
        weekOverTimeAusgabe = "+" + weekHours + "." + weekMins + " h";
    } else {
        weekOverTimeAusgabe = "0.0 h";
    }

    return weekOverTimeAusgabe;
}

/**
 * Gibt die Zeiten eines Tages zurück
 *
 * @param {string} day ElementID eines Tages Feldes
 * @return {DayTime} Die Arbeitszeiten eines Tages
 */
function getTimeForDay(day){
    const [hours, mins] =  getDayFieldValueAndUpdateCookie(day).toString().split(":").map((time) => parseInt(time, 10));
    return {hours, mins};
}

/**
 * Gibt die Arbeitszeiten der gesamnten Woche zurück
 *
 * @return {WeekTime} Die Arbeitszeiten jedes Wochentages zusammengefasst
 */
function getTimeForWeek() {
    return {
        monday: getTimeForDay("monday"),
        tuesday: getTimeForDay("tuesday"),
        wednesday: getTimeForDay("wednesday"),
        thursday: getTimeForDay("thursday"),
        friday: getTimeForDay("friday"),
    };
}

module.exports = {
    getWeekWorkTime,
    calculateWeekOverTime,
    formatWeekTime,
};
