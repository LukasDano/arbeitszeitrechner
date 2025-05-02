// Formel
// [ende - beginn (gerundet) aus der hauptmaske] - [die Zeit aller austragungen zsm.] = die tatsächlich gewertete Zeit des tages (hier muss man dann noch entsprechen die gleitzeit für Ausrechnen)

// Bsp Daten:
// 8:24 - 11:45 (8:24 wird als 8:20 gewertet) = 3h 25min
// 12:45 - 16:52 (16:52 wird als 16:55 gewertet) = 4h 10min

// soll: 7.06
// ist: 7.35
// gleitzeit: 0.29

function calculateFullWorkTimeWithoutTheManualBreak(startTime, endTime, breakTime) {
    const [startHours, startMins] = startTime;
    const [endHours, endMins] = endTime;
    const [breakHours, breakMins] = breakTime;
    const [fullPauseHours, fullPauseMins] = calculateFullManualPauseTime();

    const workTime = calculateStartEndeTimeDiff(startTime, endTime);
    let [resultHours, resultMins] = subtractTimeValues(workTime, breakTime);

    //TODO das ist sehr vereinfacht, muss noch auf evtl. überhänge in ander Stunden angepasst werden
    resultMins = resultMins - 30;

    const result = [resultHours, resultMins]

    console.log(result);
    return result;
}

function calculateManualPauseTime(id){

    const startId = "beginn" + id;
    const endId = "end" + id;

    const startValue = getTimeFromFieldById(startId);
    const endValue = getTimeFromFieldById(endId);

    return calculateStartEndeTimeDiff(startValue, endValue);
}

function calculateFullManualPauseTime(){
    const fieldNumbers = ["01", "02", "03"];
    let [fullManualPauseHours, fullManualPauseMins] = [0,0];

    fieldNumbers.forEach(fieldNumber => {
        const [pauseHours, pauseMins] = calculateManualPauseTime(fieldNumber);
        fullManualPauseHours += pauseHours;
        fullManualPauseMins += pauseMins;
    });

    const [remainingHours, remainingMins] = minutesToTime(fullManualPauseMins);
    fullManualPauseHours += remainingHours;

    return [fullManualPauseHours, remainingMins];

}
