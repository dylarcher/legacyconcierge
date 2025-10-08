// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('preferred-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save preference
    localStorage.setItem('preferred-theme', newTheme);

    // Update icon
    updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
    const lightIcons = document.querySelectorAll('.theme-toggle .icon-light');
    const darkIcons = document.querySelectorAll('.theme-toggle .icon-dark');

    if (theme === 'dark') {
        lightIcons.forEach(icon => icon.classList.add('active'));
        darkIcons.forEach(icon => icon.classList.remove('active'));
    } else {
        lightIcons.forEach(icon => icon.classList.remove('active'));
        darkIcons.forEach(icon => icon.classList.add('active'));
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // Add click event to all theme toggles
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a manual preference
        if (!localStorage.getItem('preferred-theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeToggleIcon(theme);
        }
    });
});
