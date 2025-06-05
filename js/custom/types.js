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

/**
 * @typedef {number} Milliseconds
 */

/**
 * @typedef {Object} NotificationConfiguration
 * @property {Milliseconds} timer
 * @property {boolean} confirmMessage
 * @property {string} bgColor
 * @property {string} text
 * @property {string} headline
 * @property {string} textColor
 */

/**
 * @typedef {Object} ButtonColor
 * @property {string} text
 * @property {string} background
 * @property {string} hover
 * @property {string} active
 */

/**
 * @typedef {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'} ColorVariant
 */