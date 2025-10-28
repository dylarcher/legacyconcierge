/**
 * Navigation Component
 * Flexible navigation menu with support for nested items
 * @element lc-nav
 * @attr {string} items - JSON array of nav items [{label, href, items, current}]
 * @attr {string} orientation - Navigation orientation (horizontal|vertical)
 * @attr {boolean} mobile - Mobile mode with toggleable menu
 * @fires lc-nav-click - Emitted when nav item is clicked
 * @example
 * <lc-nav
 *   orientation="horizontal"
 *   items='[
 *     {"label": "Home", "href": "/"},
 *     {"label": "About", "href": "/about"},
 *     {"label": "Services", "href": "/services", "items": [
 *       {"label": "Treatment", "href": "/services/treatment"},
 *       {"label": "Expertise", "href": "/services/expertise"}
 *     ]}
 *   ]'
 * ></lc-nav>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCNav extends BaseComponent {
  static get observedAttributes() {
    return ['items', 'orientation', 'mobile'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.openDropdowns = new Set();
  }

  async render() {
    const items = this.getJsonAttr('items', []);
    const orientation = this.getAttr('orientation', 'horizontal');
    const isMobile = this.getBoolAttr('mobile');

    if (items.length === 0) {
      console.warn('lc-nav: items attribute is required');
      return;
    }

    // Build classes
    const classes = [
      'lc-nav',
      `lc-nav--${orientation}`
    ];

    if (isMobile) {
      classes.push('lc-nav--mobile');
    }

    // Build navigation HTML
    const html = this.buildNavList(items, 0);

    // Create wrapper
    const wrapper = document.createElement('nav');
    wrapper.className = classes.join(' ');
    wrapper.setAttribute('aria-label', 'Main navigation');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  /**
   * Build navigation list
   * @param {Array} items - Nav items
   * @param {number} level - Nesting level
   * @returns {string} HTML string
   */
  buildNavList(items, level = 0) {
    let html = `<ul class="lc-nav__list lc-nav__list--level-${level}">`;

    items.forEach((item, index) => {
      const hasChildren = item.items && item.items.length > 0;
      const isCurrent = item.current || false;
      const itemId = `nav-item-${level}-${index}`;

      html += `<li class="lc-nav__item ${isCurrent ? 'lc-nav__item--current' : ''}">`;

      if (hasChildren) {
        // Parent with dropdown
        html += `
          <button
            type="button"
            class="lc-nav__link lc-nav__link--parent"
            aria-expanded="false"
            aria-controls="${itemId}-dropdown"
            data-dropdown="${itemId}"
          >
            <span>${this.escapeHtml(item.label)}</span>
            <svg class="lc-nav__icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="lc-nav__dropdown" id="${itemId}-dropdown">
            ${this.buildNavList(item.items, level + 1)}
          </div>
        `;
      } else {
        // Regular link
        html += `
          <a
            href="${item.href || '#'}"
            class="lc-nav__link"
            ${isCurrent ? 'aria-current="page"' : ''}
          >
            ${this.escapeHtml(item.label)}
          </a>
        `;
      }

      html += '</li>';
    });

    html += '</ul>';

    return html;
  }

  setupEventListeners() {
    // Handle regular links
    const links = this.$$('.lc-nav__link:not(.lc-nav__link--parent)');
    links.forEach(link => {
      this.on(link, 'click', (event) => {
        this.emit('lc-nav-click', {
          nav: this,
          href: link.href,
          label: link.textContent.trim(),
          originalEvent: event
        });
      });
    });

    // Handle dropdown toggles
    const dropdownToggles = this.$$('.lc-nav__link--parent');
    dropdownToggles.forEach(toggle => {
      this.on(toggle, 'click', (event) => {
        event.preventDefault();
        this.toggleDropdown(toggle);
      });

      // Keyboard support
      this.on(toggle, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.toggleDropdown(toggle);
        } else if (event.key === 'Escape') {
          this.closeDropdown(toggle);
        }
      });
    });

    // Close dropdowns when clicking outside
    this.on(document, 'click', (event) => {
      if (!this.contains(event.target)) {
        this.closeAllDropdowns();
      }
    });
  }

  /**
   * Toggle dropdown menu
   * @param {HTMLElement} toggle - Toggle button
   */
  toggleDropdown(toggle) {
    const dropdownId = toggle.dataset.dropdown;
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      this.closeDropdown(toggle);
    } else {
      // Close other dropdowns first (only one open at a time)
      this.closeAllDropdowns();
      this.openDropdown(toggle);
    }
  }

  /**
   * Open dropdown
   * @param {HTMLElement} toggle - Toggle button
   */
  openDropdown(toggle) {
    const dropdownId = toggle.dataset.dropdown;
    const dropdown = this.$(`#${dropdownId}-dropdown`);

    if (dropdown) {
      toggle.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('lc-nav__dropdown--open');
      this.openDropdowns.add(dropdownId);
    }
  }

  /**
   * Close dropdown
   * @param {HTMLElement} toggle - Toggle button
   */
  closeDropdown(toggle) {
    const dropdownId = toggle.dataset.dropdown;
    const dropdown = this.$(`#${dropdownId}-dropdown`);

    if (dropdown) {
      toggle.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('lc-nav__dropdown--open');
      this.openDropdowns.delete(dropdownId);
    }
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    const toggles = this.$$('.lc-nav__link--parent');
    toggles.forEach(toggle => this.closeDropdown(toggle));
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

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  onDisconnected() {
    this.closeAllDropdowns();
  }

  applyStyles() {
    if (document.getElementById('lc-nav-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-nav-styles';
    style.textContent = `
      .lc-nav {
        display: block;
      }

      .lc-nav__list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      /* Horizontal orientation */
      .lc-nav--horizontal .lc-nav__list--level-0 {
        flex-direction: row;
        align-items: center;
        gap: var(--space-4);
      }

      /* Vertical orientation */
      .lc-nav--vertical .lc-nav__list {
        flex-direction: column;
        align-items: stretch;
      }

      .lc-nav__item {
        position: relative;
      }

      .lc-nav__link {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        color: var(--nav-text);
        text-decoration: none;
        font-family: var(--font-family-accent);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        white-space: nowrap;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: color var(--transition-fast);
        border-radius: var(--radius-base);
        min-height: 44px; /* Touch target */
      }

      .lc-nav__link:hover {
        color: var(--nav-link-hover);
      }

      .lc-nav__link:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-nav__item--current .lc-nav__link {
        color: var(--nav-link-active);
        font-weight: var(--font-weight-semibold);
      }

      .lc-nav__icon {
        flex-shrink: 0;
        transition: transform var(--transition-fast);
      }

      .lc-nav__link--parent[aria-expanded="true"] .lc-nav__icon {
        transform: rotate(180deg);
      }

      /* Dropdown */
      .lc-nav__dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        z-index: var(--z-dropdown);
        min-width: 200px;
        margin-top: var(--space-2);
        padding: var(--space-2) 0;
        background: var(--dropdown-bg);
        border: 1px solid var(--dropdown-border);
        border-radius: var(--dropdown-radius);
        box-shadow: var(--dropdown-shadow);
      }

      .lc-nav__dropdown--open {
        display: block;
      }

      .lc-nav__dropdown .lc-nav__list {
        flex-direction: column;
      }

      .lc-nav__dropdown .lc-nav__link {
        padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
        border-radius: 0;
      }

      .lc-nav__dropdown .lc-nav__link:hover {
        background: var(--dropdown-item-hover-bg);
      }

      /* Mobile mode */
      .lc-nav--mobile .lc-nav__list--level-0 {
        flex-direction: column;
      }

      .lc-nav--mobile .lc-nav__dropdown {
        position: static;
        margin-top: 0;
        margin-left: var(--space-4);
        border: none;
        box-shadow: none;
        padding: var(--space-1) 0;
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-nav__link,
        .lc-nav__icon {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-nav', LCNav);
export default LCNav;
