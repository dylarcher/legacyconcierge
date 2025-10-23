// @ts-nocheck
/**
 * Form Components for Legacy Concierge
 * Provides accessible, validated form elements with Light DOM
 *
 * Components:
 * - <lc-form>: Form wrapper with validation
 * - <lc-input>: Enhanced input field
 * - <lc-textarea>: Textarea with character count
 * - <lc-select>: Select dropdown
 * - <lc-checkbox>: Checkbox with label
 * - <lc-radio-group>: Radio group wrapper
 * - <lc-radio>: Radio option
 * - <lc-submit-button>: Submit button with loading state
 */

import { cloneTemplate } from "@/core/component-loader.js";
import { getAttributeOr, getBooleanAttribute } from "@/core/helpers.js";

/**
 * Base form element class with common validation logic
 */
class LCFormElement extends HTMLElement {
	/**
	 * Gets the input element (implemented by subclasses)
	 * @returns {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement}
	 */
	getInput() {
		throw new Error("getInput() must be implemented by subclass");
	}

	/**
	 * Gets the error element (implemented by subclasses)
	 * @returns {HTMLElement}
	 */
	getErrorElement() {
		throw new Error("getErrorElement() must be implemented by subclass");
	}

	/**
	 * Sets an error message
	 * @param {string} message - Error message to display
	 */
	setError(message) {
		const errorElement = this.getErrorElement();
		const wrapper = this.querySelector('[class*="-wrapper"]');

		if (errorElement && wrapper) {
			errorElement.textContent = message;
			wrapper?.classList.add("has-error");
			this.setAttribute("aria-invalid", "true");
		}
	}

	/**
	 * Clears the error message
	 */
	clearError() {
		const errorElement = this.getErrorElement();
		const wrapper = this.querySelector('[class*="-wrapper"]');

		if (errorElement && wrapper) {
			errorElement.textContent = "";
			wrapper?.classList.remove("has-error");
			this.removeAttribute("aria-invalid");
		}
	}

	/**
	 * Validates the input
	 * @returns {boolean} - True if valid
	 */
	validate() {
		const input = this.getInput();
		if (!input) return true;

		this.clearError();

		// Required validation
		if (input.required && !input.value.trim()) {
			this.setError("This field is required");
			return false;
		}

		// Type validation
		if (input.type === "email" && input.value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(input.value)) {
				this.setError("Please enter a valid email address");
				return false;
			}
		}

		if (input.type === "url" && input.value) {
			try {
				new URL(input.value);
			} catch {
				this.setError("Please enter a valid URL");
				return false;
			}
		}

		// Pattern validation
		if (input.pattern && input.value) {
			const regex = new RegExp(input.pattern);
			if (!regex.test(input.value)) {
				const customMessage = this.getAttribute("pattern-message");
				this.setError(customMessage || "Please match the requested format");
				return false;
			}
		}

		// Min/max length validation
		if (input.minLength && input.value.length < input.minLength) {
			this.setError(`Minimum ${input.minLength} characters required`);
			return false;
		}

		if (input.maxLength && input.value.length > input.maxLength) {
			this.setError(`Maximum ${input.maxLength} characters allowed`);
			return false;
		}

		// Min/max value validation
		if (input.min && Number(input.value) < Number(input.min)) {
			this.setError(`Minimum value is ${input.min}`);
			return false;
		}

		if (input.max && Number(input.value) > Number(input.max)) {
			this.setError(`Maximum value is ${input.max}`);
			return false;
		}

		return true;
	}
}

/**
 * Form wrapper component with validation
 *
 * @example
 * <lc-form id="contact-form" validate-on-submit>
 *   <lc-input name="name" required></lc-input>
 *   <lc-submit-button>Submit</lc-submit-button>
 * </lc-form>
 */
class LCForm extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-form-template");
		this.appendChild(template);

		const form = this.querySelector("form");

		// Move all children except form into form
		const children = Array.from(this.childNodes).filter(
			(node) => node !== form && node.nodeType === Node.ELEMENT_NODE,
		);

		for (const child of children) {
			form.appendChild(child);
		}

		// Setup form submission
		form.addEventListener("submit", (event) => this.handleSubmit(event));

		// Setup real-time validation if requested
		if (getBooleanAttribute(this, "validate-on-change")) {
			this.setupRealtimeValidation();
		}
	}

	/**
	 * Handles form submission
	 * @param {Event} event - Submit event
	 */
	handleSubmit(event) {
		if (getBooleanAttribute(this, "validate-on-submit")) {
			event.preventDefault();

			if (this.validateAll()) {
				// Dispatch custom event with form data
				const formData = new FormData(event.target);
				const data = Object.fromEntries(formData);

				this.dispatchEvent(
					new CustomEvent("lc-form-submit", {
						detail: { data, formData },
						bubbles: true,
					}),
				);
			}
		}
	}

	/**
	 * Sets up real-time validation on all form elements
	 */
	setupRealtimeValidation() {
		const inputs = this.querySelectorAll("input, textarea, select");

		for (const input of inputs) {
			input.addEventListener("blur", () => {
				const element = input.closest('[class*="-wrapper"]')?.parentElement;
				if (element && typeof element.validate === "function") {
					element.validate();
				}
			});
		}
	}

	/**
	 * Validates all form elements
	 * @returns {boolean} - True if all elements are valid
	 */
	validateAll() {
		const elements = this.querySelectorAll(
			"lc-input, lc-textarea, lc-select, lc-checkbox, lc-radio-group",
		);
		let isValid = true;

		for (const element of elements) {
			if (typeof element.validate === "function") {
				if (!element.validate()) {
					isValid = false;
				}
			}
		}

		return isValid;
	}

	/**
	 * Resets the form
	 */
	reset() {
		const form = this.querySelector("form");
		form?.reset();

		// Clear all errors
		const elements = this.querySelectorAll(
			"lc-input, lc-textarea, lc-select, lc-checkbox, lc-radio-group",
		);
		for (const element of elements) {
			if (typeof element.clearError === "function") {
				element.clearError();
			}
		}
	}
}

/**
 * Enhanced input component
 *
 * @example
 * <lc-input name="email" type="email" required>
 *   <span slot="label">Email Address</span>
 *   <span slot="help">We'll never share your email</span>
 * </lc-input>
 */
class LCInput extends LCFormElement {
	connectedCallback() {
		const template = cloneTemplate("lc-input-template");
		this.appendChild(template);

		const input = this.querySelector(".lc-input-field");
		const wrapper = this.querySelector(".lc-input-wrapper");

		// Transfer attributes
		const type = getAttributeOr(this, "type", "text");
		const name = this.getAttribute("name");
		const placeholder = this.getAttribute("placeholder");
		const required = getBooleanAttribute(this, "required");
		const disabled = getBooleanAttribute(this, "disabled");
		const value = this.getAttribute("value");

		input.type = type;
		if (name) input.name = name;
		if (placeholder) input.placeholder = placeholder;
		if (required) input.required = true;
		if (disabled) input.disabled = true;
		if (value) input.value = value;

		// Transfer validation attributes
		["min", "max", "minlength", "maxlength", "pattern", "step"].forEach(
			(attr) => {
				const val = this.getAttribute(attr);
				if (val !== null) input.setAttribute(attr, val);
			},
		);

		// Set wrapper attributes
		wrapper.setAttribute("data-required", String(required));

		// Check for icon slot
		const icon = this.querySelector('[slot="icon"]');
		if (icon) {
			wrapper?.classList.add("has-icon");
		}

		// Setup validation on blur
		input.addEventListener("blur", () => this.validate());

		// Setup input event for reactive updates
		input.addEventListener("input", () => {
			this.dispatchEvent(
				new CustomEvent("lc-input", {
					detail: { value: input.value },
					bubbles: true,
				}),
			);
		});
	}

	getInput() {
		return this.querySelector(".lc-input-field");
	}

	getErrorElement() {
		return this.querySelector(".lc-input-error");
	}

	/**
	 * Gets the current value
	 * @returns {string}
	 */
	get value() {
		return this.getInput()?.value || "";
	}

	/**
	 * Sets the value
	 * @param {string} val
	 */
	set value(val) {
		const input = this.getInput();
		if (input) input.value = val;
	}
}

/**
 * Textarea component with character counter
 *
 * @example
 * <lc-textarea name="message" maxlength="500" required show-counter>
 *   <span slot="label">Message</span>
 *   <span slot="help">Tell us how we can help</span>
 * </lc-textarea>
 */
class LCTextarea extends LCFormElement {
	connectedCallback() {
		const template = cloneTemplate("lc-textarea-template");
		this.appendChild(template);

		const textarea = this.querySelector(".lc-textarea-field");
		const wrapper = this.querySelector(".lc-textarea-wrapper");
		const counter = this.querySelector(".lc-textarea-counter-current");
		const maxCounter = this.querySelector(".lc-textarea-counter-max");

		// Transfer attributes
		const name = this.getAttribute("name");
		const placeholder = this.getAttribute("placeholder");
		const required = getBooleanAttribute(this, "required");
		const disabled = getBooleanAttribute(this, "disabled");
		const value = this.getAttribute("value");
		const rows = this.getAttribute("rows");
		const maxlength = this.getAttribute("maxlength");

		if (name) textarea.name = name;
		if (placeholder) textarea.placeholder = placeholder;
		if (required) textarea.required = true;
		if (disabled) textarea.disabled = true;
		if (value) textarea.value = value;
		if (rows) textarea.rows = rows;
		if (maxlength) textarea.maxLength = maxlength;

		// Set wrapper attributes
		wrapper.setAttribute("data-required", String(required));
		wrapper.setAttribute(
			"data-show-counter",
			String(getBooleanAttribute(this, "show-counter")),
		);

		// Update counter
		if (maxlength && maxCounter) {
			maxCounter.textContent = maxlength;
		}

		// Setup counter updates
		textarea.addEventListener("input", () => {
			if (counter) {
				counter.textContent = textarea.value.length;
			}

			this.dispatchEvent(
				new CustomEvent("lc-input", {
					detail: { value: textarea.value },
					bubbles: true,
				}),
			);
		});

		// Setup validation on blur
		textarea.addEventListener("blur", () => this.validate());
	}

	getInput() {
		return this.querySelector(".lc-textarea-field");
	}

	getErrorElement() {
		return this.querySelector(".lc-textarea-error");
	}

	get value() {
		return this.getInput()?.value || "";
	}

	set value(val) {
		const textarea = this.getInput();
		if (textarea) {
			textarea.value = val;
			// Trigger input event to update counter
			textarea.dispatchEvent(new Event("input"));
		}
	}
}

/**
 * Select dropdown component
 *
 * @example
 * <lc-select name="subject" required>
 *   <span slot="label">Subject</span>
 *   <option value="">Choose a subject</option>
 *   <option value="general">General Inquiry</option>
 * </lc-select>
 */
class LCSelect extends LCFormElement {
	connectedCallback() {
		const template = cloneTemplate("lc-select-template");

		// Move existing option elements
		const options = Array.from(this.querySelectorAll("option"));

		this.appendChild(template);

		const select = this.querySelector(".lc-select-field");
		const wrapper = this.querySelector(".lc-select-wrapper");

		// Add options to select
		for (const option of options) {
			select.appendChild(option);
		}

		// Transfer attributes
		const name = this.getAttribute("name");
		const required = getBooleanAttribute(this, "required");
		const disabled = getBooleanAttribute(this, "disabled");
		const value = this.getAttribute("value");

		if (name) select.name = name;
		if (required) select.required = true;
		if (disabled) select.disabled = true;
		if (value) select.value = value;

		// Set wrapper attributes
		wrapper.setAttribute("data-required", String(required));

		// Setup validation on change
		select.addEventListener("change", () => {
			this.validate();
			this.dispatchEvent(
				new CustomEvent("lc-change", {
					detail: { value: select.value },
					bubbles: true,
				}),
			);
		});
	}

	getInput() {
		return this.querySelector(".lc-select-field");
	}

	getErrorElement() {
		return this.querySelector(".lc-select-error");
	}

	get value() {
		return this.getInput()?.value || "";
	}

	set value(val) {
		const select = this.getInput();
		if (select) select.value = val;
	}
}

/**
 * Checkbox component
 *
 * @example
 * <lc-checkbox name="agree" required>
 *   I agree to the terms and conditions
 * </lc-checkbox>
 */
class LCCheckbox extends LCFormElement {
	connectedCallback() {
		const template = cloneTemplate("lc-checkbox-template");

		// Save text content
		const text = this.textContent;

		this.appendChild(template);

		const input = this.querySelector(".lc-checkbox-input");
		const textSlot = this.querySelector(".lc-checkbox-text");

		// Restore text content
		if (text && textSlot) {
			textSlot.textContent = text;
		}

		// Transfer attributes
		const name = this.getAttribute("name");
		const value = getAttributeOr(this, "value", "on");
		const required = getBooleanAttribute(this, "required");
		const disabled = getBooleanAttribute(this, "disabled");
		const checked = getBooleanAttribute(this, "checked");

		if (name) input.name = name;
		input.value = value;
		if (required) input.required = true;
		if (disabled) input.disabled = true;
		if (checked) input.checked = true;

		// Setup change event
		input.addEventListener("change", () => {
			this.validate();
			this.dispatchEvent(
				new CustomEvent("lc-change", {
					detail: { checked: input.checked, value: input.value },
					bubbles: true,
				}),
			);
		});
	}

	getInput() {
		return this.querySelector(".lc-checkbox-input");
	}

	getErrorElement() {
		return this.querySelector(".lc-checkbox-error");
	}

	validate() {
		const input = this.getInput();
		if (!input) return true;

		this.clearError();

		if (input.required && !input.checked) {
			this.setError("This field is required");
			return false;
		}

		return true;
	}

	get checked() {
		return this.getInput()?.checked || false;
	}

	set checked(val) {
		const input = this.getInput();
		if (input) input.checked = Boolean(val);
	}

	get value() {
		return this.getInput()?.value || "";
	}
}

/**
 * Radio group component
 *
 * @example
 * <lc-radio-group name="contact-method" required>
 *   <span slot="legend">Preferred Contact Method</span>
 *   <lc-radio value="email">Email</lc-radio>
 *   <lc-radio value="phone">Phone</lc-radio>
 * </lc-radio-group>
 */
class LCRadioGroup extends LCFormElement {
	connectedCallback() {
		const template = cloneTemplate("lc-radio-group-template");

		// Save radio elements
		const radios = Array.from(this.querySelectorAll("lc-radio"));

		this.appendChild(template);

		const fieldset = this.querySelector(".lc-radio-group");
		const optionsContainer = this.querySelector(".lc-radio-group-options");

		// Add radios to options container
		for (const radio of radios) {
			optionsContainer.appendChild(radio);
		}

		// Transfer attributes
		const name = this.getAttribute("name");
		const required = getBooleanAttribute(this, "required");

		// Set name on all radio inputs
		if (name) {
			for (const radio of radios) {
				radio.setAttribute("name", name);
			}
		}

		// Set fieldset attributes
		fieldset.setAttribute("data-required", String(required));

		// Setup change event
		this.addEventListener("lc-radio-change", () => {
			this.validate();
		});
	}

	getInput() {
		return this.querySelector(".lc-radio-input:checked");
	}

	getErrorElement() {
		return this.querySelector(".lc-radio-group-error");
	}

	validate() {
		const required =
			this.querySelector(".lc-radio-group").getAttribute("data-required") ===
			"true";

		this.clearError();

		if (required && !this.getInput()) {
			this.setError("Please select an option");
			return false;
		}

		return true;
	}

	get value() {
		return this.getInput()?.value || "";
	}

	set value(val) {
		const radios = this.querySelectorAll(".lc-radio-input");
		for (const radio of radios) {
			radio.checked = radio.value === val;
		}
	}
}

/**
 * Radio option component (used within lc-radio-group)
 *
 * @example
 * <lc-radio value="email">Email</lc-radio>
 */
class LCRadio extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-radio-template");

		// Save text content
		const text = this.textContent;

		this.appendChild(template);

		const input = this.querySelector(".lc-radio-input");
		const textSlot = this.querySelector(".lc-radio-text");

		// Restore text content
		if (text && textSlot) {
			textSlot.textContent = text;
		}

		// Transfer attributes
		const name = this.getAttribute("name");
		const value = this.getAttribute("value");
		const disabled = getBooleanAttribute(this, "disabled");
		const checked = getBooleanAttribute(this, "checked");

		if (name) input.name = name;
		if (value) input.value = value;
		if (disabled) input.disabled = true;
		if (checked) input.checked = true;

		// Setup change event
		input.addEventListener("change", () => {
			this.dispatchEvent(
				new CustomEvent("lc-radio-change", {
					detail: { value: input.value },
					bubbles: true,
				}),
			);
		});
	}

	get checked() {
		return this.querySelector(".lc-radio-input")?.checked || false;
	}

	set checked(val) {
		const input = this.querySelector(".lc-radio-input");
		if (input) input.checked = Boolean(val);
	}

	get value() {
		return this.querySelector(".lc-radio-input")?.value || "";
	}
}

/**
 * Submit button with loading state
 *
 * @example
 * <lc-submit-button>Submit Form</lc-submit-button>
 */
class LCSubmitButton extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-submit-button-template");

		// Save text content
		const text = this.textContent;

		this.appendChild(template);

		const button = this.querySelector(".lc-submit-button");
		const textSlot = this.querySelector(".lc-submit-button-text");

		// Restore text content
		if (text && textSlot) {
			textSlot.textContent = text;
		}

		// Transfer attributes
		const disabled = getBooleanAttribute(this, "disabled");
		const type = getAttributeOr(this, "type", "submit");

		button.type = type;
		if (disabled) button.disabled = true;
	}

	/**
	 * Sets loading state
	 * @param {boolean} loading - Whether button is loading
	 */
	setLoading(loading) {
		const button = this.querySelector(".lc-submit-button");
		if (button) {
			if (loading) {
				button?.classList.add("loading");
				button.disabled = true;
			} else {
				button?.classList.remove("loading");
				button.disabled = getBooleanAttribute(this, "disabled");
			}
		}
	}

	get disabled() {
		return this.querySelector(".lc-submit-button")?.disabled || false;
	}

	set disabled(val) {
		const button = this.querySelector(".lc-submit-button");
		if (button) button.disabled = Boolean(val);
	}
}

// Define custom elements
customElements.define("lc-form", LCForm);
customElements.define("lc-input", LCInput);
customElements.define("lc-textarea", LCTextarea);
customElements.define("lc-select", LCSelect);
customElements.define("lc-checkbox", LCCheckbox);
customElements.define("lc-radio-group", LCRadioGroup);
customElements.define("lc-radio", LCRadio);
customElements.define("lc-submit-button", LCSubmitButton);

// Export for use in other modules
export {
	LCCheckbox,
	LCForm,
	LCInput,
	LCRadio,
	LCRadioGroup,
	LCSelect,
	LCSubmitButton,
	LCTextarea,
};
