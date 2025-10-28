/**
 * Modal Component
 * Modal dialog with backdrop, animations, and focus trap
 * @element lc-modal
 * @attr {boolean} open - Open/close modal
 * @attr {string} size - Modal size (sm, base, lg, xl, full)
 * @attr {boolean} dismissible - Allow dismissing with backdrop click/Escape (default: true)
 * @attr {boolean} show-close - Show close button (default: true)
 * @attr {string} title - Modal title
 * @fires lc-modal-open - Emitted when modal opens
 * @fires lc-modal-close - Emitted when modal closes
 * @fires lc-modal-dismiss - Emitted when modal is dismissed (backdrop/Escape)
 * @example
 * <lc-modal
 *   id="my-modal"
 *   title="Confirm Action"
 *   size="base"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <div slot="footer">
 *     <lc-button variant="outline">Cancel</lc-button>
 *     <lc-button variant="primary">Confirm</lc-button>
 *   </div>
 * </lc-modal>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCModal extends BaseComponent {
  static get observedAttributes() {
    return ['open', 'size', 'dismissible', 'show-close', 'title'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.modalId = `lc-modal-${Math.random().toString(36).substr(2, 9)}`;
    this.previousFocus = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  async render() {
    const open = this.getBoolAttr('open');
    const size = this.getAttr('size', 'base');
    const dismissible = this.getBoolAttr('dismissible') !== false; // Default true
    const showClose = this.getBoolAttr('show-close') !== false; // Default true
    const title = this.getAttr('title');

    // Extract slotted content
    const content = Array.from(this.children).filter(el => !el.hasAttribute('slot'));
    const footerContent = this.querySelector('[slot="footer"]');

    // Build classes
    const wrapperClasses = ['lc-modal'];
    if (open) wrapperClasses.push('lc-modal--open');

    const dialogClasses = [
      'lc-modal__dialog',
      `lc-modal__dialog--${size}`
    ];

    // Build HTML
    let html = `
      <!-- Backdrop -->
      <div class="lc-modal__backdrop" aria-hidden="true"></div>

      <!-- Dialog -->
      <div
        class="${dialogClasses.join(' ')}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="${this.modalId}-title"
        tabindex="-1"
      >
        <!-- Header -->
        ${title || showClose ? `
          <div class="lc-modal__header">
            ${title ? `<h2 id="${this.modalId}-title" class="lc-modal__title">${this.escapeHtml(title)}</h2>` : ''}
            ${showClose ? `
              <button
                type="button"
                class="lc-modal__close"
                aria-label="Close modal"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            ` : ''}
          </div>
        ` : ''}

        <!-- Body -->
        <div class="lc-modal__body">
          <div class="lc-modal__content"></div>
        </div>

        <!-- Footer -->
        ${footerContent ? `
          <div class="lc-modal__footer">
            ${footerContent.innerHTML}
          </div>
        ` : ''}
      </div>
    `;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Move content into modal body
    const contentContainer = wrapper.querySelector('.lc-modal__content');
    if (contentContainer) {
      content.forEach(node => {
        contentContainer.appendChild(node.cloneNode(true));
      });
    }

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Handle open state
    if (open) {
      this.handleOpen();
    }
  }

  setupEventListeners() {
    const dismissible = this.getBoolAttr('dismissible') !== false;
    const backdrop = this.$('.lc-modal__backdrop');
    const closeButton = this.$('.lc-modal__close');
    const dialog = this.$('.lc-modal__dialog');

    // Close button
    if (closeButton) {
      this.on(closeButton, 'click', () => {
        this.close();
      });
    }

    // Backdrop click
    if (backdrop && dismissible) {
      this.on(backdrop, 'click', () => {
        this.dismiss();
      });
    }

    // Escape key
    if (dismissible) {
      this.on(document, 'keydown', (event) => {
        if (event.key === 'Escape' && this.getBoolAttr('open')) {
          this.dismiss();
        }
      });
    }

    // Focus trap
    if (dialog) {
      this.on(dialog, 'keydown', (event) => {
        if (event.key === 'Tab') {
          this.handleTabKey(event);
        }
      });
    }

    // Prevent scroll on backdrop
    this.on(backdrop, 'wheel', (event) => {
      event.preventDefault();
    }, { passive: false });
  }

  /**
   * Open modal
   */
  open() {
    this.setAttribute('open', '');
  }

  /**
   * Close modal
   */
  close() {
    this.removeAttribute('open');
    this.handleClose();
    this.emit('lc-modal-close', { modal: this });
  }

  /**
   * Dismiss modal (backdrop/Escape)
   */
  dismiss() {
    this.removeAttribute('open');
    this.handleClose();
    this.emit('lc-modal-dismiss', { modal: this });
    this.emit('lc-modal-close', { modal: this });
  }

  /**
   * Handle modal open
   */
  handleOpen() {
    // Save current focus
    this.previousFocus = document.activeElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Setup focus trap
    this.setupFocusTrap();

    // Focus first element or dialog
    setTimeout(() => {
      if (this.firstFocusable) {
        this.firstFocusable.focus();
      } else {
        this.$('.lc-modal__dialog')?.focus();
      }
    }, 100);

    this.emit('lc-modal-open', { modal: this });
  }

  /**
   * Handle modal close
   */
  handleClose() {
    // Restore body scroll
    document.body.style.overflow = '';

    // Restore previous focus
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }

    // Clear focus trap
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  /**
   * Setup focus trap
   */
  setupFocusTrap() {
    const dialog = this.$('.lc-modal__dialog');
    if (!dialog) return;

    // Find all focusable elements
    const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(dialog.querySelectorAll(focusableSelector));

    if (this.focusableElements.length > 0) {
      this.firstFocusable = this.focusableElements[0];
      this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    }
  }

  /**
   * Handle Tab key for focus trap
   * @param {KeyboardEvent} event
   */
  handleTabKey(event) {
    if (this.focusableElements.length === 0) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }

  /**
   * Toggle modal
   */
  toggle() {
    if (this.getBoolAttr('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Check if modal is open
   * @returns {boolean}
   */
  isOpen() {
    return this.getBoolAttr('open');
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
    if (name === 'open' && this._initialized) {
      const isOpen = newValue !== null;
      const wrapper = this.$('.lc-modal');

      if (isOpen) {
        wrapper?.classList.add('lc-modal--open');
        this.handleOpen();
      } else {
        wrapper?.classList.remove('lc-modal--open');
        this.handleClose();
      }
    } else if (this._initialized && name !== 'open') {
      this.rerender();
    }
  }

  onDisconnected() {
    // Clean up body overflow
    if (this.getBoolAttr('open')) {
      document.body.style.overflow = '';
    }
  }

  applyStyles() {
    if (document.getElementById('lc-modal-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-modal-styles';
    style.textContent = `
      .lc-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--modal-z-index);
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
      }

      .lc-modal--open {
        display: flex;
      }

      .lc-modal__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--modal-backdrop);
        animation: lc-modal-fade-in var(--transition-base) ease-out;
      }

      .lc-modal__dialog {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: var(--modal-max-width);
        max-height: calc(100vh - var(--space-8));
        background: var(--modal-bg);
        border-radius: var(--modal-radius);
        box-shadow: var(--modal-shadow);
        display: flex;
        flex-direction: column;
        animation: lc-modal-slide-up var(--transition-base) ease-out;
        overflow: hidden;
      }

      .lc-modal__dialog:focus {
        outline: none;
      }

      /* Sizes */
      .lc-modal__dialog--sm {
        max-width: 400px;
      }

      .lc-modal__dialog--base {
        max-width: 600px;
      }

      .lc-modal__dialog--lg {
        max-width: 800px;
      }

      .lc-modal__dialog--xl {
        max-width: 1200px;
      }

      .lc-modal__dialog--full {
        max-width: calc(100vw - var(--space-8));
        max-height: calc(100vh - var(--space-8));
      }

      /* Header */
      .lc-modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--modal-padding);
        border-bottom: 1px solid var(--border-light);
        flex-shrink: 0;
      }

      .lc-modal__title {
        font-family: var(--font-family-serif);
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0;
      }

      .lc-modal__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: var(--radius-base);
        transition: all var(--transition-fast);
        flex-shrink: 0;
      }

      .lc-modal__close:hover {
        background: var(--bg-surface-secondary);
        color: var(--text-primary);
      }

      .lc-modal__close:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      /* Body */
      .lc-modal__body {
        flex: 1;
        overflow-y: auto;
        padding: var(--modal-padding);
      }

      .lc-modal__content {
        color: var(--text-primary);
        line-height: 1.6;
      }

      /* Footer */
      .lc-modal__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--space-3);
        padding: var(--modal-padding);
        border-top: 1px solid var(--border-light);
        flex-shrink: 0;
      }

      /* Animations */
      @keyframes lc-modal-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes lc-modal-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .lc-modal {
          padding: 0;
        }

        .lc-modal__dialog {
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        .lc-modal__footer {
          flex-direction: column-reverse;
          align-items: stretch;
        }

        .lc-modal__footer > * {
          width: 100%;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-modal__backdrop,
        .lc-modal__dialog {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-modal', LCModal);
export default LCModal;
