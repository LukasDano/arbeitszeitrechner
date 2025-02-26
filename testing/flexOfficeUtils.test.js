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

    test("100%", () => {
        const flexTime = [127, 48];
        const workTimeMonth = [127, 48];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(100);
    });

    test("50%", () => {
        const flexTime = [60, 0];
        const workTimeMonth = [120, 0];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(50);
    });

    test("0%", () => {
        const flexTime = [0, 0];
        const workTimeMonth = [100, 0];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(0);
    });

    test("110%", () => {
        const flexTime = [110, 0];
        const workTimeMonth = [100, 0];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(110.00000000000001);
    });

    test("-10%", () => {
        const flexTime = [-10, 0];
        const workTimeMonth = [100, 0];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(-10);
    });

    test("0,5%", () => {
        const flexTime = [50, 0];
        const workTimeMonth = [10000, 0];
        const result = calculatePercentage(flexTime, workTimeMonth);
        expect(result).toEqual(0.5);
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

    test("zero time left", () => {
        const currentPercentage = 50;
        const targetPercentage = 50;
        const workTimeMonth = [127, 48];
        const result = timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth);
        expect(result).toEqual([0, 0]);
    });

    test("to much percentage", () => {
        const currentPercentage = 55;
        const targetPercentage = 50;
        const workTimeMonth = [127, 48];
        const result = timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth);
        expect(result).toEqual([0, 0]);
    });

    test("zero percent", () => {
        const currentPercentage = 0;
        const targetPercentage = 50;
        const workTimeMonth = [127, 48];
        const result = timeLeftToReachPercentage(currentPercentage, targetPercentage, workTimeMonth);
        expect(result).toEqual([63, 54]);
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