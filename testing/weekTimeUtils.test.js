const {
    getWeekWorkTime,
    getWorkedDaysForWeek,
    formatWeekTime,
    formatWeekOverTime
} = require("../js/weekTimeUtils")

describe('getWeekWorkTime', () => {
    test('', () => {
        const weekTime = [];
        const result = getWeekWorkTime(weekTime);
        expect(result).toEqual([]);
    });
});

describe('getWorkedDaysForWeek', () => {
    test('', () => {
        const weekWorkTime = [];
        const result = getWorkedDaysForWeek(weekWorkTime);
        expect(result).toEqual([]);
    });
});

describe('formatWeekTime', () => {
    test('', () => {
        const weekTime =  [];
        const result = formatWeekTime(weekTime);
        expect(result).toEqual([]);
    });
});

describe('formatWeekOverTime', () => {
    test('', () => {
        const weekTime =  [];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual([]);
    });
});
