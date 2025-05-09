const conditions = {
    "FloatFoucs": " (Im Gleitzeitfled)",
    "DevOptionsActive": " (Wenn die DevOptions aktiv sind)"
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
    "ArrowUp": "Erhöht die Gleitzeit nach erlaubten Interwallen" + conditions.FloatFoucs,
    "ArrowDown": "Verringert die Gleitzeit nach erlaubten Interwallen" +  + conditions.FloatFoucs,
    "Esc": "Modal schließen (funktioniert bei allen)",
    "Enter": "Eingabe beim Modal (funktioniert bei allen)"
};

const dayFields = ["monday", "tuesday", "wednesday", "thursday", "friday"];