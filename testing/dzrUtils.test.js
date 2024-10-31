const {
    calculateStartEndeTimeDiff,
    calculateIstSollTimeDiff,
    calculateWorkTime,
    formatTime,
    calculateNormalEnd,
    calcuateIstTime,
    calcuateGleitzeit,
    roundStart,
    roundEnd,
    formateGleitMins,
    calculateEndForFloat,
    calculateOptimalEndForPositive,
    calculateOptimalEndForNegative,
    getFloatValue
} = require("../js/dzrUtils")

describe('calculateStartEndeTimeDiff', () => {
    test('should return the correct difference when end time is after start time', () => {
        const startTime = [10, 30];
        const endTime = [12, 45];
        const result = calculateStartEndeTimeDiff(startTime, endTime);
        expect(result).toEqual([2, 15]);
    });

    test('should handle negative minute difference correctly', () => {
        const startTime = [10, 45];
        const endTime = [12, 30];
        const result = calculateStartEndeTimeDiff(startTime, endTime);
        expect(result).toEqual([1, 45]);
    });

    test('should handle same start and end time', () => {
        const startTime = [10, 30];
        const endTime = [10, 30];
        const result = calculateStartEndeTimeDiff(startTime, endTime);
        expect(result).toEqual([0, 0]);
    });

    test('should handle hours difference only', () => {
        const startTime = [8, 0];
        const endTime = [15, 0];
        const result = calculateStartEndeTimeDiff(startTime, endTime);
        expect(result).toEqual([7, 0]);
    });
});

describe('calculateIstSollTimeDiff', () => {
    test('correct difference less then an hour negativ', () => {
        const workTime = [6, 30];
        const sollTime = [7, 6];
        const result = calculateIstSollTimeDiff(workTime, sollTime);
        expect(result).toEqual([0, 36, false]);
    });

    test('correct difference less then an hour positiv', () => {
        const workTime = [8, 0];
        const sollTime = [7, 6];
        const result = calculateIstSollTimeDiff(workTime, sollTime);
        expect(result).toEqual([0, 54, true]);
    });

    test('correct difference more then an hour negativ', () => {
        const workTime = [5, 30];
        const sollTime = [7, 6];
        const result = calculateIstSollTimeDiff(workTime, sollTime);
        expect(result).toEqual([-1, 36, false]);
    });

    test('correct difference more then an hour positiv', () => {
        const workTime = [8, 50];
        const sollTime = [7, 6];
        const result = calculateIstSollTimeDiff(workTime, sollTime);
        expect(result).toEqual([1, 44, true]);
    });

});

describe('calculateWorkTime', () => {
    test('correct default with default values', () => {
        const diffTime = [7, 36];
        const pauseTime = [0, 30];
        const result = calculateWorkTime(diffTime, pauseTime);
        expect(result).toEqual([7, 6]);
    });

});

describe('formatTime', () => {
    test('correct when less then 10 mins', () => {
        const hours = 7;
        const mins = 6;
        const result = formatTime(hours, mins);
        expect(result).toEqual("7:06");
    });

    test('correct when more then 10 mins', () => {
        const hours = 7;
        const mins = 36;
        const result = formatTime(hours, mins);
        expect(result).toEqual("7:36");
    });

});

describe('calculateNormalEnd', () => {
    test('return the correct with default values', () => {
        const startTime = [7,7];
        const pauseTime = [0,30];
        const sollTime = [7,6];
        const result = calculateNormalEnd(startTime, pauseTime, sollTime);
        expect(result).toEqual([14,43]);
    });

});

describe('calcuateIstTime', () => {
    test('return the correct with default values', () => {
        const startTime = [7,7];
        const endTime = [14,43];
        const pauseTime = [0,30];
        const result = calcuateIstTime(startTime, endTime, pauseTime);
        expect(result).toEqual([7,10]);
    });

});
