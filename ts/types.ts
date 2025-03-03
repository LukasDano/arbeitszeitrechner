export type Vorzeichen = 1 | -1;
export type Hours = number;
export type Mins = number;

export type Time = [Hours, Mins];
export type InValidTime = [Hours, Mins|null|undefined];
export type FloatTime = [Vorzeichen, Hours, Mins];

export type DayTime = { dayHours: Hours, dayMins: Mins };
export type WeekTime = { montag: DayTime, dienstag: DayTime, mittwoch: DayTime, donnerstag: DayTime, freitag: DayTime };

export type FeiertageHamburg = {
    Neujahr: Date,
    Karfreitag: Date,
    Ostermontag: Date,
    TagDerArbeit: Date,
    ChristiHimmelfahrt: Date,
    Pfingstmontag: Date,
    TagDerDeutschenEinheit: Date,
    Reformationstag: Date,
    ErsterWeihnachtsfeiertag: Date,
    ZweiterWeihnachtsfeiertag: Date
};

export type FlexMonth = { daysOff: number, flexHours: Hours, flexMins: Mins };
