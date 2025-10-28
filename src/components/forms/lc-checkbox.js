/**
 * Checkbox Component
 * Checkbox input with label and group support
 * @element lc-checkbox
 * @attr {string} name - Checkbox name attribute
 * @attr {string} value - Checkbox value
 * @attr {string} label - Label text
 * @attr {string} help - Help text below checkbox
 * @attr {string} error - Error message (shows error state)
 * @attr {boolean} checked - Checkbox checked state
 * @attr {boolean} required - Mark field as required
 * @attr {boolean} disabled - Disable checkbox
 * @attr {boolean} indeterminate - Indeterminate state (for "select all" checkboxes)
 * @attr {string} size - Checkbox size (sm, base, lg)
 * @fires lc-checkbox-change - Emitted when checked state changes
 * @example
 * <lc-checkbox
 *   name="terms"
 *   value="accepted"
 *   label="I accept the terms and conditions"
 *   required
 * ></lc-checkbox>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCCheckbox extends BaseComponent {
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
      'indeterminate',
      'size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.checkboxId = `lc-checkbox-${Math.random().toString(36).substr(2, 9)}`;
  }

  async render() {
    const name = this.getAttr('name', '');
    const value = this.getAttr('value', 'on');
    const label = this.getAttr('label');
    const help = this.getAttr('help');
    const error = this.getAttr('error');
    const checked = this.getBoolAttr('checked');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const indeterminate = this.getBoolAttr('indeterminate');
    const size = this.getAttr('size', 'base');

    // Determine state
    const hasError = !!error;
    const state = hasError ? 'error' : 'default';

    // Build classes
    const wrapperClasses = [
      'lc-checkbox',
      `lc-checkbox--${size}`,
      `lc-checkbox--${state}`
    ];

    if (disabled) wrapperClasses.push('lc-checkbox--disabled');
    if (checked) wrapperClasses.push('lc-checkbox--checked');
    if (indeterminate) wrapperClasses.push('lc-checkbox--indeterminate');

    // Build HTML
    let html = '<div class="lc-checkbox__wrapper">';

    // Checkbox input
    html += `
      <input
        type="checkbox"
        id="${this.checkboxId}"
        class="lc-checkbox__input"
        ${name ? `name="${name}"` : ''}
        ${value ? `value="${this.escapeHtml(value)}"` : ''}
        ${checked ? 'checked' : ''}
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
        aria-describedby="${this.checkboxId}-message"
        ${hasError ? 'aria-invalid="true"' : ''}
      >
    `;

    // Custom checkbox visual
    html += `
      <span class="lc-checkbox__box" aria-hidden="true">
        <svg class="lc-checkbox__icon lc-checkbox__icon--check" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="lc-checkbox__icon lc-checkbox__icon--indeterminate" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
    `;

    // Label
    if (label) {
      html += `
        <label for="${this.checkboxId}" class="lc-checkbox__label">
          ${this.escapeHtml(label)}
          ${required ? '<span class="lc-checkbox__required" aria-label="required">*</span>' : ''}
        </label>
      `;
    }

    html += '</div>'; // Close wrapper

    // Help/Error message
    const message = error || help;
    if (message) {
      html += `
        <div
          id="${this.checkboxId}-message"
          class="lc-checkbox__message lc-checkbox__message--${state}"
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

    // Apply indeterminate state (must be set via JS)
    if (indeterminate) {
      const checkbox = this.getCheckboxElement();
      if (checkbox) {
        checkbox.indeterminate = true;
      }
    }
  }

  setupEventListeners() {
    const checkbox = this.getCheckboxElement();
    if (!checkbox) return;

    // Change event
    this.on(checkbox, 'change', (event) => {
      const checked = event.target.checked;
      this.updateChecked(checked);

      // Clear indeterminate when checked changes
      if (this.getBoolAttr('indeterminate')) {
        this.removeAttribute('indeterminate');
        checkbox.indeterminate = false;
      }

      this.emit('lc-checkbox-change', {
        checkbox: this,
        name: this.getAttr('name'),
        value: this.getAttr('value'),
        checked
      });
    });
  }

  /**
   * Get the checkbox element
   * @returns {HTMLInputElement|null}
   */
  getCheckboxElement() {
    return this.$('.lc-checkbox__input');
  }

  /**
   * Get checked state
   * @returns {boolean}
   */
  isChecked() {
    const checkbox = this.getCheckboxElement();
    return checkbox ? checkbox.checked : false;
  }

  /**
   * Set checked state
   * @param {boolean} checked - New checked state
   */
  setChecked(checked) {
    if (checked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    const checkbox = this.getCheckboxElement();
    if (checkbox) {
      checkbox.checked = checked;
    }

    // Clear indeterminate
    if (this.getBoolAttr('indeterminate')) {
      this.removeAttribute('indeterminate');
      if (checkbox) {
        checkbox.indeterminate = false;
      }
    }
  }

  /**
   * Update checked state without re-rendering
   * @param {boolean} checked - New checked state
   */
  updateChecked(checked) {
    if (checked) {
      this.setAttribute('checked', '');
      this.$('.lc-checkbox')?.classList.add('lc-checkbox--checked');
    } else {
      this.removeAttribute('checked');
      this.$('.lc-checkbox')?.classList.remove('lc-checkbox--checked');
    }
  }

  /**
   * Set indeterminate state
   * @param {boolean} indeterminate - New indeterminate state
   */
  setIndeterminate(indeterminate) {
    if (indeterminate) {
      this.setAttribute('indeterminate', '');
      this.$('.lc-checkbox')?.classList.add('lc-checkbox--indeterminate');
    } else {
      this.removeAttribute('indeterminate');
      this.$('.lc-checkbox')?.classList.remove('lc-checkbox--indeterminate');
    }

    const checkbox = this.getCheckboxElement();
    if (checkbox) {
      checkbox.indeterminate = indeterminate;
    }
  }

  /**
   * Toggle checked state
   */
  toggle() {
    this.setChecked(!this.isChecked());
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
   * Check if checkbox is valid
   * @returns {boolean}
   */
  isValid() {
    const checkbox = this.getCheckboxElement();
    if (!checkbox) return true;

    // If required, must be checked
    if (this.getBoolAttr('required') && !checkbox.checked) {
      return false;
    }

    return checkbox.validity.valid;
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
    if (this._initialized && name !== 'checked' && name !== 'indeterminate') {
      this.rerender();
    } else if (name === 'checked' && this._initialized) {
      const checkbox = this.getCheckboxElement();
      const isChecked = newValue !== null;
      if (checkbox && checkbox.checked !== isChecked) {
        checkbox.checked = isChecked;
        this.updateChecked(isChecked);
      }
    } else if (name === 'indeterminate' && this._initialized) {
      const checkbox = this.getCheckboxElement();
      const isIndeterminate = newValue !== null;
      if (checkbox) {
        checkbox.indeterminate = isIndeterminate;
      }
    }
  }

  applyStyles() {
    if (document.getElementById('lc-checkbox-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-checkbox-styles';
    style.textContent = `
      .lc-checkbox {
        display: block;
        margin-bottom: var(--form-field-spacing);
      }

      .lc-checkbox__wrapper {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        position: relative;
        cursor: pointer;
      }

      .lc-checkbox--disabled .lc-checkbox__wrapper {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .lc-checkbox__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }

      .lc-checkbox__box {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--form-checkbox-size);
        height: var(--form-checkbox-size);
        border: 2px solid var(--form-input-border-color);
        border-radius: var(--form-checkbox-radius);
        background: var(--form-input-bg);
        transition: all var(--transition-fast);
      }

      .lc-checkbox__wrapper:hover .lc-checkbox__box {
        border-color: var(--form-input-border-hover-color);
      }

      .lc-checkbox__input:focus-visible + .lc-checkbox__box {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      /* Checked state */
      .lc-checkbox--checked .lc-checkbox__box {
        background: var(--interactive-default);
        border-color: var(--interactive-default);
      }

      .lc-checkbox__icon {
        width: 16px;
        height: 16px;
        color: white;
        display: none;
      }

      .lc-checkbox--checked .lc-checkbox__icon--check {
        display: block;
      }

      .lc-checkbox--indeterminate .lc-checkbox__box {
        background: var(--interactive-default);
        border-color: var(--interactive-default);
      }

      .lc-checkbox--indeterminate .lc-checkbox__icon--indeterminate {
        display: block;
      }

      /* Label */
      .lc-checkbox__label {
        font-family: var(--font-family-sans);
        font-size: var(--form-label-font-size);
        color: var(--form-label-color);
        cursor: pointer;
        user-select: none;
        padding-top: 2px; /* Align with checkbox */
      }

      .lc-checkbox--disabled .lc-checkbox__label {
        cursor: not-allowed;
      }

      .lc-checkbox__required {
        color: var(--form-error-color);
        margin-left: var(--space-1);
      }

      /* Sizes */
      .lc-checkbox--sm .lc-checkbox__box {
        width: 16px;
        height: 16px;
      }

      .lc-checkbox--sm .lc-checkbox__icon {
        width: 12px;
        height: 12px;
      }

      .lc-checkbox--sm .lc-checkbox__label {
        font-size: var(--font-size-sm);
      }

      .lc-checkbox--lg .lc-checkbox__box {
        width: 24px;
        height: 24px;
      }

      .lc-checkbox--lg .lc-checkbox__icon {
        width: 18px;
        height: 18px;
      }

      .lc-checkbox--lg .lc-checkbox__label {
        font-size: var(--font-size-lg);
      }

      /* Error state */
      .lc-checkbox--error .lc-checkbox__box {
        border-color: var(--form-error-color);
      }

      .lc-checkbox--error.lc-checkbox--checked .lc-checkbox__box {
        background: var(--form-error-color);
        border-color: var(--form-error-color);
      }

      /* Message */
      .lc-checkbox__message {
        display: block;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
        margin-left: calc(var(--form-checkbox-size) + var(--space-2));
        line-height: 1.4;
      }

      .lc-checkbox__message--default {
        color: var(--text-secondary);
      }

      .lc-checkbox__message--error {
        color: var(--form-error-color);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-checkbox__box {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-checkbox', LCCheckbox);
export default LCCheckbox;
