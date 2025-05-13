/**
 * Setzte alle HTML Element mit der Class "disabled" auf den entsprechenden Status
 */
function disableHTMLElements() {
    const disabledDivs = document.querySelectorAll(".disabled");

    disabledDivs.forEach((div) => {
        const focusableElements = div.querySelectorAll(
            "input, select, textarea, button, a",
        );

        focusableElements.forEach((element) => {
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
    htmlElement.value = text;
}

/**
 * Gibt den Wert eines HTML Elements als {number} Value aus
 *
 * @param {string} elementId des HTML Elements
 * @return {number} Den Wert als Nummer
 */
function getNumberFromElement(elementId) {
    let elementValue = document.getElementById(elementId).value;

    if (elementValue === "") elementValue = 0;

    return parseInt(elementValue, 10);
}

/**
 * Macht aus einem normalen Button einen Reactbutton eines bestimmten Types
 * @param {HTMLButtonElement} buttonElement Der Button, der zum Reactbutton werden soll
 * @param {string} variant Die Button Variante in lowerCase
 */
function makeReactButton(buttonElement, variant) {
    buttonElement.classList.add('react-button');

    // Standard-Farbzuweisungen basierend auf Bootstrap-Button-Farben
    const colors = {
        primary: { bg: "#0d6efd", hover: "#0b5ed7", active: "#0a58ca", text: "#fff" },
        secondary: { bg: "#6c757d", hover: "#5c636a", active: "#4d545a", text: "#fff" },
        success: { bg: "#198754", hover: "#157347", active: "#146c43", text: "#fff" },
        danger: { bg: "#dc3545", hover: "#bb2d3b", active: "#a52834", text: "#fff" },
        warning: { bg: "#ffc107", hover: "#e0a800", active: "#c69500", text: "#000" },
        info: { bg: "#0dcaf0", hover: "#0bb8da", active: "#0aa2c0", text: "#000" },
        light: { bg: "#f8f9fa", hover: "#e2e6ea", active: "#dae0e5", text: "#000" },
        dark: { bg: "#212529", hover: "#1c1f23", active: "#181a1d", text: "#fff" }
    };

    if (!(variant in colors)) {
        console.warn(`Unknown variant: "${variant}". Falling back to primary.`);
        variant = 'primary';
    }

    const { bg, hover, active, text } = colors[variant];

    applyButtonStyles(buttonElement, text, bg, hover, active);
}

/**
 * Setzt die Farben für um einen Button zu einem Reactbutton zu machen
 * @param {HTMLButtonElement} buttonElement Der Button
 * @param {string} textColor Die Farbe des Textes
 * @param {string} backgroundColor Die Hintergrundfarbe des Buttons
 * @param {string} hoverColor Die Farbe des Buttons beim Hovern
 * @param {string} activeColor Die Farbe des Buttons, wenn er auslöst
 */
function applyButtonStyles(buttonElement, textColor, backgroundColor, hoverColor, activeColor) {
    buttonElement.className = "react-button";
    buttonElement.style.color = textColor;
    buttonElement.style.backgroundColor = backgroundColor;
    buttonElement.style.borderColor = backgroundColor;

    buttonElement.addEventListener('mouseover', () => {
        buttonElement.style.backgroundColor = hoverColor;
        buttonElement.style.borderColor = hoverColor;
    });

    buttonElement.addEventListener('mouseout', () => {
        buttonElement.style.backgroundColor = backgroundColor;
        buttonElement.style.borderColor = backgroundColor;
    });

    buttonElement.addEventListener('mousedown', () => {
        buttonElement.style.backgroundColor = activeColor;
        buttonElement.style.borderColor = activeColor;
    });

    buttonElement.addEventListener('mouseup', () => {
        buttonElement.style.backgroundColor = hoverColor;
        buttonElement.style.borderColor = hoverColor;
    });
}
