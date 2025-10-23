/**
 * Dialog and Modal Components for Legacy Concierge
 * Provides accessible dialogs, tooltips, popovers, and alerts
 *
 * Components:
 * - <lc-dialog>: Modal dialog
 * - <lc-tooltip>: Tooltip on hover/focus
 * - <lc-popover>: Popover menu
 * - <lc-alert>: Alert notification banner
 */

import {
	cloneTemplate,
	getAttributeOr,
	getBooleanAttribute,
} from "@/core/component-loader.js";

/**
 * Modal dialog component
 *
 * @example
 * <lc-dialog id="myDialog" size="medium">
 *   <span slot="title">Dialog Title</span>
 *   <p>Dialog content goes here</p>
 *   <div slot="footer">
 *     <button onclick="document.getElementById('myDialog').close()">Cancel</button>
 *     <button class="cta-button">Confirm</button>
 *   </div>
 * </lc-dialog>
 */
class LCDialog extends HTMLElement {
	constructor() {
		super();
		this.previouslyFocusedElement = null;
	}

	connectedCallback() {
		const template = cloneTemplate("lc-dialog-template");
		this.appendChild(template);

		const backdrop = this.querySelector(".lc-dialog-backdrop");
		const closeButton = this.querySelector(".lc-dialog-close");

		// Setup close handlers
		closeButton?.addEventListener("click", () => this.close());

		// Close on backdrop click if not disabled
		if (!getBooleanAttribute(this, "no-backdrop-click")) {
			backdrop?.addEventListener("click", () => this.close());
		}

		// Close on Escape key
		this.addEventListener("keydown", (event) => {
			if (
				event.key === "Escape" &&
				!getBooleanAttribute(this, "no-escape-close")
			) {
				this.close();
			}
		});

		// Setup focus trap
		this.setupFocusTrap();
	}

	/**
	 * Opens the dialog
	 */
	open() {
		// Save currently focused element
		this.previouslyFocusedElement = document.activeElement;

		// Open dialog
		this.setAttribute("open", "");

		// Prevent body scroll
		document.body.style.overflow = "hidden";

		// Focus first focusable element
		requestAnimationFrame(() => {
			const firstFocusable = this.getFirstFocusableElement();
			firstFocusable?.focus();
		});

		// Dispatch event
		this.dispatchEvent(new CustomEvent("lc-dialog-open", { bubbles: true }));
	}

	/**
	 * Closes the dialog
	 */
	close() {
		// Close dialog
		this.removeAttribute("open");

		// Restore body scroll
		document.body.style.overflow = "";

		// Return focus
		if (this.previouslyFocusedElement) {
			this.previouslyFocusedElement.focus();
			this.previouslyFocusedElement = null;
		}

		// Dispatch event
		this.dispatchEvent(new CustomEvent("lc-dialog-close", { bubbles: true }));
	}

	/**
	 * Toggles the dialog
	 */
	toggle() {
		if (this.hasAttribute("open")) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * Gets all focusable elements in the dialog
	 * @returns {HTMLElement[]}
	 */
	getFocusableElements() {
		const selector =
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		return Array.from(this.querySelectorAll(selector));
	}

	/**
	 * Gets the first focusable element
	 * @returns {HTMLElement | null}
	 */
	getFirstFocusableElement() {
		const focusable = this.getFocusableElements();
		return focusable[0] || null;
	}

	/**
	 * Sets up focus trap to keep focus within dialog
	 */
	setupFocusTrap() {
		this.addEventListener("keydown", (event) => {
			if (!this.hasAttribute("open") || event.key !== "Tab") return;

			const focusable = this.getFocusableElements();
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			// Shift + Tab on first element -> focus last
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			}
			// Tab on last element -> focus first
			else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		});
	}
}

/**
 * Tooltip component
 *
 * @example
 * <lc-tooltip position="top">
 *   <button slot="trigger">Hover me</button>
 *   This is the tooltip text
 * </lc-tooltip>
 */
class LCTooltip extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-tooltip-template");
		this.appendChild(template);

		const trigger = this.querySelector(".lc-tooltip-trigger");
		const content = this.querySelector(".lc-tooltip-content");

		// Generate unique ID for ARIA
		const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
		content.id = tooltipId;

		// Set ARIA attributes on trigger
		const triggerElement =
			trigger?.querySelector('[slot="trigger"]') || trigger?.firstElementChild;
		if (triggerElement) {
			triggerElement.setAttribute("aria-describedby", tooltipId);
		}

		// Show on mouse enter
		this.addEventListener("mouseenter", () => this.show());

		// Hide on mouse leave
		this.addEventListener("mouseleave", () => this.hide());

		// Show on focus
		this.addEventListener("focusin", () => this.show());

		// Hide on blur
		this.addEventListener("focusout", () => this.hide());
	}

	/**
	 * Shows the tooltip
	 */
	show() {
		this.setAttribute("visible", "");
		this.dispatchEvent(new CustomEvent("lc-tooltip-show", { bubbles: true }));
	}

	/**
	 * Hides the tooltip
	 */
	hide() {
		this.removeAttribute("visible");
		this.dispatchEvent(new CustomEvent("lc-tooltip-hide", { bubbles: true }));
	}
}

/**
 * Popover component
 *
 * @example
 * <lc-popover position="bottom">
 *   <button slot="trigger">Open Menu</button>
 *   <ul>
 *     <li><a href="#">Item 1</a></li>
 *     <li><a href="#">Item 2</a></li>
 *   </ul>
 * </lc-popover>
 */
class LCPopover extends HTMLElement {
	constructor() {
		super();
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
	}

	connectedCallback() {
		const template = cloneTemplate("lc-popover-template");
		this.appendChild(template);

		const trigger = this.querySelector(".lc-popover-trigger");
		const content = this.querySelector(".lc-popover-content");

		// Generate unique ID for ARIA
		const popoverId = `popover-${Math.random().toString(36).substr(2, 9)}`;
		content.id = popoverId;

		// Set ARIA attributes on trigger
		const triggerElement =
			trigger?.querySelector('[slot="trigger"]') || trigger?.firstElementChild;
		if (triggerElement) {
			triggerElement.setAttribute("aria-haspopup", "true");
			triggerElement.setAttribute("aria-expanded", "false");
			triggerElement.setAttribute("aria-controls", popoverId);
		}

		// Toggle on trigger click
		trigger?.addEventListener("click", (event) => {
			event.stopPropagation();
			this.toggle();
		});

		// Close on Escape key
		this.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && this.hasAttribute("open")) {
				this.close();
				triggerElement?.focus();
			}
		});
	}

	/**
	 * Opens the popover
	 */
	open() {
		this.setAttribute("open", "");

		const trigger =
			this.querySelector('.lc-popover-trigger [slot="trigger"]') ||
			this.querySelector(".lc-popover-trigger")?.firstElementChild;

		if (trigger) {
			trigger.setAttribute("aria-expanded", "true");
		}

		// Add click outside listener
		setTimeout(() => {
			document.addEventListener("click", this.handleOutsideClick);
		}, 0);

		this.dispatchEvent(new CustomEvent("lc-popover-open", { bubbles: true }));
	}

	/**
	 * Closes the popover
	 */
	close() {
		this.removeAttribute("open");

		const trigger =
			this.querySelector('.lc-popover-trigger [slot="trigger"]') ||
			this.querySelector(".lc-popover-trigger")?.firstElementChild;

		if (trigger) {
			trigger.setAttribute("aria-expanded", "false");
		}

		// Remove click outside listener
		document.removeEventListener("click", this.handleOutsideClick);

		this.dispatchEvent(new CustomEvent("lc-popover-close", { bubbles: true }));
	}

	/**
	 * Toggles the popover
	 */
	toggle() {
		if (this.hasAttribute("open")) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * Handles clicks outside the popover
	 * @param {MouseEvent} event
	 */
	handleOutsideClick(event) {
		if (!this.contains(event.target)) {
			this.close();
		}
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.handleOutsideClick);
	}
}

/**
 * Alert notification component
 *
 * @example
 * <lc-alert type="success" dismissible>
 *   <span slot="title">Success!</span>
 *   Your changes have been saved.
 * </lc-alert>
 */
class LCAlert extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-alert-template");
		this.appendChild(template);

		const closeButton = this.querySelector(".lc-alert-close");
		const iconElement = this.querySelector(".lc-alert-icon svg");

		// Setup close button
		closeButton?.addEventListener("click", () => this.close());

		// Set icon based on type
		this.updateIcon(iconElement);

		// Auto-dismiss if specified
		const autoDismiss = this.getAttribute("auto-dismiss");
		if (autoDismiss) {
			const delay = Number.parseInt(autoDismiss, 10) || 5000;
			setTimeout(() => this.close(), delay);
		}
	}

	/**
	 * Updates the icon based on alert type
	 * @param {SVGElement} iconElement
	 */
	updateIcon(iconElement) {
		if (!iconElement) return;

		const type = getAttributeOr(this, "type", "info");
		let iconPath = "";

		switch (type) {
			case "success":
				iconPath = "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z";
				break;
			case "warning":
				iconPath = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";
				break;
			case "error":
				iconPath =
					"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
				break;
			default:
				iconPath =
					"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z";
				break;
		}

		iconElement.innerHTML = `<path d="${iconPath}"/>`;
	}

	/**
	 * Closes the alert with animation
	 */
	close() {
		const alert = this.querySelector(".lc-alert");

		if (alert) {
			// Animate out
			alert.style.transition = "opacity 0.3s ease, transform 0.3s ease";
			alert.style.opacity = "0";
			alert.style.transform = "translateY(-10px)";

			// Remove after animation
			setTimeout(() => {
				this.remove();
				this.dispatchEvent(
					new CustomEvent("lc-alert-close", { bubbles: true }),
				);
			}, 300);
		} else {
			this.remove();
		}
	}

	/**
	 * Shows the alert (if hidden)
	 */
	show() {
		this.style.display = "block";
		this.dispatchEvent(new CustomEvent("lc-alert-show", { bubbles: true }));
	}

	/**
	 * Hides the alert (without removing from DOM)
	 */
	hide() {
		this.style.display = "none";
		this.dispatchEvent(new CustomEvent("lc-alert-hide", { bubbles: true }));
	}
}

// Define custom elements
customElements.define("lc-dialog", LCDialog);
customElements.define("lc-tooltip", LCTooltip);
customElements.define("lc-popover", LCPopover);
customElements.define("lc-alert", LCAlert);

// Export for use in other modules
export { LCAlert, LCDialog, LCPopover, LCTooltip };
