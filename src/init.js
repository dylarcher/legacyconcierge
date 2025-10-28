/**
 * Progressive Enhancement Initialization
 * Enhances HTML-first templates with JavaScript functionality
 * This file loads after the DOM is ready and progressively enhances the page
 */

import pathResolver from './utilities/path-resolver.js';
import themeManager from './utilities/theme-manager.js';
import i18n from './utilities/i18n.js';
import AccessibilityManager from './utilities/accessibility.js';
import PerformanceManager from './utilities/performance.js';

/**
 * Component registry for lazy loading
 */
const COMPONENTS = {
  // Base
  'base-component': () => import('./components/base/BaseComponent.js'),

  // Layout
  'lc-layout-single': () => import('./components/layouts/lc-layout-single.js'),
  'lc-layout-two-column': () => import('./components/layouts/lc-layout-two-column.js'),
  'lc-layout-grid': () => import('./components/layouts/lc-layout-grid.js'),
  'lc-hero': () => import('./components/layouts/lc-hero.js'),

  // Atomic
  'lc-button': () => import('./components/atomic/lc-button.js'),
  'lc-card': () => import('./components/atomic/lc-card.js'),
  'lc-icon': () => import('./components/atomic/lc-icon.js'),
  'lc-image': () => import('./components/atomic/lc-image.js'),
  'lc-video': () => import('./components/atomic/lc-video.js'),

  // Forms
  'lc-input': () => import('./components/forms/lc-input.js'),
  'lc-textarea': () => import('./components/forms/lc-textarea.js'),
  'lc-select': () => import('./components/forms/lc-select.js'),
  'lc-checkbox': () => import('./components/forms/lc-checkbox.js'),
  'lc-radio': () => import('./components/forms/lc-radio.js'),
  'lc-form': () => import('./components/forms/lc-form.js'),

  // Navigation
  'lc-header': () => import('./components/navigation/lc-header.js'),
  'lc-footer': () => import('./components/navigation/lc-footer.js'),
  'lc-breadcrumbs': () => import('./components/navigation/lc-breadcrumbs.js'),

  // Composite
  'lc-modal': () => import('./components/composite/lc-modal.js'),
  'lc-tabs': () => import('./components/composite/lc-tabs.js'),
  'lc-accordion': () => import('./components/composite/lc-accordion.js'),
  'lc-slider': () => import('./components/composite/lc-slider.js'),
  'lc-dropdown': () => import('./components/composite/lc-dropdown.js'),
  'lc-lightbox': () => import('./components/composite/lc-lightbox.js'),
};

/**
 * Progressive Enhancement Manager
 */
class ProgressiveEnhancement {
  constructor() {
    this.componentsLoaded = new Set();
    this.initialized = false;
  }

  /**
   * Initialize progressive enhancements
   */
  async init() {
    if (this.initialized) return;

    console.log('[Init] Starting progressive enhancement...');

    // 1. Initialize core utilities
    await this.initUtilities();

    // 2. Reveal JS-only elements
    this.revealJSElements();

    // 3. Load components present on the page
    await this.loadPageComponents();

    // 4. Setup interactive enhancements
    this.setupInteractiveEnhancements();

    // 5. Apply i18n to the page
    await this.applyTranslations();

    this.initialized = true;
    console.log('[Init] Progressive enhancement complete');

    // Emit ready event
    document.dispatchEvent(new CustomEvent('lc:ready', {
      detail: { timestamp: Date.now() }
    }));
  }

  /**
   * Initialize core utilities
   */
  async initUtilities() {
    console.log('[Init] Initializing utilities...');

    // Initialize theme manager
    themeManager.init();

    // Initialize i18n
    const locale = i18n.getLocale();
    console.log(`[Init] Current locale: ${locale}`);

    // Initialize accessibility manager
    if (!window.accessibilityManager) {
      window.accessibilityManager = new AccessibilityManager();
      console.log('[Init] Accessibility manager initialized');
    }

    // Initialize performance manager
    if (!window.performanceManager) {
      window.performanceManager = new PerformanceManager();
      console.log('[Init] Performance manager initialized');
    }

    // Make utilities globally available for convenience
    window.pathResolver = pathResolver;
    window.themeManager = themeManager;
    window.i18n = i18n;
    window.t = i18n.t.bind(i18n);
    window.setLocale = i18n.setLocale.bind(i18n);
    window.setTheme = themeManager.setTheme.bind(themeManager);
    window.toggleTheme = themeManager.toggle.bind(themeManager);
    window.resolvePath = pathResolver.resolve.bind(pathResolver);
    window.resolveAsset = pathResolver.resolveAsset.bind(pathResolver);
    window.announce = window.accessibilityManager.announce.bind(window.accessibilityManager);
    window.debounce = window.performanceManager.debounce.bind(window.performanceManager);
    window.throttle = window.performanceManager.throttle.bind(window.performanceManager);
  }

  /**
   * Reveal elements that require JavaScript
   */
  revealJSElements() {
    console.log('[Init] Revealing JS-only elements...');

    // Remove 'hidden' attribute from elements with 'requires-js' class
    const jsOnlyElements = document.querySelectorAll('.requires-js[hidden]');
    jsOnlyElements.forEach(el => {
      el.removeAttribute('hidden');
    });

    console.log(`[Init] Revealed ${jsOnlyElements.length} JS-only elements`);
  }

  /**
   * Load components that are present on the page
   */
  async loadPageComponents() {
    console.log('[Init] Loading page components...');

    // Find all custom elements on the page
    const customElements = new Set();
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (tagName.startsWith('lc-') && COMPONENTS[tagName]) {
        customElements.add(tagName);
      }
    });

    console.log(`[Init] Found ${customElements.size} component types to load`);

    // Load components in parallel
    const loadPromises = Array.from(customElements).map(tagName =>
      this.loadComponent(tagName)
    );

    await Promise.all(loadPromises);
  }

  /**
   * Load a specific component
   * @param {string} tagName - Component tag name
   */
  async loadComponent(tagName) {
    if (this.componentsLoaded.has(tagName)) {
      return;
    }

    const loader = COMPONENTS[tagName];
    if (!loader) {
      console.warn(`[Init] No loader found for component: ${tagName}`);
      return;
    }

    try {
      console.log(`[Init] Loading component: ${tagName}`);
      await loader();
      this.componentsLoaded.add(tagName);
      console.log(`[Init] Component loaded: ${tagName}`);
    } catch (error) {
      console.error(`[Init] Failed to load component ${tagName}:`, error);
    }
  }

  /**
   * Setup interactive enhancements for semantic HTML
   */
  setupInteractiveEnhancements() {
    console.log('[Init] Setting up interactive enhancements...');

    // Mobile menu toggle
    this.setupMobileMenu();

    // Theme toggle
    this.setupThemeToggle();

    // Language selector
    this.setupLanguageSelector();

    // Smooth scroll for anchor links
    this.setupSmoothScroll();

    // External links (open in new tab with noopener)
    this.setupExternalLinks();

    // Lazy load images
    this.setupLazyLoading();
  }

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const menuToggle = document.querySelector('.site-header__menu-toggle');
    const menu = document.querySelector('.site-header__menu');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('is-open');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    console.log('[Init] Mobile menu toggle enabled');
  }

  /**
   * Setup theme toggle button
   */
  setupThemeToggle() {
    const themeToggle = document.querySelector('.site-header__theme-toggle');
    const themeIcon = document.querySelector('.site-header__theme-icon use');

    if (!themeToggle) return;

    // Update icon based on current theme
    const updateIcon = () => {
      const currentTheme = themeManager.getTheme();
      const iconName = currentTheme === 'dark' ? 'moon' : 'sun';
      if (themeIcon) {
        themeIcon.setAttribute('href', `/assets/icons/sprite.svg#${iconName}`);
      }
      themeToggle.setAttribute('aria-label',
        currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    };

    // Initial update
    updateIcon();

    // Toggle on click
    themeToggle.addEventListener('click', () => {
      themeManager.toggle();
      updateIcon();
    });

    // Listen for theme changes
    themeManager.addListener((event, data) => {
      if (event === 'theme-changed') {
        updateIcon();
      }
    });

    console.log('[Init] Theme toggle enabled');
  }

  /**
   * Setup language selector
   */
  setupLanguageSelector() {
    const languageSelect = document.getElementById('language-select');

    if (!languageSelect) return;

    // Set current locale
    languageSelect.value = i18n.getLocale();

    // Change locale on selection
    languageSelect.addEventListener('change', async (e) => {
      const newLocale = e.target.value;
      console.log(`[Init] Changing locale to: ${newLocale}`);

      try {
        await i18n.setLocale(newLocale);

        // Reload page to apply new translations
        // In a production app, you might want to re-translate the page dynamically
        window.location.reload();
      } catch (error) {
        console.error('[Init] Failed to change locale:', error);
      }
    });

    console.log('[Init] Language selector enabled');
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      console.log('[Init] Smooth scroll disabled (prefers-reduced-motion)');
      return;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });

    console.log('[Init] Smooth scroll enabled');
  }

  /**
   * Setup external links to open in new tab
   */
  setupExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      const url = new URL(link.href);
      if (url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    console.log('[Init] External links configured');
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    // Use native lazy loading where supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    console.log(`[Init] Lazy loading enabled for ${images.length} images`);

    // For browsers without native lazy loading, you could use IntersectionObserver here
  }

  /**
   * Apply translations to the page
   */
  async applyTranslations() {
    // Get page name from meta tag or pathname
    const pageName = document.querySelector('meta[name="page-name"]')?.content ||
      window.location.pathname.split('/').filter(Boolean)[0] || 'home';

    console.log(`[Init] Applying translations for page: ${pageName}`);

    try {
      await i18n.apply(document.body, pageName);
      console.log('[Init] Translations applied');
    } catch (error) {
      console.warn('[Init] Failed to apply translations:', error);
    }
  }
}

/**
 * Initialize when DOM is ready
 */
const enhancer = new ProgressiveEnhancement();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => enhancer.init());
} else {
  enhancer.init();
}

// Export for testing and debugging
export default enhancer;
