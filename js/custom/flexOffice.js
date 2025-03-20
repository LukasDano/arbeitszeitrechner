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
                <input type="number" id="daysOff" name="daysOff" min="0" required>
                
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
                    <button type="button" class="btn" onclick="calculateFlexOffice()">Berechnen</button>
                </div>
            </form>
        </div>
    `;
}

function quoteSelector() {
    return `
        <label for="flexOfficeQuote">FlexOffice-Quote:</label>
        <select id="flexOfficeQuote"/>
        `;
}

function monthSelector() {
   return `
        <label for=selectedMonth">Monat:</label>
        <select id="selectedMonth"/>
        `;
}

/**
 * Erstellt die Optionen für das Quoten-Selectorelement
 *
 * @param {string} elementName Die ID des HTML Elements
 */
function createOptionsForQuoteSelector(elementName){
    const quoten = [
        "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"
    ];
    const quoteSelectElement = document.getElementById(elementName);

    quoten.forEach(value => {
        const option = document.createElement("option");

        option.value = ((quoten.indexOf(value) + 1) * 10).toString();
        option.text = value;
        quoteSelectElement.appendChild(option);
    });
}

/**
 * Erstellt die Optionen für das Monat-Selectorelement
 *
 * @param {string} elementName Die ID des HTML Elements
 */
function createOptionsForMonthSelector(elementName){
    const months = getMonthNamesAsList();
    const monthSelectElement = document.getElementById(elementName);

    months.forEach(month => {
        const option = document.createElement("option");
        const monthNumber = months.indexOf(month) + 1;
        const monthShortName = month.substring(0, 3)

        option.value = monthNumber.toString();
        option.text = monthShortName + " (" + getYearForMonthWithSixMonthRange(monthNumber) + ")";
        monthSelectElement.appendChild(option);
    });
}

function addDynamicComponents(){
    const quoteSelectorElement = document.getElementById("quoteSelector");
    quoteSelectorElement.innerHTML = quoteSelector();
    createOptionsForQuoteSelector("flexOfficeQuote");
    document.getElementById("flexOfficeQuote").value = getIntCookie("flexOfficeQuote") ?? 50;

    const monthSelectorElement = document.getElementById("monthSelector");
    monthSelectorElement.innerHTML = monthSelector();
    createOptionsForMonthSelector("selectedMonth");
    document.getElementById("selectedMonth").value = getCurrentMonth();
}

function getValuesAsList(){
    const daysOff = getNumberFromElement("daysOff");
    const month = getNumberFromElement("selectedMonth");
    const year = getYearForMonthWithSixMonthRange(month);
    return [daysOff, month, year];
}

/**
 * Setzt den Wert des Feldes auf den Wert aus dem Objekt,
 * wenn kein gültiger Wert gefunden wird, wird der Wert für das Feld auf 0 gesetzt.
 *
 * @param {number} month Die Nummer des Monats, zu dem die Daten gesetzt werden sollen
 * @param {string} field Name des Feldes und des Attributs aus dem Objekt
 */
function loadFlexOfficeValuesForMonthFromCookie(month, field) {
    const flexMonth = getMonthValuesFromCookie(month);

    if (flexMonth) {

        switch (field) {
            case "daysOff":
                document.getElementById(field).value = flexMonth.daysOff
                break;

            case "flexHours":
                document.getElementById(field).value = flexMonth.flexHours
                break;

            case "flexMinutes":
                document.getElementById(field).value = flexMonth.flexMins
                break;

            default:
                document.getElementById(field).value = 0
        }
    } else {
        document.getElementById(field).value = 0;
    }

}

/**
 * Setzt die Flexoffice Werte zu einem übergebenen Monat
 *
 * @param {number} month Die Zahl des Monats für den die Werte gesetzt werden sollen
 */
function setFlexOfficeFieldValuesForMonth(month){
    const fields = ["daysOff", "flexHours", "flexMinutes"];
    fields.forEach(field => {loadFlexOfficeValuesForMonthFromCookie(month ,field)});


}

async function setUpKeyBoardControlForFlexOfficeCalculator() {
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
 * Öffnet das FlexOffice Modal
 */
async function openFlexOfficeCalculator() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("flexOfficeForm").style.display = "block";
    document.getElementById("flexOfficeOverlay").style.display = "block";

    addDynamicComponents();
    document.getElementById("flexOfficeResult").style.display = "none";

    const currentMonth = getCurrentMonth();
    setFlexOfficeFieldValuesForMonth(currentMonth);

    let [daysOff, month, year] = getValuesAsList();
    let [workHoursPerMonth, workMinutesPerMonth] = await getWorkTimePerMonth(daysOff, month, year);

    document.getElementById("daysOff").max = getDaysForMonthInYear(month, year);

    document.getElementById("selectedMonth").addEventListener('change', async () => {
        document.getElementById("flexOfficeResult").style.display = "none";
        const selectedMonth = getNumberFromElement("selectedMonth");
        setFlexOfficeFieldValuesForMonth(selectedMonth);

        [daysOff, month, year] = getValuesAsList();
        document.getElementById("daysOff").max = getDaysForMonthInYear(month, year);
        [workHoursPerMonth, workMinutesPerMonth] = await getWorkTimePerMonth(daysOff, month, year);
    });

    document.getElementById("daysOff").addEventListener('change', () => {
        const daysOff = getNumberFromElement("daysOff");
        const daysInMonth = getDaysInCurrentMonth();
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
        if (flexMinutes < 0){
            document.getElementById("flexMinutes").value = 0;
        }
    });

    await setUpKeyBoardControlForFlexOfficeCalculator();
}

/**
 * Schließt das FlexOffice Modal
 */
function closeFlexOfficeCalculator() {
    document.getElementById("flexOfficeForm").style.display = "none"; // Hide the form
    document.getElementById("flexOfficeOverlay").style.display = "none"; // Hide the overlay
    deleteCookie("settingsOpen");
}

async function calculateFlexOffice() {
    document.getElementById("flexOfficeResult").style.display = "block";

    const flexOfficeQuote = getNumberFromElement("flexOfficeQuote");
    const selectedMonth = getNumberFromElement("selectedMonth");
    const daysOff = getNumberFromElement("daysOff");
    const flexHours = getNumberFromElement("flexHours");
    const flexMinutes = getNumberFromElement("flexMinutes");
    const flexTime = [flexHours, flexMinutes];

    setCookieUntilEndOfMonth("flexOfficeQuote", flexOfficeQuote);
    setMonthValuesAsCookie(selectedMonth, daysOff, flexTime);
    const year = getYearForMonthWithSixMonthRange(selectedMonth);

    const workDaysInMonth = await getWorkDaysInMonthFromAPI(selectedMonth, year);
    let restFlexTimeThisMonth = await calculateFlexOfficeStats(daysOff, flexTime, flexOfficeQuote, selectedMonth, year);
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
