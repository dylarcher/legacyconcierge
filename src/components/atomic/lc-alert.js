/**
 * Alert Component
 * Alert/notification component for displaying important messages
 * @element lc-alert
 * @attr {string} variant - Alert type (info|success|warning|error)
 * @attr {string} title - Alert title
 * @attr {boolean} dismissible - Show close button
 * @attr {boolean} icon - Show icon
 * @attr {string} role - ARIA role (alert|status|log) - defaults based on variant
 * @fires lc-alert-dismiss - Emitted when alert is dismissed
 * @slot default - Alert message content
 * @slot actions - Alert action buttons
 * @example
 * <lc-alert variant="success" title="Success!" dismissible>
 *   Your changes have been saved.
 * </lc-alert>
 * <lc-alert variant="error" icon>
 *   <div slot="actions">
 *     <button>Retry</button>
 *   </div>
 *   An error occurred.
 * </lc-alert>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCAlert extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'title', 'dismissible', 'icon', 'role'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const variant = this.getAttr('variant', 'info');
    const title = this.getAttr('title');
    const dismissible = this.getBoolAttr('dismissible');
    const showIcon = this.getBoolAttr('icon');
    const ariaRole = this.getAttr('role') || this.getDefaultRole(variant);

    // Build classes
    const classes = [
      'lc-alert',
      `lc-alert--${variant}`
    ];

    if (dismissible) classes.push('lc-alert--dismissible');

    // Extract content
    const actionsContent = this.querySelector('[slot="actions"]');
    const defaultContent = Array.from(this.childNodes)
      .filter(node => !node.slot)
      .map(node => node.cloneNode(true));

    // Build alert HTML
    let html = '';

    // Icon
    if (showIcon) {
      const iconSvg = this.getIconForVariant(variant);
      html += `<div class="lc-alert__icon" aria-hidden="true">${iconSvg}</div>`;
    }

    // Content wrapper
    html += '<div class="lc-alert__content">';

    // Title
    if (title) {
      html += `<div class="lc-alert__title">${title}</div>`;
    }

    // Message
    html += '<div class="lc-alert__message">';
    const tempDiv = document.createElement('div');
    defaultContent.forEach(node => tempDiv.appendChild(node));
    html += tempDiv.innerHTML;
    html += '</div>';

    // Actions
    if (actionsContent) {
      html += `<div class="lc-alert__actions">${actionsContent.innerHTML}</div>`;
    }

    html += '</div>'; // Close content wrapper

    // Dismiss button
    if (dismissible) {
      html += `
        <button
          type="button"
          class="lc-alert__dismiss"
          aria-label="Dismiss alert"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      `;
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');
    wrapper.setAttribute('role', ariaRole);

    // For error/warning, make it assertive
    if (variant === 'error' || variant === 'warning') {
      wrapper.setAttribute('aria-live', 'assertive');
    } else {
      wrapper.setAttribute('aria-live', 'polite');
    }

    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const dismissBtn = this.querySelector('.lc-alert__dismiss');

    if (dismissBtn) {
      this.on(dismissBtn, 'click', () => {
        this.dismissAlert();
      });
    }
  }

  /**
   * Get default ARIA role based on variant
   * @param {string} variant - Alert variant
   * @returns {string} ARIA role
   */
  getDefaultRole(variant) {
    switch (variant) {
      case 'error':
      case 'warning':
        return 'alert';
      case 'success':
        return 'status';
      default:
        return 'status';
    }
  }

  /**
   * Get icon SVG for variant
   * @param {string} variant - Alert variant
   * @returns {string} SVG markup
   */
  getIconForVariant(variant) {
    const icons = {
      info: `
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
        </svg>
      `,
      success: `
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
      `,
      warning: `
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      `,
      error: `
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
      `
    };

    return icons[variant] || icons.info;
  }

  /**
   * Dismiss the alert
   */
  dismissAlert() {
    // Add dismiss animation
    const alert = this.querySelector('.lc-alert');
    if (alert) {
      alert.style.animation = 'lc-alert-dismiss 200ms ease-out forwards';

      // Wait for animation to complete
      setTimeout(() => {
        this.emit('lc-alert-dismiss', { alert: this });
        this.remove();
      }, 200);
    }
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-alert-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-alert-styles';
    style.textContent = `
      .lc-alert {
        display: flex;
        gap: var(--space-3);
        padding: var(--alert-padding);
        border-radius: var(--alert-radius);
        border-width: var(--alert-border-width);
        border-style: solid;
      }

      /* Variants */
      .lc-alert--info {
        background: var(--alert-info-bg);
        border-color: var(--alert-info-border);
        color: var(--alert-info-text);
      }

      .lc-alert--success {
        background: var(--alert-success-bg);
        border-color: var(--alert-success-border);
        color: var(--alert-success-text);
      }

      .lc-alert--warning {
        background: var(--alert-warning-bg);
        border-color: var(--alert-warning-border);
        color: var(--alert-warning-text);
      }

      .lc-alert--error {
        background: var(--alert-error-bg);
        border-color: var(--alert-error-border);
        color: var(--alert-error-text);
      }

      /* Icon */
      .lc-alert__icon {
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        padding-top: 2px;
      }

      /* Content */
      .lc-alert__content {
        flex: 1;
        min-width: 0;
      }

      .lc-alert__title {
        font-weight: var(--font-weight-semibold);
        margin-bottom: var(--space-1);
      }

      .lc-alert__message {
        font-size: var(--font-size-sm);
        line-height: var(--line-height-relaxed);
      }

      .lc-alert__message > * {
        margin: 0;
      }

      .lc-alert__message > * + * {
        margin-top: var(--space-2);
      }

      /* Actions */
      .lc-alert__actions {
        display: flex;
        gap: var(--space-2);
        margin-top: var(--space-3);
      }

      /* Dismiss button */
      .lc-alert__dismiss {
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        color: currentColor;
        opacity: 0.7;
        cursor: pointer;
        transition: opacity var(--transition-fast);
        border-radius: var(--radius-sm);
      }

      .lc-alert__dismiss:hover {
        opacity: 1;
      }

      .lc-alert__dismiss:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }

      .lc-alert--dismissible {
        padding-right: var(--space-3);
      }

      /* Dismiss animation */
      @keyframes lc-alert-dismiss {
        from {
          opacity: 1;
          transform: scaleY(1);
          max-height: 500px;
        }
        to {
          opacity: 0;
          transform: scaleY(0);
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin-top: 0;
          margin-bottom: 0;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        @keyframes lc-alert-dismiss {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-alert', LCAlert);
export default LCAlert;
