/**
 * Gibt den HTML-Code für das FlexOffice Modal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Settings Modal
 */
function flexOfficeCalculator() {

    return `
        <div class="flexOfficeOverlay" id="flexOfficeOverlay"></div>
        <div class="form-popup" id="flexOfficeForm">
            <form class="form-container">
                <span class="close" onclick="closeFlexOfficeCalculator()">&times;</span>
                <h1>FlexOffice Calculator</h1>

                <label for="flexOfficeQuote">FlexOffice-Quote:</label>
                <select id="flexOfficeQuote">
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50" selected>50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                </select>

                <label for="daysOff">Abwesenheitstage:</label>
                <input type="number" id="daysOff" name="daysOff" required>
                
                <label for="flexTime">FlexOffice Stunden diesen Monat:</label>
                <input type="number" id="flexHours" name="flexHours" required>
                
                <label for="flexTime">FlexOffice Minuten diesen Monat:</label>
                <input type="number" id="flexMinutes" name="flexMinutes" required>
                
                <div class="text-center" id="flexOfficeResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="currentMonth">Aktueller Monat</label>
                            <p class="display-5" id="currentMonth"></p>
                        </div>
    
                        <div class="col text-center">
                            <label for="workDaysCurrentMonth">Arbeitstage</label>
                            <p class="display-5" id="workDaysCurrentMonth"></p>
                        </div>
    
                        <div class="col text-center">
                            <label for="restFlexTime">Restliche FlexOffice Zeit</label>
                            <p class="display-5" id="restFlexTime"></p>
                        </div>
                    </div>
                </div>

                <div class="btn-container">
                    <button type="button" class="btn" onclick="calculateFlexOffice()">
                        <img class="icon" src="pictures/icons/calculator.png" alt="Enter"/>
                    </button
                </div>
            </form>
        </div>
    `;
}

/**
 * Setzt den Wert des Feldes auf den Wert des gleichnamigen Cookies.
 * Wenn der Cookie nicht existiert bzw. einen ungültigen Wert zurückgibt, wird der Wert auf 0 gesetzt.
 *
 * @param {string} field Name des Feldes und des Cookies
 */
function setInitialFlexOfficeValue(field){
    let cookieValue = getIntCookie(field);
    if (!cookieValue) {
        cookieValue = 0;
    }
    document.getElementById(field).value = cookieValue;
}

/**
 * Öffnet das FlexOffice Modal
 */
function openFlexOfficeCalculator() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("flexOfficeForm").style.display = "block"; // Show the form
    document.getElementById("flexOfficeOverlay").style.display = "block"; // Show the overlay
    document.getElementById("flexOfficeResult").style.display = "none";
    document.getElementById("daysOff").max = getDaysInMonth();
    const [workHoursPerMonth, workMinutesPerMonth] = getWorkTimePerMonth();

    const fields = ["daysOff", "flexHours", "flexMinutes"];
    fields.forEach(field => {setInitialFlexOfficeValue(field)});

    document.getElementById("daysOff").addEventListener('change', () => {
        const daysOff = getNumberFromElement("daysOff");
        const daysInMonth = getDaysInMonth();
        if (daysOff > daysInMonth) {
            document.getElementById("daysOff").value = daysInMonth;
        }
        if (daysOff < 0){
            document.getElementById("daysOff").value = 0;
        }
    });

    document.getElementById("flexHours").addEventListener('change', () => {
        const flexHours = getNumberFromElement("flexHours");
        if (flexHours > workHoursPerMonth) {
            document.getElementById("flexHours").value = workHoursPerMonth;
        }
        if (flexHours < 0){
            document.getElementById("flexHours").value = 0;
        }
    });

    document.getElementById("flexMinutes").addEventListener('change', () => {
        const flexMinutes = getNumberFromElement("flexMinutes");
        if (flexMinutes > workMinutesPerMonth) {
            document.getElementById("flexMinutes").value = workMinutesPerMonth;
        }
        if (flexMinutes < 0){
            document.getElementById("flexMinutes").value = 0;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            calculateFlexOffice();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeFlexOfficeCalculator();
        }
    });
}

/**
 * Schließt das FlexOffice Modal
 */
function closeFlexOfficeCalculator() {
    document.getElementById("flexOfficeForm").style.display = "none"; // Hide the form
    document.getElementById("flexOfficeOverlay").style.display = "none"; // Hide the overlay
    deleteCookie("settingsOpen");
}

const getNumberFromElement = (element) => parseInt(document.getElementById(element).value, 10);

function calculateFlexOffice() {
    document.getElementById("flexOfficeResult").style.display = "block";
    const flexOfficeQuote = getNumberFromElement("flexOfficeQuote");

    const daysOff = getNumberFromElement("daysOff");
    setCookieUntilEndOfMonth("daysOff", daysOff);

    const flexHours = getNumberFromElement("flexHours");
    setCookieUntilEndOfMonth("flexHours", flexHours);

    const flexMinutes = getNumberFromElement("flexMinutes");
    setCookieUntilEndOfMonth("flexMinutes", flexMinutes);

    const flexTime = [flexHours, flexMinutes];

    let restFlexTimeThisMonth = calculateFlexOfficeStats(daysOff, flexTime, flexOfficeQuote);
    restFlexTimeThisMonth = checkIfTimeIsBelowZero(restFlexTimeThisMonth)


    document.getElementById("currentMonth").textContent = getValidCurrentMonthOutPut();
    document.getElementById("workDaysCurrentMonth").textContent = getWorkDaysInMonth() - daysOff;
    document.getElementById("restFlexTime").textContent = formatTime(restFlexTimeThisMonth);

}

/**
 * Lädt alle Funktionalitäten und Daten zum Flex Office
 */
function setUpFlexOffice() {
    const settingsContainer = document.getElementById("flexOfficeCalculator");
    settingsContainer.innerHTML = flexOfficeCalculator();
}
