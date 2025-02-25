const {
  getWeekWorkTime,
  calculateWeekOverTime,
  formatWeekTime,
} = require("../js/custom/weekTimeUtils");

describe("getWeekWorkTime", () => {
  global.setCookie = jest.fn();
  global.prompt = jest.fn();

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
  global.setCookie = jest.fn();
  global.deleteCookie = jest.fn();
  global.getIntCookie = jest.fn();

  beforeEach(() => {
    global.getIntCookie.mockClear();

    // Set default mock return values
    global.getIntCookie.mockImplementation((cookieName) => {
      if (cookieName === "gleittage") return 0;
      if (cookieName === "workedDays") return 5;
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("correct with normal default values", () => {
    const gleitagGenommen = false;
    const weekTime = [35, 50];
    const result = calculateWeekOverTime(gleitagGenommen, weekTime);
    expect(result).toEqual([0, 20]);
  });

  test("correct with a realistic week", () => {
    const gleitagGenommen = false;
    const weekTime = [36, 25];
    const result = calculateWeekOverTime(gleitagGenommen, weekTime);
    expect(result).toEqual([0, 55]);
  });

  test("correct with negativ values", () => {
    const gleitagGenommen = false;
    const weekTime = [27, 30];
    const result = calculateWeekOverTime(gleitagGenommen, weekTime);
    expect(result).toEqual([-8, 0]);
  });

  test("correct with gleittag", () => {
    global.getIntCookie.mockImplementation((cookieName) => {
      if (cookieName === "gleittage") return 1;
      if (cookieName === "workedDays") return 4;
      return 0;
    });
    const gleitagGenommen = true;
    const weekTime = [27, 50];
    const result = calculateWeekOverTime(gleitagGenommen, weekTime);
    expect(result).toEqual([-7, -40]);
  });

  test("correct with gleittag", () => {
    global.getIntCookie.mockImplementation((cookieName) => {
      if (cookieName === "gleittage") return 0;
      if (cookieName === "workedDays") return 4;
      return 0;
    });
    jest.spyOn(global, "prompt").mockReturnValue("1");
    const gleitagGenommen = true;
    const weekTime = [30, 15];
    const result = calculateWeekOverTime(gleitagGenommen, weekTime);
    expect(result).toEqual([-5, -15]);
  });
});

describe("formatWeekTime", () => {
  test("correct with positiv values", () => {
    const weekTime = [0, 20];
    const result = formatWeekTime(weekTime);
    expect(result).toEqual("+0.20 h");
  });

  test("correct with negativ values", () => {
    const weekTime = [-1, -20];
    const result = formatWeekTime(weekTime);
    expect(result).toEqual("-1.20 h");
  });

  test("correct with negativ hours", () => {
    const weekTime = [-1, 0];
    const result = formatWeekTime(weekTime);
    expect(result).toEqual("-1.0 h");
  });

  test("correct with negativ minutes", () => {
    const weekTime = [0, -20];
    const result = formatWeekTime(weekTime);
    expect(result).toEqual("-0.20 h");
  });
});
