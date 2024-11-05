// Gibt die Differenz zwischen Start und Ende zurück
function calculateStartEndeTimeDiff(startTime, endTime) {

    const [startHours, startMins] = startTime;
    const [endHours, endMins] = endTime;

    let diffHours = endHours - startHours;
    let diffMins = endMins - startMins;

    // Bei negativer Differenz: + 60 min & -1h
    if (diffMins < 0) {
        diffHours--;
        diffMins = diffMins + 60;
    }
    return [diffHours, diffMins];
}

// Berechnet die Differenz zwischen IST und SOLL
function calculateIstSollTimeDiff(workTime, sollTime) {

    const [workHours, workMins] = workTime;
    const [sollHours, sollMins] = sollTime;

    let diffHours = workHours - sollHours;
    let diffMins;

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

// Berechnet die reine Arbeitszeit (abzüglich Pause)
function calculateWorkTime(diffTime, pauseTime) {

    const [diffHours, diffMins] = diffTime;
    const [pauseHours, pauseMins] = pauseTime;

    let workHours = diffHours - pauseHours;
    let workMins = diffMins - pauseMins;

    if (workMins < 0) {
        workHours--;
        workMins = workMins + 60;
    }

    return [workHours, workMins];
}

// Add 0 to the minutes and put hours and mins to gether into this format: "hh:mm"
function formatTime(hours, mins) {
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${hours}:${formattedMins}`;
}

// Calculates the End out of start, pause and soll
function calculateNormalEnd(startTime, pauseTime, sollTime) {

    const [startHours, startMins] = startTime
    const [pauseHours, pauseMins] = pauseTime;
    const [sollHours, sollMins] = sollTime;

    let endHours = startHours + pauseHours + sollHours;
    let endMins = startMins + pauseMins + sollMins;

    if (endHours >= 24) {
        endHours = endHours - 24;
    }

    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 120 sind
    if (endMins >= 120) {
        endMins = endMins - 120;
        endHours += 2;
    }

    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 60 sind
    if (endMins >= 60) {
        endMins = endMins - 60;
        endHours++;
    }

    return [endHours, endMins];
}

// Berechnet die gewertete Zeit aus dem gerundeten Start und dem gerundeten Ende
function calculateIstTime(startTime, endTime, pauseTime) {

    const [startHours, startMins] = roundStart(startTime);
    const [endHours, endMins] = roundEnd(endTime);
    const [, pauseMins] = pauseTime;

    let istHours = endHours - startHours;
    let istMins = endMins - startMins - pauseMins;

    while (istMins < 0) {
        istHours--;
        istMins = istMins + 60;
    }

    if (istHours >= 12) {
        istHours = istHours - 2;
    }

    return [istHours, istMins];
}

// Zieht die sollZeit von der istZeit ab und gibt das als Gleitzeit zurück
function calculateGleitzeit(istTime) {

    const [istHours, istMins] = istTime;
    const [sollHours, sollMins] = [7, 6];

    let gleitHours = istHours - sollHours;
    let gleitMins = istMins - sollMins;

    if (istHours < sollHours) {
        gleitHours++;
        gleitMins = gleitMins - 60;
    }

    if (gleitHours > 0 && gleitMins < 0) {
        gleitHours--;
        gleitMins = gleitMins + 60;
    }

    if (gleitMins < -59) {
        gleitHours--;
        gleitMins = gleitMins + 60;
    }

    return [gleitHours, gleitMins];
}

// Arbeitsbeginn auf 10er und 5er abrunden
function roundStart(startTime) {

    let [startHours, startMins] = startTime;
    let tens = 0;

    while (startMins > 9) {
        startMins = startMins - 10;
        tens++;
    }

    if (startMins >= 5) {
        startMins = 5;
    }

    if (startMins <= 4) {
        startMins = 0;
    }

    startMins = startMins + (tens * 10);

    return [startHours, startMins];
}

// Arbeitsende auf 10er und 5er abrunden
function roundEnd(endTime) {

    let [endHours, endMins] = endTime;
    let tens = 0;


    if (endMins >= 56) {
        endMins = 0;
        endHours++;

        return [endHours, endMins];
    }

    while (endMins > 9) {
        endMins = endMins - 10;
        tens++;
    }

    if (endMins >= 6) {
        endMins = 0;
        tens++;

    } else if (endMins === 0) {
        endMins = 0;

    } else if (endMins <= 4) {
        endMins = 5;
    }

    endMins = endMins + (tens * 10);

    return [endHours, endMins];
}

// Add a 0 if the Minutes are below 10
function formateMins(mins) {
    if (mins <= 9) {
        return "0" + mins;
    }
    return mins.toString();
}

// Calculate the End from the normal End and the desired amount of Float time
function calculateEndForFloat(normalEnd, float) {

    let [istEndHours, istEndMins] = normalEnd;
    const gleitVorzeichen = float[0];

    let floatTimeRounded;

    if (gleitVorzeichen === 1) {
        floatTimeRounded = calculateTimeToAddForEndWithPositiveFloat(float);
    } else if (gleitVorzeichen === -1) {
        floatTimeRounded = calculateTimeToAddForEndWithNegativeFloat(float);
    }

    const [gleitHours, gleitMins] = floatTimeRounded;

    const sollEndHours = istEndHours + (gleitHours * gleitVorzeichen);
    const sollEndMins = istEndMins + (gleitMins * gleitVorzeichen);

    return [sollEndHours, sollEndMins];
}

// Berechnet die Zeit, die dem normalen Ende hinzugefügt werden muss, um die gewünschte Gleitzeit zu bekommen, wenn diese positiv ist
function calculateTimeToAddForEndWithPositiveFloat(float) {

    let [, gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0) {
        gleitMins = 4;
        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, (gleitMins - 4)];
    }

    while (gleitMins > 9) {
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins <= 4) {
        gleitMins = 4;

    } else if (gleitMins <= 9) {
        gleitMins = 9;
    }

    gleitMins = 10 * tens + gleitMins;

    return [gleitHours, (gleitMins - 4)];
}

// Berechnet die Zeit, die dem normalen Ende hinzugefügt werden muss, um die gewünschte Gleitzeit zu bekommen, wenn diese nagativ ist
function calculateTimeToAddForEndWithNegativeFloat(float) {

    let [, gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0) {
        gleitMins = 56;
        gleitHours--;

        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, (gleitMins + 4)];

    } else if (gleitHours === 0 && gleitMins === 0) {
        gleitMins = 1;

        return [gleitHours, (gleitMins + 4)];
    }

    while (gleitMins > 9) {
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins === 0) {
        gleitMins = 6;
        tens--;

    } else if (gleitMins >= 6) {
        gleitMins = 6;

    } else if (gleitMins <= 5) {
        gleitMins = 1;
    }

    gleitMins = 10 * tens + gleitMins;

    return [gleitHours, (gleitMins + 4)];
}

// Creates an Array with Float Values from a String
function getFloatValueFromText(float) {

    const floatArray = float.split('');
    let vorzeichen = 1;

    if (floatArray[0] === "-") {
        vorzeichen = -1;
    }

    // wenn es zweistellige Minuten gibt
    if (floatArray.length > 4) {

        // Fromat
        // 0,1,2,3,4
        // +,0,.,1,4

        const gleitHours = parseInt(floatArray[1], 10);
        const gleitTens = parseInt(floatArray[3], 10);
        const gleitOnes = parseInt(floatArray[4], 10);

        const gleitMins = gleitTens * 10 + gleitOnes;

        return [vorzeichen, gleitHours, gleitMins];
    }
}

// Takes the current End Time and gives the Time with the least amount of worktime that gives the same amount of Gleitzeit
function calculateOptimizedEnd(endTime) {

    let [endHours, endMins] = endTime;
    let tens = 0;

    while (endMins > 9) {
        endMins = endMins - 10;
        tens++;
    }

    if (endMins === 0 && tens === 0) {
        endMins = 56;
        endHours--;

    } else if (endMins === 0) {
        endMins = 6;
        tens--;

    } else if (endMins >= 6) {
        endMins = 6;

    } else if (endMins <= 5) {
        endMins = 1;
    }

    endMins = 10 * tens + endMins;

    if (endMins <= 9) {
        endMins = "0" + endMins
    }

    return [endHours, endMins];
}

// Rechnet aus dem eigentlichen Ende und der Gleitzeit das Ende für diese Gleitzeit
function roundTimeForFloat(normalEnd, floatTime) {

    let [endHours, endMins] = calculateEndForFloat(normalEnd, floatTime);

    while (endMins >= 60) {
        endHours++;
        endMins = endMins - 60;
    }

    while (endMins < 0) {
        endHours--;
        endMins = endMins + 60;
    }

    if (endMins < 10) {
        endMins = "0" + endMins;
    }

    return [endHours, endMins];
}

// Increases the Value of a given float value to the next higher allowed value
function calculateIncreasedValue(float) {
    let [floatVorzeichen, floatHours, floatMins] = float;
    // 1,0,4
    floatHours = floatHours * floatVorzeichen
    floatMins = floatMins * floatVorzeichen

    if (floatMins == 59) {
        floatHours += 1;
        floatMins = 4;

        return [floatHours, floatMins];
    }

    if (floatHours === 0 && floatMins === -1) {
        floatMins = 4;
        return [floatHours, floatMins];
    }

    if (floatHours <= 0 && floatMins === -1) {
        floatHours += 1;
        floatMins = -56
        return [floatHours, floatMins];
    }

    floatMins = floatMins + 5;

    if (floatHours === -0) {
        floatHours = 0;
    }

    return [floatHours, floatMins];
}

// Decreases the Value of a given float value to the next lower allowed value
function calculateDecreasedValue(float) {
    let [floatVorzeichen, floatHours, floatMins] = float;
    // 1,0,4
    floatHours = floatHours * floatVorzeichen
    floatMins = floatMins * floatVorzeichen

    if (floatMins === 4 && floatHours === 0) {
        floatMins = -1;

        return [floatHours, floatMins];
    }

    if (floatHours <= 0 && floatMins === -56) {
        floatHours -= 1;
        floatMins = -1
        return [floatHours, floatMins];
    }

    if (floatMins === 4) {
        floatHours -= 1;
        floatMins = 59;

        return [floatHours, floatMins];
    }

    floatMins = floatMins - 5;

    if (floatHours === -0) {
        floatHours = 0;
    }

    return [floatHours, floatMins];
}

// Erzeugt aus [FloatHours, FloatMins] einen lesbareren String, der zur Darstellung genutz werden kann
function createGleitzeitAusgabeFromFloat(float) {

    let [gleitHours, gleitMins] = float;
    let gleitAusgabe;

    if (gleitHours < 0 || gleitMins < 0) {

        gleitHours = Math.abs(gleitHours);
        gleitMins = Math.abs(gleitMins);

        gleitAusgabe = "-" + gleitHours + "." + formateMins(gleitMins);

    } else if (gleitHours > 0 || gleitMins > 0) {
        gleitAusgabe = "+" + gleitHours + "." + formateMins(gleitMins);
    }

    return gleitAusgabe;
}


module.exports = {
    calculateStartEndeTimeDiff,
    calculateIstSollTimeDiff,
    calculateWorkTime,
    formatTime,
    calculateNormalEnd,
    calculateIstTime,
    calculateGleitzeit,
    roundStart,
    roundEnd,
    formateMins,
    calculateEndForFloat,
    calculateTimeToAddForEndWithPositiveFloat,
    calculateTimeToAddForEndWithNegativeFloat,
    getFloatValueFromText,
    calculateOptimizedEnd,
    roundTimeForFloat,
    calculateIncreasedValue,
    calculateDecreasedValue,
    createGleitzeitAusgabeFromFloat
};
