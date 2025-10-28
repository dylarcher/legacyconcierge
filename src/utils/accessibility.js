/**
 * Accessibility Utilities
 *
 * Comprehensive WCAG 2.2 AAA accessibility features including:
 * - Focus management
 * - Screen reader announcements
 * - Keyboard navigation
 * - Motion preferences
 * - High contrast support
 */

export class AccessibilityManager {
  constructor() {
    this.focusTrap = null;
    this.lastFocusedElement = null;
    this.announcer = null;

    this.init();
  }

  init() {
    this.createScreenReaderAnnouncer();
    this.setupMotionPreferences();
    this.setupFocusManagement();
    this.setupKeyboardShortcuts();
    this.setupSkipLinks();
    this.enhanceFocusIndicators();
  }

  /**
   * Screen Reader Announcements
   * Creates a live region for dynamic content announcements
   */
  createScreenReaderAnnouncer() {
    if (this.announcer) return;

    this.announcer = document.createElement('div');
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.announcer);
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    if (!this.announcer) {
      this.createScreenReaderAnnouncer();
    }

    this.announcer.setAttribute('aria-live', priority);

    // Clear and set content with slight delay to ensure announcement
    this.announcer.textContent = '';
    setTimeout(() => {
      this.announcer.textContent = message;
    }, 100);
  }

  /**
   * Motion Preferences
   * Respects prefers-reduced-motion for animations
   */
  setupMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMotionPreference = (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-motion', 'reduced');
        this.announce('Animations have been reduced based on your system preferences');
      } else {
        document.documentElement.removeAttribute('data-motion');
      }
    };

    // Initial check
    updateMotionPreference(prefersReducedMotion);

    // Listen for changes
    prefersReducedMotion.addEventListener('change', updateMotionPreference);
  }

  /**
   * Focus Management
   * Manages focus for modals and dynamic content
   */
  setupFocusManagement() {
    // Store last focused element when opening modals
    document.addEventListener('modal:open', (e) => {
      this.lastFocusedElement = document.activeElement;
      const modal = e.detail?.element;
      if (modal) {
        this.trapFocus(modal);
        this.focusFirstElement(modal);
      }
    });

    // Restore focus when closing modals
    document.addEventListener('modal:close', () => {
      this.releaseFocusTrap();
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    });

    // Handle dynamic content focus
    document.addEventListener('content:loaded', (e) => {
      const container = e.detail?.element;
      if (container) {
        this.announceContentChange(container);
      }
    });
  }

  /**
   * Trap focus within an element (for modals)
   * @param {HTMLElement} element - Element to trap focus within
   */
  trapFocus(element) {
    const focusableElements = this.getFocusableElements(element);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.focusTrap = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', this.focusTrap);
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap() {
    if (this.focusTrap) {
      document.removeEventListener('keydown', this.focusTrap);
      this.focusTrap = null;
    }
  }

  /**
   * Get all focusable elements within a container
   * @param {HTMLElement} container - Container element
   * @returns {Array} Array of focusable elements
   */
  getFocusableElements(container) {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'audio[controls]',
      'video[controls]',
      '[contenteditable]:not([contenteditable="false"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector));
  }

  /**
   * Focus first focusable element in container
   * @param {HTMLElement} container - Container element
   */
  focusFirstElement(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Announce content changes to screen readers
   * @param {HTMLElement} container - Container with new content
   */
  announceContentChange(container) {
    const heading = container.querySelector('h1, h2, h3');
    if (heading) {
      this.announce(`New content loaded: ${heading.textContent}`);
    } else {
      this.announce('New content has been loaded');
    }
  }

  /**
   * Keyboard Shortcuts
   * Global keyboard shortcuts for common actions
   */
  setupKeyboardShortcuts() {
    const shortcuts = {
      '/': this.focusSearch,
      'Escape': this.closeOverlays,
      'h': () => this.skipToSection('header'),
      'm': () => this.skipToSection('main'),
      'f': () => this.skipToSection('footer')
    };

    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      const shortcut = shortcuts[e.key];
      if (shortcut) {
        e.preventDefault();
        shortcut.call(this);
      }
    });

    // Announce keyboard shortcuts on load
    this.announceKeyboardShortcuts();
  }

  /**
   * Focus search input
   */
  focusSearch() {
    const searchInput = document.querySelector('input[type="search"], input[name="search"]');
    if (searchInput) {
      searchInput.focus();
      this.announce('Search field focused');
    }
  }

  /**
   * Close all overlays (modals, dropdowns, etc.)
   */
  closeOverlays() {
    // Dispatch close events
    document.dispatchEvent(new CustomEvent('overlay:close'));

    // Close modals
    const openModals = document.querySelectorAll('[role="dialog"][open], .modal.is-open');
    openModals.forEach(modal => {
      modal.dispatchEvent(new CustomEvent('close'));
    });

    // Close dropdowns
    const openDropdowns = document.querySelectorAll('.dropdown.is-open');
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('is-open');
    });

    if (openModals.length > 0 || openDropdowns.length > 0) {
      this.announce('Overlay closed');
    }
  }

  /**
   * Skip to section
   * @param {string} section - Section to skip to ('header', 'main', 'footer')
   */
  skipToSection(section) {
    const element = document.querySelector(section);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.announce(`Skipped to ${section}`);
    }
  }

  /**
   * Announce available keyboard shortcuts
   */
  announceKeyboardShortcuts() {
    const shortcuts = [
      'Press / to focus search',
      'Press h to skip to header',
      'Press m to skip to main content',
      'Press f to skip to footer',
      'Press Escape to close overlays'
    ];

    // Add shortcuts info to page
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'sr-only';
    shortcutsInfo.setAttribute('role', 'region');
    shortcutsInfo.setAttribute('aria-label', 'Keyboard shortcuts');
    shortcutsInfo.innerHTML = `
      <h2>Keyboard Shortcuts</h2>
      <ul>
        ${shortcuts.map(s => `<li>${s}</li>`).join('')}
      </ul>
    `;
    document.body.appendChild(shortcutsInfo);
  }

  /**
   * Enhanced Skip Links
   * Ensures skip links are functional and visible on focus
   */
  setupSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link, [href^="#"][class*="skip"]');

    skipLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Remove tabindex after focus
          target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
          }, { once: true });

          this.announce(`Skipped to ${target.getAttribute('aria-label') || targetId}`);
        }
      });
    });
  }

  /**
   * Enhanced Focus Indicators
   * Adds visible focus indicators that meet AAA standards
   */
  enhanceFocusIndicators() {
    // Add focus-visible class for keyboard navigation
    let _isUsingKeyboard = false;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        _isUsingKeyboard = true;
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      _isUsingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    });

    // Add focus within management for containers
    document.querySelectorAll('[role="navigation"], [role="menu"]').forEach(container => {
      container.addEventListener('focusin', () => {
        container.classList.add('has-focus');
      });

      container.addEventListener('focusout', (e) => {
        if (!container.contains(e.relatedTarget)) {
          container.classList.remove('has-focus');
        }
      });
    });
  }

  /**
   * High Contrast Mode Detection
   * Detects and adapts to high contrast mode
   */
  detectHighContrast() {
    const highContrast = window.matchMedia('(prefers-contrast: high)');

    const updateContrast = (e) => {
      if (e.matches) {
        document.documentElement.setAttribute('data-contrast', 'high');
        this.announce('High contrast mode detected');
      } else {
        document.documentElement.removeAttribute('data-contrast');
      }
    };

    updateContrast(highContrast);
    highContrast.addEventListener('change', updateContrast);
  }

  /**
   * Text Spacing Support
   * Ensures content adapts to user text spacing preferences
   */
  ensureTextSpacing() {
    // WCAG 2.2 Level AAA requires supporting:
    // - Line height at least 1.5x font size
    // - Paragraph spacing at least 2x font size
    // - Letter spacing at least 0.12x font size
    // - Word spacing at least 0.16x font size

    const style = document.createElement('style');
    style.textContent = `
      [data-user-spacing="true"] {
        line-height: 1.5 !important;
        letter-spacing: 0.12em !important;
        word-spacing: 0.16em !important;
      }
      [data-user-spacing="true"] p {
        margin-bottom: 2em !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Accessible Names Validation
   * Ensures all interactive elements have accessible names
   */
  validateAccessibleNames() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    const issues = [];

    interactiveElements.forEach(element => {
      const hasAccessibleName =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.textContent.trim() ||
        element.getAttribute('title') ||
        element.getAttribute('alt');

      if (!hasAccessibleName) {
        issues.push(element);
        console.warn('Missing accessible name:', element);
      }
    });

    return issues;
  }

  /**
   * Form Error Handling
   * Enhanced error messages for forms
   */
  enhanceFormErrors() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const invalidElements = form.querySelectorAll(':invalid');

        if (invalidElements.length > 0) {
          e.preventDefault();

          // Focus first invalid element
          invalidElements[0].focus();

          // Announce errors
          const errorCount = invalidElements.length;
          const errorMessage = errorCount === 1
            ? 'There is 1 error in the form. Please review and correct it.'
            : `There are ${errorCount} errors in the form. Please review and correct them.`;

          this.announce(errorMessage, 'assertive');

          // Add error summary if not exists
          this.addErrorSummary(form, invalidElements);
        }
      });

      // Real-time validation feedback
      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('invalid', () => {
          const errorMessage = field.validationMessage || 'This field is required';
          this.announce(errorMessage, 'assertive');
        });

        field.addEventListener('change', () => {
          if (field.validity.valid && field.getAttribute('aria-invalid') === 'true') {
            field.removeAttribute('aria-invalid');
            this.announce(`${field.labels[0]?.textContent || 'Field'} is now valid`);
          }
        });
      });
    });
  }

  /**
   * Add error summary to form
   * @param {HTMLFormElement} form - Form element
   * @param {NodeList} invalidElements - Invalid form elements
   */
  addErrorSummary(form, invalidElements) {
    // Remove existing summary
    const existingSummary = form.querySelector('.form-error-summary');
    if (existingSummary) {
      existingSummary.remove();
    }

    // Create new summary
    const summary = document.createElement('div');
    summary.className = 'form-error-summary';
    summary.setAttribute('role', 'alert');
    summary.setAttribute('aria-atomic', 'true');
    summary.innerHTML = `
      <h2>Please correct the following errors:</h2>
      <ul>
        ${Array.from(invalidElements).map(el => {
          const label = el.labels?.[0]?.textContent || el.name || 'Field';
          const message = el.validationMessage || 'This field is required';
          return `<li><a href="#${el.id}">${label}: ${message}</a></li>`;
        }).join('')}
      </ul>
    `;

    form.insertBefore(summary, form.firstChild);
    summary.querySelector('a')?.focus();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
  });
} else {
  window.accessibilityManager = new AccessibilityManager();
}

// Export for use in other modules
export default AccessibilityManager;
