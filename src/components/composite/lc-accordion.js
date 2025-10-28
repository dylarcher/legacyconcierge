/**
 * Accordion Component
 * Collapsible content sections with keyboard navigation
 * @element lc-accordion
 * @attr {string} items - JSON array of accordion items [{title, content, open}]
 * @attr {boolean} allow-multiple - Allow multiple panels open (default: false)
 * @attr {string} variant - Accordion variant (default|bordered|filled) default: default
 * @fires lc-accordion-open - Emitted when panel opens
 * @fires lc-accordion-close - Emitted when panel closes
 * @example
 * <lc-accordion
 *   items='[
 *     {"title": "Section 1", "content": "Content 1", "open": true},
 *     {"title": "Section 2", "content": "Content 2"},
 *     {"title": "Section 3", "content": "Content 3"}
 *   ]'
 * ></lc-accordion>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCAccordion extends BaseComponent {
  static get observedAttributes() {
    return ['items', 'allow-multiple', 'variant'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.accordionId = `lc-accordion-${Math.random().toString(36).substring(2, 11)}`;
    this.openPanels = new Set();
  }

  async render() {
    const items = this.getJsonAttr('items', []);
    const allowMultiple = this.getBoolAttr('allow-multiple');
    const variant = this.getAttr('variant', 'default');

    if (items.length === 0) {
      console.warn('lc-accordion: items attribute is required');
      return;
    }

    // Build classes
    const wrapperClasses = [
      'lc-accordion',
      `lc-accordion--${variant}`
    ];

    // Build HTML
    let html = '';

    items.forEach((item, index) => {
      const itemId = `${this.accordionId}-item-${index}`;
      const isOpen = item.open || false;

      if (isOpen) {
        this.openPanels.add(index);
      }

      const itemClasses = ['lc-accordion__item'];
      if (isOpen) itemClasses.push('lc-accordion__item--open');

      html += `
        <div class="${itemClasses.join(' ')}" data-index="${index}">
          <h3 class="lc-accordion__header">
            <button
              type="button"
              class="lc-accordion__trigger"
              aria-expanded="${isOpen}"
              aria-controls="${itemId}-content"
              id="${itemId}-trigger"
            >
              <span class="lc-accordion__title">${this.escapeHtml(item.title)}</span>
              <svg
                class="lc-accordion__icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </h3>
          <div
            id="${itemId}-content"
            class="lc-accordion__panel"
            role="region"
            aria-labelledby="${itemId}-trigger"
            ${!isOpen ? 'hidden' : ''}
          >
            <div class="lc-accordion__content">
              ${item.content}
            </div>
          </div>
        </div>
      `;
    });

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
    const triggers = this.$$('.lc-accordion__trigger');

    triggers.forEach((trigger, index) => {
      // Click
      this.on(trigger, 'click', () => {
        this.togglePanel(index);
      });

      // Keyboard navigation
      this.on(trigger, 'keydown', (event) => {
        this.handleKeyboard(event, index, triggers);
      });
    });
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   * @param {number} currentIndex
   * @param {NodeList} triggers
   */
  handleKeyboard(event, currentIndex, triggers) {
    let targetIndex = currentIndex;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      targetIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      targetIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
    } else if (event.key === 'Home') {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      targetIndex = triggers.length - 1;
    }

    if (targetIndex !== currentIndex && triggers[targetIndex]) {
      triggers[targetIndex].focus();
    }
  }

  /**
   * Toggle panel open/close
   * @param {number} index
   */
  togglePanel(index) {
    const isOpen = this.openPanels.has(index);

    if (isOpen) {
      this.closePanel(index);
    } else {
      this.openPanel(index);
    }
  }

  /**
   * Open panel
   * @param {number} index
   */
  openPanel(index) {
    const allowMultiple = this.getBoolAttr('allow-multiple');

    // Close other panels if not allowing multiple
    if (!allowMultiple) {
      this.closeAllPanels();
    }

    this.openPanels.add(index);

    const item = this.$(`[data-index="${index}"]`);
    const trigger = item?.querySelector('.lc-accordion__trigger');
    const panel = item?.querySelector('.lc-accordion__panel');

    if (item && trigger && panel) {
      item.classList.add('lc-accordion__item--open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');

      // Animate height
      this.animatePanel(panel, true);
    }

    this.emit('lc-accordion-open', {
      accordion: this,
      index
    });
  }

  /**
   * Close panel
   * @param {number} index
   */
  closePanel(index) {
    this.openPanels.delete(index);

    const item = this.$(`[data-index="${index}"]`);
    const trigger = item?.querySelector('.lc-accordion__trigger');
    const panel = item?.querySelector('.lc-accordion__panel');

    if (item && trigger && panel) {
      item.classList.remove('lc-accordion__item--open');
      trigger.setAttribute('aria-expanded', 'false');

      // Animate height then hide
      this.animatePanel(panel, false).then(() => {
        panel.setAttribute('hidden', '');
      });
    }

    this.emit('lc-accordion-close', {
      accordion: this,
      index
    });
  }

  /**
   * Close all panels
   */
  closeAllPanels() {
    Array.from(this.openPanels).forEach(index => {
      this.closePanel(index);
    });
  }

  /**
   * Animate panel
   * @param {HTMLElement} panel
   * @param {boolean} opening
   * @returns {Promise}
   */
  animatePanel(panel, opening) {
    return new Promise(resolve => {
      const content = panel.querySelector('.lc-accordion__content');
      if (!content) {
        resolve();
        return;
      }

      // Check for reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        resolve();
        return;
      }

      const contentHeight = content.scrollHeight;

      if (opening) {
        // Opening animation
        panel.style.height = '0px';
        panel.style.overflow = 'hidden';

        requestAnimationFrame(() => {
          panel.style.transition = `height ${getComputedStyle(panel).getPropertyValue('--transition-base') || '200ms'} ease-out`;
          panel.style.height = `${contentHeight}px`;

          const handleTransitionEnd = () => {
            panel.style.height = '';
            panel.style.overflow = '';
            panel.style.transition = '';
            panel.removeEventListener('transitionend', handleTransitionEnd);
            resolve();
          };

          panel.addEventListener('transitionend', handleTransitionEnd);
        });
      } else {
        // Closing animation
        panel.style.height = `${contentHeight}px`;
        panel.style.overflow = 'hidden';

        requestAnimationFrame(() => {
          panel.style.transition = `height ${getComputedStyle(panel).getPropertyValue('--transition-base') || '200ms'} ease-out`;
          panel.style.height = '0px';

          const handleTransitionEnd = () => {
            panel.style.height = '';
            panel.style.overflow = '';
            panel.style.transition = '';
            panel.removeEventListener('transitionend', handleTransitionEnd);
            resolve();
          };

          panel.addEventListener('transitionend', handleTransitionEnd);
        });
      }
    });
  }

  /**
   * Open all panels
   */
  openAll() {
    const items = this.getJsonAttr('items', []);
    items.forEach((_, index) => {
      this.openPanel(index);
    });
  }

  /**
   * Close all panels
   */
  closeAll() {
    this.closeAllPanels();
  }

  /**
   * Check if panel is open
   * @param {number} index
   * @returns {boolean}
   */
  isOpen(index) {
    return this.openPanels.has(index);
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

  applyStyles() {
    if (document.getElementById('lc-accordion-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-accordion-styles';
    style.textContent = `
      .lc-accordion {
        display: block;
      }

      .lc-accordion__item {
        border-bottom: 1px solid var(--accordion-border);
      }

      .lc-accordion__item:first-child {
        border-top: 1px solid var(--accordion-border);
      }

      /* Bordered variant */
      .lc-accordion--bordered .lc-accordion__item {
        border: 1px solid var(--accordion-border);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-2);
      }

      .lc-accordion--bordered .lc-accordion__item:first-child {
        border-top: 1px solid var(--accordion-border);
      }

      /* Filled variant */
      .lc-accordion--filled .lc-accordion__item {
        background: var(--bg-surface-secondary);
        border: 1px solid var(--accordion-border);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-2);
      }

      .lc-accordion--filled .lc-accordion__item:first-child {
        border-top: 1px solid var(--accordion-border);
      }

      /* Header */
      .lc-accordion__header {
        margin: 0;
      }

      .lc-accordion__trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: var(--accordion-header-padding);
        font-family: var(--font-family-sans);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        text-align: left;
        background: var(--accordion-header-bg);
        border: none;
        cursor: pointer;
        transition: background var(--transition-fast);
        min-height: 44px; /* WCAG touch target */
      }

      .lc-accordion__trigger:hover {
        background: var(--accordion-header-hover-bg);
      }

      .lc-accordion__trigger:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: -2px;
        z-index: 1;
      }

      .lc-accordion__title {
        flex: 1;
      }

      .lc-accordion__icon {
        flex-shrink: 0;
        margin-left: var(--space-2);
        transition: transform var(--accordion-icon-transition);
      }

      .lc-accordion__item--open .lc-accordion__icon {
        transform: rotate(180deg);
      }

      /* Panel */
      .lc-accordion__panel {
        overflow: hidden;
      }

      .lc-accordion__panel[hidden] {
        display: none;
      }

      .lc-accordion__content {
        padding: var(--accordion-content-padding);
        color: var(--text-secondary);
        line-height: 1.6;
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-accordion__trigger,
        .lc-accordion__icon {
          transition: none;
        }

        .lc-accordion__panel {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-accordion', LCAccordion);
export default LCAccordion;
