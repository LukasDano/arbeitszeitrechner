/**
 * Liefert die Arbeitszeit für die Woche
 *
 * @param {WeekTime} weekTime Ein Objekt mit "hours" und "mins" Werten für jeden Wochentag
 * @returns {Time} Die komplette Arbeitszeit in Stunden und Minuten
 */
function getWeekWorkTime(weekTime) {
    let totalHours = 0;
    let totalMins = 0;
    let workedDays = 5;

    // Iterate through the week
    for (const day in weekTime) {
        if (weekTime.hasOwnProperty(day)) {
            totalHours += weekTime[day].hours;
            totalMins += weekTime[day].mins;

            const workedThisDay =
                weekTime[day].hours === 0 && weekTime[day].mins === 0;

            if (workedThisDay) {
                workedDays -= 1;
            }
        }
    }

    setCookie("workedDays", workedDays);
    totalHours += Math.floor(totalMins / 60);
    totalMins = totalMins % 60;

    return [totalHours, totalMins];
}

/**
 * Rechnet die Gleitzeit für diese Woche aus (Kann nicht getestet werden)
 *
 * @param {boolean} gleitagGenommen
 * @param {Time} weekWorkTime Gesamt Arbeitszeit einer Woche
 * @returns Die Überstunden der gesamten Woche in Stunden und Minuten
 */
function calculateWeekOverTime(gleitagGenommen, weekWorkTime) {
    const gleittageThisWeek = getIntCookie("gleittage");
    let workedDays = getIntCookie("workedDays");

    if (gleittageThisWeek && gleitagGenommen) {
        workedDays = gleittageThisWeek + workedDays;
        deleteCookie("gleittage");
    } else if (gleitagGenommen) {
        const gleittageThisWeek = parseInt(
            prompt("Anzahl Gleitage diese Woche:", ""),
            10,
        );
        workedDays = gleittageThisWeek + workedDays;
        setCookie("gleittage", gleittageThisWeek);
    }

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
 * @param {boolean} workTime Der Übergebene Wert ist die Arbeitszeit
 *
 * @return {string} Wochen-/Gleitzeit als lesbarer String
 */
function formatWeekTime(weekTime, workTime) {
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

    if (workTime) {
        weekOverTimeAusgabe = weekOverTimeAusgabe.substring(1);
    }

    return weekOverTimeAusgabe;
}

module.exports = {
    getWeekWorkTime,
    calculateWeekOverTime,
    formatWeekTime,
};
