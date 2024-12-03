$(document).ready(function () {
    function getTimeForDay(day) {
        const [hours, mins] = $(day)
            .val()
            .toString()
            .split(":")
            .map((time) => parseInt(time, 10));
        return { hours, mins };
    }

    function getTimeForWeek() {
        return {
            monday: getTimeForDay("#monday"),
            tuesday: getTimeForDay("#tuesday"),
            wednesday: getTimeForDay("#wednesday"),
            thursday: getTimeForDay("#thursday"),
            friday: getTimeForDay("#friday"),
        };
    }

    const timeValues = {
        get weekTime() {
            return getTimeForWeek();
        },
        get weekWorkTime() {
            return getWeekWorkTime(this.weekTime);
        },
        get floatThisWeek() {
            return getBooleanCookie("gleittageGenommen");
        },
        get weekOverTime() {
            return calculateWeekOverTime(this.floatThisWeek, this.weekWorkTime);
        },
    };

    function setWeekTime() {
        const weekTimeAusgabe = formatWeekTime(timeValues.weekWorkTime, true);
        $("#weekworktime").html(weekTimeAusgabe);
    }

    function setWeekOverTime() {
        const weekOverTimeAusgabe = formatWeekTime(timeValues.weekOverTime, false);
        $("#weekovertime").html(weekOverTimeAusgabe);
    }

    function calculateWeekTime(gleittageGenommen) {
        setCookie("gleittageGenommen", gleittageGenommen);
        setWeekTime();
        setWeekOverTime();
        uploadDaysTime();
        setCookie("calculated", true);
    }

    $("#weekTimeCalc").click(function () {
        calculateWeekTime(false);
    });

    $("#weekTimeCalcFloat").click(function () {
        calculateWeekTime(true);
    });

    $("#daytimefields").keypress(function (event) {
        if (event.which === 13) {
            setWeekTime();
            setWeekOverTime();
            uploadDaysTime();
            uploadDaysTime();
        }
    });

    $("#monday").change(function () {
        uploadDaysTime();
    });

    $("#tuesday").change(function () {
        uploadDaysTime();
    });

    $("#wednesday").change(function () {
        uploadDaysTime();
    });

    $("#thursday").change(function () {
        uploadDaysTime();
    });

    $("#friday").change(function () {
        uploadDaysTime();
    });

    function uploadDaysTime() {
        const monday_time = $("#monday").val();
        const tuesday_time = $("#tuesday").val();
        const wednesday_time = $("#wednesday").val();
        const thursday_time = $("#thursday").val();
        const friday_time = $("#friday").val();

        setCookie("monday", monday_time);
        setCookie("tuesday", tuesday_time);
        setCookie("wednesday", wednesday_time);
        setCookie("thursday", thursday_time);
        setCookie("friday", friday_time);
    }

    function getCookiesAndSetInDayFields() {
        const mondayTime = getCookie("monday");
        const tuesdayTime = getCookie("tuesday");
        const wednesdayTime = getCookie("wednesday");
        const thursdayTime = getCookie("thursday");
        const fridayTime = getCookie("friday");

        if (mondayTime != null) {
            $("#monday").val(mondayTime);
        }

        if (tuesdayTime !== null) {
            $("#tuesday").val(tuesdayTime);
        }

        if (wednesdayTime !== null) {
            $("#wednesday").val(wednesdayTime);
        }

        if (thursdayTime !== null) {
            $("#thursday").val(thursdayTime);
        }

        if (fridayTime !== null) {
            $("#friday").val(fridayTime);
        }
    }

    if (getCookie("weekWindowInitLoaded") && getCookie("monday") != null) {
        getCookiesAndSetInDayFields();

        let calculated = getBooleanCookie("calculated");

        if (calculated) {
            calculateWeekTime(true);
        } else if (!calculated) {
            calculateWeekTime(false);
        } else {
            $("#monday").focus();
        }
    }
});
