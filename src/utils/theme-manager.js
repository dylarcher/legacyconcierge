/**
 * Theme Manager Utility
 * Manages theme switching (light/dark), system preferences, and persistence
 * Supports prefers-* media queries for accessibility
 * @module utilities/theme-manager
 */

/**
 * ThemeManager class for handling theme state and transitions
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.systemPreference = 'light';
    this.storageKey = 'lc-theme-preference';
    this.listeners = new Set();
    this.mediaQueries = {};

    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.detectSystemPreferences();
    this.loadSavedTheme();
    this.applyTheme(this.currentTheme);
    this.setupMediaQueryListeners();
    this.exposeGlobally();
  }

  /**
   * Detect system theme preference
   */
  detectSystemPreferences() {
    // Theme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPreference = darkModeQuery.matches ? 'dark' : 'light';

    // Store media query for later
    this.mediaQueries.colorScheme = darkModeQuery;

    // Reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.mediaQueries.reducedMotion = reducedMotionQuery;

    // Contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.mediaQueries.highContrast = highContrastQuery;

    const lowContrastQuery = window.matchMedia('(prefers-contrast: low)');
    this.mediaQueries.lowContrast = lowContrastQuery;

    // Transparency preference
    const reducedTransparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    this.mediaQueries.reducedTransparency = reducedTransparencyQuery;

    // Data preference
    const reducedDataQuery = window.matchMedia('(prefers-reduced-data: reduce)');
    this.mediaQueries.reducedData = reducedDataQuery;
  }

  /**
   * Setup media query listeners for system preference changes
   */
  setupMediaQueryListeners() {
    // Listen for theme changes
    this.mediaQueries.colorScheme?.addEventListener('change', (e) => {
      this.systemPreference = e.matches ? 'dark' : 'light';

      // Only auto-switch if no user preference is saved
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(this.systemPreference, false);
      }

      this.notifyListeners('system-preference-changed', this.systemPreference);
    });

    // Listen for accessibility preference changes
    ['reducedMotion', 'highContrast', 'lowContrast', 'reducedTransparency', 'reducedData'].forEach(key => {
      this.mediaQueries[key]?.addEventListener('change', (e) => {
        document.documentElement.setAttribute(`data-${this.camelToKebab(key)}`, e.matches);
        this.notifyListeners('accessibility-preference-changed', { [key]: e.matches });
      });
    });
  }

  /**
   * Convert camelCase to kebab-case
   * @param {string} str - String to convert
   * @returns {string} Kebab-case string
   * @private
   */
  camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved && (saved === 'light' || saved === 'dark')) {
      this.currentTheme = saved;
    } else {
      this.currentTheme = this.systemPreference;
    }
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  applyTheme(theme) {
    const root = document.documentElement;

    // Remove both theme classes
    root.removeAttribute('data-theme');

    // Add new theme
    if (theme !== this.systemPreference) {
      root.setAttribute('data-theme', theme);
    }

    // Update meta theme-color
    this.updateMetaThemeColor(theme);

    // Apply accessibility preferences
    this.applyAccessibilityPreferences();

    // Notify listeners
    this.notifyListeners('theme-changed', theme);
  }

  /**
   * Apply accessibility preference attributes
   */
  applyAccessibilityPreferences() {
    const root = document.documentElement;

    // Set data attributes for accessibility preferences
    Object.entries(this.mediaQueries).forEach(([key, query]) => {
      if (key !== 'colorScheme' && query?.matches) {
        root.setAttribute(`data-${this.camelToKebab(key)}`, 'true');
      }
    });
  }

  /**
   * Update meta theme-color based on current theme
   * @param {string} theme - Theme name
   */
  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    // Get computed theme colors
    const colors = {
      light: '#f9f7f4',
      dark: '#1a1a1a'
    };

    metaThemeColor.setAttribute('content', colors[theme]);
  }

  /**
   * Set theme
   * @param {string} theme - Theme name ('light', 'dark', or 'system')
   * @param {boolean} persist - Whether to save to localStorage (default: true)
   */
  setTheme(theme, persist = true) {
    let actualTheme = theme;

    // Handle 'system' theme
    if (theme === 'system') {
      actualTheme = this.systemPreference;

      if (persist) {
        localStorage.removeItem(this.storageKey);
      }
    } else {
      if (persist) {
        localStorage.setItem(this.storageKey, theme);
      }
    }

    this.currentTheme = actualTheme;
    this.applyTheme(actualTheme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Get system preference
   * @returns {string} System theme preference
   */
  getSystemPreference() {
    return this.systemPreference;
  }

  /**
   * Check if using system theme
   * @returns {boolean} True if following system preference
   */
  isUsingSystemTheme() {
    return !localStorage.getItem(this.storageKey);
  }

  /**
   * Get accessibility preference
   * @param {string} preference - Preference name (e.g., 'reducedMotion')
   * @returns {boolean} True if preference is active
   */
  getAccessibilityPreference(preference) {
    return this.mediaQueries[preference]?.matches || false;
  }

  /**
   * Add theme change listener
   * @param {Function} callback - Callback function(event, data)
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
  }

  /**
   * Remove theme change listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of theme changes
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Theme listener error:', error);
      }
    });
  }

  /**
   * Expose theme manager globally
   */
  exposeGlobally() {
    window.themeManager = this;
    window.setTheme = this.setTheme.bind(this);
    window.toggleTheme = this.toggle.bind(this);
  }

  /**
   * Get all current preferences
   * @returns {Object} All preference values
   */
  getAllPreferences() {
    return {
      theme: this.currentTheme,
      systemPreference: this.systemPreference,
      usingSystem: this.isUsingSystemTheme(),
      reducedMotion: this.getAccessibilityPreference('reducedMotion'),
      highContrast: this.getAccessibilityPreference('highContrast'),
      lowContrast: this.getAccessibilityPreference('lowContrast'),
      reducedTransparency: this.getAccessibilityPreference('reducedTransparency'),
      reducedData: this.getAccessibilityPreference('reducedData')
    };
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
