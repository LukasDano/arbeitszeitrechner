const {
    calculatePercentage,
    timeLeftToReachPercentage,
    checkIfTimeIsBelowZero
} = require("../js/custom/flexOfficeUtils");


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

describe("checkIfTimeIsBelowZero", () => {
    test("default", () => {
        const time = [7, 50];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([7, 50]);
    });

    test("einstellige Minuten", () => {
        const time = [7, 6];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([7, 6]);
    });

    test("0h, 0m", () => {
        const time = [0, 0];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Stunden", () => {
        const time = [-1, 0];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Minuten", () => {
        const time = [0, -14];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });

    test("minus Stunden und Minuten", () => {
        const time = [-1, -14];
        const result = checkIfTimeIsBelowZero(time);
        expect(result).toEqual([0, 0]);
    });
});