document.addEventListener('DOMContentLoaded', function() {
    const disabledDivs = document.querySelectorAll('.disabled');

    disabledDivs.forEach(function(div) {
        const focusableElements = div.querySelectorAll('input, select, textarea, button, a');

        focusableElements.forEach(function(element) {
            element.setAttribute('tabindex', '-1');
        });
    });
});