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
                <input type="number" id="numberOfManualBreaks" min="1" value="1" required>
                
                <div id="manualBreaks"></div>

                <div class="btn-container">
                    <button type="button" class="btn" onclick="calculateTimeWithManualBreak()">
                        <img class="icon" src="pictures/icons/calculator.png" alt="Enter"/>
                    </button
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
 *
 * @param {number} requiredFieldPairs Die Zahl der benötigten Feldern
 */
function addBeginAndEndFieldsDynamic(requiredFieldPairs){

    const manualBreaksHTMLElement = document.getElementById("manualBreaks");
    //TODO vlt. kann man das auch anders lösen
    manualBreaksHTMLElement.innerHTML = "";

    for (let i = 0; i < requiredFieldPairs; i++) {
        let numberID = i + 1;
        numberID = formatNumber(numberID);

        const divElement = document.createElement("div");
        divElement.innerHTML = beginAndEndOfManualBreak(numberID);
        manualBreaksHTMLElement.appendChild(divElement);
    }
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

    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        const numberOfManualBreaksField = document.getElementById("numberOfManualBreaks");
        const requiredFieldPairs = parseInt (numberOfManualBreaksField.value, 10);
        const increasedValue = requiredFieldPairs + 1;
        const decreasedValue = Math.max(requiredFieldPairs - 1, 1);

        if (event.deltaY > 0) {
            document.getElementById("numberOfManualBreaks").value = decreasedValue;
        } else {
            document.getElementById("numberOfManualBreaks").value = increasedValue;
        }

        const changeEvent = new Event('change', { bubbles: true });
        numberOfManualBreaksField.dispatchEvent(changeEvent);

    }, { passive: false });
}

function updateBeginAndEndFields(){
    const requiredFieldPairs = document.getElementById("numberOfManualBreaks").value;
    addBeginAndEndFieldsDynamic(requiredFieldPairs);
}

function getTimeFromFieldById(fieldId) {
    const [hours, mins] = document.getElementById(fieldId).value.toString().split(":").map(Number);
    return [hours, mins];
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
    updateBeginAndEndFields();

    document.getElementById("numberOfManualBreaks").addEventListener("change", () => {
        updateBeginAndEndFields();
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

function setUpManualBreak() {
    const settingsContainer = document.getElementById("manualBreak");
    settingsContainer.innerHTML = manualBreak();
}