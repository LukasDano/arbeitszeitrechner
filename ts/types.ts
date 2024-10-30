export type Time = {
    hours: number
    mins: number
};

export type FloatTime = {
    vorzeichen: number
    hours: number
    mins: number
};

export type WeekTime = {
    monday: Time
    tuesday: Time
    wednesday: Time
    thursday: Time
    friday: Time
};

declare global {
    interface JQuery {
        ClassyCountdown: (options?: any) => JQuery;
    }
}
