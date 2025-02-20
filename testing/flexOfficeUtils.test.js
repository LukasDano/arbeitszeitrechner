const {
    minutesToTime,
    calculatePercentage,
    timeLeftToReachPercentage,
    formatTimeValueToString
} = require("../js/flexOfficeUtils");

describe("minutesToTime", () => {
    test("default", () => {
        const minutes = 108;
        const result = minutesToTime(minutes);
        expect(result).toEqual([1, 48]);
    });
});

describe("calculatePercentage", () => {
    test("default", () => {
        const flexTime = [40, 49];
        const workTimeMonth = [127, 48];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(31.93792383933229);
    });
});

describe("timeLeftToReachPercentage", () => {
    test("default", () => {
        const currentPercentage = 31.93792383933229;
        const targetPercentage = 50;
        const workTimeMonth = [127, 48];
        const result = timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth);
        expect(result).toEqual([23, 5]);
    });
});

describe("formatTimeValueToString", () => {
    test("default", () => {
        const time = [7, 50];
        const result = formatTimeValueToString(time);
        expect(result).toEqual("7.50");
    });

    test("einstellige Minuten", () => {
        const time = [7, 6];
        const result = formatTimeValueToString(time);
        expect(result).toEqual("7.06");
    });

    test("hohe stunden", () => {
        const time = [127, 48];
        const result = formatTimeValueToString(time);
        expect(result).toEqual("127.48");
    });
});