/**
 * @returns {string} Den HTML Code für die Notification Komponente
 */
function notification() {
    return `
        <div class="form-notification" id="notificationForm">
            <form class="form-container">

                <div id="notificationField"></div>

            </form>
        </div>
    `;
}

/**
 * @param {NotificationConfiguration} config
 */
function sendNotification(config) {
    document.getElementById("notificationForm").style.display = "block";

    const notificationForm = document.getElementById("notificationForm");
    const notificationField = document.getElementById("notificationField");

    notificationForm.style.backgroundColor = config.bgColor;
    notificationField.textContent = config.text

    if (!config.confirmMessage) setTimeout(() => closeNotification(), config.timer);
}

function closeNotification() {
    document.getElementById("notificationForm").style.display = "none";
}

function setUpNotification() {
    const notificationContainer = document.getElementById("notification");
    notificationContainer.innerHTML = notification();
}