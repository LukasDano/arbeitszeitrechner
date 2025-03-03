import {Time} from "../ts/types";
import {
    getLaterTime,
    formatTime,
    formatNumber,
    minutesToTime
} from "../js/custom/utility";

describe("getLaterTime", () => {

    test("correct with timeTwo beeing bigger", () => {
        const timeOne: Time = [12, 21];
        const timeTwo: Time = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeTwo);
    });

    test("correct with timeOne beeing bigger", () => {
        const timeOne: Time = [15, 1];
        const timeTwo: Time = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });

    test("correct with timeOne and timeTwo beeing equal", () => {
        const timeOne: Time = [13, 20];
        const timeTwo: Time = [13, 20];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });
});

describe("formatTime", () => {
    test("correct when less then 10 mins", () => {
        const time: Time = [7, 6];
        const result = formatTime(time);
        expect(result).toEqual("7.06");
    });

    test("correct when more then 10 mins", () => {
        const time: Time = [7, 36];
        const result = formatTime(time);
        expect(result).toEqual("7.36");
    });
});

describe("formatNumber", () => {
    test("return correct with less than 10", () => {
        const mins = 4;
        const result = formatNumber(mins);
        expect(result).toEqual("04");
    });

    test("return correct with more than 10", () => {
        const mins = 12;
        const result = formatNumber(mins);
        expect(result).toEqual("12");
    });

    test("return correct with broder value", () => {
        const mins = 9;
        const result = formatNumber(mins);
        expect(result).toEqual("09");
    });

    test("with a 0", () => {
        const mins = 0;
        const result = formatNumber(mins);
        expect(result).toEqual("00");
    });
});

describe("minutesToTime", () => {
    test("more than 60", () => {
        const minutes = 108;
        const result = minutesToTime(minutes);
        expect(result).toEqual([1, 48]);
    });

    test("exactly 60", () => {
        const minutes = 60;
        const result = minutesToTime(minutes);
        expect(result).toEqual([1, 0]);
    });

    test("less than 60", () => {
        const minutes = 42;
        const result = minutesToTime(minutes);
        expect(result).toEqual([0, 42]);
    });

    test("exactly 120", () => {
        const minutes = 120;
        const result = minutesToTime(minutes);
        expect(result).toEqual([2, 0]);
    });

    test("neagtiv under one hour", () => {
        const minutes = -1;
        const result = minutesToTime(minutes);
        expect(result).toEqual([0, -1]);
    });

    test("neagtiv more then an hour", () => {
        const minutes = -108;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-1, -48]);
    });

    test("neagtiv an hour", () => {
        const minutes = -60;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-1, -0]);
    });

    test("neagtiv two hours", () => {
        const minutes = -120;
        const result = minutesToTime(minutes);
        expect(result).toEqual([-2, -0]);
    });
});
