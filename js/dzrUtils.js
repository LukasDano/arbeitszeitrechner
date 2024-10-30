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

function formatTime (hours, mins) {
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${hours}:${formattedMins}`;
}

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

// Arbeitsbeginn auf 10er und 5er abrunden
function roundStart(startTime) {

    let [startHours, startMins] = startTime;
    let tens = 0;

    while (startMins > 9){
        startMins = startMins - 10;
        tens++;
    }

    if (startMins >= 5){
        startMins = 5;
    }

    if (startMins <= 4){
        startMins = 0;
    }

    startMins = startMins + (tens*10);

    return [startHours, startMins];
}

// Arbeitsende auf 10er und 5er abrunden
function roundEnd(endTime) {

    let [endHours, endMins] = endTime;
    let tens = 0;


    if (endMins >= 56){
        endMins = 0;
        endHours++;

        return [endHours, endMins];
    }

    while (endMins > 9){
        endMins = endMins - 10;
        tens++;
    }

    if (endMins >= 6){
        endMins = 0;
        tens++;

    } else if(endMins === 0){
        endMins = 0;

    } else if (endMins <= 4){
        endMins = 5;
    }

    endMins = endMins + (tens*10);

    return [endHours, endMins];
}

// GerundeterAnfang - GerundetesEnde = Ist Arbeitszeit
function calcuateIstTime(startTime, endTime, pauseTime){

    const [startHours, startMins] = roundStart(startTime);
    const [endHours, endMins] = roundEnd(endTime);
    const [, pauseMins] = pauseTime;

    let istHours = endHours - startHours;
    let istMins = endMins - startMins - pauseMins;

    while (istMins < 0){
        istHours--;
        istMins = istMins + 60;
    }

    if (istHours >= 12){
        istHours = istHours - 2;
    }

   return [istHours, istMins];
}

function calcuateGleitzeit(istTime){

    const [istHours, istMins] = istTime;
    const [sollHours, sollMins] = [7,6];

    let gleitHours = istHours - sollHours;
    let gleitMins = istMins - sollMins;

    if (istHours < sollHours) {
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

function formateGleitMins(gleitMins) {
    if (gleitMins <= 9) {
        return "0" + gleitMins;
    }
    return gleitMins.toString();
}

function calculateEndForFloat(normalEnd, float) {

    let [istEndHours, istEndMins] = normalEnd;
    const gleitVorzeichen = float[0];

    let floatTimeRounded;

    if (gleitVorzeichen === 1){
        floatTimeRounded = calculateOptimalEndForPositive(float);
    } else if (gleitVorzeichen === -1) {
        floatTimeRounded = calculateOptimalEndForNegative(float);
    }

    const [gleitHours, gleitMins] = floatTimeRounded;

    const sollEndHours = istEndHours + (gleitHours * gleitVorzeichen);
    const sollEndMins = istEndMins + (gleitMins * gleitVorzeichen);

    return [sollEndHours, sollEndMins];
}

function calculateOptimalEndForPositive(float) {

    let [gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0){
        gleitMins = 4;
        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, (gleitMins - 4)];
    }

    while(gleitMins > 9){
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins <= 4){
        gleitMins = 4;

    } else if (gleitMins <= 9){
        gleitMins = 9;
    }

    gleitMins =  10*tens + gleitMins;

    return [gleitHours, (gleitMins - 4)];
}

function calculateOptimalEndForNegative(float){

    let [gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0){
        gleitMins = 56;
        gleitHours--;

        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, (gleitMins + 4)];

    } else if (gleitHours === 0 && gleitMins === 0){
        gleitMins = 1;

        return [gleitHours, (gleitMins + 4)];
    }

    while (gleitMins > 9){
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins === 0){
        gleitMins = 6;
        tens--;

    } else if (gleitMins >= 6 ){
        gleitMins = 6;

    } else if (gleitMins <= 5){
        gleitMins = 1;
    }

    gleitMins =  10*tens + gleitMins;

    return [gleitHours, (gleitMins + 4)];
}

function getFloat(float) {

    const floatArray = float.split('');
    let vorzeichen = 1;

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

        return [vorzeichen, gleitHours, gleitMins];
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

        return [vorzeichen, gleitHours, gleitMins];
    }
}
