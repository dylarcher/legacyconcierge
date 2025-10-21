/**
 * Theme Management Module
 * Handles dark/light theme switching with localStorage persistence
 * and system preference detection
 */

/**
 * Initialize the theme based on saved preference or system preference
 * @returns {void}
 */
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    let savedTheme;
    try {
        savedTheme = localStorage.getItem('preferred-theme');
    } catch (e) {
        console.warn('localStorage not available:', e);
        savedTheme = null;
    }

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcon(theme);
}

/**
 * Toggle between dark and light themes
 * @returns {void}
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);

    // Save preference
    try {
        localStorage.setItem('preferred-theme', newTheme);
    } catch (e) {
        console.warn('Could not save theme preference:', e);
    }

    // Update icon
    updateThemeToggleIcon(newTheme);
}

/**
 * Update the theme toggle icon to reflect the current theme
 * @param {string} theme - The current theme ('dark' or 'light')
 * @returns {void}
 */
function updateThemeToggleIcon(theme) {
    const lightIcons = document.querySelectorAll('.theme-toggle .icon-light');
    const darkIcons = document.querySelectorAll('.theme-toggle .icon-dark');

    if (theme === 'dark') {
        for (const icon of lightIcons) {
            icon?.classList.add('active');
        }
        for (const icon of darkIcons) {
            icon?.classList.remove('active');
        }
    } else {
        for (const icon of lightIcons) {
            icon?.classList.remove('active');
        }
        for (const icon of darkIcons) {
            icon?.classList.add('active');
        }
    }
}

/**
 * Setup theme toggle button event listener
 * Call this after components are rendered
 * @returns {void}
 */
function setupThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    for (const toggle of themeToggles) {
        // Remove any existing listeners to avoid duplicates
        toggle.replaceWith(toggle.cloneNode(true));
    }

    // Re-query after cloning
    const newToggles = document.querySelectorAll('.theme-toggle');
    for (const toggle of newToggles) {
        toggle.addEventListener('click', toggleTheme);
    }

    // Update icon to match current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeToggleIcon(currentTheme);

    console.log('✓ Theme toggle initialized');
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // Try to setup theme toggle (for static pages)
    // This will be called again after components load
    setupThemeToggle();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a manual preference
        let hasManualPreference = false;
        try {
            hasManualPreference = !!localStorage.getItem('preferred-theme');
        } catch (err) {
            console.warn('Could not check theme preference:', err);
        }

        if (!hasManualPreference) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeToggleIcon(theme);
        }
    });
});

// Expose functions globally for component integration
if (typeof window !== 'undefined') {
    window.toggleTheme = toggleTheme;
    window.setupThemeToggle = setupThemeToggle;
    window.updateThemeToggleIcon = updateThemeToggleIcon;
}
