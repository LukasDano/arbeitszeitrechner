/**
 * Gibt den HTML-Code für das Manual Break Modal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Manual Break Modal
 */
function manualBreak() {

    return `
        <div class="manualBreakOverlay" id="manualBreakOverlay"></div>
        <div class="form-popup" id="manualBreakForm">
            <form class="form-container">
                <span class="close" onclick="closeManualBreak()">&times;</span>
                <h1>Manuell Austragen</h1>
                
                <label for="numberOfManualBreaks">Anzahl der manuellen Pausen:</label>
                <input type="number" id="numberOfManualBreaks" min="1" max="3" value="1" required>
                
                <div id="manualBreaks"></div>

                <div class="btn-container">
                    <button type="button" class="btn" onclick="calculateTimeWithManualBreak()">Berechnen</button>
                    <button type="button" class="btn" onclick="deactivateManualBreak()">Reset</button>
                </div>
            </form>
        </div>
    `;
}

function beginAndEndOfManualBreak(numberOfFieldPair) {
    return `
        <div class="row justify-content-center">
            <div class="col-sm-6 col-12">
                <label for="beginn${numberOfFieldPair}">Beginn ${numberOfFieldPair}</label>
                <input type="time" id="beginn${numberOfFieldPair}"/>
            </div>

            <div class="col-sm-6 col-12">
                <label for="end${numberOfFieldPair}">Ende ${numberOfFieldPair}</label>
                <input type="time" id="end${numberOfFieldPair}"/>
            </div>
        </div>
        `;
}

/**
 * Erstellt die benötigte Anzahl von Beginn und Ende Feldern
 */
function addBeginAndEndFieldsDynamic(){

    const maximumFieldPairs = 3;
    const requiredFieldPairs = getNumberFromElement("numberOfManualBreaks");
    const manualBreaksHTMLElement = document.getElementById("manualBreaks");
    manualBreaksHTMLElement.innerHTML = "";

    for (let i = 0; i < maximumFieldPairs; i++) {
        let numberID = i + 1;
        numberID = formatNumber(numberID);

        const divElement = document.createElement("div");
        divElement.innerHTML = beginAndEndOfManualBreak(numberID);

        if (numberID > requiredFieldPairs) {
            divElement.style.display = "none";
        }

        manualBreaksHTMLElement.appendChild(divElement);
    }
}

function getBeginAndEndFieldIds() {
    const fieldNumbers = ["01", "02", "03"];

    let startIds = [];
    let endIds = [];

    fieldNumbers.forEach(number => {

        const startId = "beginn" + number;
        const endId = "end" + number;

        startIds.push(startId);
        endIds.push(endId);
    });

    return {startIds: startIds, endIds: endIds};
}

function setUpFields(){

    const startIds = getBeginAndEndFieldIds().startIds;
    const endIds = getBeginAndEndFieldIds().endIds;

    startIds.forEach(id => {
        addEventListenerAndValueToElement(id);
    });

    endIds.forEach(id => {
        addEventListenerAndValueToElement(id);
    });
}

/**
 * Die Zahl der ElementId des Feldes
 * @param {string} id Die ID in dem Format "nn"
 */
function addEventListenerAndValueToElement(id){
    const element = document.getElementById(id);
    setValuesAndSafeThem(id);

    //TODO hier wird nicht richtig der Wert für das entsprechende Feld gesetzt
    element.addEventListener("change", () => {
        const timeValue = getTimeFromFieldById(id);
        if (timeValue !== undefined) {
            setCookieUntilMidnight(id, timeValue);
        }
    });
}

/**
 * Die Zahl der ElementId des zu speichernden Feldes
 *
 * @param {string} elementId Die ID in dem Format "nn"
 */
function setValuesAndSafeThem(elementId) {

    let elementValue = getCookie(elementId);

    if (!elementValue) {
        elementValue = document.getElementById(elementId).value;
        setCookieUntilMidnight(elementId, elementValue);
    }

    document.getElementById(elementId).value = elementValue;
}

function setUpKeyBoardControlForManualBreak() {

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeManualBreak();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            calculateTimeWithManualBreak();
        }
    });
}

function setResultsInMainView(countedworktime, trueworktime, gleitzeit) {
    document.getElementById("countedworktime").value = countedworktime;
    document.getElementById("trueworktime").value = trueworktime;
    document.getElementById("gleitzeit").value = gleitzeit;
}

function openManualBreak() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("manualBreakOverlay").style.display = "block";
    document.getElementById("manualBreakForm").style.display = "block";
    setUpKeyBoardControlForManualBreak();
    addBeginAndEndFieldsDynamic();
    setUpFields();

    document.getElementById("numberOfManualBreaks").addEventListener("change", () => {
        addBeginAndEndFieldsDynamic();
        setUpFields();
    });

    document.getElementById("manualBreakOverlay").addEventListener("click", () => {
        closeManualBreak();
    });

}

function closeManualBreak() {
    document.getElementById("manualBreakOverlay").style.display = "none";
    document.getElementById("manualBreakForm").style.display = "none";
    deleteCookie("settingsOpen");
}

function calculateTimeWithManualBreak() {
    const breakStart = getTimeFromFieldById("beginn01");
    const breakEnd = getTimeFromFieldById("end01");
    const startTime = getTimeFromFieldById("start");
    const endTime = getTimeFromFieldById("end");

    const breakTime = calculateStartEndeTimeDiff(breakStart, breakEnd);
    const countedworktime = calculateFullWorkTimeWithoutTheManualBreak(startTime, endTime, breakTime);

    const manualBreakIcon = document.getElementById("manualBreakIcon")
    manualBreakIcon.classList.remove("noneDevOption");
    manualBreakIcon.classList.add('red-image');
}

function deactivateManualBreak() {
    const manualBreakIcon = document.getElementById("manualBreakIcon")
    manualBreakIcon.classList.remove("red-image");
    manualBreakIcon.classList.add('noneDevOption');
}

function setUpManualBreak() {
    const settingsContainer = document.getElementById("manualBreak");
    settingsContainer.innerHTML = manualBreak();
}