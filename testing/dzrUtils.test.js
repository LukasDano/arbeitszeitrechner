const {
  calculateStartEndeTimeDiff,
  calculateIstSollTimeDiff,
  calculateWorkTime,
  formatTime,
  calculateNormalEnd,
  calculateIstTime,
  calculateGleitzeit,
  roundStart,
  roundEnd,
  formateMins,
  calculateEndForFloat,
  calculateTimeToAddForEndWithPositiveFloat,
  calculateTimeToAddForEndWithNegativeFloat,
  getFloatValueFromText,
  calculateOptimizedEnd,
  roundTimeForFloat,
  calculateIncreasedValue,
  calculateDecreasedValue,
  createGleitzeitAusgabeFromFloat,
  validateFloat
} = require("../js/dzrUtils");

describe("calculateStartEndeTimeDiff", () => {
  test("should return the correct difference when end time is after start time", () => {
    const startTime = [10, 30];
    const endTime = [12, 45];
    const result = calculateStartEndeTimeDiff(startTime, endTime);
    expect(result).toEqual([2, 15]);
  });

  test("should handle negative minute difference correctly", () => {
    const startTime = [10, 45];
    const endTime = [12, 30];
    const result = calculateStartEndeTimeDiff(startTime, endTime);
    expect(result).toEqual([1, 45]);
  });

  test("should handle same start and end time", () => {
    const startTime = [10, 30];
    const endTime = [10, 30];
    const result = calculateStartEndeTimeDiff(startTime, endTime);
    expect(result).toEqual([0, 0]);
  });

  test("should handle hours difference only", () => {
    const startTime = [8, 0];
    const endTime = [15, 0];
    const result = calculateStartEndeTimeDiff(startTime, endTime);
    expect(result).toEqual([7, 0]);
  });
});

describe("calculateIstSollTimeDiff", () => {
  test("correct difference less then an hour negativ", () => {
    const workTime = [6, 30];
    const sollTime = [7, 6];
    const result = calculateIstSollTimeDiff(workTime, sollTime);
    expect(result).toEqual([0, 36, false]);
  });

  test("correct difference less then an hour positiv", () => {
    const workTime = [8, 0];
    const sollTime = [7, 6];
    const result = calculateIstSollTimeDiff(workTime, sollTime);
    expect(result).toEqual([0, 54, true]);
  });

  test("correct difference more then an hour negativ", () => {
    const workTime = [5, 30];
    const sollTime = [7, 6];
    const result = calculateIstSollTimeDiff(workTime, sollTime);
    expect(result).toEqual([-1, 36, false]);
  });

  test("correct difference more then an hour positiv", () => {
    const workTime = [8, 50];
    const sollTime = [7, 6];
    const result = calculateIstSollTimeDiff(workTime, sollTime);
    expect(result).toEqual([1, 44, true]);
  });
});

describe("calculateWorkTime", () => {
  test("correct default with default values", () => {
    const diffTime = [7, 36];
    const pauseTime = [0, 30];
    const result = calculateWorkTime(diffTime, pauseTime);
    expect(result).toEqual([7, 6]);
  });
});

describe("formatTime", () => {
  test("correct when less then 10 mins", () => {
    const hours = 7;
    const mins = 6;
    const result = formatTime(hours, mins);
    expect(result).toEqual("7.06");
  });

  test("correct when more then 10 mins", () => {
    const hours = 7;
    const mins = 36;
    const result = formatTime(hours, mins);
    expect(result).toEqual("7.36");
  });
});

describe("calculateNormalEnd", () => {
  test("return the correct with default values", () => {
    const startTime = [7, 7];
    const pauseTime = [0, 30];
    const sollTime = [7, 6];
    const result = calculateNormalEnd(startTime, pauseTime, sollTime);
    expect(result).toEqual([14, 43]);
  });
});

describe("calculateIstTime", () => {
  test("return the correct with default values", () => {
    const startTime = [7, 7];
    const endTime = [14, 43];
    const pauseTime = [0, 30];
    const result = calculateIstTime(startTime, endTime, pauseTime);
    expect(result).toEqual([7, 10]);
  });
});

describe("calculateGleitzeit", () => {
  test("return correct with default values", () => {
    const istTime = [7, 10];
    const result = calculateGleitzeit(istTime);
    expect(result).toEqual([0, 4]);
  });

  test("return correct with negativ values", () => {
    const istTime = [7, 5];
    const result = calculateGleitzeit(istTime);
    expect(result).toEqual([0, -1]);
  });
});

describe("roundStart", () => {
  test("return correct value with more than 5", () => {
    const startTime = [7, 7];
    const result = roundStart(startTime);
    expect(result).toEqual([7, 5]);
  });

  test("return correct with less than 5", () => {
    const startTime = [7, 13];
    const result = roundStart(startTime);
    expect(result).toEqual([7, 10]);
  });

  test("return correct with 0", () => {
    const startTime = [7, 10];
    const result = roundStart(startTime);
    expect(result).toEqual([7, 10]);
  });

  test("return correct with 5", () => {
    const startTime = [7, 25];
    const result = roundStart(startTime);
    expect(result).toEqual([7, 25]);
  });
});

describe("roundEnd", () => {
  test("return correct value with more than 5", () => {
    const startTime = [15, 18];
    const result = roundEnd(startTime);
    expect(result).toEqual([15, 20]);
  });

  test("return correct with less than 5", () => {
    const startTime = [15, 22];
    const result = roundEnd(startTime);
    expect(result).toEqual([15, 25]);
  });

  test("return correct with 0", () => {
    const startTime = [15, 20];
    const result = roundEnd(startTime);
    expect(result).toEqual([15, 20]);
  });

  test("return correct with 5", () => {
    const startTime = [15, 25];
    const result = roundEnd(startTime);
    expect(result).toEqual([15, 25]);
  });
});

describe("formateMins", () => {
  test("return correct with less than 10", () => {
    const gleitMins = 4;
    const result = formateMins(gleitMins);
    expect(result).toEqual("04");
  });

  test("return correct with more than 10", () => {
    const istTime = 12;
    const result = formateMins(istTime);
    expect(result).toEqual("12");
  });
});

describe("calculateEndForFloat", () => {
  test("return correct with default values", () => {
    const normalEnd = [15, 28];
    const float = [1, 0, 4];
    const result = calculateEndForFloat(normalEnd, float);
    expect(result).toEqual([15, 28]);
  });

  test("return correct with positive float", () => {
    const normalEnd = [15, 28];
    const float = [1, 0, 14];
    const result = calculateEndForFloat(normalEnd, float);
    expect(result).toEqual([15, 38]);
  });

  test("return correct with negative float", () => {
    const normalEnd = [15, 28];
    const float = [-1, 0, -1];
    const result = calculateEndForFloat(normalEnd, float);
    expect(result).toEqual([15, 23]);
  });
});

describe("calculateTimeToAddForEndWithPositiveFloat", () => {
  test("return correct with default values", () => {
    const float = [1, 0, 4];
    const result = calculateTimeToAddForEndWithPositiveFloat(float);
    expect(result).toEqual([0, 0]);
  });

  test("return correct with positive float", () => {
    const float = [1, 0, 14];
    const result = calculateTimeToAddForEndWithPositiveFloat(float);
    expect(result).toEqual([0, 10]);
  });
});

describe("calculateTimeToAddForEndWithNegativeFloat", () => {
  test("return correct with less than 10", () => {
    const float = [-1, 0, 1];
    const result = calculateTimeToAddForEndWithNegativeFloat(float);
    expect(result).toEqual([0, 5]);
  });

  test("return correct with more than 10", () => {
    const float = [-1, 0, 11];
    const result = calculateTimeToAddForEndWithNegativeFloat(float);
    expect(result).toEqual([0, 15]);
  });
});

describe("getFloatValueFromText", () => {
  global.resetToDefault = jest.fn();

  test("correct with default values", () => {
    const float = "+0.04";
    const result = getFloatValueFromText(float);
    expect(result).toEqual([1, 0, 4]);
  });

  test("correct with negativ values", () => {
    const float = "-1.06";
    const result = getFloatValueFromText(float);
    expect(result).toEqual([-1, 1, 6]);
  });
});

describe("calculateOptimizedEnd", () => {
  test("correct when less then 5 mins", () => {
    const endTime = [15, 34];
    const result = calculateOptimizedEnd(endTime);
    expect(result).toEqual([15, 31]);
  });

  test("correct when more then 5 mins", () => {
    const endTime = [15, 38];
    const result = calculateOptimizedEnd(endTime);
    expect(result).toEqual([15, 36]);
  });
});

describe("roundTimeForFloat", () => {
  test("correct with positiv values", () => {
    const normalEnd = [15, 34];
    const floatTime = [1, 0, 34];
    const result = roundTimeForFloat(normalEnd, floatTime);
    expect(result).toEqual([16, "04"]);
  });

  test("correct with negativ values", () => {
    const normalEnd = [15, 34];
    const floatTime = [-1, 0, 16];
    const result = roundTimeForFloat(normalEnd, floatTime);
    expect(result).toEqual([15, 14]);
  });
});

describe("calculateIncreasedValue", () => {
  test("correct with small positiv values", () => {
    const floatTime = [1, 0, 4];
    const result = calculateIncreasedValue(floatTime);
    expect(result).toEqual([0, 9]);
  });

  test("correct with bigger positiv values", () => {
    const floatTime = [1, 0, 39];
    const result = calculateIncreasedValue(floatTime);
    expect(result).toEqual([0, 44]);
  });

  test("correct with small negativ values", () => {
    const floatTime = [-1, 0, 6];
    const result = calculateIncreasedValue(floatTime);
    expect(result).toEqual([0, -1]);
  });

  test("correct with bigger negativ values", () => {
    const floatTime = [-1, 1, 26];
    const result = calculateIncreasedValue(floatTime);
    expect(result).toEqual([-1, -21]);
  });

  test("correct transition from neagtiv to positiv", () => {
    const floatTime = [-1, 0, 1];
    const result = calculateIncreasedValue(floatTime);
    expect(result).toEqual([0, 4]);
  });
});

describe("calculateDecreasedValue", () => {
  test("correct with small positiv values", () => {
    const floatTime = [1, 0, 9];
    const result = calculateDecreasedValue(floatTime);
    expect(result).toEqual([0, 4]);
  });

  test("correct with bigger positiv values", () => {
    const floatTime = [1, 0, 44];
    const result = calculateDecreasedValue(floatTime);
    expect(result).toEqual([0, 39]);
  });

  test("correct with small negativ values", () => {
    const floatTime = [-1, 0, 1];
    const result = calculateDecreasedValue(floatTime);
    expect(result).toEqual([0, -6]);
  });

  test("correct with bigger negativ values", () => {
    const floatTime = [-1, 1, 21];
    const result = calculateDecreasedValue(floatTime);
    expect(result).toEqual([-1, -26]);
  });

  test("correct transition from positiv to negativ", () => {
    const floatTime = [-1, 0, 4];
    const result = calculateDecreasedValue(floatTime);
    expect(result).toEqual([0, -1]);
  });
});

describe("createGleitzeitAusgabeFromFloat", () => {
  test("correct with default values", () => {
    const float = [0, 4];
    const result = createGleitzeitAusgabeFromFloat(float);
    expect(result).toEqual("+0.04");
  });

  test("correct with higher positiv values", () => {
    const float = [1, 26];
    const result = createGleitzeitAusgabeFromFloat(float);
    expect(result).toEqual("+1.26");
  });

  test("correct with negativ values", () => {
    const float = [-0, -1];
    const result = createGleitzeitAusgabeFromFloat(float);
    expect(result).toEqual("-0.01");
  });

  test("correct with lower negativ values", () => {
    const float = [-1, -6];
    const result = createGleitzeitAusgabeFromFloat(float);
    expect(result).toEqual("-1.06");
  });
});

describe("validateFloat", () => {
  beforeEach(() => {
    global.resetPage = jest.fn();
  });

  test("correct with default values", () => {
    const float = "+0.04";
    const result = validateFloat(float);
    expect(result).toEqual(true);
  });

  test("correct with negativ values", () => {
    const float = "-0.01";
    const result = validateFloat(float);
    expect(result).toEqual(true);
  });

  test("correct with letters and correct values", () => {
    const float = "-0.0a";
    const result = validateFloat(float);
    expect(result).toEqual(false);
  });
  
  test("correct with a komma", () => {
    const float = "+0,04";
    const result = validateFloat(float);
    expect(result).toEqual(false);
  });

  test("correct with only letters", () => {
    const float = "abcdefghijklmnopqrstuvwxyz";
    const result = validateFloat(float);
    expect(result).toEqual(false);
  });

  test("correct with a space", () => {
    const float = "+ 0.04";
    const result = validateFloat(float);
    expect(result).toEqual(false);
  });
});

describe("isValidTime", () => {
    test("correct with two numbers", () => {
        const float = [12,21];
        const result = isValidTime(float);
        expect(result).toEqual(true);
    });

    test("correct with NaN", () => {
        const time = [12,NaN];
        const result = isValidTime(time);
        expect(result).toEqual(false);
    });

    test("correct with null", () => {
        const time = [12,null];
        const result = isValidTime(time);
        expect(result).toEqual(false);
    });

    test("correct with undefinded", () => {
        const time = [12,undefined];
        const result = isValidTime(time);
        expect(result).toEqual(false);
    });
});

