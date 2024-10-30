import $ from 'jquery';
import {getCookie, getBooleanCookie, setCookie, deleteCookie} from "./storageUtils"
import {Time, WeekTime} from "./types";

$(document).ready(function (): void {

    function getTimeForDay(day: string): Time{
        const [hours, mins] = $(day).val().toString().split(":").map(time => parseInt(time, 10));
        return { hours, mins };
    }

    function getTimeForWeek(): WeekTime {
        return {
            monday: getTimeForDay("#monday"),
            tuesday: getTimeForDay("#tuesday"),
            wednesday: getTimeForDay("#wednesday"),
            thursday: getTimeForDay("#thursday"),
            friday: getTimeForDay("#friday"),
        };
    }

    function getWeekWorkTime(): [number, number] {
        const weekTime = getTimeForWeek();

        let totalHours = 0;
        let totalMins = 0;

        // Iterate through the week
        for (const day in weekTime) {
            if (weekTime.hasOwnProperty(day)) {
                totalHours += weekTime[day].hours;
                totalMins += weekTime[day].mins;
            }
        }

        // Convert excess minutes to hours
        totalHours += Math.floor(totalMins / 60);
        totalMins = totalMins % 60;

        return [totalHours, totalMins];
    }

    function getWorkedDaysForWeek(): number {

        const [daysWorkHours, daysWorkMins] = getWeekWorkTime();
        let countedDays = 5;

        for (let i: number = 0; i<5; i++){

            if(daysWorkHours[i] === 0 && daysWorkMins[i] === 0){
                countedDays --;
            }

        }

        return countedDays;
    }

    function calculateWeekOverTime(gleitagGenommen: boolean): number[] {
        let countedDays = getWorkedDaysForWeek();
        const [istHours,istMins] = getWeekWorkTime();
        const gleittageThisWeek= parseInt(getCookie("gleittage"))

        if (gleittageThisWeek && gleitagGenommen){
            countedDays = gleittageThisWeek + countedDays;
            deleteCookie("gleittage");

        } else if (gleitagGenommen) {
            const gleittageThisWeek = parseInt(prompt("Anzahl Gleitage diese Woche:", ""), 10);
            countedDays = gleittageThisWeek + countedDays;
            setCookie("gleittage", gleittageThisWeek.toString());
        }

        const shouldHours = countedDays * 7;
        const shouldMins = countedDays * 6;

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

    function setWeekTime(): void {

        let [weekHours, weekMins] = getWeekWorkTime();
        let weekHoursString: string = weekHours.toString();
        let weekMinsString: string = weekMins.toString();

        if (weekHours <= 9){
            weekHoursString = "0" + weekHours;
        }

        if (weekMins <= 9){
            weekMinsString = "0" + weekMins;
        }

        const weekTimeAusgabe = weekHoursString + "." + weekMinsString + " h";
        $("#weekworktime").html(weekTimeAusgabe);
    }

    function setWeekOverTime(gleittagGenommen?: boolean): void {

        let [weekHours, weekMins] = calculateWeekOverTime(gleittagGenommen);
        let weekOverTimeAusgabe: string;

        if (weekHours < 0 || weekMins < 0){

            weekHours = Math.abs(weekHours);
            weekMins = Math.abs(weekMins);

            weekOverTimeAusgabe = "-" + weekHours + "." + weekMins + " h";

        } else if (weekHours > 0 || weekMins > 0){
            weekOverTimeAusgabe = "+" + weekHours + "." + weekMins + " h";
        } else {
            weekOverTimeAusgabe = "0.0 h";
        }

        $("#weekovertime").html(weekOverTimeAusgabe);
    }

    function calculateWeekTime(gleittagGenommen: boolean): void{
        setWeekTime();
        setWeekOverTime(gleittagGenommen);
        uploadDaysTime();
        setCookie("calculated", gleittagGenommen.toString());
    }

    $("#weekTimeCalc").click(function (): void {
        calculateWeekTime(false);
    });

    $("#weekTimeCalcFloat").click(function (): void {
        calculateWeekTime(true);
    });

    $("#daytimefields").keypress(function (event: any): void {
        if (event.which === 13) {
            setWeekTime();
            setWeekOverTime();
            uploadDaysTime();
        }
    });

    $("#monday").change(function (): void {
        uploadDaysTime();
    })

    $("#tuesday").change(function (): void {
        uploadDaysTime();
    })

    $("#wednesday").change(function (): void {
        uploadDaysTime();
    })

    $("#thursday").change(function (): void {
        uploadDaysTime();
    })

    $("#friday").change(function (): void {
        uploadDaysTime();
    })

    function uploadDaysTime(): void{

        const mondayTime = $("#monday").val()?.toString();
        const tuesdayTime = $("#tuesday").val()?.toString();
        const wednesdayTime = $("#wednesday").val()?.toString();
        const thursdayTime = $("#thursday").val()?.toString();
        const fridayTime = $("#friday").val()?.toString();

        setCookie("monday", mondayTime);
        setCookie("tuesday", tuesdayTime);
        setCookie("wednesday", wednesdayTime);
        setCookie("thursday", thursdayTime);
        setCookie("friday", fridayTime);
    }

    function getCookieAndSetInDayFields(): void {

        const mondayTime = getCookie("monday");
        const tuesdayTime = getCookie("tuesday");
        const wednesdayTime = getCookie("wednesday");
        const thursdayTime = getCookie("thursday");
        const fridayTime = getCookie("friday");


        if (mondayTime != null ) {
            $("#monday").val(mondayTime);
        }

        if (tuesdayTime !== null ) {
            $("#tuesday").val(tuesdayTime);
        }

        if (wednesdayTime !== null ) {
            $("#wednesday").val(wednesdayTime);
        }

        if (thursdayTime !== null ) {
            $("#thursday").val(thursdayTime);
        }

        if (fridayTime !== null ) {
            $("#friday").val(fridayTime);
        }

    }

    if (getCookie("weekWindowInitLoaded") && getCookie("monday") != null) {
        getCookieAndSetInDayFields();

        const calculated = getBooleanCookie("calculated");

        if (calculated){
            calculateWeekTime(true);
        } else if(!calculated){
            calculateWeekTime(false);
        } else {
            $("#monday").focus();
        }
    }

});