// liefert die Arbeitszeit für die Woche
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

// liefert die Tage, die diese Woche gearbeitet wurden
function getWorkedDaysForWeek(weekWorkTime) {

    const [daysWorkHours, daysWorkMins] = weekWorkTime;
    let countedDays = 5;

    for (let i = 0; i < 5; i++) {

        if (daysWorkHours[i] === 0 && daysWorkMins[i] === 0) {
            countedDays--;
        }

    }

    return countedDays;
}

// rechnet die Gleitzeit für diese Woche aus (Kann nicht getestet werden)
function calculateWeekOverTime(gleitagGenommen, countedDays, weekWorkTime) {
    const gleittageThisWeek = parseInt(getCookie("gleittage"));

    if (gleittageThisWeek && gleitagGenommen) {
        countedDays = gleittageThisWeek + countedDays;
        deleteCookie("gleittage");

    } else if (gleitagGenommen) {
        const gleittageThisWeek = parseInt(prompt("Anzahl Gleitage diese Woche:", ""), 10);
        countedDays = gleittageThisWeek + countedDays;
        setCookie("gleittage", gleittageThisWeek);
    }

    const shouldHours = countedDays * 7;
    const shouldMins = countedDays * 6;
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

    if (overTimeHours < 0) {
        overTimeHours++;
        overTimeMins -= 60;
    }

    return [overTimeHours, overTimeMins];
}

// Formatiert die Wochenzeit zur Darstellung
function formatWeekTime(weekTime) {

    let [weekHours, weekMins] = weekTime;

    if (weekHours <= 9) {
        weekHours = "0" + weekHours;
    }

    if (weekMins <= 9) {
        weekMins = "0" + weekMins;
    }

    return weekHours + "." + weekMins + " h";
}

// Formatiert die Gleitzeit zur Darstellung
function formatWeekOverTime(weekTime) {

    let [weekHours, weekMins] = weekTime;
    let weekOverTimeAusgabe;

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

module.exports = {
    getWeekWorkTime,
    getWorkedDaysForWeek,
    formatWeekTime,
    formatWeekOverTime
};
