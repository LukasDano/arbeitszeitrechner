import $ from 'jquery';
import introJs from 'intro.js';
import {FloatTime, Time} from "./types"
import {getCookie, setCookieUntilMidnight} from "./storageUtils"
import {deleteDataFromStorages, resetCookies} from "./devOptions"
import {
    formatTime,
    calculateNormalEnd,
    calcuateIstTime,
    calculateEndForFloat,
    calcuateGleitzeit, formateGleitMins
} from "./dzrUtils"

//TODO wichtige variablen als const speichern, damit man sie nicht in jeder function neu callen muss

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

    function setNoPause(){
        $("#pause").val("00:00");
        $("#00min").addClass("active");
        $("#30min, #45min").removeClass("active");
        setCookieUntilMidnight("pause", "00min");
        setCookieUntilMidnight("pauseTime", "00:00");
        activateChanges();
    }

    function setThirtyMinutesPause(){
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "30min");
        setCookieUntilMidnight("pauseTime", "00:30");
        activateChanges();
    }

    function setFourtyFiveMinutesPause(){
        $("#pause").val("00:45");
        $("#45min").addClass("active");
        $("#00min, #30min").removeClass("active");
        setCookieUntilMidnight("pause", "45min");
        setCookieUntilMidnight("pauseTime", "00:45");
        activateChanges();
    }

    function setSixHourMode(){
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        setCookieUntilMidnight("modus", "6h00m");
        $("#float").val("-1.06");
        setCookieUntilMidnight("float", "-1.06");
        applyFloatChanges();
    }

    function setSevenHourMode(){
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        setCookieUntilMidnight("modus", "7h06m");
        $("#float").val("+0.04");
        setCookieUntilMidnight("float", "+0.04");
        applyFloatChanges();
    }

    // liest Dienstbeginn aus dem Input-Feld aus
    function getStartTime(): Time {
        const [hours, mins] = $("#start").val().toString().split(":").map(Number);
        return { hours, mins };
    }

    // liest Pausenzeit aus dem Input-Feld aus
    function getPauseTime(): Time {
        const [hours, mins] = $("#pause").val().toString().split(":").map(Number);
        return { hours, mins };
    }

    // liest Dienstende aus dem Input-Feld aus
    function getEndTime(): Time {
        const [hours, mins] = $("#end").val().toString().split(":").map(Number);
        return {hours, mins};
    }

    // liest Solldienstzeit aus dem Input-Feld aus
    function getSollTime(): Time {
        const [hours, mins] = $("#soll").val().toString().split(":").map(Number);
        return {hours, mins};
    }

    // Gibt die Differenz zwischen Start und Ende zurück
    function getDiffTime(): Time {

        const {hours: startHours, mins: startMins} = getStartTime();
        const {hours: endHours, mins: endMins} = getEndTime();

        let diffHours = endHours - startHours;
        let diffMins = endMins - startMins;

        // Bei negativer Differenz: + 60 min & -1h
        if (diffMins < 0) {
            diffHours--;
            diffMins = diffMins + 60;
        }
        return {hours: diffHours, mins: diffMins};
    }

    // Berechnet die reine Arbeitszeit (abzüglich Pause)
    function getWorkTime(): Time {

        const {hours: diffHours, mins: diffMins} = getDiffTime();
        const {hours: pauseHours, mins: pauseMins} = getPauseTime();

        let workHours = diffHours - pauseHours;
        let workMins = diffMins - pauseMins;

        if (workMins < 0) {
            workHours--;
            workMins = workMins + 60;
        }

        return {hours: workHours, mins: workMins}
    }

// Berechnet die Differenz zwischen IST und SOLL
    function getTimeDifference(): [number, number, boolean] {

        const {hours: workHours, mins: workMins} = getWorkTime();
        const {hours: sollHours, mins: sollMins} = getSollTime();

        let diffHours: number = workHours - sollHours;
        let diffMins: number;

        if (diffHours === 0 && workMins > sollMins) {
            diffMins = workMins - sollMins;

        } else if (diffHours > 0) {
            diffMins = 60 - sollMins + workMins;
            diffHours--;

            if (diffMins >= 60) {
                diffMins = diffMins - 60;
                diffHours++;
            }

        } else if (workMins > sollMins && workMins < 60) {
            diffMins = 60 - workMins + sollMins;
            diffHours++;

        } else {
            diffMins = sollMins - workMins;
        }

        if (diffMins < 0) {
            diffHours--;
            diffMins = diffMins + 60;
        }

        const positive = !(workHours === sollHours && workMins < sollMins || workHours < sollHours);

        return [diffHours, diffMins, positive];
    }

    function getFloat(otherFloat?: string): FloatTime {
        let float: string = $("#float").val()?.toString() || "";

        if (otherFloat) {
            float = otherFloat;
        }

        const floatArray: string[] = float.split('');
        let vorzeichenOld = 1;
        //true = positiv, false = negative
        let vorzeichen: number = 1;

        if (floatArray[0] === "-"){
            vorzeichen = -1;
        }

        // wenn es nur einstellige Minuten gibt
        if (floatArray.length === 4) {

            // Fromat
            // 0,1,2,3
            // +,0,.,4

            const gleitHours = parseInt(floatArray[1], 10);
            const gleitMins = parseInt(floatArray[3], 10);

            return {vorzeichen: vorzeichen, hours: gleitHours, mins: gleitMins};
        }

        // wenn es zweistellige Minuten gibt
        if (floatArray.length > 4) {

            // Fromat
            // 0,1,2,3,4
            // +,0,.,1,4

            const gleitHours = parseInt(floatArray[1], 10);
            const gleitTens = parseInt(floatArray[3], 10);
            const gleitOnes = parseInt(floatArray[4], 10);

            const gleitMins = gleitTens*10 + gleitOnes;

            return {vorzeichen: vorzeichen, hours: gleitHours, mins: gleitMins};
        }
    }

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

    function setCountdown(): void {

        const currHour = new Date().getHours();
        const currMin = new Date().getMinutes();
        const currSec = new Date().getSeconds();

        let hoursToEnd = getEndTime()[0] - currHour;
        let minutesToEnd = getEndTime()[1] - currMin;

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
    function calculate(): void {
        const {hours: workHours, mins: workMins} = getWorkTime();
        const [diffHours, diffMins, diffPositive] = getTimeDifference();

        const workTime = formatTime(workHours, workMins);
        const diffTime = formatTime(Math.abs(diffHours), diffMins);
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
    function setEnd(): void {

        const startTime = getStartTime();
        const pauseTime = getPauseTime();
        const sollTime = getSollTime();

        const {hours: endHours, mins: endMins} = calculateNormalEnd(startTime, pauseTime, sollTime);
        $("#end").val(endHours + ":" + endMins);
    }

    $('#countdown16').ClassyCountdown({
        theme: "flat-colors-wide",
        end: $.now() + 10000
    });
    $('#countdown17').ClassyCountdown({
        theme: "flat-colors-very-wide",
        end: $.now() + 10000
    });
    $('#countdown18').ClassyCountdown({
        theme: "flat-colors-black",
        end: $.now() + 10000
    });
    $('#countdown1').ClassyCountdown({
        theme: "white",
        end: $.now() + 645600
    });
    $('#countdown5').ClassyCountdown({
        theme: "white",
        end: $.now() + 10000
    });
    $('#countdown6').ClassyCountdown({
        theme: "white-wide",
        end: $.now() + 10000
    });
    $('#countdown7').ClassyCountdown({
        theme: "white-very-wide",
        end: $.now() + 10000
    });
    $('#countdown8').ClassyCountdown({
        theme: "white-black",
        end: $.now() + 10000
    });
    $('#countdown11').ClassyCountdown({
        theme: "black",
        style: {
            secondsElement: {
                gauge: {
                    fgColor: "#F00"
                }
            }
        },
        end: $.now() + 10000
    });
    $('#countdown12').ClassyCountdown({
        theme: "black-wide",
        labels: false,
        end: $.now() + 10000
    });
    $('#countdown13').ClassyCountdown({
        theme: "black-very-wide",
        labelsOptions: {
            lang: {
                days: 'D',
                hours: 'H',
                minutes: 'M',
                seconds: 'S'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        end: $.now() + 10000
    });
    $('#countdown14').ClassyCountdown({
        theme: "black-black",
        labelsOptions: {
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        end: $.now() + 10000
    });
    $('#countdown4').ClassyCountdown({
        end: $.now() + 10000,
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#1abc9c"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            hours: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#2980b9"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            minutes: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#8e44ad"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            },
            seconds: {
                gauge: {
                    thickness: .03,
                    bgColor: "rgba(255,255,255,0.05)",
                    fgColor: "#f39c12"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#fff;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown2').ClassyCountdown({
        end: '1388468325',
        now: '1378441323',
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#1abc9c"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            hours: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#2980b9"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            minutes: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#8e44ad"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            seconds: {
                gauge: {
                    thickness: .01,
                    bgColor: "rgba(0,0,0,0.05)",
                    fgColor: "#f39c12"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown9').ClassyCountdown({
        end: '1388468325',
        now: '1380501323',
        labels: true,
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#1abc9c",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            hours: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#2980b9",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            minutes: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#8e44ad",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            },
            seconds: {
                gauge: {
                    thickness: .05,
                    bgColor: "rgba(0,0,0,0)",
                    fgColor: "#f39c12",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:#34495e;'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown10').ClassyCountdown({
        end: '1397468325',
        now: '1388471324',
        labels: true,
        labelsOptions: {
            lang: {
                days: 'D',
                hours: 'H',
                minutes: 'M',
                seconds: 'S'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            hours: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            minutes: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            seconds: {
                gauge: {
                    thickness: .02,
                    bgColor: "rgba(255,255,255,0.1)",
                    fgColor: "rgba(255,255,255,1)",
                    lineCap: 'round'
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });
    $('#countdown3').ClassyCountdown({
        end: '1390868325',
        now: '1388461323',
        labels: true,
        labelsOptions: {
            lang: {
                days: 'Zile',
                hours: 'Ore',
                minutes: 'Minute',
                seconds: 'Secunde'
            },
            style: 'font-size:0.5em; text-transform:uppercase;'
        },
        style: {
            element: "",
            textResponsive: .5,
            days: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            hours: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            minutes: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            },
            seconds: {
                gauge: {
                    thickness: .2,
                    bgColor: "rgba(255,255,255,0.2)",
                    fgColor: "rgb(241, 196, 15)"
                },
                textCSS: 'font-family:\'Open Sans\'; font-size:25px; font-weight:300; color:rgba(255,255,255,0.7);'
            }

        },
        onEndCallback: function () {
            console.log("Time out!");
        }
    });

    $("#start_Tour").click(function () {
        $('.introjs-relativePosition').addClass('introjs-showElement');
        introJs().refresh();
        introJs().start();
    })

// Ab hier selbstgeschrieben

    function activateChanges(): void{
        calculate();
        setGleitzeit();
        setIstTime();
    }

    function resetPauseAndWorkTime(): void{
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

    function setIstTime(): void {

        const startTime = getStartTime();
        const endTime = getEndTime();
        const pauseTime = getPauseTime();

        let {hours: istHours, mins: istMins} = calcuateIstTime(startTime, endTime, pauseTime);

        if (istMins < 0) {
            istHours--;
            istMins = istMins + 60;
        }

        const istAusgabe = istHours + "." + istMins
        $("#countedworktime").html(istAusgabe);

    }

    function setGleitzeit(): void {
        const startTime = getStartTime();
        const endTime = getEndTime();
        const pauseTime = getPauseTime();
        const istTime = calcuateIstTime(startTime, endTime, pauseTime);

        let {hours: gleitHours, mins: gleitMins} = calcuateGleitzeit(istTime);
        let gleitAusgabe: string;

        if (gleitHours < 0 || gleitMins < 0){

            gleitHours = Math.abs(gleitHours);
            gleitMins = Math.abs(gleitMins);

            gleitAusgabe = "-" + gleitHours + "." + formateGleitMins(gleitMins);

        } else if (gleitHours > 0 || gleitMins > 0){
            gleitAusgabe = "+" + gleitHours + "." + formateGleitMins(gleitMins);
        }

        $("#gleitzeit").html(gleitAusgabe);
        $("#float").val(gleitAusgabe);

    }

    function roundAndSetTimesForFloat(): void {

        const startTime = getStartTime();
        const sollTime = getSollTime();
        const pauseTime = getPauseTime();

        const normalTime = calculateNormalEnd(startTime, pauseTime, sollTime);
        const floatTime = getFloat();

        let {hours: endHours, mins: endMins} = calculateEndForFloat(normalTime, floatTime);
        let endMinsString = endMins.toString();

        while (endMins >= 60) {
            endHours++;
            endMins = endMins - 60;
        }

        while (endMins < 0) {
            endHours--;
            endMins = endMins + 60;
        }

        if (endMins < 10){
            endMinsString = "0" + endMins;
        }

        $("#end").val(endHours +":"+ endMinsString);
    }

    function optimizeEnd(): void {

        let {hours: endHours, mins: endMins} = getEndTime();
        let tens = 0;
        let endMinsString: string;

        while (endMins > 9){
            endMins = endMins - 10;
            tens++;
        }

        if (endMins === 0 && tens === 0){
            endMins = 56;
            endHours--;

        } else if (endMins === 0){
            endMins = 6;
            tens--;

        } else if (endMins >= 6 ){
            endMins = 6;

        } else if (endMins <= 5){
            endMins = 1;
        }

        endMins =  10*tens + endMins;
        endMinsString = endMins.toString();

        if (endMins <= 9){
            endMinsString = 0 + endMins.toString();
        }

        $("#end").val(endHours +":"+ endMinsString);
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

    $("#float").focusin(function(){
        optimizeEnd();
    });

    function applyFloatChanges(){
        roundAndSetTimesForFloat();
        calculate();
        setGleitzeit();
        setIstTime();
        setCountdown();
        optimizeEnd();
        uploadGleitzeit();
    }

    function switchModeIfIsAllowed(): void {

        const currentMode = getCookie("modus")
        const floatCookie = getCookie("float");
        const float =  getFloat(floatCookie);
        const startTime = getStartTime();
        const endTime = getEndTime();
        const pauseTime = getPauseTime();

        const {vorzeichen: floatVorzeichen, hours: floatHours, mins: floatMins} = float;
        const {hours: istHours, mins: istMins} = calcuateIstTime(startTime, endTime, pauseTime);

        const positivOrLessThenOneHour = floatVorzeichen > 0 || floatHours < 1;
        const oneHourAndLessThenSixMinutes = floatHours === 1 && floatMins < 6;
        const sixHourModeAllowed = positivOrLessThenOneHour || oneHourAndLessThenSixMinutes;

        const lessThenSixHours = istHours < 6;
        const sixHourWorkDay = istHours === 6 && istMins === 0;
        const sevenHourModeAllowed =  lessThenSixHours || sixHourWorkDay

        if (currentMode === "6h00m" && sixHourModeAllowed) {
            switchToSixHourMode();
        } else if (currentMode === "7h06m" && sevenHourModeAllowed) {
            switchToSevenHourMode();
        }
    }


    function switchToSixHourMode(): void {
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        setCookieUntilMidnight("modus", "6h00m");
        $("#pause").val("00:00");
        $("#00min").addClass("active");
        $("#30min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "00min");
        setCookieUntilMidnight("pauseTime", "00:00");
    }

    function switchToSevenHourMode(): void {
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        setCookieUntilMidnight("modus", "7h06m");
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        setCookieUntilMidnight("pause", "30min");
        setCookieUntilMidnight("pauseTime", "00:30");
    }

    function uploadStartTime(): void {
        const startTime = $("#start").val()?.toString();
        setCookieUntilMidnight("start", startTime);
    }

    function uploadGleitzeit(): void {
        const floatTime = $("#float").val()?.toString();
        setCookieUntilMidnight("float", floatTime);
    }

    function readStartAndFloatFromLocalStorageAndSetInFields(): void {
        const startTime = getCookie("start");
        const floatTime = getCookie("float");

        if (startTime != null ) {
            $("#start").val(startTime);
        }

        if (floatTime != null){
            $("#float").val(floatTime);
        } else {
            $("#float").val("+0.4");
        }

    }

    function readSollAnPauseFromLocalStorageAndSetInFields(): void  {

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

    if (getCookie("windowInitLoaded") && getCookie("start") != null ) {
        readSollAnPauseFromLocalStorageAndSetInFields();
        readStartAndFloatFromLocalStorageAndSetInFields();
        roundAndSetTimesForFloat();
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

    function floatValueCheck(): void {

        const float = $("#float").val();

        if (float == null || float === ""){
            $("#float").val("0.00");
        }
    }

    $("#float").blur(function () {
        setGleitzeit();
        floatValueCheck();
    });

    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible') {
            location.reload();
        }
    });

});
