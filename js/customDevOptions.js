/**
 * Gibt eine kurze Anleitung aus wie man eigene DevOptions hinzufügen kann
 */
function customDevOptionAdvice() {
    console.log("Füge eine eigene DevOption hinzu: addDevOption(optionNr, url, cookieAltName)");
}

/**
 * Startet den Prozess eigene DevOptions hinzuzufügen.
 * Man kann immer nur eine zurzeit hinzufügen.
 * Ist auf insgesamt 3 beschränkt, diese können aber überschrieben werden.
 *
 * @param {number} optionNr Die DevOption die man setzten möchte (1,2,3)
 * @param {string} url Der Link zu dem der neue Button führen soll
 * @param {string} cookieAltName Der Name der Angezeigt wird, wenn die Icons nicht richtig geladen werden
 * @deprecated Kann später entfernt werden
 */
async function addDevOption(optionNr, url, cookieAltName) {
    let customDevOption;

    if (optionNr === 1) {
        setCookieForMaximumTime("customDevOptionOne", url);
        setCookieForMaximumTime("customDevOptionOneAltName", cookieAltName);
        customDevOption = "customDevOptionOne";
    } else if (optionNr === 2) {
        setCookieForMaximumTime("customDevOptionTwo", url);
        setCookieForMaximumTime("customDevOptionTwoAltName", cookieAltName);
        customDevOption = "customDevOptionTwo";
        customDevOption = "customDevOptionOne";
    } else if (optionNr === 3) {
        setCookieForMaximumTime("customDevOptionThree", url);
        setCookieForMaximumTime("customDevOptionTHreeAltName", cookieAltName);
        customDevOption = "customDevOptionTHree";
    } else {
        console.error(optionNr + " ist keine gültige Nummer. Bitte 1, 2 oder 3 eingeben");
        return;
    }

    const icons = await listAllIcons();
    console.log("Alle existierenden Icons" + icons);
    chooseIcon(customDevOption);
}

/**
 * Lässt den User das Icon wählen, welches die DevOption haben soll
 *
 * @param {string} cookieNameForDevOption Den Namen unter dem der Link als Cookie gespeichert wurde (customDevOptionOne/customDevOptionTwo)
 * @deprecated Kann noch normal genutzt werden. Die Funktion mit der Oberfläche sollte priorisiert werden
 */
async function chooseIcon(cookieNameForDevOption) {
    const customDevOption = cookieNameForDevOption + "Icon";
    const validIcons = await listAllIcons();
    let userSelectionIsValid = true;
    let iconName;

    while (userSelectionIsValid) {
        iconName = prompt("Welches Icon soll deine DevOption haben? \n(Bitten den Namen ohne .png angeben!)");

        if (validIcons.hasOwnProperty(iconName)) {
            userSelectionIsValid = false;
        }
    }

    const iconFileName = iconName + ".png"
    const iconFilePath = `pictures/icons/${iconFileName}`
    setCookieForMaximumTime(customDevOption, iconFilePath);

    location.reload();
}

/**
 * Startet den Prozess eigene DevOptions hinzuzufügen.
 * Man kann immer nur eine zur Zeit hinzufügen.
 * Ist auf insgesamt 3 beschränkt, diese können aber überschrieben werden.
 *
 * @param {string} customDevOption Die DevOption die man setzten möchte (1,2,3)
 * @param {string} url Der Link zu dem der neue Button führen soll
 * @param {string} cookieAltName Der Name der Angezeigt wird, wenn die Icons nicht richtig geladen werden
 * @param {string} iconName Der Name des Icons ohne ".png"
 */
function addDevOptionFromModal(customDevOption, url, cookieAltName, iconName) {

    setCookieForMaximumTime(customDevOption, url);
    setCookieForMaximumTime(customDevOption + "AltName", cookieAltName);

    const iconFileName = iconName + ".png"
    const iconFilePath = `pictures/icons/${iconFileName}`
    setCookieForMaximumTime(customDevOption + "Icon", iconFilePath);
}

/**
 * Gibt alle existierenden Files aus
 * @return {string[]} Eine Liste aller Icon File Namen
 */
async function listAllIcons() {
    const jsonPath = 'database/icons/icons.json';
    let icons = {};

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        icons = await response.json();
    } catch (error) {
        console.error('Failed to fetch icon list:', error);
    }

    return icons;
}

/**
 * Gibt alle im HTML Dokument existierenden CustomDevOptionsButtonNamen als Liste zurück
 *
 * @return {string[]} Die Namen zu allen existierenden CustomDevOptionsButtons
 */
function listAllCustomDevOptionButtons() {
    const devOptions = document.querySelectorAll('.devOption');
    const classNames = [];

    devOptions.forEach(devOption => {
        const customDevOption = devOption.querySelector('.customDevOption');
        if (customDevOption) {
            const className = customDevOption.className.replace(/\s+/g, '');
            classNames.push(className);
        }
    });

    return classNames;
}

document.addEventListener('DOMContentLoaded', function () {
    refreshDevOptionCookies();
    const options = getAllDevOptions();

    const settingsContainer = document.getElementById("devOptionSettings");
    settingsContainer.innerHTML = devOptionSettings();

    options.forEach(option => {
        const {cookiePrefix, id} = option;
        const targetUrl = getCookie(cookiePrefix);
        const devOptionIcon = getCookie(`${cookiePrefix}Icon`);
        const devOptionAltName = getCookie(`${cookiePrefix}AltName`);

        if (typeof devOptionAltName !== "undefined") {
            const devOptionContainer = document.querySelector(`.customDevOption.${id}`);
            if (devOptionContainer) {
                devOptionContainer.innerHTML = customDevOption(targetUrl, devOptionIcon, devOptionAltName);
            } else {
                console.warn(`Container for customDevOption ${id} not found`);
            }
        }
    });
});

/**
 * Guckt welche Cookies für die DevOptions existieren und setzt diese dann neu.
 */
function refreshDevOptionCookies() {
    const options = getAllDevOptions();

    options.forEach(option => {
        const targetUrl = getCookie(`${option.cookiePrefix}`);
        const devOptionIcon = getCookie(`${option.cookiePrefix}Icon`);
        const devOptionAltName = getCookie(`${option.cookiePrefix}AltName`);

        if (targetUrl) setCookieForMaximumTime(option.cookiePrefix, targetUrl);
        if (devOptionIcon) setCookieForMaximumTime(option.cookiePrefix + "Icon", devOptionIcon);
        if (devOptionAltName) setCookieForMaximumTime(option.cookiePrefix + "AltName", devOptionAltName);
        if (devOptionAltName === ("Mittag" || "Lunch")) updateLink(targetUrl, option.cookiePrefix);
    });
}

/**
 * Prüft, ob ein String einem vorher übergebenen Schema entspricht
 *
 * @param inputString
 * @return {boolean}
 */
function isValidSpeiseplanURL(inputString) {
    const lunchURLVerificator = getCookie("lunchURLVerificator");
    setCookieForMaximumTime("lunchURLVerificator", lunchURLVerificator);

    const lunchURLExpression = RegExp(lunchURLVerificator);

    return lunchURLExpression.test(inputString);
}

/**
 * Updated den Speiseplanlink auf die aktuelle Woche
 *
 * @param {string} cookieURL Die in den Cookies gespeicherte URL
 * @param {string} devOptionsButtonName den Namen, unter dem der Cookie gespeichert wurde
 */
function updateLink(cookieURL, devOptionsButtonName){
    if (isValidSpeiseplanURL(cookieURL)) {
        const speisePlanURL = cookieURL.substring(0, cookieURL.lastIndexOf('-') + 1);
        const currentSpeisePlanURL = speisePlanURL + getCurrentKW() + ".pdf";
        setCookieForMaximumTime(devOptionsButtonName, currentSpeisePlanURL);
    }
}

/**
 * Gibt alle CustomDevOption Namen zurück
 *
 * @returns Alle CustomDevOptions
 */
function getAllDevOptions() {
    const options = [
        {id: 'One', cookiePrefix: 'customDevOptionOne'},
        {id: 'Two', cookiePrefix: 'customDevOptionTwo'},
        {id: 'Three', cookiePrefix: 'customDevOptionThree'}
    ];

    return options;
}

/**
 * Gibt den HTML-Code für eine DevOption als String zurück
 *
 * @param {string} targetUrl Die Ziel führende URL
 * @param {string} devOptionIcon Der Pfad zu dem Icon, welches gesetzt werden soll
 * @param {string} devOptionAltName Der Alternativename, der angezeigt werden soll, wenn das Icon nicht geladen werden kann
 * @returns Den HTML Code Abschnitt für die neue DevOption
 */
function customDevOption(targetUrl, devOptionIcon, devOptionAltName) {
    const defaultIcon = "pictures/icons/close.png";

    return `
        <div class="devOption">
            <li class="nav-item">
                <a class="nav-link" href="${targetUrl}" target="_blank">
                    <img class="icon" src="${devOptionIcon || defaultIcon}" alt="${devOptionAltName}">
                </a>
            </li>
        </div>
    `;
}

/**
 * Gibt den HTML-Code für das DevOptionSettingsModal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Settings Modal
 */
function devOptionSettings() {

    return `
        <div class="overlay" id="overlay"></div>
        <div class="form-popup" id="myForm">
            <form class="form-container" onsubmit="submitForm(event)">
                <span class="close" onclick="closeForm()">&times;</span>
                <h1>DevOption Setting</h1>

                <label for="devOptionButtonDropDown">DevOptionButton:</label>
                <select id="devOptionButtonDropDown" onChange="updateValues()"></select>

                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Namen vergeben" required>
      
                <label for="iconDropDown">Icon:</label>
                <select id="iconDropDown"></select>

                <label for="url">URL:</label>
                <input type="text" id="url" name="url" placeholder="URL eingeben" required>

                <div class="btn-container">
                    <button type="submit" class="btn">Save</button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Öffnet das SettingsModal
 */
async function openForm() {
    setCookie("settingsOpen", true);
    document.getElementById("myForm").style.display = "block"; // Show the form
    document.getElementById("overlay").style.display = "block"; // Show the overlay

    const iconDropDownId = "iconDropDown";
    const allIconsList = await listAllIcons();
    populateDropdown(iconDropDownId, allIconsList);

    const devOptionDropDownId = "devOptionButtonDropDown";
    const allDevOptionButtons = listAllCustomDevOptionButtons();
    populateDropdown(devOptionDropDownId, allDevOptionButtons);

    const nameElementId = "name";
    const namePlaceHolderText = getCookie("customDevOptionOneAltName");
    updateDropdownValue(nameElementId, namePlaceHolderText);

    const urlElementId = "url";
    const ulrPlaceHolderText = getCookie("customDevOptionOne");
    updateDropdownValue(urlElementId, ulrPlaceHolderText);

    updateValues();
}

/**
 * Schließt das SettingsModal
 */
function closeForm() {
    document.getElementById("myForm").style.display = "none"; // Hide the form
    document.getElementById("overlay").style.display = "none"; // Hide the overlay
    deleteCookie("settingsOpen");
}

function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission
    const customButtonName = document.getElementById("devOptionButtonDropDown").value;
    const name = document.getElementById("name").value;
    const icon = document.getElementById("iconDropDown").value;
    const url = document.getElementById("url").value;

    addDevOptionFromModal(customButtonName, url, name, icon);
    closeForm();
    location.reload();
}

/**
 * Schreibt Daten aus einem Objekt oder einer Liste in ein DropDownMenu mit der angegebenen ID.
 *
 * @param {string} dropDownId Die ID des DropDownMenu HTML-Elements
 * @param {array|object} optionsList Die Liste/ das Objekt mit den Daten
 */
function populateDropdown(dropDownId, optionsList) {
    const dropdown = document.getElementById(dropDownId);

    if (Array.isArray(optionsList)) {
        optionsList.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;

            dropdown.appendChild(opt);
        });
    } else if (typeof optionsList === "object") {
        for (const key in optionsList) {
            if (optionsList.hasOwnProperty(key)) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = key;

                dropdown.appendChild(opt);
            }

        }
    }
}

/**
 * Setzt den Placeholder für ein entsprechendes HTML-Element
 *
 * @param {string} elementId Die ID des Elements
 * @param {string} valueText Text der in den Placeholder gesetzt wird
 */
function updateDropdownValue(elementId, valueText) {
    const htmlElement = document.getElementById(elementId);
    htmlElement.value = valueText;
}

/**
 * Updateted die Anzegeigten Werte im SettingsModal, wenn der Button, der bearbeitet wird sich ändert
 *
 * @returns {Promise<void>}
 */
async function updateValues(){
    const dropdown = document.getElementById("devOptionButtonDropDown");
    const nameInput = document.getElementById("name");
    const urlInput = document.getElementById("url");
    const iconDropDown = document.getElementById("iconDropDown");

    const selectedValue = dropdown.value;
    const defaultNameText = "";
    const defaultURLText = "";
    const defaultIconText = Object.keys(await listAllIcons())[0];

    switch (selectedValue) {
        case "customDevOptionOne":
            nameInput.value = getCookie("customDevOptionOneAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionOne") || defaultURLText ;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionOneIcon") || defaultIconText;
            break;
        case "customDevOptionTwo":
            nameInput.value = getCookie("customDevOptionTwoAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionTwo") || defaultURLText;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionTwoIcon") || defaultIconText;
            break;
        case "customDevOptionThree":
            nameInput.value = getCookie("customDevOptionThreeAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionThree") || defaultURLText;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionThreeIcon") || defaultIconText;
            break;
    }
}
