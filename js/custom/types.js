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
 * @property {Hours} hours - Stunden des Tages
 * @property {Mins} mins - Minuten des Tages
 */

/**
 * @typedef {Object} WeekTime
 * @property {DayTime} monday - Zeiten für Montag
 * @property {DayTime} tuesday - Zeiten für Dienstag
 * @property {DayTime} wednesday - Zeiten für Mittwoch
 * @property {DayTime} thursday - Zeiten für Donnerstag
 * @property {DayTime} friday - Zeiten für Freitag
 */

/**
 * @typedef {Object} FeiertageHamburg
 * @property {Date} Neujahr
 * @property {Date} Karfreitag
 * @property {Date} Ostermontag
 * @property {Date} TagDerArbeit
 * @property {Date} ChristiHimmelfahrt
 * @property {Date} Pfingstmontag
 * @property {Date} TagDerDeutschenEinheit
 * @property {Date} Reformationstag
 * @property {Date} ErsterWeihnachtsfeiertag
 * @property {Date} ZweiterWeihnachtsfeiertag
 */

/**
 * @typedef {Object} FlexMonth
 * @property {number} daysOff
 * @property {number} flexHours
 * @property {number} flexMins
 */
