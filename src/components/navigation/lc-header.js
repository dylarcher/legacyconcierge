/**
 * Header Component
 * Global site header with logo, navigation, and mobile menu
 * @element lc-header
 * @attr {string} logo - Logo image URL
 * @attr {string} logo-alt - Logo alt text
 * @attr {string} site-name - Site name text
 * @attr {string} nav-items - JSON array of navigation items
 * @attr {boolean} sticky - Make header sticky
 * @attr {boolean} transparent - Transparent header (for hero overlays)
 * @fires lc-header-menu-toggle - Emitted when mobile menu is toggled
 * @slot logo - Custom logo content
 * @slot actions - Header actions (theme toggle, language selector, etc.)
 * @example
 * <lc-header
 *   site-name="Legacy Concierge"
 *   logo="/images/logo.svg"
 *   sticky
 *   nav-items='[
 *     {"label": "Home", "href": "/"},
 *     {"label": "Services", "href": "/services"},
 *     {"label": "About", "href": "/about"}
 *   ]'
 * >
 *   <div slot="actions">
 *     <lc-button size="sm">Contact</lc-button>
 *   </div>
 * </lc-header>
 */

import pathResolver from '../../utils/path-resolver.js';
import Component from '../base/Component.js';

class LCHeader extends Component {
  static get observedAttributes() {
    return ['logo', 'logo-alt', 'site-name', 'nav-items', 'sticky', 'transparent'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.mobileMenuOpen = false;
  }

  async render() {
    const logo = this.getAttr('logo');
    const logoAlt = this.getAttr('logo-alt', 'Logo');
    const siteName = this.getAttr('site-name');
    const navItems = this.getJsonAttr('nav-items', []);
    const sticky = this.getBoolAttr('sticky');
    const transparent = this.getBoolAttr('transparent');

    // Build classes
    const classes = ['lc-header'];

    if (sticky) classes.push('lc-header--sticky');
    if (transparent) classes.push('lc-header--transparent');
    if (this.mobileMenuOpen) classes.push('lc-header--menu-open');

    // Extract slots
    const logoSlot = this.querySelector('[slot="logo"]');
    const actionsSlot = this.querySelector('[slot="actions"]');

    // Build header HTML
    let html = '<div class="lc-header__container">';

    // Logo/Brand section
    html += '<div class="lc-header__brand">';

    if (logoSlot) {
      html += `<a href="/" class="lc-header__logo-link">${logoSlot.innerHTML}</a>`;
    } else if (logo) {
      const logoSrc = pathResolver.resolveAsset(logo);
      html += `
        <a href="/" class="lc-header__logo-link">
          <img src="${logoSrc}" alt="${logoAlt}" class="lc-header__logo-image">
        </a>
      `;
    }

    if (siteName && !logoSlot) {
      html += `<a href="/" class="lc-header__site-name">${this.escapeHtml(siteName)}</a>`;
    }

    html += '</div>'; // Close brand

    // Navigation section (desktop)
    if (navItems.length > 0) {
      html += `
        <div class="lc-header__nav">
          <lc-nav
            orientation="horizontal"
            items='${JSON.stringify(navItems)}'
          ></lc-nav>
        </div>
      `;
    }

    // Actions section
    html += '<div class="lc-header__actions">';

    if (actionsSlot) {
      html += actionsSlot.innerHTML;
    }

    // Mobile menu toggle
    html += `
      <button
        type="button"
        class="lc-header__mobile-toggle"
        aria-label="Toggle mobile menu"
        aria-expanded="${this.mobileMenuOpen}"
        aria-controls="mobile-menu"
      >
        <svg class="lc-header__menu-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
        <svg class="lc-header__close-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    `;

    html += '</div>'; // Close actions

    html += '</div>'; // Close container

    // Mobile menu
    if (navItems.length > 0) {
      html += `
        <div class="lc-header__mobile-menu" id="mobile-menu">
          <lc-nav
            orientation="vertical"
            mobile
            items='${JSON.stringify(navItems)}'
          ></lc-nav>
        </div>
      `;
    }

    // Create wrapper
    const wrapper = document.createElement('header');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const toggle = this.$('.lc-header__mobile-toggle');

    if (toggle) {
      this.on(toggle, 'click', () => {
        this.toggleMobileMenu();
      });
    }

    // Close menu on escape
    this.on(document, 'keydown', (event) => {
      if (event.key === 'Escape' && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu when clicking nav links
    const navLinks = this.$$('.lc-header__mobile-menu a');
    navLinks.forEach(link => {
      this.on(link, 'click', () => {
        this.closeMobileMenu();
      });
    });

    // Handle scroll for sticky header
    if (this.getBoolAttr('sticky')) {
      let _lastScroll = 0;

      this.on(window, 'scroll', () => {
        const currentScroll = window.pageYOffset;
        const header = this.$('.lc-header');

        if (header) {
          if (currentScroll > 100) {
            header.classList.add('lc-header--scrolled');
          } else {
            header.classList.remove('lc-header--scrolled');
          }
        }

        _lastScroll = currentScroll;
      });
    }
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.mobileMenuOpen = true;
    const header = this.$('.lc-header');
    const toggle = this.$('.lc-header__mobile-toggle');

    if (header) {
      header.classList.add('lc-header--menu-open');
    }

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    this.emit('lc-header-menu-toggle', {
      header: this,
      open: true
    });
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.mobileMenuOpen = false;
    const header = this.$('.lc-header');
    const toggle = this.$('.lc-header__mobile-toggle');

    if (header) {
      header.classList.remove('lc-header--menu-open');
    }

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }

    // Restore body scroll
    document.body.style.overflow = '';

    this.emit('lc-header-menu-toggle', {
      header: this,
      open: false
    });
  }

  /**
   * Escape HTML
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  onDisconnected() {
    // Clean up body overflow
    if (this.mobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }

  applyStyles() {
    if (document.getElementById('lc-header-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-header-styles';
    style.textContent = `
      .lc-header {
        position: relative;
        z-index: var(--header-z-index);
        width: 100%;
        background: var(--header-bg);
        color: var(--header-text);
        box-shadow: var(--header-shadow);
        transition: box-shadow var(--transition-base);
      }

      .lc-header--sticky {
        position: sticky;
        top: 0;
      }

      .lc-header--transparent {
        background: transparent;
        box-shadow: none;
      }

      .lc-header--scrolled {
        box-shadow: var(--shadow-md);
      }

      .lc-header--transparent.lc-header--scrolled {
        background: var(--header-bg);
      }

      .lc-header__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-6);
        height: var(--header-height-mobile);
        padding: 0 var(--space-4);
        max-width: var(--container-2xl);
        margin: 0 auto;
      }

      /* Brand section */
      .lc-header__brand {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex-shrink: 0;
      }

      .lc-header__logo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
      }

      .lc-header__logo-image {
        height: 40px;
        width: auto;
      }

      .lc-header__site-name {
        font-family: var(--font-family-serif);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-bold);
        text-decoration: none;
        color: inherit;
        white-space: nowrap;
      }

      .lc-header__site-name:hover {
        color: var(--nav-link-hover);
      }

      /* Navigation */
      .lc-header__nav {
        display: none;
        flex: 1;
        justify-content: center;
      }

      /* Actions */
      .lc-header__actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      /* Mobile toggle */
      .lc-header__mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        border: none;
        background: transparent;
        color: currentColor;
        cursor: pointer;
        border-radius: var(--radius-base);
      }

      .lc-header__mobile-toggle:hover {
        background: var(--bg-surface-secondary);
      }

      .lc-header__mobile-toggle:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-header__menu-icon,
      .lc-header__close-icon {
        width: 24px;
        height: 24px;
      }

      .lc-header__close-icon {
        display: none;
      }

      .lc-header--menu-open .lc-header__menu-icon {
        display: none;
      }

      .lc-header--menu-open .lc-header__close-icon {
        display: block;
      }

      /* Mobile menu */
      .lc-header__mobile-menu {
        display: none;
        position: fixed;
        top: var(--header-height-mobile);
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--nav-mobile-bg);
        overflow-y: auto;
        padding: var(--space-6) var(--space-4);
      }

      .lc-header--menu-open .lc-header__mobile-menu {
        display: block;
      }

      /* Tablet and up */
      @media (min-width: 768px) {
        .lc-header__container {
          height: var(--header-height);
          padding: 0 var(--space-6);
        }

        .lc-header__logo-image {
          height: 48px;
        }

        .lc-header__nav {
          display: flex;
        }

        .lc-header__mobile-toggle {
          display: none;
        }

        .lc-header__mobile-menu {
          display: none !important;
        }
      }

      /* Desktop */
      @media (min-width: 1024px) {
        .lc-header__container {
          padding: 0 var(--space-8);
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-header', LCHeader);
export default LCHeader;
