function getDaysWorkHoursAsList(){
    return [7, 7, 7, 8, 0];
}

function getDaysWorkMinsAsList(){
    return [20, 20, 0, 0, 0];
}

function getGleitagePerWeek(){
    return 1;
}

function getWeekWorkTime(){

    const daysWorkHours = getDaysWorkHoursAsList();
    const daysWorkMins = getDaysWorkMinsAsList();

    var week_hours = daysWorkHours[0] + daysWorkHours[1] + daysWorkHours[2] + daysWorkHours[3] + daysWorkHours[4];
    var week_mins = daysWorkMins[0] + daysWorkMins[1] + daysWorkMins[2] + daysWorkMins[3] + daysWorkMins[4];

    while (week_mins >= 60) {
        week_mins = week_mins - 60;
        week_hours++;
    }

    return [week_hours, week_mins];

}

function getWorkedDaysForWeek(){

    var daysWorkHours = getDaysWorkHoursAsList();
    var daysWorkMins = getDaysWorkMinsAsList();
    var countedDays = 5;

    for (let i = 0; i<5; i++){

        if(daysWorkHours[i] == 0 && daysWorkMins[i] == 0){
            countedDays --;
        }

    }

    console.log("countedDays: " + countedDays)
    return countedDays;
}

function calculateWeekOverTime() {
    var workedDays = getWorkedDaysForWeek();
    var gleittage = getGleitagePerWeek();
    // gleitage = getGleitagePerWeek
    var weekWorkTime = getWeekWorkTime();

    const countedDays = workedDays + gleittage;

    var shouldHours = countedDays * 7;
    var shouldMins = countedDays * 6;
    var istHours = weekWorkTime[0];
    var istMins = weekWorkTime[1];

    var overTimeHours = istHours - shouldHours;
    var overTimeMins = istMins - shouldMins;

    console.log("overTimeHours: " + overTimeHours);
    console.log("overTimeMins: " + overTimeMins);


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

    console.log(overTimeHours, overTimeMins)
    return [overTimeHours, overTimeMins];
}

function setWeekTime(){

    var week_time = getWeekWorkTime();

    var weekHours = week_time[0];
    var weekMins = week_time[1];

    var weekTimeAusgabe = weekHours + "." + weekMins + " h";

    console.log(weekTimeAusgabe);
}

function setWeekOverTime(){

    var weekTime = calculateWeekOverTime();

    var weekHours = weekTime[0];
    var weekMins = weekTime[1];

    if (weekHours < 0 || weekMins < 0){

        weekHours = Math.abs(weekHours);
        weekMins = Math.abs(weekMins);

        var weekOverTimeAusgabe = "-" + weekHours + "." + weekMins + " h";

    } else if (weekHours > 0 || weekMins > 0){
        var weekOverTimeAusgabe = "+" + weekHours + "." + weekMins + " h";
    } else {
        var weekOverTimeAusgabe = "0.0 h";
    }

    console.log(weekOverTimeAusgabe);
}

setWeekOverTime();
setWeekTime();

console.log("");
console.log("Sollte sein: " + -5.50);