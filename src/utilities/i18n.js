/**
 * Internationalization (i18n) Engine
 * Handles translation loading, locale switching, and content application
 * Supports nested keys, array notation, and HTML attribute translations
 * @module utilities/i18n
 */

import pathResolver from './path-resolver.js';

/**
 * I18n class for managing translations
 */
class I18n {
  constructor() {
    this.currentLocale = 'en';
    this.defaultLocale = 'en';
    this.supportedLocales = ['en', 'es'];
    this.translations = {};
    this.loadedPages = new Set();
    this.storageKey = 'lc-locale-preference';
    this.listeners = new Set();

    this.init();
  }

  /**
   * Initialize i18n system
   */
  async init() {
    this.detectLocale();
    await this.loadCommonTranslations();
    this.exposeGlobally();
  }

  /**
   * Detect user's preferred locale
   */
  detectLocale() {
    // 1. Check localStorage
    const saved = localStorage.getItem(this.storageKey);
    if (saved && this.supportedLocales.includes(saved)) {
      this.currentLocale = saved;
      return;
    }

    // 2. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];

    if (this.supportedLocales.includes(langCode)) {
      this.currentLocale = langCode;
      return;
    }

    // 3. Fall back to default
    this.currentLocale = this.defaultLocale;
  }

  /**
   * Load common translations shared across all pages
   * @returns {Promise<void>}
   */
  async loadCommonTranslations() {
    await this.loadTranslations('common');
  }

  /**
   * Load translations for a specific page
   * @param {string} page - Page name (e.g., 'home', 'about', 'common')
   * @returns {Promise<Object>} Loaded translations
   */
  async loadTranslations(page) {
    const cacheKey = `${this.currentLocale}:${page}`;

    // Return cached if available
    if (this.translations[cacheKey]) {
      return this.translations[cacheKey];
    }

    try {
      const path = pathResolver.resolveI18n(this.currentLocale, page);
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load translations: ${path} (${response.status})`);
      }

      const data = await response.json();
      this.translations[cacheKey] = data;
      this.loadedPages.add(page);

      return data;
    } catch (error) {
      console.error(`Translation loading error for ${page}:`, error);

      // Try default locale as fallback
      if (this.currentLocale !== this.defaultLocale) {
        return this.loadTranslationsForLocale(page, this.defaultLocale);
      }

      return {};
    }
  }

  /**
   * Load translations for a specific locale (fallback mechanism)
   * @param {string} page - Page name
   * @param {string} locale - Locale code
   * @returns {Promise<Object>} Loaded translations
   * @private
   */
  async loadTranslationsForLocale(page, locale) {
    const cacheKey = `${locale}:${page}`;

    try {
      const path = pathResolver.resolveI18n(locale, page);
      const response = await fetch(path);

      if (!response.ok) {
        return {};
      }

      const data = await response.json();
      this.translations[cacheKey] = data;

      return data;
    } catch (error) {
      console.error(`Fallback translation loading error for ${page}:`, error);
      return {};
    }
  }

  /**
   * Get translation by key (supports nested keys and array notation)
   * @param {string} key - Translation key (e.g., 'page.title', 'items[0].name')
   * @param {string} [page='common'] - Page namespace
   * @param {Object} [replacements] - Values to replace in translation (e.g., {name: 'John'})
   * @returns {string} Translated text or key if not found
   */
  t(key, page = 'common', replacements = {}) {
    const cacheKey = `${this.currentLocale}:${page}`;
    const translations = this.translations[cacheKey];

    if (!translations) {
      console.warn(`Translations not loaded for page: ${page}`);
      return key;
    }

    // Get value from nested key path
    let value = this.getNestedValue(translations, key);

    if (value === undefined || value === null) {
      console.warn(`Translation not found: ${key} (page: ${page})`);
      return key;
    }

    // Replace placeholders if any
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      value = this.replacePlaceholders(value, replacements);
    }

    return value;
  }

  /**
   * Get nested value from object using dot notation
   * Supports array notation: items[0].name
   * @param {Object} obj - Object to search
   * @param {string} path - Dot-separated path
   * @returns {*} Value or undefined
   * @private
   */
  getNestedValue(obj, path) {
    // Handle array notation: items[0].name
    const keys = path.split('.').reduce((acc, key) => {
      const arrayMatch = key.match(/(.+)\[(\d+)\]/);
      if (arrayMatch) {
        acc.push(arrayMatch[1], parseInt(arrayMatch[2], 10));
      } else {
        acc.push(key);
      }
      return acc;
    }, []);

    return keys.reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  /**
   * Replace placeholders in translation string
   * @param {string} str - String with placeholders
   * @param {Object} replacements - Replacement values
   * @returns {string} String with replaced values
   * @private
   */
  replacePlaceholders(str, replacements) {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  }

  /**
   * Apply translations to the DOM
   * Looks for elements with data-i18n attributes
   * @param {HTMLElement} [root=document.body] - Root element to search
   * @param {string} [page='common'] - Page namespace
   * @returns {Promise<void>}
   */
  async apply(root = document.body, page = 'common') {
    // Load page translations if not already loaded
    if (!this.loadedPages.has(page)) {
      await this.loadTranslations(page);
    }

    // Find all elements with data-i18n
    const elements = root.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (!key) return;

      const translation = this.t(key, page);

      // Safely set text content (sanitize HTML)
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.setAttribute('placeholder', translation);
      } else {
        element.textContent = translation;
      }
    });

    // Handle attribute translations: data-i18n-attr="alt:image.alt;title:image.title"
    const attrElements = root.querySelectorAll('[data-i18n-attr]');

    attrElements.forEach(element => {
      const attrConfig = element.getAttribute('data-i18n-attr');
      if (!attrConfig) return;

      const attrs = attrConfig.split(';').map(pair => pair.split(':'));

      attrs.forEach(([attr, key]) => {
        if (attr && key) {
          const translation = this.t(key.trim(), page);
          element.setAttribute(attr.trim(), translation);
        }
      });
    });

    // Handle HTML content: data-i18n-html (use cautiously)
    const htmlElements = root.querySelectorAll('[data-i18n-html]');

    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      if (!key) return;

      const translation = this.t(key, page);

      // Sanitize HTML before inserting
      element.innerHTML = this.sanitizeHTML(translation);
    });

    // Update meta tags
    this.updateMetaTags(page);

    // Update document lang attribute
    document.documentElement.setAttribute('lang', this.currentLocale);

    // Notify listeners
    this.notifyListeners('translations-applied', { page, locale: this.currentLocale });
  }

  /**
   * Basic HTML sanitization
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   * @private
   */
  sanitizeHTML(html) {
    // Create a temporary element
    const temp = document.createElement('div');
    temp.textContent = html;

    // Allow specific safe HTML tags
    const safeTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'span', 'a'];
    const safeHTML = html.replace(/<(\/?)([\w]+)[^>]*>/g, (match, slash, tag) => {
      return safeTags.includes(tag.toLowerCase()) ? match : '';
    });

    return safeHTML;
  }

  /**
   * Update meta tags with translations
   * @param {string} page - Page namespace
   */
  updateMetaTags(page) {
    // Update page title
    const titleKey = this.t('meta.title', page);
    if (titleKey && titleKey !== 'meta.title') {
      document.title = titleKey;
    }

    // Update meta description
    const descriptionKey = this.t('meta.description', page);
    if (descriptionKey && descriptionKey !== 'meta.description') {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', descriptionKey);
    }

    // Update Open Graph tags
    const ogTitle = this.t('meta.ogTitle', page);
    if (ogTitle && ogTitle !== 'meta.ogTitle') {
      this.updateMetaTag('og:title', ogTitle);
    }

    const ogDescription = this.t('meta.ogDescription', page);
    if (ogDescription && ogDescription !== 'meta.ogDescription') {
      this.updateMetaTag('og:description', ogDescription);
    }
  }

  /**
   * Update a meta tag
   * @param {string} property - Meta property name
   * @param {string} content - Meta content
   * @private
   */
  updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  /**
   * Change locale and reload translations
   * @param {string} locale - New locale code
   * @returns {Promise<void>}
   */
  async setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.warn(`Unsupported locale: ${locale}`);
      return;
    }

    const oldLocale = this.currentLocale;
    this.currentLocale = locale;

    // Save to localStorage
    localStorage.setItem(this.storageKey, locale);

    // Reload common translations
    this.loadedPages.clear();
    await this.loadCommonTranslations();

    // Re-apply translations to current page
    const currentPage = this.detectCurrentPage();
    await this.apply(document.body, currentPage);

    // Notify listeners
    this.notifyListeners('locale-changed', { oldLocale, newLocale: locale });
  }

  /**
   * Detect current page from URL
   * @returns {string} Page name
   */
  detectCurrentPage() {
    const { pathname } = window.location;
    const fileName = pathname.split('/').pop().replace('.html', '') || 'home';
    return fileName === 'index' ? 'home' : fileName;
  }

  /**
   * Get current locale
   * @returns {string} Current locale code
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * Get supported locales
   * @returns {string[]} Array of supported locale codes
   */
  getSupportedLocales() {
    return this.supportedLocales;
  }

  /**
   * Add locale change listener
   * @param {Function} callback - Callback function(event, data)
   */
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
  }

  /**
   * Remove locale change listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('I18n listener error:', error);
      }
    });
  }

  /**
   * Expose i18n globally
   */
  exposeGlobally() {
    window.i18n = this;
    window.t = this.t.bind(this);
    window.setLocale = this.setLocale.bind(this);
  }
}

// Create singleton instance
const i18n = new I18n();

export default i18n;
export { I18n };
