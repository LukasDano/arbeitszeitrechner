import {Time, FloatTime} from "./types"

export function formatTime (hours: number, mins: number): string {
    const formattedMins = mins < 10 ? `0${mins}` : mins; // Add leading zero if mins is a single digit
    return `${hours}:${formattedMins}`;
}

export function calculateNormalEnd(startTime: Time, pauseTime: Time, sollTime: Time): Time{

    const {hours: startHours, mins: startMins} = startTime
    const {hours: pauseHours, mins: pauseMins} = pauseTime;
    const {hours: sollHours, mins: sollMins} = sollTime;

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

    return {hours: endHours, mins: endMins};
}

// Arbeitsbeginn auf 10er und 5er abrunden
export function roundStart(startTime: Time): Time {

    let {hours: startHours, mins: startMins} = startTime;
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

    return {hours: startHours, mins: startMins};
}

// Arbeitsende auf 10er und 5er abrunden
export function roundEnd(endTime: Time): Time {

    let {hours: endHours, mins: endMins} = endTime;
    let tens = 0;


    if (endMins >= 56){
        endMins = 0;
        endHours++;

        return {hours: endHours, mins: endMins};
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

    return {hours: endHours, mins: endMins};
}

// GerundeterAnfang - GerundetesEnde = Ist Arbeitszeit
export function calcuateIstTime(startTime: Time, endTime: Time, pauseTime: Time): Time{

    const {hours: startHours, mins: startMins} = roundStart(startTime);
    const {hours: endHours, mins: endMins} = roundEnd(endTime);
    const {mins: pauseMins} = pauseTime;

    let istHours = endHours - startHours;
    let istMins = endMins - startMins - pauseMins;

    while (istMins < 0){
        istHours--;
        istMins = istMins + 60;
    }

    if (istHours >= 12){
        istHours = istHours - 2;
    }

    return {hours: istHours, mins: istMins};
}

export function calcuateGleitzeit(istTime: Time): Time{

    const {hours: istHours, mins: istMins} = istTime;
    const {hours: sollHours, mins: sollMins} = {hours: 7, mins: 8};

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

    return {hours: gleitHours, mins: gleitMins};
}

export function formateGleitMins(gleitMins: number): string {
    if (gleitMins <= 9) {
        return "0" + gleitMins;
    }
    return gleitMins.toString();
}

export function calculateEndForFloat(normalEnd: Time, float: FloatTime): Time {

    let {hours: istEndHours, mins: istEndMins} = normalEnd
    const gleitVorzeichen = float.vorzeichen;

    let floatTimeRounded: Time;

    if (gleitVorzeichen === 1){
        floatTimeRounded = calculateOptimalEndForPositive(float);
    } else if (gleitVorzeichen === -1) {
        floatTimeRounded = calculateOptimalEndForNegative(float);
    }

    const {hours: gleitHours, mins: gleitMins} = floatTimeRounded;

    const sollEndHours = istEndHours + (gleitHours * gleitVorzeichen);
    const sollEndMins = istEndMins + (gleitMins * gleitVorzeichen);

    return {hours: sollEndHours, mins: sollEndMins};
}

function calculateOptimalEndForPositive(float: FloatTime): Time {

    let {hours: gleitHours, mins: gleitMins} = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0){
        gleitMins = 4;
        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return {hours: gleitHours, mins: (gleitMins - 4)};
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

    return {hours: gleitHours, mins: (gleitMins - 4)};
}

function calculateOptimalEndForNegative(float: FloatTime): Time{

    let {hours: gleitHours, mins: gleitMins} = float
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0){
        gleitMins = 56;
        gleitHours--;

        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return {hours: gleitHours, mins: (gleitMins + 4)};

    } else if (gleitHours === 0 && gleitMins === 0){
        gleitMins = 1;

        return {hours: gleitHours, mins: (gleitMins + 4)};
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

    return {hours: gleitHours, mins: (gleitMins + 4)};
}