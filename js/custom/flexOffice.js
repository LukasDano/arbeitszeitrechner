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
                
                <div class="row justify-content-center">
                    <div class="col-sm-6 col-12">
                        <div id="quoteSelector"></div>
                    </div>
    
                    <div class="col-sm-6 col-12">
                        <div id="monthSelector"></div>
                    </div>
                </div>

                <label for="daysOff">Abwesenheitstage:</label>
                <input type="number" id="daysOff" name="daysOff" required>
                
                <div class="row justify-content-center">
                    <div class="col-sm-6 col-12">
                        <label for="flexTime">FlexOffice Stunden:</label>
                        <input type="number" id="flexHours" name="flexHours" min="0" step="1" required>
                    </div>
    
                    <div class="col-sm-6 col-12">
                        <label for="flexTime">FlexOffice Minuten:</label>
                        <input type="number" id="flexMinutes" name="flexMinutes" min="0" max="59" step="1" required>
                    </div>
                </div>
                
                <div class="text-center" id="flexOfficeResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="calculatedMonth">Berechneter Monat</label>
                            <p class="display-5" id="calculatedMonth"></p>
                        </div>
                        
                       <div class="col text-center">
                            <label for="workDaysCurrentMonth">Arbeitstage</label>
                            <p class="display-5" id="workDaysCurrentMonth"></p>
                        </div>
    
                        <div class="col text-center">
                            <label for="workedDaysCurrentMonth">Gearbeitete Tage</label>
                            <p class="display-5" id="workedDaysCurrentMonth"></p>
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

function quoteSelector() {
    return `
        <label for="flexOfficeQuote">FlexOffice-Quote:</label>
        <select id="flexOfficeQuote">
            <option value="10">10%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
            <option value="40">40%</option>
            <option value="50">50%</option>
            <option value="60">60%</option>
            <option value="70">70%</option>
            <option value="80">80%</option>
            <option value="90">90%</option>
            <option value="100">100%</option>
        </select>
        `;
}

function monthSelector() {
   return `
        <label for=selectedMonth">Monat:</label>
        <select id="selectedMonth">
            <option value="1">Januar</option>
            <option value="2">Februar</option>
            <option value="3">März</option>
            <option value="4">April</option>
            <option value="5">Mai</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Dezember</option>
        </select>
        `;
}

/**
 * Setzt den Wert des Feldes auf den Wert des gleichnamigen Cookies.
 * Wenn der Cookie nicht existiert bzw. einen ungültigen Wert zurückgibt, wird der Wert auf 0 gesetzt.
 *
 * @param {string} field Name des Feldes und des Cookies
 */
function setInitialFlexOfficeValue(field) {
    let cookieValue = getIntCookie(field);
    if (!cookieValue) {
        cookieValue = 0;
    }
    document.getElementById(field).value = cookieValue;
}

function addDynamicComponents(){
    const quoteSelectorElement = document.getElementById("quoteSelector");
    quoteSelectorElement.innerHTML = quoteSelector();
    document.getElementById("flexOfficeQuote").value = getIntCookie("flexOfficeQuote") ?? 50;

    const monthSelectorElement = document.getElementById("monthSelector");
    monthSelectorElement.innerHTML = monthSelector();
    document.getElementById("selectedMonth").value = getCurrentMonth();
}

function getValuesAsList(){
    const daysOff = getNumberFromElement("daysOff");
    const month = getNumberFromElement("selectedMonth");
    const year = getYearForMonthWithSixMonthRange(month);
    return [daysOff, month, year];
}

/**
 * Öffnet das FlexOffice Modal
 */
function openFlexOfficeCalculator() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("flexOfficeForm").style.display = "block";
    document.getElementById("flexOfficeOverlay").style.display = "block";

    addDynamicComponents();
    document.getElementById("flexOfficeResult").style.display = "none";
    document.getElementById("daysOff").max = getDaysInMonth();

    const fields = ["daysOff", "flexHours", "flexMinutes"];
    fields.forEach(field => {setInitialFlexOfficeValue(field)});

    const [daysOff, month, year] = getValuesAsList();
    const [workHoursPerMonth, workMinutesPerMonth] = getWorkTimePerMonth(daysOff, month, year);

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
    setCookieUntilEndOfMonth("flexOfficeQuote", flexOfficeQuote);

    const selectedMonth = getNumberFromElement("selectedMonth");
    setCookieUntilEndOfMonth("selectedMonth", selectedMonth);

    const daysOff = getNumberFromElement("daysOff");
    setCookieUntilEndOfMonth("daysOff", daysOff);

    const flexHours = getNumberFromElement("flexHours");
    setCookieUntilEndOfMonth("flexHours", flexHours);

    const flexMinutes = getNumberFromElement("flexMinutes");
    setCookieUntilEndOfMonth("flexMinutes", flexMinutes);

    const flexTime = [flexHours, flexMinutes];
    const year = getYearForMonthWithSixMonthRange(selectedMonth);

    const workDaysInMonth = getWorkDaysInMonth(selectedMonth, year);
    let restFlexTimeThisMonth = calculateFlexOfficeStats(daysOff, flexTime, flexOfficeQuote, selectedMonth, year);
    restFlexTimeThisMonth = checkIfTimeIsBelowZero(restFlexTimeThisMonth)


    document.getElementById("calculatedMonth").textContent = formatNumber(selectedMonth);
    document.getElementById("workDaysCurrentMonth").textContent = workDaysInMonth
    document.getElementById("workedDaysCurrentMonth").textContent = workDaysInMonth - daysOff;
    document.getElementById("restFlexTime").textContent = formatTime(restFlexTimeThisMonth);

}

/**
 * Lädt alle Funktionalitäten und Daten zum Flex Office
 */
function setUpFlexOffice() {
    const settingsContainer = document.getElementById("flexOfficeCalculator");
    settingsContainer.innerHTML = flexOfficeCalculator();
}
