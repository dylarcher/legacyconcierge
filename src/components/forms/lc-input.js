/**
 * Input Component
 * Text input field with validation and states
 * @element lc-input
 * @attr {string} type - Input type (text, email, password, tel, url, number, date, etc.)
 * @attr {string} name - Input name attribute
 * @attr {string} value - Input value
 * @attr {string} label - Label text
 * @attr {string} placeholder - Placeholder text
 * @attr {string} help - Help text below input
 * @attr {string} error - Error message (shows error state)
 * @attr {string} success - Success message (shows success state)
 * @attr {boolean} required - Mark field as required
 * @attr {boolean} disabled - Disable input
 * @attr {boolean} readonly - Make input read-only
 * @attr {string} autocomplete - Autocomplete attribute
 * @attr {string} pattern - Validation pattern (regex)
 * @attr {number} minlength - Minimum length
 * @attr {number} maxlength - Maximum length
 * @attr {number} min - Minimum value (for number/date)
 * @attr {number} max - Maximum value (for number/date)
 * @attr {string} size - Input size (sm, base, lg)
 * @attr {string} icon-left - Left icon name
 * @attr {string} icon-right - Right icon name
 * @fires lc-input-change - Emitted when value changes
 * @fires lc-input-blur - Emitted when input loses focus
 * @fires lc-input-focus - Emitted when input gains focus
 * @fires lc-input-valid - Emitted when input becomes valid
 * @fires lc-input-invalid - Emitted when input becomes invalid
 * @example
 * <lc-input
 *   type="email"
 *   name="email"
 *   label="Email Address"
 *   placeholder="you@example.com"
 *   required
 *   help="We'll never share your email"
 * ></lc-input>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCInput extends BaseComponent {
  static get observedAttributes() {
    return [
      'type',
      'name',
      'value',
      'label',
      'placeholder',
      'help',
      'error',
      'success',
      'required',
      'disabled',
      'readonly',
      'autocomplete',
      'pattern',
      'minlength',
      'maxlength',
      'min',
      'max',
      'size',
      'icon-left',
      'icon-right'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.validationEnabled = false; // Enable after first blur
    this.inputId = `lc-input-${Math.random().toString(36).substr(2, 9)}`;
  }

  async render() {
    const type = this.getAttr('type', 'text');
    const name = this.getAttr('name', '');
    const value = this.getAttr('value', '');
    const label = this.getAttr('label');
    const placeholder = this.getAttr('placeholder', '');
    const help = this.getAttr('help');
    const error = this.getAttr('error');
    const success = this.getAttr('success');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const readonly = this.getBoolAttr('readonly');
    const autocomplete = this.getAttr('autocomplete');
    const pattern = this.getAttr('pattern');
    const minlength = this.getAttr('minlength');
    const maxlength = this.getAttr('maxlength');
    const min = this.getAttr('min');
    const max = this.getAttr('max');
    const size = this.getAttr('size', 'base');
    const iconLeft = this.getAttr('icon-left');
    const iconRight = this.getAttr('icon-right');

    // Determine state
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;
    const state = hasError ? 'error' : hasSuccess ? 'success' : 'default';

    // Build classes
    const wrapperClasses = [
      'lc-input',
      `lc-input--${size}`,
      `lc-input--${state}`
    ];

    if (disabled) wrapperClasses.push('lc-input--disabled');
    if (readonly) wrapperClasses.push('lc-input--readonly');
    if (iconLeft) wrapperClasses.push('lc-input--has-icon-left');
    if (iconRight) wrapperClasses.push('lc-input--has-icon-right');

    // Build HTML
    let html = '';

    // Label
    if (label) {
      html += `
        <label for="${this.inputId}" class="lc-input__label">
          ${this.escapeHtml(label)}
          ${required ? '<span class="lc-input__required" aria-label="required">*</span>' : ''}
        </label>
      `;
    }

    // Input wrapper
    html += '<div class="lc-input__wrapper">';

    // Left icon
    if (iconLeft) {
      html += `
        <span class="lc-input__icon lc-input__icon--left" aria-hidden="true">
          <svg class="lc-input__icon-svg" width="20" height="20">
            <use href="/assets/icons/sprite.svg#${iconLeft}"></use>
          </svg>
        </span>
      `;
    }

    // Input element
    html += `
      <input
        type="${type}"
        id="${this.inputId}"
        class="lc-input__field"
        ${name ? `name="${name}"` : ''}
        ${value ? `value="${this.escapeHtml(value)}"` : ''}
        ${placeholder ? `placeholder="${this.escapeHtml(placeholder)}"` : ''}
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
        ${readonly ? 'readonly' : ''}
        ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
        ${pattern ? `pattern="${pattern}"` : ''}
        ${minlength ? `minlength="${minlength}"` : ''}
        ${maxlength ? `maxlength="${maxlength}"` : ''}
        ${min ? `min="${min}"` : ''}
        ${max ? `max="${max}"` : ''}
        aria-describedby="${this.inputId}-message"
        ${hasError ? 'aria-invalid="true"' : ''}
      >
    `;

    // Right icon
    if (iconRight) {
      html += `
        <span class="lc-input__icon lc-input__icon--right" aria-hidden="true">
          <svg class="lc-input__icon-svg" width="20" height="20">
            <use href="/assets/icons/sprite.svg#${iconRight}"></use>
          </svg>
        </span>
      `;
    }

    html += '</div>'; // Close wrapper

    // Message (help/error/success)
    const message = error || success || help;
    if (message) {
      html += `
        <div
          id="${this.inputId}-message"
          class="lc-input__message lc-input__message--${state}"
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
    const input = this.getInputElement();
    if (!input) return;

    // Input event - real-time validation after first blur
    this.on(input, 'input', (event) => {
      this.updateValue(event.target.value);
      if (this.validationEnabled) {
        this.validate();
      }
      this.emit('lc-input-change', {
        input: this,
        name: this.getAttr('name'),
        value: event.target.value,
        valid: input.validity.valid
      });
    });

    // Blur event - enable validation
    this.on(input, 'blur', (event) => {
      this.validationEnabled = true;
      this.validate();
      this.emit('lc-input-blur', {
        input: this,
        name: this.getAttr('name'),
        value: event.target.value
      });
    });

    // Focus event
    this.on(input, 'focus', (event) => {
      this.emit('lc-input-focus', {
        input: this,
        name: this.getAttr('name'),
        value: event.target.value
      });
    });
  }

  /**
   * Get the input element
   * @returns {HTMLInputElement|null}
   */
  getInputElement() {
    return this.$('.lc-input__field');
  }

  /**
   * Get current value
   * @returns {string}
   */
  getValue() {
    const input = this.getInputElement();
    return input ? input.value : '';
  }

  /**
   * Set value
   * @param {string} value - New value
   */
  setValue(value) {
    this.setAttribute('value', value);
    const input = this.getInputElement();
    if (input) {
      input.value = value;
    }
  }

  /**
   * Update value without re-rendering
   * @param {string} value - New value
   */
  updateValue(value) {
    this.setAttribute('value', value);
  }

  /**
   * Focus the input
   */
  focus() {
    const input = this.getInputElement();
    if (input) input.focus();
  }

  /**
   * Blur the input
   */
  blur() {
    const input = this.getInputElement();
    if (input) input.blur();
  }

  /**
   * Validate the input
   * @returns {boolean} True if valid
   */
  validate() {
    const input = this.getInputElement();
    if (!input) return true;

    const isValid = input.validity.valid;

    if (!isValid) {
      // Get validation message
      let errorMessage = input.validationMessage;

      // Custom validation messages
      if (input.validity.valueMissing) {
        errorMessage = `${this.getAttr('label') || 'This field'} is required`;
      } else if (input.validity.typeMismatch) {
        if (input.type === 'email') {
          errorMessage = 'Please enter a valid email address';
        } else if (input.type === 'url') {
          errorMessage = 'Please enter a valid URL';
        }
      } else if (input.validity.patternMismatch) {
        errorMessage = 'Please match the requested format';
      } else if (input.validity.tooShort) {
        errorMessage = `Please use at least ${input.minLength} characters`;
      } else if (input.validity.tooLong) {
        errorMessage = `Please use no more than ${input.maxLength} characters`;
      } else if (input.validity.rangeUnderflow) {
        errorMessage = `Value must be at least ${input.min}`;
      } else if (input.validity.rangeOverflow) {
        errorMessage = `Value must be no more than ${input.max}`;
      }

      this.setError(errorMessage);
      this.emit('lc-input-invalid', {
        input: this,
        name: this.getAttr('name'),
        value: input.value,
        validity: input.validity
      });
    } else {
      this.clearError();
      this.emit('lc-input-valid', {
        input: this,
        name: this.getAttr('name'),
        value: input.value
      });
    }

    return isValid;
  }

  /**
   * Set error message
   * @param {string} message - Error message
   */
  setError(message) {
    this.setAttribute('error', message);
    this.removeAttribute('success');
  }

  /**
   * Set success message
   * @param {string} message - Success message
   */
  setSuccess(message) {
    this.setAttribute('success', message);
    this.removeAttribute('error');
  }

  /**
   * Clear error and success states
   */
  clearError() {
    this.removeAttribute('error');
    this.removeAttribute('success');
  }

  /**
   * Check if input is valid
   * @returns {boolean}
   */
  isValid() {
    const input = this.getInputElement();
    return input ? input.validity.valid : true;
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
    if (this._initialized && name !== 'value') {
      this.rerender();
    } else if (name === 'value' && this._initialized) {
      // Update input value without re-rendering
      const input = this.getInputElement();
      if (input && input.value !== newValue) {
        input.value = newValue;
      }
    }
  }

  applyStyles() {
    if (document.getElementById('lc-input-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-input-styles';
    style.textContent = `
      .lc-input {
        display: block;
        margin-bottom: var(--form-field-spacing);
      }

      .lc-input__label {
        display: block;
        font-family: var(--font-family-sans);
        font-size: var(--form-label-font-size);
        font-weight: var(--form-label-font-weight);
        color: var(--form-label-color);
        margin-bottom: var(--space-2);
      }

      .lc-input__required {
        color: var(--form-error-color);
        margin-left: var(--space-1);
      }

      .lc-input__wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .lc-input__field {
        flex: 1;
        width: 100%;
        font-family: var(--font-family-sans);
        font-size: var(--form-input-font-size);
        line-height: var(--form-input-line-height);
        color: var(--form-input-color);
        background: var(--form-input-bg);
        border: var(--form-input-border-width) solid var(--form-input-border-color);
        border-radius: var(--form-input-radius);
        padding: var(--form-input-padding-y) var(--form-input-padding-x);
        transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        min-height: 44px; /* WCAG touch target */
      }

      .lc-input__field::placeholder {
        color: var(--form-input-placeholder-color);
        opacity: 1;
      }

      .lc-input__field:hover:not(:disabled):not(:focus) {
        border-color: var(--form-input-border-hover-color);
      }

      .lc-input__field:focus {
        outline: none;
        border-color: var(--form-input-border-focus-color);
        box-shadow: var(--form-input-focus-shadow);
      }

      .lc-input__field:disabled {
        background: var(--form-input-disabled-bg);
        color: var(--form-input-disabled-color);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .lc-input__field:readonly {
        background: var(--form-input-readonly-bg);
        cursor: default;
      }

      /* Sizes */
      .lc-input--sm .lc-input__field {
        padding: var(--form-input-padding-y-sm) var(--form-input-padding-x-sm);
        font-size: var(--font-size-sm);
        min-height: 36px;
      }

      .lc-input--lg .lc-input__field {
        padding: var(--form-input-padding-y-lg) var(--form-input-padding-x-lg);
        font-size: var(--font-size-lg);
        min-height: 52px;
      }

      /* States */
      .lc-input--error .lc-input__field {
        border-color: var(--form-error-color);
      }

      .lc-input--error .lc-input__field:focus {
        border-color: var(--form-error-color);
        box-shadow: 0 0 0 3px rgba(var(--form-error-color-rgb), 0.1);
      }

      .lc-input--success .lc-input__field {
        border-color: var(--form-success-color);
      }

      .lc-input--success .lc-input__field:focus {
        border-color: var(--form-success-color);
        box-shadow: 0 0 0 3px rgba(var(--form-success-color-rgb), 0.1);
      }

      /* Icons */
      .lc-input__icon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        color: var(--text-muted);
      }

      .lc-input__icon--left {
        left: var(--space-3);
      }

      .lc-input__icon--right {
        right: var(--space-3);
      }

      .lc-input--has-icon-left .lc-input__field {
        padding-left: var(--space-10);
      }

      .lc-input--has-icon-right .lc-input__field {
        padding-right: var(--space-10);
      }

      .lc-input__icon-svg {
        width: 20px;
        height: 20px;
      }

      /* Message */
      .lc-input__message {
        display: block;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
        line-height: 1.4;
      }

      .lc-input__message--default {
        color: var(--text-secondary);
      }

      .lc-input__message--error {
        color: var(--form-error-color);
      }

      .lc-input__message--success {
        color: var(--form-success-color);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-input__field {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-input', LCInput);
export default LCInput;
