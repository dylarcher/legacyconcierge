/**
 * Form Component
 * Form container with validation orchestration and submission handling
 * @element lc-form
 * @attr {string} action - Form action URL
 * @attr {string} method - Form method (get, post) default: post
 * @attr {string} encoding - Form encoding type
 * @attr {boolean} validate - Enable client-side validation (default: true)
 * @attr {boolean} prevent-default - Prevent default form submission (for AJAX)
 * @attr {boolean} show-errors - Show validation errors inline (default: true)
 * @attr {string} submit-text - Submit button text (default: "Submit")
 * @attr {string} submit-variant - Submit button variant (primary, secondary, etc.)
 * @fires lc-form-submit - Emitted when form is submitted (after validation)
 * @fires lc-form-valid - Emitted when form becomes valid
 * @fires lc-form-invalid - Emitted when form becomes invalid
 * @fires lc-form-reset - Emitted when form is reset
 * @example
 * <lc-form
 *   action="/api/contact"
 *   method="post"
 *   prevent-default
 *   submit-text="Send Message"
 * >
 *   <lc-input name="name" label="Name" required></lc-input>
 *   <lc-input name="email" type="email" label="Email" required></lc-input>
 *   <lc-textarea name="message" label="Message" required></lc-textarea>
 * </lc-form>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCForm extends BaseComponent {
  static get observedAttributes() {
    return [
      'action',
      'method',
      'encoding',
      'validate',
      'prevent-default',
      'show-errors',
      'submit-text',
      'submit-variant'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.formId = `lc-form-${Math.random().toString(36).substr(2, 9)}`;
    this.isSubmitting = false;
  }

  async render() {
    const action = this.getAttr('action', '');
    const method = this.getAttr('method', 'post');
    const encoding = this.getAttr('encoding');
    const validate = this.getBoolAttr('validate') !== false; // Default true
    const preventDefault = this.getBoolAttr('prevent-default');
    const submitText = this.getAttr('submit-text', 'Submit');
    const submitVariant = this.getAttr('submit-variant', 'primary');

    // Extract form elements from slot
    const formElements = Array.from(this.children);

    // Build HTML
    let html = `
      <form
        id="${this.formId}"
        class="lc-form__form"
        ${action ? `action="${action}"` : ''}
        ${method ? `method="${method}"` : ''}
        ${encoding ? `enctype="${encoding}"` : ''}
        ${!validate ? 'novalidate' : ''}
      >
    `;

    // Form elements (slotted content)
    html += '<div class="lc-form__fields"></div>';

    // Submit button
    html += `
      <div class="lc-form__actions">
        <lc-button
          type="submit"
          variant="${submitVariant}"
          class="lc-form__submit"
          ${this.isSubmitting ? 'loading' : ''}
        >
          ${submitText}
        </lc-button>
      </div>
    `;

    html += '</form>'; // Close form

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'lc-form';
    wrapper.innerHTML = html;

    // Move original form elements into fields container
    const fieldsContainer = wrapper.querySelector('.lc-form__fields');
    if (fieldsContainer) {
      formElements.forEach(element => {
        fieldsContainer.appendChild(element);
      });
    }

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const form = this.getFormElement();
    if (!form) return;

    const preventDefault = this.getBoolAttr('prevent-default');
    const validate = this.getBoolAttr('validate') !== false;

    // Form submit
    this.on(form, 'submit', (event) => {
      // Always prevent default if preventDefault attribute is set
      if (preventDefault) {
        event.preventDefault();
      }

      // Validate if enabled
      if (validate) {
        const isValid = this.validateForm();
        if (!isValid) {
          event.preventDefault();
          return;
        }
      }

      // If we're still here, form is valid
      this.handleSubmit(event);
    });

    // Listen to field changes for live validation
    if (validate) {
      this.setupFieldValidation();
    }
  }

  /**
   * Setup live validation on form fields
   */
  setupFieldValidation() {
    const formFields = this.getFormFields();

    formFields.forEach(field => {
      // Listen to validation events from custom components
      const events = ['lc-input-blur', 'lc-textarea-blur', 'lc-checkbox-change', 'lc-radio-change', 'lc-select-change'];

      events.forEach(eventName => {
        this.on(field, eventName, () => {
          // Check overall form validity
          setTimeout(() => {
            const isValid = this.isFormValid();
            this.emit(isValid ? 'lc-form-valid' : 'lc-form-invalid', {
              form: this,
              valid: isValid
            });
          }, 0);
        });
      });
    });
  }

  /**
   * Get the form element
   * @returns {HTMLFormElement|null}
   */
  getFormElement() {
    return this.$('.lc-form__form');
  }

  /**
   * Get all form field custom components
   * @returns {Array}
   */
  getFormFields() {
    const fieldSelectors = ['lc-input', 'lc-textarea', 'lc-checkbox', 'lc-radio', 'lc-select'];
    return this.$$(fieldSelectors.join(', '));
  }

  /**
   * Validate entire form
   * @returns {boolean} True if valid
   */
  validateForm() {
    const form = this.getFormElement();
    if (!form) return true;

    const fields = this.getFormFields();
    let isValid = true;

    // Validate each custom field
    fields.forEach(field => {
      if (typeof field.validate === 'function') {
        const fieldValid = field.validate();
        if (!fieldValid) {
          isValid = false;
        }
      }
    });

    // Also check native HTML5 validation
    if (!form.checkValidity()) {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Check if form is currently valid (without showing errors)
   * @returns {boolean}
   */
  isFormValid() {
    const form = this.getFormElement();
    if (!form) return true;

    const fields = this.getFormFields();

    // Check custom fields
    for (const field of fields) {
      if (typeof field.isValid === 'function' && !field.isValid()) {
        return false;
      }
    }

    // Check native validity
    return form.checkValidity();
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  handleSubmit(event) {
    this.isSubmitting = true;
    this.updateSubmitButton();

    // Get form data
    const formData = this.getFormData();

    this.emit('lc-form-submit', {
      form: this,
      formData,
      event,
      preventDefault: () => event.preventDefault()
    });
  }

  /**
   * Get form data as object
   * @returns {Object}
   */
  getFormData() {
    const form = this.getFormElement();
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes with same name)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  /**
   * Get form data as FormData object
   * @returns {FormData}
   */
  getFormDataObject() {
    const form = this.getFormElement();
    return form ? new FormData(form) : new FormData();
  }

  /**
   * Reset form
   */
  reset() {
    const form = this.getFormElement();
    if (form) {
      form.reset();

      // Clear errors on custom fields
      const fields = this.getFormFields();
      fields.forEach(field => {
        if (typeof field.clearError === 'function') {
          field.clearError();
        }
      });

      this.emit('lc-form-reset', { form: this });
    }
  }

  /**
   * Set form as submitting (shows loading state)
   * @param {boolean} submitting - Is submitting
   */
  setSubmitting(submitting) {
    this.isSubmitting = submitting;
    this.updateSubmitButton();
  }

  /**
   * Update submit button state
   */
  updateSubmitButton() {
    const submitButton = this.$('.lc-form__submit');
    if (submitButton) {
      if (this.isSubmitting) {
        submitButton.setAttribute('loading', '');
        submitButton.setAttribute('disabled', '');
      } else {
        submitButton.removeAttribute('loading');
        submitButton.removeAttribute('disabled');
      }
    }
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    // Find or create success message container
    let successDiv = this.$('.lc-form__success');
    if (!successDiv) {
      successDiv = document.createElement('div');
      successDiv.className = 'lc-form__success';
      successDiv.setAttribute('role', 'status');
      const form = this.getFormElement();
      if (form) {
        form.insertBefore(successDiv, form.firstChild);
      }
    }

    successDiv.textContent = message;
    successDiv.style.display = 'block';

    // Hide error if present
    const errorDiv = this.$('.lc-form__error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    // Find or create error message container
    let errorDiv = this.$('.lc-form__error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'lc-form__error';
      errorDiv.setAttribute('role', 'alert');
      const form = this.getFormElement();
      if (form) {
        form.insertBefore(errorDiv, form.firstChild);
      }
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Hide success if present
    const successDiv = this.$('.lc-form__success');
    if (successDiv) {
      successDiv.style.display = 'none';
    }
  }

  /**
   * Hide messages
   */
  hideMessages() {
    const successDiv = this.$('.lc-form__success');
    const errorDiv = this.$('.lc-form__error');
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-form-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-form-styles';
    style.textContent = `
      .lc-form {
        display: block;
      }

      .lc-form__form {
        display: block;
      }

      .lc-form__fields {
        display: block;
      }

      .lc-form__success,
      .lc-form__error {
        display: none;
        padding: var(--space-4);
        margin-bottom: var(--space-6);
        border-radius: var(--radius-base);
        font-size: var(--font-size-base);
        line-height: 1.5;
      }

      .lc-form__success {
        background: var(--alert-success-bg);
        color: var(--form-success-color);
        border: 1px solid var(--form-success-color);
      }

      .lc-form__error {
        background: var(--alert-error-bg);
        color: var(--form-error-color);
        border: 1px solid var(--form-error-color);
      }

      .lc-form__actions {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-top: var(--space-6);
      }

      /* Responsive */
      @media (max-width: 640px) {
        .lc-form__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .lc-form__submit {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-form', LCForm);
export default LCForm;
