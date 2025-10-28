/**
 * Button Component
 * Accessible, themeable button with multiple variants
 * @element lc-button
 * @attr {string} variant - Button style (primary|secondary|outline|ghost)
 * @attr {string} size - Button size (sm|base|lg)
 * @attr {boolean} disabled - Disabled state
 * @attr {string} href - Optional link URL (renders as <a>)
 * @attr {string} type - Button type (button|submit|reset)
 * @fires lc-button-click - Emitted when button is clicked
 * @example
 * <lc-button variant="primary" size="lg">Click me</lc-button>
 * <lc-button variant="outline" href="/contact">Contact Us</lc-button>
 */

import Component from '../base/Component.js';

class LCButton extends Component {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'href', 'type'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    // Get attributes
    const variant = this.getAttr('variant', 'primary');
    const size = this.getAttr('size', 'base');
    const disabled = this.getBoolAttr('disabled');
    const href = this.getAttr('href');
    const type = this.getAttr('type', 'button');

    // Determine if we're rendering a link or button
    const isLink = !!href;

    // Build classes
    const classes = [
      'lc-button',
      `lc-button--${variant}`,
      `lc-button--${size}`
    ];

    if (disabled) {
      classes.push('lc-button--disabled');
    }

    // Create button element
    const button = isLink ? document.createElement('a') : document.createElement('button');

    button.className = classes.join(' ');

    if (isLink) {
      button.href = href;
      if (disabled) {
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('tabindex', '-1');
      }
    } else {
      button.type = type;
      button.disabled = disabled;
    }

    // Copy ARIA attributes from host
    Array.from(this.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });

    // Move content into button
    button.innerHTML = `<span class="lc-button__content">${this.innerHTML}</span>`;

    // Clear host and append button
    this.innerHTML = '';
    this.appendChild(button);

    // Apply styles inline (for no-build approach)
    this.applyStyles();
  }

  setupEventListeners() {
    const button = this.querySelector('.lc-button');

    if (button) {
      this.on(button, 'click', (event) => {
        if (this.getBoolAttr('disabled')) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        this.emit('lc-button-click', {
          button: this,
          originalEvent: event
        });
      });
    }
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  /**
   * Apply component styles
   * In production, these would be in a separate CSS file
   */
  applyStyles() {
    if (document.getElementById('lc-button-styles')) {
      return; // Styles already injected
    }

    const style = document.createElement('style');
    style.id = 'lc-button-styles';
    style.textContent = `
      .lc-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--button-padding-y) var(--button-padding-x);
        font-family: var(--font-family-accent);
        font-size: var(--button-font-size);
        font-weight: var(--button-font-weight);
        line-height: 1;
        text-align: center;
        text-decoration: none;
        border: none;
        border-radius: var(--button-radius);
        cursor: pointer;
        transition: var(--button-transition);
        min-height: 44px; /* WCAG AAA touch target */
        min-width: 44px;
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .lc-button:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      /* Variants */
      .lc-button--primary {
        background: var(--button-primary-bg);
        color: var(--button-primary-text);
      }

      .lc-button--primary:hover:not(.lc-button--disabled) {
        background: var(--button-primary-hover);
      }

      .lc-button--primary:active:not(.lc-button--disabled) {
        background: var(--button-primary-active);
      }

      .lc-button--secondary {
        background: var(--button-secondary-bg);
        color: var(--button-secondary-text);
      }

      .lc-button--secondary:hover:not(.lc-button--disabled) {
        background: var(--button-secondary-hover);
      }

      .lc-button--secondary:active:not(.lc-button--disabled) {
        background: var(--button-secondary-active);
      }

      .lc-button--outline {
        background: transparent;
        color: var(--button-outline-text);
        border: 2px solid var(--button-outline-border);
      }

      .lc-button--outline:hover:not(.lc-button--disabled) {
        background: var(--button-outline-hover-bg);
      }

      .lc-button--ghost {
        background: transparent;
        color: var(--button-ghost-text);
      }

      .lc-button--ghost:hover:not(.lc-button--disabled) {
        background: var(--button-ghost-hover-bg);
      }

      /* Sizes */
      .lc-button--sm {
        padding: var(--button-padding-y-sm) var(--button-padding-x-sm);
        font-size: var(--button-font-size-sm);
      }

      .lc-button--lg {
        padding: var(--button-padding-y-lg) var(--button-padding-x-lg);
        font-size: var(--button-font-size-lg);
      }

      /* Disabled state */
      .lc-button--disabled,
      .lc-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      .lc-button__content {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-button {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

// Register component
customElements.define('lc-button', LCButton);

export default LCButton;
