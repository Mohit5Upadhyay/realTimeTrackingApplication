// Shared Dark Mode Logic for all pages
(function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;
    const htmlElement = document.documentElement;
    const darkModeIcon = darkModeToggle.querySelector('i');

    function setDarkMode(enabled) {
        if (enabled) {
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            if (darkModeIcon) {
                darkModeIcon.classList.remove('bx-moon');
                darkModeIcon.classList.add('bx-sun');
            }
        } else {
            htmlElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            if (darkModeIcon) {
                darkModeIcon.classList.remove('bx-sun');
                darkModeIcon.classList.add('bx-moon');
            }
        }
    }

    darkModeToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.contains('dark-mode');
        setDarkMode(!isDark);
    });

    // On page load, set mode based on localStorage or system preference
    (function initializeDarkMode() {
        const userPref = localStorage.getItem('darkMode');
        if (userPref === 'enabled') {
            setDarkMode(true);
        } else if (userPref === 'disabled') {
            setDarkMode(false);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    })();
})();
