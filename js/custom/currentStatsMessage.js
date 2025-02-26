/**
 * Gibt den HTML-Code für das CurrentStatsMassage Modal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Message Modal
 */
function currentStatsMessage() {

    return `
        <div class="currentStatsMessageOverlay" id="currentStatsMessageOverlay"></div>
        <div class="form-popup" id="currentStatsMessageForm">
            <form class="form-container">
                <span class="close" onclick="closeCurrentStatsMessage()">&times;</span>
                <h1>Daten bei frühem Arbeitsende</h1>
                
                <div class="text-center" id="currentTimeStatsResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="currentWorkTime">Aktuelle Arbeitszeit</label>
                            <p class="display-5" id="currentWorkTime">0.00</p>
                        </div>
        
                        <div class="col text-center">
                            <label for="currentFloatTime">Aktuelle Gleitzeit</label>
                            <p class="display-5" id="currentFloatTime">0.00</p>
                        </div>
                    </div>
                </div>
                
            </form>
        </div>
    `;
}

/**
 * Öffnet das CurrentStatsMassage Modal
 */
function openCurrentStatsMessageWithValues(currentStart, currentTime, currentPause) {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("currentStatsMessageOverlay").style.display = "block";
    document.getElementById("currentStatsMessageForm").style.display = "block";
    document.getElementById("currentTimeStatsResult").style.display = "block";

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeCurrentStatsMessage();
        }
    });

    const currentIst = calculateIstTime(currentStart, currentTime, currentPause);
    const currentFloat = calculateGleitzeit(currentIst);

    document.getElementById("currentWorkTime").textContent = formatTime(currentIst);
    document.getElementById("currentFloatTime").textContent = createGleitzeitAusgabeFromFloat(currentFloat);
}

/**
 * Schließt das CurrentStatsMassage Modal
 */
function closeCurrentStatsMessage() {
    document.getElementById("currentStatsMessageOverlay").style.display = "none";
    document.getElementById("currentStatsMessageForm").style.display = "none";
    document.getElementById("currentTimeStatsResult").style.display = "none";
    deleteCookie("settingsOpen");
}

/**
 * Lädt alle Funktionalitäten und Daten zum CurrentStatsMassage Modal
 */
function setUpCurrentStatsMessageOverlay() {
    const settingsContainer = document.getElementById("currentStatsMessage");
    settingsContainer.innerHTML = currentStatsMessage();
}
