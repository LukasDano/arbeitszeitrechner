function calculateFullWorkTimeWithoutTheManualBreak(startTime, endTime, breakTime) {
    const [startHours, startMins] = startTime;
    const [endHours, endMins] = endTime;
    const [breakHours, breakMins] = breakTime;

    const workTime = calculateStartEndeTimeDiff(startTime, endTime);
    let [resultHours, resultMins] = subtractTimeValues(workTime, breakTime);

    //TODO das ist sehr vereinfacht, muss noch auf evtl. überhänge in ander Stunden angepasst werden
    resultMins = resultMins - 30;

    const result = [resultHours, resultMins]

    console.log(result);
    return result;
}