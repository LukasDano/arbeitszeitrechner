/**
 * @typedef {number} Hours
 * @typedef {number} Mins
 * @typedef {1 | -1} Vorzeichen
 */

/**
 * @typedef {[Hours, Mins]} Time
 */

/**
 * @typedef {[Vorzeichen, Hours, Mins]} FloatTime
 */

/**
 * @typedef {Object} DayTime
 * @property {Hours} dayHours - Stunden des Tages
 * @property {Mins} dayMins - Minuten des Tages
 */

/**
 * @typedef {Object} WeekTime
 * @property {DayTime} montag - Zeiten für Montag
 * @property {DayTime} dienstag - Zeiten für Dienstag
 * @property {DayTime} mittwoch - Zeiten für Mittwoch
 * @property {DayTime} donnerstag - Zeiten für Donnerstag
 * @property {DayTime} freitag - Zeiten für Freitag
 */


