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
        writeToLocalStorage("pause", "00min");
        writeToLocalStorage("pauseTime", "00:00");
        activateChanges();
    }

    function setThirtyMinutesPause(){
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        writeToLocalStorage("pause", "30min");
        writeToLocalStorage("pauseTime", "00:30");
        activateChanges();
    }

    function setFourtyFiveMinutesPause(){
        $("#pause").val("00:45");
        $("#45min").addClass("active");
        $("#00min, #30min").removeClass("active");
        writeToLocalStorage("pause", "45min");
        writeToLocalStorage("pauseTime", "00:45");
        activateChanges();
    }

    function setSixHourMode(){
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        writeToLocalStorage("modus", "6h00m");
        $("#float").val("-1.06");
        writeToLocalStorage("float", "-1.06");
        applyFloatChanges();
    }

    function setSevenHourMode(){
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        writeToLocalStorage("modus", "7h06m");
        $("#float").val("+0.04");
        writeToLocalStorage("float", "+0.04");
        applyFloatChanges();
    }

    // liest Dienstbeginn aus dem Input-Feld aus
    function getStart_time() {
        var start_time = $("#start").val().split(":");

       var start_hours = parseInt(start_time[0], 10);
       var start_mins = parseInt(start_time[1], 10);

        return [start_hours, start_mins];
    }

    // liest Dienstende aus dem Input-Feld aus
    function getEnd_time() {
        var end_time = $("#end").val().split(":");

        var end_hours = parseInt(end_time[0], 10);
        var end_mins = parseInt(end_time[1], 10);

        return [end_hours, end_mins];
    }

    // Gibt die Differenz zwischen Start und Ende zurück
    function getDiff_time() {
        var start_time = getStart_time();
        var end_time = getEnd_time();

        var start_hours = parseInt(start_time[0], 10);
        var start_mins = parseInt(start_time[1], 10);
        var end_hours = parseInt(end_time[0], 10);
        var end_mins = parseInt(end_time[1], 10);

        var diff_hours = end_hours - start_hours;
        var diff_mins = end_mins - start_mins;

        // Bei negativer Differenz: + 60 min & -1h
        if (diff_mins < 0) {
            diff_hours--;
            diff_mins = diff_mins + 60;
        }
        return [diff_hours, diff_mins];
    }

    // liest Pausenzeit aus dem Input-Feld aus
    function getPause_time() {
        var pause_time = $("#pause").val().split(":");

        var pause_hours = parseInt(pause_time[0], 10);
        var pause_mins = parseInt(pause_time[1], 10);

        return [pause_hours, pause_mins];
    }

    // liest Solldienstzeit aus dem Input-Feld aus
    function getSoll_time() {
        var soll_time = $("#soll").val().split(":");

        var soll_hours = parseInt(soll_time[0], 10);
        var soll_mins = parseInt(soll_time[1], 10);

        return [soll_hours, soll_mins];
    }

    // Berechnet die reine Arbeitszeit (abzüglich Pause)
    function getWork_time() {
        var pause_time = getPause_time();
        var diff_time = getDiff_time();

        var diff_hours = diff_time[0];
        var diff_mins = diff_time[1];
        var pause_hours = pause_time[0];
        var pause_mins = pause_time[1];

        var work_hours = diff_hours - pause_hours;
        var work_mins = diff_mins - pause_mins;

        if (work_mins < 0) {
            work_hours--;
            work_mins = work_mins + 60;
        }

        return [work_hours, work_mins];
    }

    // Berechnet die Differenz zwischen IST und SOLL
    function getTimeDifference() {
        var soll_time = getSoll_time();
        var work_time = getWork_time();

        var work_hours = work_time[0];
        var work_mins = work_time[1];
        var soll_hours = soll_time[0];
        var soll_mins = soll_time[1];

        var diff_hours = work_hours - soll_hours;
        // Wenn Diff-Stunden = 0 & Arbeitsminuten > Sollminuten
        if (diff_hours == 0 && work_mins > soll_mins) {
            var diff_mins = work_mins - soll_mins;
            // Wenn Diff-Stunden > 0
        } else if (diff_hours > 0) {
            var diff_mins = 60 - soll_mins + work_mins;
            diff_hours--;
            // Wenn Diff-Minuten >= 60
            if (diff_mins >= 60) {
                diff_mins = diff_mins - 60;
                diff_hours++;
            }
            // Sonst
        } else {
            // Wenn Arbeitsminuten zwischen Sollminuten und 60 ziehe von 60 Minuten die Arbeitsminuten ab und addiere die Sollminuten
            if (work_mins > soll_mins && work_mins < 60) {
                var diff_mins = 60 - work_mins + soll_mins;
                diff_hours++;
            } else {
                var diff_mins = soll_mins - work_mins;
            }
        }


        if (diff_mins < 0) {
            diff_hours--;
            diff_mins = diff_mins + 60;
        }

        let positive;

        if (work_hours === soll_hours && work_mins < soll_mins || work_hours < soll_hours) {
            positive = false;
        } else {
            positive = true;
        }

        return [diff_hours, diff_mins, positive];
    }

    function applyChangedWorktime(){
        set_end();
        setGleitzeit();
        setIstTime();
        calculate();
        setCountdown();
        uploadStartTime();
    }

    $("#start").change(function () {
        set_end();
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
        // gibt das aktuelle Kalenderjahr zurück
        var curr_year = new Date().getFullYear();
        // gibt den aktuellen Monat im Jahr zurück
        var curr_month = new Date().getMonth();
        // gibt den aktuellen Tag im Monat zurück
        var curr_day = new Date().getDate();

        // gibt die Startzeit in Millisekunden (since Epoch) zurück
        var start_time = new Date(curr_year, curr_month, curr_day, getStart_time()[0], getStart_time()[1], 0, 0);
        // gibt die Endzeit in Millisekunden (since Epoch) zurück
        var end_time = new Date(curr_year, curr_month, curr_day, getEnd_time()[0], getEnd_time()[1], 0, 0);
        // gibt die aktuelle Zeit in Millisekunden (since Epoch) zurück
        var curr_time = new Date();

        //console.log("Start Sekunden: " + start_time.getTime());
        //console.log("Aktuelle Sekunden: " + curr_time.getTime());
        //console.log("Ende Sekunden: " + end_time.getTime());


        // Liest die aktuellen Werte für Stunden, Minuten und Sekunden aus
        var curr_hour = new Date().getHours();
        var curr_min = new Date().getMinutes();
        var curr_sec = new Date().getSeconds();

        // Berechnet die Deltas für Stunden, Minuten und Sekunden (zw. aktueller Uhrzeit und Endzeit)
        var hoursToEnd = getEnd_time()[0] - curr_hour;
        var minutesToEnd = getEnd_time()[1] - curr_min;
        // Wenn negatives Vorzeichen bei dem Delta für Minuten
        if (minutesToEnd < 0) {
            hoursToEnd--;
            minutesToEnd = minutesToEnd + 60;
        }
        // Wenn negatives Vorzeichen bei dem Delta für Sekunden
        var secondsToEnd = 0 - curr_sec;
        if (secondsToEnd < 0) {
            minutesToEnd--;
            secondsToEnd = secondsToEnd + 60;
        }

        // Berechnet verbleibende Zeit in Sekunden (für den Countdown)
        var remainingSeconds = hoursToEnd * 60 * 60 + minutesToEnd * 60 + secondsToEnd;

        if ($('.ClassyCountdown-wrapper').length > 0) {
            //console.log("IF");
            $('#countdown15').remove();
            //console.log("Inhalt entfernt.");
            $('#cc-box').html('<div id="countdown15" class="ClassyCountdownDemo container"></div>');
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });
        } else {
           //console.log("ELSE");
            $('#countdown15').ClassyCountdown({
                theme: "flat-colors-wide",
                end: $.now() + remainingSeconds
            });
        }
    }

    // Funktion zur Berechnung der Arbeitszeit, der Differenz zur Regeldienstzeit und des prozentualen Anteils der Arbeitszeit an der Regeldienstzeit
    function calculate() {

        var diff_time = getTimeDifference();
        var work_time = getWork_time();

        var diff_hours = diff_time[0];
        var diff_mins = diff_time[1];
        var diff_positive = diff_time[2];

        if (diff_mins < 10) {
            diff_time = diff_hours + ".0" + diff_mins;
        } else {
            diff_time = diff_hours + "." + diff_mins;
        }

        // Wenn Diffenrenz negativ & Diff-Stunden = 0
        if (diff_positive == false && diff_hours == 0) {
            $("#difference").html("-" + diff_time);
            // Wenn Diff-Stunden = 0 & Diff-Minuten = 0
        } else if (diff_hours == 0 && diff_mins == 0) {
            $("#difference").html(diff_time);
            // Wenn Differenz negativ & Diff-Stunden < 0
        } else if (diff_positive == false && diff_hours < 0) {
            $("#difference").html(diff_time);
        } else if (isNaN(diff_hours) && isNaN(diff_mins)) {
            $("#trueworktime").html("0:00");
            $("#difference").html("0:00");
        } else if (diff_positive == true) {
            $("#difference").html("+" + diff_time);
        }
        var work_hours = work_time[0];
        var work_mins = work_time[1];
        if (work_mins < 10) {
            work_time = work_hours + ".0" + work_mins;
        } else {
            work_time = work_hours + "." + work_mins;
        }
        if (isNaN(work_hours) && isNaN(work_mins)) {
            $("#trueworktime").html("0.00");
        } else {
            $("#trueworktime").html(work_time);
        }
    }

    // Berechnet das Dienstende anhand der Start-, Pausen- und Soll-Dienstzeit
    function set_end() {
        let normalEndTime = calculateNormalEnd();

        let endHours = normalEndTime[0];
        let endMins = normalEndTime[1];

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

function calculateNormalEnd(){
    let start_time = getStart_time();
    let pause_time = getPause_time();
    let soll_time = getSoll_time();

    let start_hours = parseInt(start_time[0], 10);
    let start_mins = parseInt(start_time[1], 10);
    let pause_hours = parseInt(pause_time[0], 10);
    let pause_mins = parseInt(pause_time[1], 10);
    let soll_hours = parseInt(soll_time[0], 10);
    let soll_mins = parseInt(soll_time[1], 10);

    let end_hours = start_hours + pause_hours + soll_hours;
    let end_mins = start_mins + pause_mins + soll_mins;

    if (end_hours >= 24) {
        end_hours = end_hours - 24;
    }

    //console.log("end_mins: " + end_mins);
    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 120 sind
    if (end_mins >= 120) {
        //console.log("if end_mins >= 120 gestartet");
        end_mins = end_mins - 120;
        //console.log("end_mins: " + end_mins);
        end_hours += 2;
    }

    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 60 sind
    if (end_mins >= 60) {
        //console.log("if end_mins >= 60 gestartet");
        end_mins = end_mins - 60;
        //console.log("end_mins: " + end_mins);
        end_hours++;
    }

    if (end_mins < 10) {
        end_mins = "0" + end_mins;
    }

    return [end_hours, end_mins];
}

function activateChanges(){
    calculate();
    setGleitzeit();
    setIstTime();
}

function resetPauseAndWorkTime(){
    $("#pause").val("00:30");
    $("#30min").addClass("active");
    $("#00min, #45min").removeClass("active");

    $("#soll").val("07:06");
    $("#7h06m").addClass("active");
    $("#6h00m").removeClass("active");

    writeToLocalStorage("pause", "30min");
    writeToLocalStorage("pauseTime", "00:30");
    writeToLocalStorage("modus", "7h06m");
    activateChanges();
}

// Arbeitsbeginn auf 10er und 5er abrunden
function getRoundStart() {

        var start_time = getStart_time();

        var start_hours = start_time[0];
        var start_mins = start_time[1];
        var tens = 0;

        while(start_mins > 9){
            start_mins = start_mins - 10;
            tens++;
        }

        if (start_mins >= 5){
            start_mins = 5;
        }

        if (start_mins <= 4){
            start_mins = 0;
        }

        start_mins = start_mins + (tens*10);

        var rounded_start_time = [start_hours, start_mins];
        //console.log("Anfang: " + rounded_start_time);
        return(rounded_start_time);

	}

	// Arbeitsende auf 10er und 5er abrunden
	function getRoundEnd() {

        var end_time = getEnd_time();

        var end_hours = end_time[0];
        var end_mins = end_time[1];
        var tens = 0;


        if (end_mins >= 56){
            end_mins = 0;
            end_hours++;

            var rounded_end_time = [end_hours, end_mins];
            return(rounded_end_time);
        }

        while(end_mins > 9){
            end_mins = end_mins - 10;
            tens++;
        }

        if (end_mins >= 6){
            end_mins = 0;
            tens++;
        } else if(end_mins === 0){
          end_mins = 0;
        } else if (end_mins <= 4){
            end_mins = 5;
        }

        end_mins = end_mins + (tens*10);

        // console.log("Ende: " + [end_hours, end_mins]);
        return [end_hours, end_mins]

	}

	// GerundeterAnfang - GerundetesEnde = Ist Arbeitszeit
	function getIstTime(){

        var roundedStart = getRoundStart();
        var roundedEnd = getRoundEnd();
        var pauseTime =  getPause_time();

        var startHours = roundedStart[0];
        var startMins = roundedStart[1];
        var endHours = roundedEnd[0];
        var endMins = roundedEnd[1];
        var pauseMins = pauseTime[1];

        var istHours = endHours - startHours;
        var istMins = endMins - startMins - pauseMins;

        while (istMins < 0){
          istHours--;
          istMins = istMins + 60;
        }

        if (istHours >= 12){
            istHours = istHours - 2;
        }

        return [istHours, istMins];

      }

	// Ist Arbeitszeit - Soll Arbeitszeit = Gleitzeit
	function getGleitzeit(){

        var istTime = getIstTime();

        var istHours = istTime[0];
        var istMins = istTime[1];
        var sollHours = 7;
        var sollMins = 6;

        var gleitHours = istHours - sollHours;
        var gleitMins = istMins - sollMins;

        if (istHours < sollHours){
          gleitHours++;
          gleitMins = gleitMins - 60;
        }
        if (gleitHours > 0 && gleitMins < 0){
          gleitHours--;
          gleitMins = gleitMins + 60;
        }
        if (gleitMins < -59){
          gleitHours--;
          gleitMins = gleitMins + 60;
        }

        return [gleitHours, gleitMins];
      }

    function setIstTime(){

		var istTime = getIstTime();

        var istHours = istTime[0];
        var istMins = istTime[1];

        if (istMins < 0) {
            istHours--;
            istMins = istMins + 60;
        }

		var istAusgabe = istHours + "." + istMins
		$("#countedworktime").html(istAusgabe);

	}

	function setGleitzeit(){

		var gleitzeit = getGleitzeit();

		var gleitHours = gleitzeit[0];
		var gleitMins = gleitzeit[1];
        let gleitAusgabe;

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

    function formateGleitMins(gleitMins){
        if (gleitMins <= 9) {
            return "0" + gleitMins;
        }
        return gleitMins;
    }

    function getFloat(float){
        let floatArray = Array.of(...float);
        let vorzeichen = 1;

        if (floatArray[0] === "-"){
            vorzeichen = -1;
        }

        // wenn es nur einstellige Minuten gibt
        if (floatArray.length === 4) {

            // Fromat
            // 0,1,2,3
            // +,0,.,4

            var gleitHours = parseInt(floatArray[1], 10);
            var gleitMins = parseInt(floatArray[3], 10);

            return [vorzeichen, gleitHours, gleitMins];
        }

        // wenn es zweistellige Minuten gibt
        if (floatArray.length > 4) {

            // Fromat
            // 0,1,2,3,4
            // +,0,.,1,4

            var gleitHours = parseInt(floatArray[1], 10);
            var gleitTens = parseInt(floatArray[3], 10);
            var gleitOnes = parseInt(floatArray[4], 10);

            var gleitMins = gleitTens*10 + gleitOnes;

            return [vorzeichen, gleitHours, gleitMins];
        }
    }

    function calculateEndForFloat(){

        var floatTime = getFloat($("#float").val());
        var istEnd = calculateNormalEnd();

        var istEndHours = parseInt(istEnd[0], 10);
        var istEndMins = parseInt(istEnd[1], 10);

        var gleitVorzeichen = floatTime[0];
        let floatTimeRounded = [];

        if (gleitVorzeichen === 1){
            floatTimeRounded = getOptimalEndForPositive();
        } else if (gleitVorzeichen === -1) {
            floatTimeRounded = getOptimalEndForNegative();
        }

        var gleitHours = floatTimeRounded[0];
        var gleitMins = floatTimeRounded[1];

        var sollEndHours = istEndHours + (gleitHours * gleitVorzeichen);
        var sollEndMins = istEndMins + (gleitMins * gleitVorzeichen);

        return [sollEndHours, sollEndMins];
    }

    function roundAndSetTimesForFloat(){

        var endTime = calculateEndForFloat();

        var endHours = endTime[0];
        var endMins = endTime[1];

        while (endMins >= 60) {
            endHours++;
            endMins = endMins - 60;
        }

        while (endMins < 0) {
            endHours--;
            endMins = endMins + 60;
        }

        if (endMins < 10){
        endMins = "0" + endMins;
        }

        var sollEndHours = endHours;
        var sollEndMins = endMins;

        $("#end").val(sollEndHours +":"+ sollEndMins);
    }

    function getOptimalEndForPositive(){

        var floatTime = getFloat($("#float").val());

        var gleitHours = floatTime[1];
        var gleitMins = floatTime[2];
        var tens = 0;

        if (gleitHours !== 0 && gleitMins === 0){
            gleitMins = 4;
            // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
            return [gleitHours, gleitMins - 4];
        }

        while(gleitMins > 9){
            gleitMins = gleitMins - 10;
            tens++;
        }

        if (gleitMins <= 4){
            gleitMins = 4;
        }else if (gleitMins <= 9){
            gleitMins = 9;
        }

        gleitMins =  10*tens + gleitMins;
        //console.log("Positive Minuten: " + gleitMins);
        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, gleitMins - 4];

    }

    function getOptimalEndForNegative(){

        var floatTime = getFloat($("#float").val());

        var gleitHours = floatTime[1];
        var gleitMins = floatTime[2];
        var tens = 0;

        if (gleitHours !== 0 && gleitMins === 0){
            gleitMins = 56;
            gleitHours--;
            // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
            return [gleitHours, gleitMins + 4];
        } else if (gleitHours === 0 && gleitMins === 0){
            gleitMins = 1;
            // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
            return [gleitHours, gleitMins + 4];
        }

        while(gleitMins > 9){
            gleitMins = gleitMins - 10;
            tens++;
        }

        if (gleitMins === 0){
            gleitMins = 6;
            tens--;
        }else if (gleitMins >= 6 ){
            gleitMins = 6;
        }else if (gleitMins <= 5){
            gleitMins = 1;
        }

        gleitMins =  10*tens + gleitMins;
        //Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, gleitMins + 4];

    }

    function optimizeEnd(){

        var endTimeBefore = getEnd_time();

        var endHours = parseInt(endTimeBefore[0], 10);
        var endMins = parseInt(endTimeBefore[1], 10);
        var tens = 0;

        while(endMins > 9){
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

        if (endMins <= 9){
            endMins = 0 + endMins.toString();
        }

        $("#end").val(endHours +":"+ endMins);
        setCountdown();

    }

	$("#reset").click(function () {
        resetPauseAndWorkTime();
        set_end();
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

    function switchModeIfIsAllowed(){

        if(readFromLocalStorage("modus") === "6h00m"){
            let float =  getFloat(readFromLocalStorage("float"));

            let floatVorzeichen = float[0];
            let floatHours = float[1];
            let floatMinutes = float[2];

            if (floatVorzeichen > 0 || floatHours < 1) {
                switchToSevenHourMode();
            } else if (floatHours === 1 && floatMinutes < 6){
                switchToSevenHourMode();
            }
        }else if(readFromLocalStorage("modus") === "7h06m"){
            let istTime =  getIstTime();

            let istHours = istTime[0];
            let istMinutes = istTime[1];

            if (istHours < 6) {
                switchToSixHourMode();
            } else if (istHours === 6 && istMinutes === 0){
                switchToSixHourMode();
            }
        }
    }

    function switchToSixHourMode(){
        $("#6h00m").addClass("active");
        $("#7h06m").removeClass("active");
        writeToLocalStorage("modus", "6h00m");
        $("#pause").val("00:00");
        $("#00min").addClass("active");
        $("#30min,#45min").removeClass("active");
        writeToLocalStorage("pause", "00min");
        writeToLocalStorage("pauseTime", "00:00");
    }

    function switchToSevenHourMode(){
        $("#7h06m").addClass("active");
        $("#6h00m").removeClass("active");
        writeToLocalStorage("modus", "7h06m");
        $("#pause").val("00:30");
        $("#30min").addClass("active");
        $("#00min,#45min").removeClass("active");
        writeToLocalStorage("pause", "30min");
        writeToLocalStorage("pauseTime", "00:30");
    }

    function uploadStartTime(){
        var startTime = $("#start").val();
        writeToLocalStorage("start", startTime);
    }

    function uploadGleitzeit(){
        var floatTime = $("#float").val();
        writeToLocalStorage("float", floatTime);
    }

    function readStartAndFloatFromLocalStorageAndSetInFields() {

        var startTime = readFromLocalStorage("start");
        var floatTime = readFromLocalStorage("float");

        if (startTime != null ) {
            $("#start").val(startTime);
        }

        if (floatTime != null){
            $("#float").val(floatTime);
        } else {
            $("#float").val("+0.4");
        }

    }

    function readSollAnPauseFromLocalStorageAndSetInFields() {

        const modusValue = "#" + readFromLocalStorage("modus");
        const pauseValue = "#" + readFromLocalStorage("pause");
        const pauseTime = readFromLocalStorage("pauseTime");

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

    function formatDate(date){
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${day}.${month}.${year}`;
    }

    function datesAreTheSame(date1, date2){
        const date1String = formatDate(date1);
        const date2String = formatDate(date2);

        //console.log(date1String)
        //console.log(date2String)

        if (date1String === date2String){
            return true
        } else if (date1String !== date2String){
            return false
        }
    }

    function isTheSameDay(){
        const currentDate = new Date();
        const storageDate = new Date(readIntFromLocalStorage("todayTimeStamp"))

        return datesAreTheSame(currentDate, storageDate);
    }

    function resetLocalStorage(){
        deleteFromLocalStorage("monday");
        deleteFromLocalStorage("tuesday");
        deleteFromLocalStorage("wednesday");
        deleteFromLocalStorage("thursday");
        deleteFromLocalStorage("friday");

        deleteFromLocalStorage("todayTimeStamp");
        deleteFromLocalStorage("modus");
        deleteFromLocalStorage("float");
        deleteFromLocalStorage("gleittage");
        deleteFromLocalStorage("pause");
        deleteFromLocalStorage("pauseTime");
        deleteFromLocalStorage("start");

        writeToLocalStorage("todayTimeStamp", new Date().getTime());
    }

    if (readFromLocalStorage("windowInitLoaded") && readFromLocalStorage("start") != null && isTheSameDay()){
        readSollAnPauseFromLocalStorageAndSetInFields();
        readStartAndFloatFromLocalStorageAndSetInFields();
        roundAndSetTimesForFloat();
        calculate();
		setGleitzeit();
        setIstTime();
        setCountdown();
        optimizeEnd();
    } else {
        $("#start").focus();
        resetLocalStorage();
    }

    function floatValueCheck(){

        let float = $("#float").val();

        if (float == null || float === ""){
            $("#float").val("0.00");
        }
    }
    
    $("#float").blur(function () {
        setGleitzeit();
        floatValueCheck();
    });

});
