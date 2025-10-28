/**
 * Dropdown Menu Component
 * Dropdown menu with keyboard navigation for actions/options
 * @element lc-dropdown
 * @attr {string} placement - Dropdown placement (bottom-start|bottom-end|top-start|top-end) default: bottom-start
 * @attr {string} trigger - Trigger type (click|hover) default: click
 * @attr {string} items - JSON array of menu items [{label, icon, href, disabled, divider}]
 * @fires lc-dropdown-open - Emitted when dropdown opens
 * @fires lc-dropdown-close - Emitted when dropdown closes
 * @fires lc-dropdown-select - Emitted when item is selected
 * @example
 * <lc-dropdown
 *   items='[
 *     {"label": "Edit", "icon": "pencil"},
 *     {"label": "Delete", "icon": "trash"},
 *     {"divider": true},
 *     {"label": "Settings", "icon": "cog"}
 *   ]'
 * >
 *   <lc-button slot="trigger">Actions</lc-button>
 * </lc-dropdown>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCDropdown extends BaseComponent {
  static get observedAttributes() {
    return ['placement', 'trigger', 'items'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.dropdownId = `lc-dropdown-${Math.random().toString(36).substr(2, 9)}`;
    this.isOpen = false;
    this.focusedIndex = -1;
  }

  async render() {
    const placement = this.getAttr('placement', 'bottom-start');
    const trigger = this.getAttr('trigger', 'click');
    const items = this.getJsonAttr('items', []);

    // Extract trigger slot
    const triggerSlot = this.querySelector('[slot="trigger"]');

    if (!triggerSlot) {
      console.warn('lc-dropdown: trigger slot is required');
      return;
    }

    // Build classes
    const wrapperClasses = [
      'lc-dropdown',
      `lc-dropdown--${placement}`
    ];

    if (this.isOpen) wrapperClasses.push('lc-dropdown--open');

    // Build HTML
    let html = `
      <div class="lc-dropdown__trigger">
        ${triggerSlot.outerHTML}
      </div>

      <div
        class="lc-dropdown__menu"
        role="menu"
        aria-orientation="vertical"
        ${!this.isOpen ? 'hidden' : ''}
      >
    `;

    // Build menu items
    items.forEach((item, index) => {
      if (item.divider) {
        html += '<div class="lc-dropdown__divider" role="separator"></div>';
      } else {
        const itemClasses = ['lc-dropdown__item'];
        if (item.disabled) itemClasses.push('lc-dropdown__item--disabled');
        if (index === this.focusedIndex) itemClasses.push('lc-dropdown__item--focused');

        if (item.href) {
          // Link item
          html += `
            <a
              href="${item.href}"
              class="${itemClasses.join(' ')}"
              role="menuitem"
              ${item.disabled ? 'aria-disabled="true" tabindex="-1"' : 'tabindex="0"'}
              data-index="${index}"
            >
              ${item.icon ? `<svg class="lc-dropdown__icon" width="20" height="20"><use href="/assets/icons/sprite.svg#${item.icon}"></use></svg>` : ''}
              <span>${this.escapeHtml(item.label)}</span>
            </a>
          `;
        } else {
          // Button item
          html += `
            <button
              type="button"
              class="${itemClasses.join(' ')}"
              role="menuitem"
              ${item.disabled ? 'disabled aria-disabled="true"' : ''}
              data-index="${index}"
            >
              ${item.icon ? `<svg class="lc-dropdown__icon" width="20" height="20"><use href="/assets/icons/sprite.svg#${item.icon}"></use></svg>` : ''}
              <span>${this.escapeHtml(item.label)}</span>
            </button>
          `;
        }
      }
    });

    html += '</div>'; // Close menu

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const triggerType = this.getAttr('trigger', 'click');
    const triggerElement = this.$('.lc-dropdown__trigger > *');
    const menuItems = this.$$('.lc-dropdown__item:not(.lc-dropdown__item--disabled)');

    if (!triggerElement) return;

    // Trigger events
    if (triggerType === 'click') {
      this.on(triggerElement, 'click', () => {
        this.toggle();
      });
    } else if (triggerType === 'hover') {
      this.on(this, 'mouseenter', () => {
        this.open();
      });

      this.on(this, 'mouseleave', () => {
        this.close();
      });
    }

    // Menu item clicks
    menuItems.forEach((item, index) => {
      this.on(item, 'click', (event) => {
        const items = this.getJsonAttr('items', []);
        const itemData = items.filter(i => !i.divider)[index];

        // Emit select event
        this.emit('lc-dropdown-select', {
          dropdown: this,
          item: itemData,
          index
        });

        // Close dropdown unless it's a link
        if (!item.hasAttribute('href')) {
          this.close();
        }
      });

      this.on(item, 'mouseenter', () => {
        this.focusedIndex = index;
        this.updateFocusedItem();
      });
    });

    // Keyboard navigation
    this.on(document, 'keydown', (event) => {
      if (!this.isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        triggerElement?.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextItem();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusPreviousItem();
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.focusFirstItem();
      } else if (event.key === 'End') {
        event.preventDefault();
        this.focusLastItem();
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (document.activeElement && document.activeElement.classList.contains('lc-dropdown__item')) {
          // Let the native click handle it
          return;
        }
      }
    });

    // Click outside to close
    this.on(document, 'click', (event) => {
      if (!this.contains(event.target)) {
        this.close();
      }
    });
  }

  /**
   * Open dropdown
   */
  open() {
    this.isOpen = true;
    const wrapper = this.$('.lc-dropdown');
    const menu = this.$('.lc-dropdown__menu');

    if (wrapper) {
      wrapper.classList.add('lc-dropdown--open');
    }

    if (menu) {
      menu.removeAttribute('hidden');
    }

    // Focus first item
    this.focusFirstItem();

    this.emit('lc-dropdown-open', { dropdown: this });
  }

  /**
   * Close dropdown
   */
  close() {
    this.isOpen = false;
    const wrapper = this.$('.lc-dropdown');
    const menu = this.$('.lc-dropdown__menu');

    if (wrapper) {
      wrapper.classList.remove('lc-dropdown--open');
    }

    if (menu) {
      menu.setAttribute('hidden', '');
    }

    this.focusedIndex = -1;

    this.emit('lc-dropdown-close', { dropdown: this });
  }

  /**
   * Toggle dropdown
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Focus next item
   */
  focusNextItem() {
    const items = this.$$('.lc-dropdown__item:not(.lc-dropdown__item--disabled)');
    if (items.length === 0) return;

    this.focusedIndex = (this.focusedIndex + 1) % items.length;
    this.updateFocusedItem();
    items[this.focusedIndex]?.focus();
  }

  /**
   * Focus previous item
   */
  focusPreviousItem() {
    const items = this.$$('.lc-dropdown__item:not(.lc-dropdown__item--disabled)');
    if (items.length === 0) return;

    this.focusedIndex = this.focusedIndex <= 0 ? items.length - 1 : this.focusedIndex - 1;
    this.updateFocusedItem();
    items[this.focusedIndex]?.focus();
  }

  /**
   * Focus first item
   */
  focusFirstItem() {
    const items = this.$$('.lc-dropdown__item:not(.lc-dropdown__item--disabled)');
    if (items.length === 0) return;

    this.focusedIndex = 0;
    this.updateFocusedItem();
    items[0]?.focus();
  }

  /**
   * Focus last item
   */
  focusLastItem() {
    const items = this.$$('.lc-dropdown__item:not(.lc-dropdown__item--disabled)');
    if (items.length === 0) return;

    this.focusedIndex = items.length - 1;
    this.updateFocusedItem();
    items[this.focusedIndex]?.focus();
  }

  /**
   * Update focused item class
   */
  updateFocusedItem() {
    const items = this.$$('.lc-dropdown__item');
    items.forEach((item, index) => {
      item.classList.toggle('lc-dropdown__item--focused', index === this.focusedIndex);
    });
  }

  /**
   * Escape HTML
   * @param {string} str
   * @returns {string}
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
    this.close();
  }

  applyStyles() {
    if (document.getElementById('lc-dropdown-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-dropdown-styles';
    style.textContent = `
      .lc-dropdown {
        position: relative;
        display: inline-block;
      }

      .lc-dropdown__trigger {
        display: inline-block;
      }

      .lc-dropdown__menu {
        position: absolute;
        z-index: var(--dropdown-z-index);
        min-width: 200px;
        padding: var(--dropdown-padding-y) 0;
        background: var(--dropdown-bg);
        border: 1px solid var(--dropdown-border);
        border-radius: var(--dropdown-radius);
        box-shadow: var(--dropdown-shadow);
        animation: lc-dropdown-slide-in var(--transition-fast) ease-out;
      }

      .lc-dropdown__menu[hidden] {
        display: none;
      }

      /* Placements */
      .lc-dropdown--bottom-start .lc-dropdown__menu {
        top: calc(100% + var(--space-1));
        left: 0;
      }

      .lc-dropdown--bottom-end .lc-dropdown__menu {
        top: calc(100% + var(--space-1));
        right: 0;
      }

      .lc-dropdown--top-start .lc-dropdown__menu {
        bottom: calc(100% + var(--space-1));
        left: 0;
      }

      .lc-dropdown--top-end .lc-dropdown__menu {
        bottom: calc(100% + var(--space-1));
        right: 0;
      }

      /* Menu item */
      .lc-dropdown__item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        width: 100%;
        padding: var(--dropdown-item-padding-y) var(--dropdown-item-padding-x);
        font-family: var(--font-family-sans);
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        text-align: left;
        text-decoration: none;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: background var(--transition-fast);
        white-space: nowrap;
      }

      .lc-dropdown__item:hover:not(.lc-dropdown__item--disabled),
      .lc-dropdown__item--focused {
        background: var(--dropdown-item-hover-bg);
      }

      .lc-dropdown__item:focus {
        outline: none;
        background: var(--dropdown-item-hover-bg);
      }

      .lc-dropdown__item:active:not(.lc-dropdown__item--disabled) {
        background: var(--dropdown-item-active-bg);
      }

      .lc-dropdown__item--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lc-dropdown__icon {
        flex-shrink: 0;
        color: var(--text-secondary);
      }

      .lc-dropdown__divider {
        height: 1px;
        margin: var(--space-1) 0;
        background: var(--border-light);
      }

      /* Animation */
      @keyframes lc-dropdown-slide-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-dropdown__menu {
          animation: none;
        }

        .lc-dropdown__item {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-dropdown', LCDropdown);
export default LCDropdown;
