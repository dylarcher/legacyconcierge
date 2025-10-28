/**
 * Textarea Component
 * Multi-line text input with validation and auto-resize
 * @element lc-textarea
 * @attr {string} name - Textarea name attribute
 * @attr {string} value - Textarea value
 * @attr {string} label - Label text
 * @attr {string} placeholder - Placeholder text
 * @attr {string} help - Help text below textarea
 * @attr {string} error - Error message (shows error state)
 * @attr {string} success - Success message (shows success state)
 * @attr {boolean} required - Mark field as required
 * @attr {boolean} disabled - Disable textarea
 * @attr {boolean} readonly - Make textarea read-only
 * @attr {number} rows - Number of visible rows (default: 4)
 * @attr {number} minlength - Minimum length
 * @attr {number} maxlength - Maximum length
 * @attr {boolean} resize - Allow manual resize (default: true)
 * @attr {boolean} auto-resize - Auto-resize height to content
 * @attr {string} size - Textarea size (sm, base, lg)
 * @fires lc-textarea-change - Emitted when value changes
 * @fires lc-textarea-blur - Emitted when textarea loses focus
 * @fires lc-textarea-focus - Emitted when textarea gains focus
 * @fires lc-textarea-valid - Emitted when textarea becomes valid
 * @fires lc-textarea-invalid - Emitted when textarea becomes invalid
 * @example
 * <lc-textarea
 *   name="message"
 *   label="Your Message"
 *   placeholder="Tell us more..."
 *   required
 *   minlength="10"
 *   maxlength="500"
 *   auto-resize
 * ></lc-textarea>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCTextarea extends BaseComponent {
  static get observedAttributes() {
    return [
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
      'rows',
      'minlength',
      'maxlength',
      'resize',
      'auto-resize',
      'size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.validationEnabled = false; // Enable after first blur
    this.textareaId = `lc-textarea-${Math.random().toString(36).substr(2, 9)}`;
  }

  async render() {
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
    const rows = this.getNumAttr('rows', 4);
    const minlength = this.getAttr('minlength');
    const maxlength = this.getAttr('maxlength');
    const resize = this.getBoolAttr('resize') !== false; // Default true
    const autoResize = this.getBoolAttr('auto-resize');
    const size = this.getAttr('size', 'base');

    // Determine state
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;
    const state = hasError ? 'error' : hasSuccess ? 'success' : 'default';

    // Build classes
    const wrapperClasses = [
      'lc-textarea',
      `lc-textarea--${size}`,
      `lc-textarea--${state}`
    ];

    if (disabled) wrapperClasses.push('lc-textarea--disabled');
    if (readonly) wrapperClasses.push('lc-textarea--readonly');
    if (!resize) wrapperClasses.push('lc-textarea--no-resize');
    if (autoResize) wrapperClasses.push('lc-textarea--auto-resize');

    // Build HTML
    let html = '';

    // Label
    if (label) {
      html += `
        <label for="${this.textareaId}" class="lc-textarea__label">
          ${this.escapeHtml(label)}
          ${required ? '<span class="lc-textarea__required" aria-label="required">*</span>' : ''}
        </label>
      `;
    }

    // Character count (if maxlength)
    const showCharCount = !!maxlength;
    if (showCharCount) {
      const currentLength = value.length;
      html += `
        <div class="lc-textarea__header">
          <span class="lc-textarea__char-count" id="${this.textareaId}-count">
            ${currentLength} / ${maxlength}
          </span>
        </div>
      `;
    }

    // Textarea wrapper
    html += '<div class="lc-textarea__wrapper">';

    // Textarea element
    html += `
      <textarea
        id="${this.textareaId}"
        class="lc-textarea__field"
        ${name ? `name="${name}"` : ''}
        ${placeholder ? `placeholder="${this.escapeHtml(placeholder)}"` : ''}
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
        ${readonly ? 'readonly' : ''}
        ${minlength ? `minlength="${minlength}"` : ''}
        ${maxlength ? `maxlength="${maxlength}"` : ''}
        rows="${rows}"
        aria-describedby="${this.textareaId}-message${showCharCount ? ` ${this.textareaId}-count` : ''}"
        ${hasError ? 'aria-invalid="true"' : ''}
      >${this.escapeHtml(value)}</textarea>
    `;

    html += '</div>'; // Close wrapper

    // Message (help/error/success)
    const message = error || success || help;
    if (message) {
      html += `
        <div
          id="${this.textareaId}-message"
          class="lc-textarea__message lc-textarea__message--${state}"
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

    // Apply auto-resize if enabled
    if (autoResize) {
      this.adjustHeight();
    }
  }

  setupEventListeners() {
    const textarea = this.getTextareaElement();
    if (!textarea) return;

    const autoResize = this.getBoolAttr('auto-resize');

    // Input event - real-time validation after first blur
    this.on(textarea, 'input', (event) => {
      this.updateValue(event.target.value);

      // Update character count
      this.updateCharCount();

      // Auto-resize
      if (autoResize) {
        this.adjustHeight();
      }

      // Validate
      if (this.validationEnabled) {
        this.validate();
      }

      this.emit('lc-textarea-change', {
        textarea: this,
        name: this.getAttr('name'),
        value: event.target.value,
        valid: textarea.validity.valid
      });
    });

    // Blur event - enable validation
    this.on(textarea, 'blur', (event) => {
      this.validationEnabled = true;
      this.validate();
      this.emit('lc-textarea-blur', {
        textarea: this,
        name: this.getAttr('name'),
        value: event.target.value
      });
    });

    // Focus event
    this.on(textarea, 'focus', (event) => {
      this.emit('lc-textarea-focus', {
        textarea: this,
        name: this.getAttr('name'),
        value: event.target.value
      });
    });
  }

  /**
   * Get the textarea element
   * @returns {HTMLTextAreaElement|null}
   */
  getTextareaElement() {
    return this.$('.lc-textarea__field');
  }

  /**
   * Get current value
   * @returns {string}
   */
  getValue() {
    const textarea = this.getTextareaElement();
    return textarea ? textarea.value : '';
  }

  /**
   * Set value
   * @param {string} value - New value
   */
  setValue(value) {
    this.setAttribute('value', value);
    const textarea = this.getTextareaElement();
    if (textarea) {
      textarea.value = value;
      this.updateCharCount();
      if (this.getBoolAttr('auto-resize')) {
        this.adjustHeight();
      }
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
   * Update character count display
   */
  updateCharCount() {
    const maxlength = this.getAttr('maxlength');
    if (!maxlength) return;

    const charCount = this.$('.lc-textarea__char-count');
    if (charCount) {
      const currentLength = this.getValue().length;
      charCount.textContent = `${currentLength} / ${maxlength}`;
    }
  }

  /**
   * Adjust height to fit content (auto-resize)
   */
  adjustHeight() {
    const textarea = this.getTextareaElement();
    if (!textarea) return;

    // Reset height to recalculate
    textarea.style.height = 'auto';

    // Set height to scrollHeight
    const newHeight = Math.max(textarea.scrollHeight, 44); // Min 44px
    textarea.style.height = `${newHeight}px`;
  }

  /**
   * Focus the textarea
   */
  focus() {
    const textarea = this.getTextareaElement();
    if (textarea) textarea.focus();
  }

  /**
   * Blur the textarea
   */
  blur() {
    const textarea = this.getTextareaElement();
    if (textarea) textarea.blur();
  }

  /**
   * Validate the textarea
   * @returns {boolean} True if valid
   */
  validate() {
    const textarea = this.getTextareaElement();
    if (!textarea) return true;

    const isValid = textarea.validity.valid;

    if (!isValid) {
      // Get validation message
      let errorMessage = textarea.validationMessage;

      // Custom validation messages
      if (textarea.validity.valueMissing) {
        errorMessage = `${this.getAttr('label') || 'This field'} is required`;
      } else if (textarea.validity.tooShort) {
        errorMessage = `Please use at least ${textarea.minLength} characters`;
      } else if (textarea.validity.tooLong) {
        errorMessage = `Please use no more than ${textarea.maxLength} characters`;
      }

      this.setError(errorMessage);
      this.emit('lc-textarea-invalid', {
        textarea: this,
        name: this.getAttr('name'),
        value: textarea.value,
        validity: textarea.validity
      });
    } else {
      this.clearError();
      this.emit('lc-textarea-valid', {
        textarea: this,
        name: this.getAttr('name'),
        value: textarea.value
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
   * Check if textarea is valid
   * @returns {boolean}
   */
  isValid() {
    const textarea = this.getTextareaElement();
    return textarea ? textarea.validity.valid : true;
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
      // Update textarea value without re-rendering
      const textarea = this.getTextareaElement();
      if (textarea && textarea.value !== newValue) {
        textarea.value = newValue;
        this.updateCharCount();
        if (this.getBoolAttr('auto-resize')) {
          this.adjustHeight();
        }
      }
    }
  }

  applyStyles() {
    if (document.getElementById('lc-textarea-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-textarea-styles';
    style.textContent = `
      .lc-textarea {
        display: block;
        margin-bottom: var(--form-field-spacing);
      }

      .lc-textarea__label {
        display: block;
        font-family: var(--font-family-sans);
        font-size: var(--form-label-font-size);
        font-weight: var(--form-label-font-weight);
        color: var(--form-label-color);
        margin-bottom: var(--space-2);
      }

      .lc-textarea__required {
        color: var(--form-error-color);
        margin-left: var(--space-1);
      }

      .lc-textarea__header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: var(--space-1);
      }

      .lc-textarea__char-count {
        font-size: var(--font-size-xs);
        color: var(--text-muted);
        font-variant-numeric: tabular-nums;
      }

      .lc-textarea__wrapper {
        position: relative;
        display: flex;
      }

      .lc-textarea__field {
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
        resize: vertical;
        min-height: 44px; /* WCAG touch target */
      }

      .lc-textarea__field::placeholder {
        color: var(--form-input-placeholder-color);
        opacity: 1;
      }

      .lc-textarea__field:hover:not(:disabled):not(:focus) {
        border-color: var(--form-input-border-hover-color);
      }

      .lc-textarea__field:focus {
        outline: none;
        border-color: var(--form-input-border-focus-color);
        box-shadow: var(--form-input-focus-shadow);
      }

      .lc-textarea__field:disabled {
        background: var(--form-input-disabled-bg);
        color: var(--form-input-disabled-color);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .lc-textarea__field:readonly {
        background: var(--form-input-readonly-bg);
        cursor: default;
      }

      /* Sizes */
      .lc-textarea--sm .lc-textarea__field {
        padding: var(--form-input-padding-y-sm) var(--form-input-padding-x-sm);
        font-size: var(--font-size-sm);
      }

      .lc-textarea--lg .lc-textarea__field {
        padding: var(--form-input-padding-y-lg) var(--form-input-padding-x-lg);
        font-size: var(--font-size-lg);
      }

      /* States */
      .lc-textarea--error .lc-textarea__field {
        border-color: var(--form-error-color);
      }

      .lc-textarea--error .lc-textarea__field:focus {
        border-color: var(--form-error-color);
        box-shadow: 0 0 0 3px rgba(var(--form-error-color-rgb), 0.1);
      }

      .lc-textarea--success .lc-textarea__field {
        border-color: var(--form-success-color);
      }

      .lc-textarea--success .lc-textarea__field:focus {
        border-color: var(--form-success-color);
        box-shadow: 0 0 0 3px rgba(var(--form-success-color-rgb), 0.1);
      }

      /* No resize */
      .lc-textarea--no-resize .lc-textarea__field {
        resize: none;
      }

      /* Auto-resize */
      .lc-textarea--auto-resize .lc-textarea__field {
        resize: none;
        overflow: hidden;
      }

      /* Message */
      .lc-textarea__message {
        display: block;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
        line-height: 1.4;
      }

      .lc-textarea__message--default {
        color: var(--text-secondary);
      }

      .lc-textarea__message--error {
        color: var(--form-error-color);
      }

      .lc-textarea__message--success {
        color: var(--form-success-color);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-textarea__field {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-textarea', LCTextarea);
export default LCTextarea;
