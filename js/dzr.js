$(document).ready(function () {

    $("#00min").click(function () {
        setNoPause();
    })
    $("#30min").click(function () {
        setThirtyMinutesPause();
    })
    $("#45min").click(function () {
        setFourtyFiveMinutesPause();
    })

    $("#6h00m").click(function () {
        setNoPause();
        setSixHourMode();
    })

    $("#7h06m").click(function () {
        setThirtyMinutesPause();
        setSevenHourMode();
    })

    function setNoPause() {
        $("#pause").val("00:00");
        $("#00min").addClass("active");
        $("#30min, #45min").removeClass("active");
        setCookieUntilMidnight("pause", "00min");
        setCookieUntilMidnight("pauseTime", "00:00");
        activateChanges();
    }

    function setThirtyMinutesPause() {
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "30min");
        setCookieUntilMidnight("pauseTime", "00:30");
        activateChanges();
    }

    function setFourtyFiveMinutesPause() {
        $("#pause").val("00:45");
        $("#45min").addClass("active");
        $("#00min, #30min").removeClass("active");
        setCookieUntilMidnight("pause", "45min");
        setCookieUntilMidnight("pauseTime", "00:45");
        activateChanges();
    }

    function setSixHourMode() {
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        setCookieUntilMidnight("modus", "6h00m");
        $("#float").val("-1.06");
        setCookieUntilMidnight("float", "-1.06");
        applyFloatChanges();
    }

    function setSevenHourMode() {
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        setCookieUntilMidnight("modus", "7h06m");
        $("#float").val("+0.04");
        setCookieUntilMidnight("float", "+0.04");
        applyFloatChanges();
    }

    // liest Dienstbeginn aus dem Input-Feld aus
    function getStartTime() {
        const [hours, mins] = $("#start").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    // liest Pausenzeit aus dem Input-Feld aus
    function getPauseTime() {
        const [hours, mins] = $("#pause").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    // liest Dienstende aus dem Input-Feld aus
    function getEndTime() {
        const [hours, mins] = $("#end").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    // liest Solldienstzeit aus dem Input-Feld aus
    function getSollTime() {
        const [hours, mins] = $("#soll").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    const timeValues = {
        get startTime() {
            return getStartTime();
        },
        get endTime() {
            return getEndTime();
        },
        get pauseTime() {
            return getPauseTime();
        },
        get sollTime() {
            return getSollTime();
        },
        get istTime() {
            return calculateIstTime(this.startTime, this.endTime, this.pauseTime);
        },
        get workTime() {
            return calculateWorkTime(this.startEndeDiff, this.pauseTime);
        },
        get gleitzeit() {
            return calculateGleitzeit(this.istTime);
        },
        get startEndeDiff() {
            return calculateStartEndeTimeDiff(this.startTime, this.endTime);
        },
        get istSollDiff() {
            return calculateIstSollTimeDiff(this.istTime, this.sollTime);
        },
        get normalEnd() {
            return calculateNormalEnd(this.startTime, this.pauseTime, this.sollTime);
        }
    };

    $("#start").change(function () {
        setEnd();
        setGleitzeit();
        setIstTime();
        calculate();
        setCountdown();
        uploadStartTime();
    });

    $("#pause").change(function () {
        setGleitzeit();
        setIstTime();
        calculate();
        setCountdown();
    });

    $("#end").change(function () {
        calculate();
        setGleitzeit();
        setIstTime();
        setCountdown();
        uploadGleitzeit();
        switchModeIfIsAllowed();
        calculate();
        setGleitzeit();
        setIstTime();
        setCountdown();
        uploadGleitzeit();
    });

    $("#soll").change(function () {
        calculate();
    });

    function setCountdown() {

        const currHour = new Date().getHours();
        const currMin = new Date().getMinutes();
        const currSec = new Date().getSeconds();

        let hoursToEnd = timeValues.endTime[0] - currHour;
        let minutesToEnd = timeValues.endTime[1] - currMin;

        if (minutesToEnd < 0) {
            hoursToEnd--;
            minutesToEnd = minutesToEnd + 60;
        }

        // Wenn negatives Vorzeichen bei dem Delta für Sekunden
        let secondsToEnd = 0 - currSec;

        if (secondsToEnd < 0) {
            minutesToEnd--;
            secondsToEnd = secondsToEnd + 60;
        }

        let remainingSeconds = hoursToEnd * 60 * 60 + minutesToEnd * 60 + secondsToEnd;

        if ($('.ClassyCountdown-wrapper').length > 0) {
            $('#countdown15').remove();
            $('#cc-box').html('<div id="countdown15" class="ClassyCountdownDemo container"></div>');
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });

        } else {
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });
        }
    }

    // Funktion zur Berechnung der Arbeitszeit, der Differenz zur Regeldienstzeit
    function calculate() {

        const [workHours, workMins] = timeValues.workTime;
        const [diffHours, diffMins, diffPositive] = timeValues.istSollDiff;

        workTime = formatTime(workHours, workMins);
        diffTime = formatTime(Math.abs(diffHours), diffMins);
        let diffDisplay = diffTime;

        if (diffPositive && (diffHours !== 0 || diffMins !== 0)) {
            diffDisplay = '+' + diffTime;

        } else if (!diffPositive && (diffHours !== 0 || diffMins !== 0)) {
            diffDisplay = '-' + diffTime;
        }

        if (isNaN(diffHours) && isNaN(diffMins)) {
            $("#trueworktime").html("0:00");
            $("#difference").html("0:00");

        } else {
            $("#difference").html(diffDisplay);
            $("#trueworktime").html(isNaN(workHours) && isNaN(workMins) ? "0.00" : workTime);
        }
    }

    // Berechnet das Dienstende anhand der Start-, Pausen- und Soll-Dienstzeit
    function setEnd() {
        let [endHours, endMins] = timeValues.normalEnd
        $("#end").val(endHours + ":" + formateMins(endMins));
    }

    $("#start_Tour").click(function () {
        $('.introjs-relativePosition').addClass('introjs-showElement');
        introJs().refresh();
        introJs().start();
    })

    // Ab hier selbstgeschrieben

    function activateChanges() {
        calculate();
        setGleitzeit();
        setIstTime();
    }

    function resetPauseAndWorkTime() {
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min, #45min").removeClass("active");

        $("#soll").val("07:06");
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");

        setCookieUntilMidnight("pause", "30min");
        setCookieUntilMidnight("pauseTime", "00:30");
        setCookieUntilMidnight("modus", "7h06m");
        activateChanges();
    }

    function setIstTime() {

        let [istHours, istMins] = timeValues.istTime;

        if (istMins < 0) {
            istHours--;
            istMins = istMins + 60;
        }

        const istAusgabe = istHours + "." + istMins
        $("#countedworktime").html(istAusgabe);

    }

    function setGleitzeit() {
        const gleitAusgabe = createGleitzeitAusgabeFromFloat(timeValues.gleitzeit);
        $("#gleitzeit").html(gleitAusgabe);
        $("#float").val(gleitAusgabe);

    }

    function setTimesForFloat() {

        const float = $("#float").val()?.toString() || "";
        const floatTime = getFloatValueFromText(float);
        const [endHours, endMins] = roundTimeForFloat(timeValues.normalEnd, floatTime);
        $("#end").val(endHours + ":" + endMins);
    }

    function optimizeEnd() {
        const [endHours, endMins] = calculateOptimizedEnd(timeValues.endTime);
        $("#end").val(endHours + ":" + endMins);
        setCountdown();
    }

    $("#reset").click(function () {
        resetPauseAndWorkTime();
        setEnd();
        setGleitzeit();
        setIstTime();
        calculate();
        setCountdown();
        uploadGleitzeit();
    });

    $("#float").change(function () {
        applyFloatChanges();
        switchModeIfIsAllowed();
    });

    $("#float").focusin(function () {
        optimizeEnd();
    });

    function applyFloatChanges() {
        setTimesForFloat();
        calculate();
        setGleitzeit();
        setIstTime();
        setCountdown();
        optimizeEnd();
        uploadGleitzeit();
    }

    function switchModeIfIsAllowed() {

        const currentMode = getCookie("modus")
        const floatCookie = getCookie("float");
        const float = getFloatValueFromText(floatCookie);

        const [floatVorzeichen, floatHours, floatMins] = float;
        const [istHours, istMins] = timeValues.istTime;

        const positivOrLessThenOneHour = floatVorzeichen > 0 || floatHours < 1;
        const oneHourAndLessThenSixMinutes = floatHours === 1 && floatMins < 6;
        const sixHourModeAllowed = positivOrLessThenOneHour || oneHourAndLessThenSixMinutes;

        const lessThenSixHours = istHours < 6;
        const sixHourWorkDay = istHours === 6 && istMins === 0;
        const sevenHourModeAllowed = lessThenSixHours || sixHourWorkDay

        if (currentMode === "6h00m" && sixHourModeAllowed) {
            switchToSixHourMode();
        } else if (currentMode === "7h06m" && sevenHourModeAllowed) {
            switchToSevenHourMode();
        }
    }


    function switchToSixHourMode() {
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        setCookieUntilMidnight("modus", "6h00m");
        $("#pause").val("00:00");
        $("#00min").addClass("active");
        $("#30min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "00min");
        setCookieUntilMidnight("pauseTime", "00:00");
    }

    function switchToSevenHourMode() {
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        setCookieUntilMidnight("modus", "7h06m");
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "30min");
        setCookieUntilMidnight("pauseTime", "00:30");
    }

    function uploadStartTime() {
        const startTime = $("#start").val()?.toString();
        setCookieUntilMidnight("start", startTime);
    }

    function uploadGleitzeit() {
        const floatTime = $("#float").val()?.toString();
        setCookieUntilMidnight("float", floatTime);
    }

    function readStartAndFloatFromLocalStorageAndSetInFields() {
        const startTime = getCookie("start");
        const floatTime = getCookie("float");

        if (startTime != null) {
            $("#start").val(startTime);
        }

        if (floatTime != null) {
            $("#float").val(floatTime);
        } else {
            $("#float").val("+0.4");
        }

    }

    function readSollAnPauseFromLocalStorageAndSetInFields() {

        const modusValue = "#" + getCookie("modus");
        const pauseValue = "#" + getCookie("pause");
        const pauseTime = getCookie("pauseTime");

        if (modusValue != null) {
            $("#6h00m, #7h06m").removeClass("active");
            $(modusValue).addClass("active");
            activateChanges();
        }

        if (pauseValue != null && pauseTime != null) {
            $("#pause").val(pauseTime);
            $("#00min, #30min, #45min").removeClass("active");
            $(pauseValue).addClass("active");
            activateChanges();
        }

    }

    if (getCookie("windowInitLoaded") && getCookie("start") != null) {
        readSollAnPauseFromLocalStorageAndSetInFields();
        readStartAndFloatFromLocalStorageAndSetInFields();
        setTimesForFloat();
        calculate();
        setGleitzeit();
        setIstTime();
        setCountdown();
        optimizeEnd();
    } else {
        deleteDataFromStorages();
        resetCookies();
        setCookieUntilMidnight("modus", "7h06m");
        setCookieUntilMidnight("windowInitLoaded", "true");
        $("#start").focus();
    }

    function floatValueCheck() {

        const float = $("#float").val();

        if (float == null || float === "") {
            $("#float").val("0.00");
        }
    }

    $("#float").blur(function () {
        setGleitzeit();
        floatValueCheck();
    });

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === 'visible') {
            location.reload();
        }
    });

    function increaseFloat() {
        const float = $("#float").val()?.toString() || "";
        const floatTime = getFloatValueFromText(float);
        return calculateIncreasedValue(floatTime);
    }

    function decreaseFloat() {
        const float = $("#float").val()?.toString() || "";
        const floatTime = getFloatValueFromText(float);
        return calculateDecreasedValue(floatTime);
    }

    document.getElementById("float").addEventListener("keydown", function (event) {
        let changedValue;

        if (event.key === "ArrowUp") {
            event.preventDefault();
            changedValue = increaseFloat();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            changedValue = decreaseFloat();
        }

        const gleitAusgabe = createGleitzeitAusgabeFromFloat(changedValue);
        $("#float").val(gleitAusgabe);
        applyFloatChanges();
        switchModeIfIsAllowed();
    });

});
