/**
 * Accessible Contact Form Dialog Component
 *
 * Features:
 * - WCAG 2.2 AA compliant
 * - WAI-ARIA support for screen readers
 * - Constraint Validation API
 * - Schema.org microdata
 * - Keyboard navigation
 * - Focus trap
 * - Escape to close
 *
 * Usage:
 * <lc-contact-dialog></lc-contact-dialog>
 *
 * API:
 * dialog.open() - Opens the dialog
 * dialog.close() - Closes the dialog
 */

class ContactDialog extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this._isOpen = false;
	}

	connectedCallback() {
		this.render();
		this.setupEventListeners();
	}

	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--dialog-max-width: 600px;
					--dialog-padding: 2rem;
					--dialog-border-radius: 0.5rem;
					--overlay-bg: rgba(0, 0, 0, 0.6);
					--dialog-bg: var(--background-color, #ffffff);
					--dialog-text: var(--text-color, #333333);
					--input-border: var(--border-color, #cccccc);
					--input-focus: var(--primary-color, #007bff);
					--error-color: #d32f2f;
					--button-primary-bg: var(--primary-color, #007bff);
					--button-primary-text: #ffffff;
				}

				/* Support for dark mode */
				:host([data-theme="dark"]) {
					--dialog-bg: #1e1e1e;
					--dialog-text: #e0e0e0;
					--input-border: #555555;
				}

				/* Overlay */
				.overlay {
					display: none;
					position: fixed;
					inset: 0;
					background: var(--overlay-bg);
					backdrop-filter: blur(4px);
					z-index: 9998;
					animation: fadeIn 0.2s ease-out;
				}

				.overlay[aria-hidden="false"] {
					display: block;
				}

				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}

				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				/* Dialog */
				.dialog {
					display: none;
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					max-width: var(--dialog-max-width);
					width: calc(100% - 2rem);
					max-height: calc(100vh - 2rem);
					background: var(--dialog-bg);
					color: var(--dialog-text);
					border-radius: var(--dialog-border-radius);
					padding: var(--dialog-padding);
					box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
					overflow-y: auto;
					z-index: 9999;
					animation: slideUp 0.3s ease-out;
				}

				.dialog[aria-hidden="false"] {
					display: block;
				}

				/* Dialog Header */
				.dialog-header {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 1.5rem;
				}

				.dialog-title {
					margin: 0;
					font-size: 1.75rem;
					font-weight: 600;
					line-height: 1.2;
				}

				.close-button {
					background: transparent;
					border: none;
					font-size: 1.5rem;
					cursor: pointer;
					padding: 0.5rem;
					margin: -0.5rem -0.5rem 0 0;
					min-width: 44px;
					min-height: 44px;
					border-radius: 0.25rem;
					color: var(--dialog-text);
					transition: background-color 0.2s;
				}

				.close-button:hover,
				.close-button:focus {
					background-color: rgba(0, 0, 0, 0.1);
					outline: 2px solid var(--input-focus);
					outline-offset: 2px;
				}

				.close-button:focus-visible {
					outline: 2px solid var(--input-focus);
					outline-offset: 2px;
				}

				/* Form */
				.form {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.form-group {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				}

				.label {
					font-weight: 600;
					font-size: 1rem;
					color: var(--dialog-text);
				}

				.required {
					color: var(--error-color);
					margin-left: 0.25rem;
				}

				.input,
				.textarea,
				.select {
					padding: 0.75rem;
					font-size: 1rem;
					border: 2px solid var(--input-border);
					border-radius: 0.25rem;
					background: var(--dialog-bg);
					color: var(--dialog-text);
					font-family: inherit;
					min-height: 44px;
					transition: border-color 0.2s;
				}

				.input:focus,
				.textarea:focus,
				.select:focus {
					outline: none;
					border-color: var(--input-focus);
					box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
				}

				.input:invalid:not(:placeholder-shown),
				.textarea:invalid:not(:placeholder-shown),
				.select:invalid:not(:placeholder-shown) {
					border-color: var(--error-color);
				}

				.textarea {
					resize: vertical;
					min-height: 120px;
				}

				.error-message {
					color: var(--error-color);
					font-size: 0.875rem;
					display: none;
					margin-top: 0.25rem;
				}

				.form-group:has(.input:invalid:not(:placeholder-shown)) .error-message,
				.form-group:has(.textarea:invalid:not(:placeholder-shown)) .error-message,
				.form-group:has(.select:invalid:not(:placeholder-shown)) .error-message {
					display: block;
				}

				/* Buttons */
				.form-actions {
					display: flex;
					gap: 1rem;
					justify-content: flex-end;
					margin-top: 1rem;
				}

				.button {
					padding: 0.75rem 1.5rem;
					font-size: 1rem;
					font-weight: 600;
					border: none;
					border-radius: 0.25rem;
					cursor: pointer;
					min-width: 100px;
					min-height: 44px;
					transition: all 0.2s;
				}

				.button-primary {
					background: var(--button-primary-bg);
					color: var(--button-primary-text);
				}

				.button-primary:hover:not(:disabled) {
					filter: brightness(1.1);
				}

				.button-primary:focus-visible {
					outline: 2px solid var(--input-focus);
					outline-offset: 2px;
				}

				.button-primary:disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}

				.button-secondary {
					background: transparent;
					color: var(--dialog-text);
					border: 2px solid var(--input-border);
				}

				.button-secondary:hover {
					background: rgba(0, 0, 0, 0.05);
				}

				.button-secondary:focus-visible {
					outline: 2px solid var(--input-focus);
					outline-offset: 2px;
				}

				/* Reduced motion support */
				@media (prefers-reduced-motion: reduce) {
					.overlay,
					.dialog {
						animation: none;
					}
				}

				/* Mobile adjustments */
				@media (max-width: 640px) {
					.dialog {
						padding: 1.5rem;
					}

					.dialog-title {
						font-size: 1.5rem;
					}

					.form-actions {
						flex-direction: column;
					}

					.button {
						width: 100%;
					}
				}
			</style>

			<!-- Overlay -->
			<div
				class="overlay"
				aria-hidden="true"
				role="presentation"
			></div>

			<!-- Dialog -->
			<div
				class="dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="dialog-title"
				aria-describedby="dialog-description"
				aria-hidden="true"
			>
				<!-- Header -->
				<div class="dialog-header">
					<h2 id="dialog-title" class="dialog-title">
						<span data-i18n="contactDialog.title">Personalized Consultation</span>
					</h2>
					<button
						type="button"
						class="close-button"
						aria-label="Close dialog"
						data-action="close"
					>
						×
					</button>
				</div>

				<!-- Description -->
				<p id="dialog-description" class="visually-hidden">
					<span data-i18n="contactDialog.description">
						Fill out this form to request a personalized consultation with our team.
					</span>
				</p>

				<!-- Form with Schema.org microdata -->
				<form
					class="form"
					novalidate
					itemscope
					itemtype="https://schema.org/ContactPage"
				>
					<!-- Name -->
					<div class="form-group">
						<label for="contact-name" class="label">
							<span data-i18n="contactDialog.name">Full Name</span>
							<span class="required" aria-label="required">*</span>
						</label>
						<input
							type="text"
							id="contact-name"
							name="name"
							class="input"
							required
							minlength="2"
							maxlength="100"
							placeholder="John Doe"
							aria-required="true"
							aria-invalid="false"
							itemprop="name"
						/>
						<span class="error-message" role="alert">
							<span data-i18n="contactDialog.nameError">Please enter your full name (2-100 characters)</span>
						</span>
					</div>

					<!-- Email -->
					<div class="form-group">
						<label for="contact-email" class="label">
							<span data-i18n="contactDialog.email">Email Address</span>
							<span class="required" aria-label="required">*</span>
						</label>
						<input
							type="email"
							id="contact-email"
							name="email"
							class="input"
							required
							placeholder="john.doe@example.com"
							aria-required="true"
							aria-invalid="false"
							itemprop="email"
						/>
						<span class="error-message" role="alert">
							<span data-i18n="contactDialog.emailError">Please enter a valid email address</span>
						</span>
					</div>

					<!-- Phone -->
					<div class="form-group">
						<label for="contact-phone" class="label">
							<span data-i18n="contactDialog.phone">Phone Number</span>
						</label>
						<input
							type="tel"
							id="contact-phone"
							name="phone"
							class="input"
							pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
							placeholder="123-456-7890"
							aria-invalid="false"
							itemprop="telephone"
						/>
						<span class="error-message" role="alert">
							<span data-i18n="contactDialog.phoneError">Please enter a valid phone number (123-456-7890)</span>
						</span>
					</div>

					<!-- Service Interest -->
					<div class="form-group">
						<label for="contact-service" class="label">
							<span data-i18n="contactDialog.service">Service Interest</span>
							<span class="required" aria-label="required">*</span>
						</label>
						<select
							id="contact-service"
							name="service"
							class="select"
							required
							aria-required="true"
							aria-invalid="false"
						>
							<option value="" disabled selected data-i18n="contactDialog.selectService">Select a service...</option>
							<option value="post-op" data-i18n="contactDialog.services.postOp">Post-Operative Care</option>
							<option value="chronic" data-i18n="contactDialog.services.chronic">Chronic Condition Management</option>
							<option value="palliative" data-i18n="contactDialog.services.palliative">Palliative Care</option>
							<option value="wellness" data-i18n="contactDialog.services.wellness">Wellness & Prevention</option>
							<option value="other" data-i18n="contactDialog.services.other">Other</option>
						</select>
						<span class="error-message" role="alert">
							<span data-i18n="contactDialog.serviceError">Please select a service</span>
						</span>
					</div>

					<!-- Message -->
					<div class="form-group">
						<label for="contact-message" class="label">
							<span data-i18n="contactDialog.message">Message</span>
							<span class="required" aria-label="required">*</span>
						</label>
						<textarea
							id="contact-message"
							name="message"
							class="textarea"
							required
							minlength="10"
							maxlength="1000"
							placeholder="Tell us about your needs..."
							aria-required="true"
							aria-invalid="false"
							itemprop="description"
						></textarea>
						<span class="error-message" role="alert">
							<span data-i18n="contactDialog.messageError">Please enter a message (10-1000 characters)</span>
						</span>
					</div>

					<!-- Actions -->
					<div class="form-actions">
						<button
							type="button"
							class="button button-secondary"
							data-action="close"
						>
							<span data-i18n="contactDialog.cancel">Cancel</span>
						</button>
						<button
							type="submit"
							class="button button-primary"
						>
							<span data-i18n="contactDialog.submit">Submit Request</span>
						</button>
					</div>
				</form>
			</div>
		`;
	}

	setupEventListeners() {
		const overlay = this.shadowRoot.querySelector('.overlay');
		const dialog = this.shadowRoot.querySelector('.dialog');
		const form = this.shadowRoot.querySelector('.form');
		const closeButtons = this.shadowRoot.querySelectorAll('[data-action="close"]');

		// Close on overlay click
		overlay.addEventListener('click', () => this.close());

		// Close on close button click
		for (const button of closeButtons) {
			button.addEventListener('click', () => this.close());
		}

		// Close on Escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this._isOpen) {
				this.close();
			}
		});

		// Form submission
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.handleSubmit(e);
		});

		// Custom validation messages
		const inputs = form.querySelectorAll('input, textarea, select');
		for (const input of inputs) {
			input.addEventListener('invalid', (e) => {
				e.preventDefault();
				input.setAttribute('aria-invalid', 'true');
			});

			input.addEventListener('input', () => {
				if (input.validity.valid) {
					input.setAttribute('aria-invalid', 'false');
				}
			});
		}

		// Focus trap
		this.setupFocusTrap(dialog);
	}

	setupFocusTrap(dialog) {
		const focusableElements = dialog.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		dialog.addEventListener('keydown', (e) => {
			if (!this._isOpen) return;

			if (e.key === 'Tab') {
				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstFocusable) {
						e.preventDefault();
						lastFocusable.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastFocusable) {
						e.preventDefault();
						firstFocusable.focus();
					}
				}
			}
		});
	}

	/**
	 * Get HubSpot tracking cookie (hutk)
	 * This connects the form submission to visitor browsing behavior
	 */
	getHubSpotCookie() {
		const value = `; ${document.cookie}`;
		const parts = value.split('; hubspotutk=');
		if (parts.length === 2) {
			return parts.pop().split(';').shift();
		}
		return null;
	}

	/**
	 * Submit form to HubSpot Forms API
	 * Uses the Forms API (not CRM API) for secure frontend submission
	 */
	async submitToHubSpot(formData) {
		// TODO: Replace with your actual Portal ID and Form GUID
		const PORTAL_ID = 'YOUR-PORTAL-ID';
		const FORM_GUID = 'YOUR-FORM-GUID';

		const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

		// Build HubSpot fields array
		const fields = [];
		for (const [name, value] of formData.entries()) {
			fields.push({
				objectTypeId: "0-1", // 0-1 indicates contact properties
				name: name,
				value: value
			});
		}

		// Build submission payload
		const payload = {
			submittedAt: Date.now(),
			fields: fields,
			context: {
				hutk: this.getHubSpotCookie(), // Critical for visitor tracking
				pageUri: window.location.href,
				pageName: document.title
			}
		};

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			const data = await response.json();
			return { success: true, data };
		} catch (error) {
			console.error('HubSpot submission error:', error);
			return { success: false, error };
		}
	}

	async handleSubmit(event) {
		const form = event.target;

		// Validate using Constraint Validation API
		if (!form.checkValidity()) {
			// Find first invalid field and focus it
			const firstInvalid = form.querySelector(':invalid');
			if (firstInvalid) {
				firstInvalid.focus();
				firstInvalid.setAttribute('aria-invalid', 'true');
			}
			return;
		}

		// Disable submit button during submission
		const submitButton = form.querySelector('[type="submit"]');
		const originalText = submitButton.textContent;
		submitButton.disabled = true;
		submitButton.textContent = 'Submitting...';

		// Collect form data
		const formData = new FormData(form);

		// Submit to HubSpot
		const result = await this.submitToHubSpot(formData);

		if (result.success) {
			// Close dialog
			this.close();

			// Handle redirect or show inline message
			if (result.data.redirectUri) {
				window.location.href = result.data.redirectUri;
			} else {
				// Show success message (use inline message from HubSpot if available)
				const message = result.data.inlineMessage || 'Thank you for your request! We will contact you soon.';
				// TODO: Replace alert with proper toast/notification component
				alert(message);
			}
		} else {
			// Show error message
			// TODO: Replace alert with proper toast/notification component
			alert('There was an error submitting your request. Please try again or contact us directly.');

			// Re-enable submit button
			submitButton.disabled = false;
			submitButton.textContent = originalText;
		}
	}

	open() {
		if (this._isOpen) return;

		const overlay = this.shadowRoot.querySelector('.overlay');
		const dialog = this.shadowRoot.querySelector('.dialog');

		// Show dialog
		overlay.setAttribute('aria-hidden', 'false');
		dialog.setAttribute('aria-hidden', 'false');
		this._isOpen = true;

		// Store previously focused element
		this._previousFocus = document.activeElement;

		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		// Focus first input
		setTimeout(() => {
			const firstInput = dialog.querySelector('input');
			if (firstInput) {
				firstInput.focus();
			}
		}, 100);

		// Dispatch custom event
		this.dispatchEvent(new CustomEvent('dialog-opened', {
			bubbles: true,
			composed: true
		}));
	}

	close() {
		if (!this._isOpen) return;

		const overlay = this.shadowRoot.querySelector('.overlay');
		const dialog = this.shadowRoot.querySelector('.dialog');
		const form = this.shadowRoot.querySelector('.form');

		// Hide dialog
		overlay.setAttribute('aria-hidden', 'true');
		dialog.setAttribute('aria-hidden', 'true');
		this._isOpen = false;

		// Reset form
		form.reset();

		// Reset validation states
		const inputs = form.querySelectorAll('input, textarea, select');
		for (const input of inputs) {
			input.setAttribute('aria-invalid', 'false');
		}

		// Restore body scroll
		document.body.style.overflow = '';

		// Restore focus
		if (this._previousFocus) {
			this._previousFocus.focus();
		}

		// Dispatch custom event
		this.dispatchEvent(new CustomEvent('dialog-closed', {
			bubbles: true,
			composed: true
		}));
	}
}

// Register custom element
if (!customElements.get('lc-contact-dialog')) {
	customElements.define('lc-contact-dialog', ContactDialog);
}
