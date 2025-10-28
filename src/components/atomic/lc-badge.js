/**
 * Badge Component
 * Small label/tag for categorization and status indication
 * @element lc-badge
 * @attr {string} variant - Badge style (default|primary|secondary|success|warning|error|info)
 * @attr {string} size - Badge size (sm|base|lg)
 * @attr {boolean} outline - Use outline style
 * @attr {boolean} dot - Show as status dot only
 * @attr {boolean} pill - Use pill shape (fully rounded)
 * @attr {boolean} removable - Show remove button
 * @fires lc-badge-remove - Emitted when remove button is clicked
 * @slot default - Badge content
 * @example
 * <lc-badge variant="success">Active</lc-badge>
 * <lc-badge variant="primary" pill>New</lc-badge>
 * <lc-badge variant="warning" outline>Pending</lc-badge>
 * <lc-badge variant="error" dot></lc-badge>
 * <lc-badge variant="primary" removable>Tag</lc-badge>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCBadge extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'outline', 'dot', 'pill', 'removable'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const variant = this.getAttr('variant', 'default');
    const size = this.getAttr('size', 'base');
    const outline = this.getBoolAttr('outline');
    const dot = this.getBoolAttr('dot');
    const pill = this.getBoolAttr('pill');
    const removable = this.getBoolAttr('removable');

    // Build classes
    const classes = [
      'lc-badge',
      `lc-badge--${variant}`,
      `lc-badge--${size}`
    ];

    if (outline) classes.push('lc-badge--outline');
    if (dot) classes.push('lc-badge--dot');
    if (pill) classes.push('lc-badge--pill');
    if (removable) classes.push('lc-badge--removable');

    // Store content
    const content = dot ? '' : this.innerHTML;

    // Build badge HTML
    let html = '';

    if (dot) {
      html = '<span class="lc-badge__dot"></span>';
    } else {
      html = `<span class="lc-badge__text">${content}</span>`;

      if (removable) {
        html += `
          <button
            type="button"
            class="lc-badge__remove"
            aria-label="Remove badge"
            tabindex="0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        `;
      }
    }

    // Create wrapper
    const wrapper = document.createElement('span');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const removeBtn = this.querySelector('.lc-badge__remove');

    if (removeBtn) {
      this.on(removeBtn, 'click', (event) => {
        event.stopPropagation();

        this.emit('lc-badge-remove', {
          badge: this
        });

        // Optionally remove the badge from DOM
        // this.remove();
      });
    }
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  /**
   * Remove the badge from DOM
   */
  removeBadge() {
    this.remove();
  }

  applyStyles() {
    if (document.getElementById('lc-badge-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-badge-styles';
    style.textContent = `
      .lc-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: var(--badge-padding-y) var(--badge-padding-x);
        font-family: var(--font-family-sans);
        font-size: var(--badge-font-size);
        font-weight: var(--badge-font-weight);
        line-height: 1;
        border-radius: var(--badge-radius);
        vertical-align: middle;
        white-space: nowrap;
        user-select: none;
      }

      /* Sizes */
      .lc-badge--sm {
        padding: calc(var(--badge-padding-y) * 0.75) calc(var(--badge-padding-x) * 0.75);
        font-size: calc(var(--badge-font-size) * 0.875);
      }

      .lc-badge--lg {
        padding: calc(var(--badge-padding-y) * 1.25) calc(var(--badge-padding-x) * 1.25);
        font-size: calc(var(--badge-font-size) * 1.125);
      }

      /* Pill shape */
      .lc-badge--pill {
        border-radius: var(--radius-full);
      }

      /* Dot variant */
      .lc-badge--dot {
        padding: 0;
        width: 10px;
        height: 10px;
        border-radius: var(--radius-full);
      }

      .lc-badge__dot {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: currentColor;
      }

      /* Variants - Filled */
      .lc-badge--default {
        background: var(--color-neutral-200);
        color: var(--color-neutral-800);
      }

      .lc-badge--primary {
        background: var(--badge-primary-bg);
        color: var(--badge-primary-text);
      }

      .lc-badge--secondary {
        background: var(--badge-secondary-bg);
        color: var(--badge-secondary-text);
      }

      .lc-badge--success {
        background: var(--badge-success-bg);
        color: var(--badge-success-text);
      }

      .lc-badge--warning {
        background: var(--color-warning-100);
        color: var(--color-warning-900);
      }

      .lc-badge--error {
        background: var(--color-error-100);
        color: var(--color-error-900);
      }

      .lc-badge--info {
        background: var(--color-info-100);
        color: var(--color-info-900);
      }

      /* Variants - Outline */
      .lc-badge--outline {
        background: transparent;
        border: 1px solid currentColor;
      }

      .lc-badge--default.lc-badge--outline {
        color: var(--color-neutral-600);
      }

      .lc-badge--primary.lc-badge--outline {
        color: var(--color-primary-600);
      }

      .lc-badge--secondary.lc-badge--outline {
        color: var(--color-secondary-700);
      }

      .lc-badge--success.lc-badge--outline {
        color: var(--color-success-700);
      }

      .lc-badge--warning.lc-badge--outline {
        color: var(--color-warning-700);
      }

      .lc-badge--error.lc-badge--outline {
        color: var(--color-error-700);
      }

      .lc-badge--info.lc-badge--outline {
        color: var(--color-info-700);
      }

      /* Remove button */
      .lc-badge__remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
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

      .lc-badge__remove:hover {
        opacity: 1;
      }

      .lc-badge__remove:focus-visible {
        outline: 1px solid currentColor;
        outline-offset: 1px;
      }

      /* .lc-badge--removable class no longer adds redundant padding-right; spacing is handled by gap */
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-badge', LCBadge);
export default LCBadge;
