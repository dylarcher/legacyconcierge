/**
 * Radio Button Component
 * Radio button input with label and group support
 * @element lc-radio
 * @attr {string} name - Radio name attribute (groups radios with same name)
 * @attr {string} value - Radio value
 * @attr {string} label - Label text
 * @attr {string} help - Help text below radio
 * @attr {string} error - Error message (shows error state)
 * @attr {boolean} checked - Radio checked state
 * @attr {boolean} required - Mark field as required
 * @attr {boolean} disabled - Disable radio
 * @attr {string} size - Radio size (sm, base, lg)
 * @fires lc-radio-change - Emitted when checked state changes
 * @example
 * <lc-radio
 *   name="plan"
 *   value="basic"
 *   label="Basic Plan - $9/month"
 *   required
 * ></lc-radio>
 * <lc-radio
 *   name="plan"
 *   value="pro"
 *   label="Pro Plan - $29/month"
 *   checked
 * ></lc-radio>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCRadio extends BaseComponent {
  static get observedAttributes() {
    return [
      'name',
      'value',
      'label',
      'help',
      'error',
      'checked',
      'required',
      'disabled',
      'size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.radioId = `lc-radio-${Math.random().toString(36).substr(2, 9)}`;
  }

  async render() {
    const name = this.getAttr('name', '');
    const value = this.getAttr('value', '');
    const label = this.getAttr('label');
    const help = this.getAttr('help');
    const error = this.getAttr('error');
    const checked = this.getBoolAttr('checked');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const size = this.getAttr('size', 'base');

    // Determine state
    const hasError = !!error;
    const state = hasError ? 'error' : 'default';

    // Build classes
    const wrapperClasses = [
      'lc-radio',
      `lc-radio--${size}`,
      `lc-radio--${state}`
    ];

    if (disabled) wrapperClasses.push('lc-radio--disabled');
    if (checked) wrapperClasses.push('lc-radio--checked');

    // Build HTML
    let html = '<div class="lc-radio__wrapper">';

    // Radio input
    html += `
      <input
        type="radio"
        id="${this.radioId}"
        class="lc-radio__input"
        ${name ? `name="${name}"` : ''}
        ${value ? `value="${this.escapeHtml(value)}"` : ''}
        ${checked ? 'checked' : ''}
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
        aria-describedby="${this.radioId}-message"
        ${hasError ? 'aria-invalid="true"' : ''}
      >
    `;

    // Custom radio visual
    html += `
      <span class="lc-radio__circle" aria-hidden="true">
        <span class="lc-radio__dot"></span>
      </span>
    `;

    // Label
    if (label) {
      html += `
        <label for="${this.radioId}" class="lc-radio__label">
          ${this.escapeHtml(label)}
          ${required ? '<span class="lc-radio__required" aria-label="required">*</span>' : ''}
        </label>
      `;
    }

    html += '</div>'; // Close wrapper

    // Help/Error message
    const message = error || help;
    if (message) {
      html += `
        <div
          id="${this.radioId}-message"
          class="lc-radio__message lc-radio__message--${state}"
          ${hasError ? 'role="alert"' : ''}
        >
          ${this.escapeHtml(message)}
        </div>
      `;
    }

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
    const radio = this.getRadioElement();
    if (!radio) return;

    // Change event
    this.on(radio, 'change', (event) => {
      const checked = event.target.checked;
      this.updateChecked(checked);

      // Update other radios in the same group
      if (checked) {
        this.uncheckOtherRadios();
      }

      this.emit('lc-radio-change', {
        radio: this,
        name: this.getAttr('name'),
        value: this.getAttr('value'),
        checked
      });
    });
  }

  /**
   * Get the radio element
   * @returns {HTMLInputElement|null}
   */
  getRadioElement() {
    return this.$('.lc-radio__input');
  }

  /**
   * Get checked state
   * @returns {boolean}
   */
  isChecked() {
    const radio = this.getRadioElement();
    return radio ? radio.checked : false;
  }

  /**
   * Set checked state
   * @param {boolean} checked - New checked state
   */
  setChecked(checked) {
    if (checked) {
      this.setAttribute('checked', '');
      // Uncheck other radios in the same group
      this.uncheckOtherRadios();
    } else {
      this.removeAttribute('checked');
    }

    const radio = this.getRadioElement();
    if (radio) {
      radio.checked = checked;
    }
  }

  /**
   * Update checked state without re-rendering
   * @param {boolean} checked - New checked state
   */
  updateChecked(checked) {
    if (checked) {
      this.setAttribute('checked', '');
      this.$('.lc-radio')?.classList.add('lc-radio--checked');
    } else {
      this.removeAttribute('checked');
      this.$('.lc-radio')?.classList.remove('lc-radio--checked');
    }
  }

  /**
   * Uncheck other radios in the same group
   */
  uncheckOtherRadios() {
    const name = this.getAttr('name');
    if (!name) return;

    // Find all radios with the same name
    const radios = document.querySelectorAll(`lc-radio[name="${name}"]`);
    radios.forEach(radio => {
      if (radio !== this && radio.hasAttribute('checked')) {
        radio.removeAttribute('checked');
        radio.querySelector('.lc-radio')?.classList.remove('lc-radio--checked');
      }
    });
  }

  /**
   * Set error message
   * @param {string} message - Error message
   */
  setError(message) {
    this.setAttribute('error', message);
  }

  /**
   * Clear error state
   */
  clearError() {
    this.removeAttribute('error');
  }

  /**
   * Check if radio is valid
   * @returns {boolean}
   */
  isValid() {
    const radio = this.getRadioElement();
    if (!radio) return true;

    // If required, at least one radio in the group must be checked
    if (this.getBoolAttr('required')) {
      const name = this.getAttr('name');
      if (name) {
        const radios = document.querySelectorAll(`lc-radio[name="${name}"] input`);
        return Array.from(radios).some(r => r.checked);
      }
    }

    return radio.validity.valid;
  }

  /**
   * Escape HTML
   * @param {string} str - String to escape
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized && name !== 'checked') {
      this.rerender();
    } else if (name === 'checked' && this._initialized) {
      const radio = this.getRadioElement();
      const isChecked = newValue !== null;
      if (radio && radio.checked !== isChecked) {
        radio.checked = isChecked;
        this.updateChecked(isChecked);
      }
    }
  }

  applyStyles() {
    if (document.getElementById('lc-radio-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-radio-styles';
    style.textContent = `
      .lc-radio {
        display: block;
        margin-bottom: var(--form-field-spacing);
      }

      .lc-radio__wrapper {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        position: relative;
        cursor: pointer;
      }

      .lc-radio--disabled .lc-radio__wrapper {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .lc-radio__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }

      .lc-radio__circle {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--form-radio-size);
        height: var(--form-radio-size);
        border: 2px solid var(--form-input-border-color);
        border-radius: 50%;
        background: var(--form-input-bg);
        transition: all var(--transition-fast);
      }

      .lc-radio__wrapper:hover .lc-radio__circle {
        border-color: var(--form-input-border-hover-color);
      }

      .lc-radio__input:focus-visible + .lc-radio__circle {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-radio__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: transparent;
        transition: all var(--transition-fast);
        transform: scale(0);
      }

      /* Checked state */
      .lc-radio--checked .lc-radio__circle {
        border-color: var(--interactive-default);
      }

      .lc-radio--checked .lc-radio__dot {
        background: var(--interactive-default);
        transform: scale(1);
      }

      /* Label */
      .lc-radio__label {
        font-family: var(--font-family-sans);
        font-size: var(--form-label-font-size);
        color: var(--form-label-color);
        cursor: pointer;
        user-select: none;
        padding-top: 2px; /* Align with radio */
      }

      .lc-radio--disabled .lc-radio__label {
        cursor: not-allowed;
      }

      .lc-radio__required {
        color: var(--form-error-color);
        margin-left: var(--space-1);
      }

      /* Sizes */
      .lc-radio--sm .lc-radio__circle {
        width: 16px;
        height: 16px;
      }

      .lc-radio--sm .lc-radio__dot {
        width: 6px;
        height: 6px;
      }

      .lc-radio--sm .lc-radio__label {
        font-size: var(--font-size-sm);
      }

      .lc-radio--lg .lc-radio__circle {
        width: 24px;
        height: 24px;
      }

      .lc-radio--lg .lc-radio__dot {
        width: 10px;
        height: 10px;
      }

      .lc-radio--lg .lc-radio__label {
        font-size: var(--font-size-lg);
      }

      /* Error state */
      .lc-radio--error .lc-radio__circle {
        border-color: var(--form-error-color);
      }

      .lc-radio--error.lc-radio--checked .lc-radio__circle {
        border-color: var(--form-error-color);
      }

      .lc-radio--error.lc-radio--checked .lc-radio__dot {
        background: var(--form-error-color);
      }

      /* Message */
      .lc-radio__message {
        display: block;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
        margin-left: calc(var(--form-radio-size) + var(--space-2));
        line-height: 1.4;
      }

      .lc-radio__message--default {
        color: var(--text-secondary);
      }

      .lc-radio__message--error {
        color: var(--form-error-color);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-radio__circle,
        .lc-radio__dot {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-radio', LCRadio);
export default LCRadio;
