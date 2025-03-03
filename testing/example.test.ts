// @ts-ignore
import {getLaterTime} from "../js/custom/utility";

describe("getLaterTime", () => {

    test("correct with timeTwo beeing bigger", () => {
        const timeOne = [12, 21];
        const timeTwo = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeTwo);
    });

    test("correct with timeOne beeing bigger", () => {
        const timeOne = [15, 1];
        const timeTwo = [14, 51];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });

    test("correct with timeOne and timeTwo beeing equal", () => {
        const timeOne = [13, 20];
        const timeTwo = [13, 20];
        const result = getLaterTime(timeOne, timeTwo);
        expect(result).toEqual(timeOne);
    });
});