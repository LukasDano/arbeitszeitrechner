const conditions = {
    "FloatFoucs": " (Gleitzeitfeld muss aktiv sein)",
    "DevOptionsActive": " (DevOptions müssen aktiv sein)",
    "InFlexOfficeModal": " (In der FlexOffice Anwendung)"
}

const keyboardControl = {
    "F1": "Open DevOptions",
    "F2": "Reset Page",
    "F3": "+14 Min Overtime" + conditions.DevOptionsActive,
    "F4": "OvertimeAutomatic on/off" + conditions.DevOptionsActive,
    "Shift + S": "Six-Hour-Mode aktivieren",
    "Shift + G": "Springt in das Gleitzeitfeld",
    "Alt + w": "Open WeekTimeCalculator",
    "Alt + f": "Open FlexOfficeCalculator",
    "Alt + c": "Open CurrentStatsMessageWithValues",
    "Alt + d": "Open DevOptionsForm" + conditions.DevOptionsActive,
    "Alt + a": "Open TimeAdder" + conditions.InFlexOfficeModal,
    "Alt + h": "Open HelpPage" + conditions.DevOptionsActive,
    "ArrowUp": "Erhöht die Gleitzeit nach erlaubten Interwallen" + conditions.FloatFoucs,
    "ArrowDown": "Verringert die Gleitzeit nach erlaubten Interwallen" + + conditions.FloatFoucs,
    "Esc": "Modal schließen (funktioniert bei allen)",
    "Enter": "Eingabe beim Modal (funktioniert bei allen)"
};

const dayFields = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const timer = {
    "SEC_3": 3000,
    "SEC_5": 5000,
    "SEC_10": 10000,
};

/**
 * @type {NotificationConfiguration}
 */
const defaultButtonConfig = {
    timer: timer.SEC_3,
    confirmMessage: false,
    textColor: "#fff",
    bgColor: "#ccc",
    headline: "",
    text: "Hello World"
};

const mainPageFieldIds = ["start", "pause", "end", "soll", "float"];