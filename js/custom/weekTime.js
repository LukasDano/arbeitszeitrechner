/**
 * Gibt den HTML-Code für das WochenZeit Modal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Modal
 */
function weekTimeCalculator() {

    return `
        <div class="weekTimeOverlay" id="weekTimeOverlay"></div>
        <div class="form-popup" id="weekTimeForm">
            <form class="form-container">
                <span class="close" onclick="closeWeekTimeCalculator()">&times;</span>
                <h1>Wochenzeitrechner</h1>

                <label for="monday">Montag:</label>
                <input type="time" id="monday" name="monday" required>
                
                <label for="tuesday">Dienstag:</label>
                <input type="time" id="tuesday" name="tuesday" required>
                
                <label for="wednesday">Mittwoch:</label>
                <input type="time" id="wednesday" name="wednesday" required>
                
                <label for="thursday">Donnerstag:</label>
                <input type="time" id="thursday" name="thursday" required>
                
                <label for="friday">Freitag:</label>
                <input type="time" id="friday" name="friday" required>
                
                <label id="floatDaysLabel" for="floatDays">Anazahl Gleitage:</label>
                <input type="number" id="floatDays" name="floatDays" max="7" required>                
                
                <div class="text-center" id="weekTimeResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="weekWorkTime">Wochenarbeitszeit</label>
                            <p class="display-5" id="weekWorkTime"></p>
                        </div>
                    </div>
                </div>

                <div class="btn-container">
                    <button type="button" class="btn" onclick="calculateWeekTime()">
                        <img class="icon" src="pictures/icons/calculator.png" alt="Enter"/>
                    </button
                </div>
            </form>
        </div>
    `;
}

/**
 * Öffnet das WochenZeit Modal
 */
function openWeekTimeCalculator() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("weekTimeForm").style.display = "block"; // Show the form
    document.getElementById("weekTimeOverlay").style.display = "block"; // Show the overlay
    document.getElementById("weekTimeResult").style.display = "none";
    document.getElementById("floatDaysLabel").style.display = "none";
    document.getElementById("floatDays").style.display = "none";

    const fields = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    fields.forEach(field => setInitialValue(field));
    fields.forEach(field => getDayFieldValueAndUpdateCookie(field));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            calculateWeekTime();
        }
    });

}

/**
 * Schließt das WochenZeit Modal
 */
function closeWeekTimeCalculator() {
    document.getElementById("weekTimeForm").style.display = "none"; // Hide the form
    document.getElementById("weekTimeOverlay").style.display = "none"; // Hide the overlay
    deleteCookie("settingsOpen");
}

/**
 * Setzt den Wert des Feldes auf den Wert des gleichnamigen Cookies.
 *
 * @param {string} field Name des Feldes und des Cookies
 */
function setInitialValue(field){
    const fieldValue = getCookie(field);

    if (document.getElementById(field).type === "number"){
        document.getElementById(field).value = 0;
        return;
    } else if (!fieldValue) {
        document.getElementById(field).value = "00:00";
        return;
    }

    document.getElementById(field).value = fieldValue;
}

/**
 * Gibt den Wert, den ein Tagesfeld hat zurück
 *
 * @param {string} day ElementID eines Tages Feldes
 * @return {string} Die Arbeitszeiten eines Tages
 */
function getDayFieldValueAndUpdateCookie(day) {
    const dayValue = document.getElementById(day).value;
    setCookieUntilEndOfWeek(day, dayValue);
    return dayValue;

}

/**
 * Berechnet die Wochenzeiten
 */
function calculateWeekTime() {
    document.getElementById("weekTimeResult").style.display = "block";
    const weekTime = getTimeForWeek();

    let weekWorkTime = getWeekWorkTime(weekTime);
    weekWorkTime = formatWeekTime(weekWorkTime, true);

    document.getElementById("weekWorkTime").textContent = weekWorkTime;

}

document.addEventListener('DOMContentLoaded', function () {
    refreshDevOptionCookies();

    const settingsContainer = document.getElementById("weekTimeCalculator");
    settingsContainer.innerHTML = weekTimeCalculator();
});
