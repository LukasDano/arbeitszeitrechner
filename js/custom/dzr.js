$(document).ready(function () {
    $("#00min").click(function () {
        setNoPause();
    });
    $("#30min").click(function () {
        setThirtyMinutesPause();
    });
    $("#45min").click(function () {
        setFourtyFiveMinutesPause();
    });

    $("#6h00m").click(function () {
        setNoPause();
        setSixHourMode();
    });

    $("#7h06m").click(function () {
        setThirtyMinutesPause();
        setSevenHourMode();
    });

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

    /**
     * liest Dienstbeginn aus dem Input-Feld aus
     * @returns {Time} Die Startzeit
     */
    function getStartTime() {
        const [hours, mins] = $("#start").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    /**
     * liest Pausenzeit aus dem Input-Feld aus
     * @returns {Time} Die Pausenzeit
     */
    function getPauseTime() {
        const [hours, mins] = $("#pause").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    /**
     * liest Dienstende aus dem Input-Feld aus
     * @returns {Time} Die Endzeit
     */
    function getEndTime() {
        const [hours, mins] = $("#end").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    /**
     * liest Solldienstzeit aus dem Input-Feld aus
     * @returns {Time} Die Sollzeit
     */
    function getSollTime() {
        const [hours, mins] = $("#soll").val().toString().split(":").map(Number);
        return [hours, mins];
    }

    /**
     * liest die Gleitzeit aus dem Input-Feld aus
     * @return {string} Die Eingabe aus dem Floatfeld
     */
    function getFloat() {
        const float = $("#float").val();
        if (validateFloat(float)) {
            return float
        }

        $("#float").val("0.00");
        console.error("Du hast ein ungültiges Zeichen verwendet");
        return "";
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
        get floatTime() {
            return getFloat();
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
        },
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
        reactToEndTimeChange();
    });

    $("#soll").change(function () {
        calculate();
    });

    function reactToEndTimeChange(){
        if (isValidTime(timeValues.endTime)) {
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
        }
    }

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

        let secondsToEnd = 0 - currSec;

        if (secondsToEnd < 0) {
            minutesToEnd--;
            secondsToEnd = secondsToEnd + 60;
        }

        let remainingSeconds =
            hoursToEnd * 60 * 60 + minutesToEnd * 60 + secondsToEnd;

        if ($(".ClassyCountdown-wrapper").length > 0) {
            $("#countdown15").remove();
            $("#cc-box").html(
                '<div id="countdown15" class="ClassyCountdownDemo container"></div>',
            );
            $("#countdown15").ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds,
            });
        } else {
            $("#countdown15").ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds,
            });
        }
    }

    // Funktion zur Berechnung der Arbeitszeit, der Differenz zur Regeldienstzeit
    function calculate() {
        const formattedTime = formatTime(timeValues.workTime);
        const [workHours, workMins] = formattedTime;

        if (isNaN(workHours) && isNaN(workMins)) {
            $("#trueworktime").html("0:00");
        } else {
            $("#trueworktime").html(
                isNaN(workHours) && isNaN(workMins) ? "0.00" : formattedTime,
            );
        }
    }

    function setEnd() {
        let [endHours, endMins] = timeValues.normalEnd;
        $("#end").val(endHours + ":" + formatNumber(endMins));
    }

    function setEndTime(endTime) {
        let [endHours, endMins] = endTime;
        $("#end").val(endHours + ":" + formatNumber(endMins));
    }

    function setStartTime(startTime) {
        const [startHours, startMins] = startTime;
        $("#start").val(startHours + ":" + formatNumber(startMins));
    }

    $("#start_Tour").click(function () {
        $(".introjs-relativePosition").addClass("introjs-showElement");
        introJs().refresh();
        introJs().start();
    });

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

        const istAusgabe = istHours + "." + istMins;
        $("#countedworktime").html(istAusgabe);
    }

    function setGleitzeit() {
        const gleitAusgabe = createGleitzeitAusgabeFromFloat(timeValues.gleitzeit);
        $("#gleitzeit").html(gleitAusgabe);
        $("#float").val(gleitAusgabe);
    }

    function setTimesForFloat() {
        const float = timeValues.floatTime;
        const floatTime = getFloatValueFromText(float);
        const [endHours, endMins] = roundTimeForFloat(
            timeValues.normalEnd,
            floatTime,
        );
        $("#end").val(endHours + ":" + endMins);
    }

    function optimizeEnd() {
        const [endHours, endMins] = calculateOptimizedEnd(timeValues.endTime);
        $("#end").val(endHours + ":" + endMins);
        setCountdown();
    }

    function resetToDefault() {
        resetPauseAndWorkTime();
        setEnd();
        setGleitzeit();
        setIstTime();
        calculate();
        setCountdown();
        uploadGleitzeit();
    }

    $("#reset").click(function () {
        resetToDefault();
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
        const currentMode = getCookie("modus");
        const floatCookie = getCookie("float");
        const float = getFloatValueFromText(floatCookie);

        const [floatVorzeichen, floatHours, floatMins] = float;
        const [istHours, istMins] = timeValues.istTime;

        const positivOrLessThenOneHour = floatVorzeichen > 0 || floatHours < 1;
        const oneHourAndLessThenSixMinutes = floatHours === 1 && floatMins < 6;
        const sixHourModeAllowed =
            positivOrLessThenOneHour || oneHourAndLessThenSixMinutes;

        const lessThenSixHours = istHours < 6;
        const sixHourWorkDay = istHours === 6 && istMins === 0;
        const sevenHourModeAllowed = lessThenSixHours || sixHourWorkDay;

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
        const floatTime = timeValues.floatTime;
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
            $("#float").val("+0.04");
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
        updateEndTimeAfterWorkIsOver();
        setOverTimeIconToCookieValue();
    } else {
        resetCookies();
        setCookieUntilMidnight("modus", "7h06m");
        setCookieUntilMidnight("windowInitLoaded", "true");
        $("#start").focus();
    }

    function floatValueCheck() {
        const float = timeValues.floatTime;

        if (float == null || float === "") {
            $("#float").val("0.00");
        }
    }

    $("#float").blur(function () {
        setGleitzeit();
        floatValueCheck();
    });

    document.addEventListener("visibilitychange", function () {
        const settingsOpen = getBooleanCookie("settingsOpen");
        if (document.visibilityState === "visible" && !settingsOpen) {
            location.reload();
        }
    });

    function increaseFloat() {
        const float = timeValues.floatTime
        const floatTime = getFloatValueFromText(float);
        return calculateIncreasedValue(floatTime);
    }

    function decreaseFloat() {
        const float = timeValues.floatTime;
        const floatTime = getFloatValueFromText(float);
        return calculateDecreasedValue(floatTime);
    }

    function setFloatValue(floatValue) {
        const gleitAusgabe = createGleitzeitAusgabeFromFloat(floatValue);
        $("#float").val(gleitAusgabe);
        applyFloatChanges();
        switchModeIfIsAllowed();
    }

    function setOverTimeIconToCookieValue() {
        const overTimeAutomaticActive = getBooleanCookie("overTimeAutomaticActive");

        if (overTimeAutomaticActive){
            document.getElementById("overTimeAutomaticIcon").alt = "overTimeAutomaticOn";
            document.getElementById("overTimeAutomaticIcon").src = "pictures/icons/automaticOn.png";
            return;
        }

        document.getElementById("overTimeAutomaticIcon").alt = "overTimeAutomaticOff";
        document.getElementById("overTimeAutomaticIcon").src = "pictures/icons/automaticOff.png";
    }

    function swapCurrentOverTimeIcon() {
        const overTimeAutomaticActive = getBooleanCookie("overTimeAutomaticActive");

        if (overTimeAutomaticActive){
            document.getElementById("overTimeAutomaticIcon").alt = "overTimeAutomaticOff";
            document.getElementById("overTimeAutomaticIcon").src = "pictures/icons/automaticOff.png";
            setCookieForever("overTimeAutomaticActive", false);
            return;
        }

        document.getElementById("overTimeAutomaticIcon").alt = "overTimeAutomaticOn";
        document.getElementById("overTimeAutomaticIcon").src = "pictures/icons/automaticOn.png";
        setCookieForever("overTimeAutomaticActive", true);
    }

    function updateEndTimeAfterWorkIsOver() {
        const overTimeAutomaticActive = getBooleanCookie("overTimeAutomaticActive");

        if (overTimeAutomaticActive) {
            const currentTime = getCurrentTime();
            const laterTime = getLaterTime(timeValues.endTime, currentTime);

            if (laterTime === currentTime) {
                alert("Deine Arbeitszeit ist vorbei")
                setEndTime(currentTime);
                reactToEndTimeChange();
                setFloatValue(increaseFloat());
            }
        }
    }

    document
        .getElementById("float")
        .addEventListener("keydown", function (event) {
            let changedValue;

            if (event.key === "ArrowUp") {
                event.preventDefault();
                changedValue = increaseFloat();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                changedValue = decreaseFloat();
            }

            setFloatValue(changedValue);
        });

    document.getElementById("addBetterDefaultFloat").addEventListener("click", () => {
        const floatFourteenMinutes = [0, 14];
        setFloatValue(floatFourteenMinutes);
    });

    document.getElementById("overTimeAutomatic").addEventListener("click", () => {
        swapCurrentOverTimeIcon();
    });

    document.getElementById("currentStatsMessageButton").addEventListener("click", () => {
        const currentStart = timeValues.startTime;
        const currentTime = getCurrentTime();
        const currentPause = timeValues.pauseTime;
        openCurrentStatsMessageWithValues(currentStart, currentTime, currentPause);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'F1') {
            event.preventDefault();
            resetToDefault();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'F2') {
            event.preventDefault();
            openOrCloseDevOptionsFromButton();
        }
    });

});
