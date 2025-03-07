import {Time} from "../ts/types";
import {getWeekWorkTime,
    calculateWeekOverTime,
    formatWeekTime,
    formatWeekOverTime} from "../js/custom/weekTimeUtils";

describe("getWeekWorkTime", () => {
    (globalThis as any).setCookie = jest.fn();
    (globalThis as any).prompt = jest.fn();

    test("correct with normal default work hours for each day", () => {
        const weekTime = {
            monday: { hours: 7, mins: 10 },
            tuesday: { hours: 7, mins: 10 },
            wednesday: { hours: 7, mins: 10 },
            thursday: { hours: 7, mins: 10 },
            friday: { hours: 7, mins: 10 },
        };
        const result = getWeekWorkTime(weekTime);
        expect(result).toEqual([35, 50]);
    });

    test("correct with a realistic week", () => {
        const weekTime = {
            monday: { hours: 7, mins: 15 },
            tuesday: { hours: 7, mins: 20 },
            wednesday: { hours: 7, mins: 45 },
            thursday: { hours: 8, mins: 0 },
            friday: { hours: 6, mins: 5 },
        };
        const result = getWeekWorkTime(weekTime);
        expect(result).toEqual([36, 25]);
    });
});

describe("calculateWeekOverTime", () => {
    (globalThis as any).setCookie = jest.fn();
    (globalThis as any).deleteCookie = jest.fn();
    (globalThis as any).getIntCookie = jest.fn();

    beforeEach(() => {
        (globalThis as any).getIntCookie.mockClear();

        (globalThis as any).getIntCookie.mockImplementation((cookieName: string) => {
            if (cookieName === "gleittage") return 0;
            if (cookieName === "workedDays") return 5;
            return 0;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("correct with normal default values", () => {
        const weekTime: Time = [35, 50];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([0, 20]);
    });

    test("correct with a realistic week", () => {
        const weekTime: Time = [36, 25];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([0, 55]);
    });

    test("correct with negativ values", () => {
        const weekTime: Time = [27, 30];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([-8, 0]);
    });

    test("correct with gleittag", () => {
        (globalThis as any).getIntCookie.mockImplementation((cookieName: string) => {
            if (cookieName === "gleittage") return 1;
            if (cookieName === "workedDays") return 4;
            return 0;
        });
        const weekTime: Time = [27, 50];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([-7, -40]);
    });

    test("correct with gleittag", () => {
        (globalThis as any).getIntCookie.mockImplementation((cookieName: string) => {
            if (cookieName === "gleittage") return 0;
            if (cookieName === "workedDays") return 4;
            return 0;
        });
        jest.spyOn(global, "prompt").mockReturnValue("1");
        const weekTime: Time = [30, 15];
        const result = calculateWeekOverTime(weekTime);
        expect(result).toEqual([-5, -15]);
    });
});

describe("formatWeekTime", () => {
    test("default values", () => {
        const weekTime: Time = [35, 30];
        const result = formatWeekTime(weekTime);
        expect(result).toEqual("35.30 h");
    });

    test("with values under 10", () => {
        const weekTime: Time = [7, 6];
        const result = formatWeekTime(weekTime);
        expect(result).toEqual("7.06 h");
    });

    test("with one value under 10", () => {
        const weekTime: Time = [14, 6];
        const result = formatWeekTime(weekTime);
        expect(result).toEqual("14.06 h");
    });

    test("with the other value under 10", () => {
        const weekTime: Time = [7, 12];
        const result = formatWeekTime(weekTime);
        expect(result).toEqual("7.12 h");
    });

});

describe("formatWeekOverTime", () => {
    test("correct with positiv values", () => {
        const weekTime: Time = [0, 20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("+0.20 h");
    });

    test("correct with negativ values", () => {
        const weekTime: Time = [-1, -20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-1.20 h");
    });

    test("correct with negativ hours", () => {
        const weekTime: Time = [-1, 0];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-1.0 h");
    });

    test("correct with negativ minutes", () => {
        const weekTime: Time = [0, -20];
        const result = formatWeekOverTime(weekTime);
        expect(result).toEqual("-0.20 h");
    });
});