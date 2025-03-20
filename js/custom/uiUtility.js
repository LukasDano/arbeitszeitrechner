/**
 * Setzte alle HTML Element mit der Class "disabled" auf den entsprechenden Status
 */
function disableHTMLElements() {
    const disabledDivs = document.querySelectorAll(".disabled");

    disabledDivs.forEach(function (div) {
        const focusableElements = div.querySelectorAll(
            "input, select, textarea, button, a",
        );

        focusableElements.forEach(function (element) {
            element.setAttribute("tabindex", "-1");
        });
    });
}

/**
 * Gibt den Wert aus einem Input Feld des "time" Types den Wert als {Time} Wert zurück
 *
 * @param {string} fieldId Die ID des HTML Feldes
 * @return {Time} Der Wert des Feldes als Time Value
 */
function getTimeFromFieldById(fieldId) {
    const [hours, mins] = document.getElementById(fieldId).value.toString().split(":").map(Number);
    return [hours, mins];
}

/**
 * Löscht alle Parameter, die in der URL gesetzt sind
 */
function removeCustomButtonParameters() {
    const urlWithoutParams = window.location.href.split('?')[0];
    history.pushState({}, '', urlWithoutParams);
}

/**
 * Setzt den Placeholder für ein entsprechendes HTML-Element
 *
 * @param {string} elementId Die ID des Elements
 * @param {string} text Text der in das HTML Element gestzt werden soll
 */
function setHTMLTextValueForElement(elementId, text) {
    const htmlElement = document.getElementById(elementId);
    htmlElement.value = valueText;
}

/**
 * Gibt den Wert eines HTML Elements als {number} Value aus
 *
 * @param {string} elementId des HTML Elements
 * @return {number} Den Wert als Nummer
 */
function getNumberFromElement(elementId) {
    const elementValue = document.getElementById(element).value;
    const valueAsNumber = parseInt(elementValue, 10);
    return valueAsNumber;
}
