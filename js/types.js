/**
 * @typedef {1 | -1} Vorzeichen
 */

/**
 * @typedef {number} Hours
 */

/**
 * @typedef {number} Mins
 */

/**
 * @typedef {[Hours, Mins]} Time
 */

/**
 * @typedef {[Hours, Mins | null | undefined]} InValidTime
 */

/**
 * @typedef {[Vorzeichen, Hours, Mins]} FloatTime
 */

/**
 * @typedef {Object} DayTime
 * @property {Hours} hours
 * @property {Mins} mins
 */

/**
 * @typedef {Object} WeekTime
 * @property {DayTime} monday
 * @property {DayTime} tuesday
 * @property {DayTime} wednesday
 * @property {DayTime} thursday
 * @property {DayTime} friday
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
 * @property {Hours} flexHours
 * @property {Mins} flexMins
 */

/**
 * @typedef {Object} ButtonColor
 * @property {string} text
 * @property {string} bg
 * @property {string} hover
 * @property {string} active
 */

/**
 * @typedef {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'} ColorVariant
 */

/**
 * @typedef {"info" | "waring" | "error" | "success"} NotificationType
 */

/**
 * @typedef {Object} NotificationConfig
 * @property {NotificationType} type
 * @property {string} text
 */
