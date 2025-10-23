// @ts-nocheck
/**
 * lc-icon Web Component
 *
 * A reusable icon component that renders SVG icons from the assets/icons/ directory.
 * Replaces emoji usage with semantic, accessible, and themeable SVG icons.
 *
 * @example
 * <lc-icon name="heart" size="medium" color="primary"></lc-icon>
 * <lc-icon name="home" size="large" aria-label="Home page"></lc-icon>
 * <lc-icon name="call" size="small" color="var(--custom-color)"></lc-icon>
 *
 * @attributes
 * - name: Icon name without 'icon-' prefix and '.svg' extension (e.g., "heart", "home")
 * - size: Predefined size - 'small' (1.5rem), 'medium' (2.5rem), 'large' (3.5rem), or custom CSS value
 * - color: Color value - 'primary', 'secondary', 'inherit', or any CSS color
 * - aria-label: Accessible label for screen readers
 */

class LcIcon extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	// Observed attributes for reactivity
	static get observedAttributes() {
		return ["name", "size", "color", "aria-label"];
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback(_name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	// Get the path to icon using root-relative path
	getIconPath() {
		const iconName = this.getAttribute("name") || "home";
		// Use resolvePath for GitHub Pages compatibility
		const path = `shared/assets/icons/icon-${iconName}.svg`;
		return window.resolvePath ? window.resolvePath(path) : `/${path}`;
	}

	// Size mapping
	getSizeValue() {
		const size = this.getAttribute("size") || "medium";
		const sizeMap = {
			small: "1.5rem",
			medium: "2.5rem",
			large: "3.5rem",
			xlarge: "4.5rem",
		};
		return sizeMap[size] || size; // Allow custom CSS values
	}

	// Color mapping
	getColorValue() {
		const color = this.getAttribute("color") || "primary";
		const colorMap = {
			primary: "var(--color-warm-tan, #C9A876)",
			secondary: "var(--color-dark-blue, #0B2935)",
			inherit: "currentColor",
			white: "var(--color-white, #FFFFFF)",
			accent: "var(--color-sage, #9FBDBF)",
		};
		return colorMap[color] || color; // Allow custom CSS colors
	}

	async loadIcon() {
		const iconPath = this.getIconPath();

		try {
			const response = await fetch(iconPath);
			if (!response.ok) {
				console.warn(`Icon not found: ${iconPath}`);
				return this.renderFallback();
			}

			const svgText = await response.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
			const svg = svgDoc.querySelector("svg");

			if (!svg) {
				console.warn(`Invalid SVG: ${iconPath}`);
				return this.renderFallback();
			}

			// Set size
			const size = this.getSizeValue();
			svg.setAttribute("width", size);
			svg.setAttribute("height", size);

			// Set color by updating fill="currentcolor" paths
			const color = this.getColorValue();
			svg.querySelectorAll('[fill="currentcolor"]').forEach((el) => {
				el.setAttribute("fill", color);
			});

			// Add accessibility
			const ariaLabel = this.getAttribute("aria-label");
			if (ariaLabel) {
				svg.setAttribute("aria-label", ariaLabel);
				svg.setAttribute("role", "img");
			} else {
				svg.setAttribute("aria-hidden", "true");
			}

			// Add class for styling hooks
			svg.classList.add("lc-icon-svg");

			return svg;
		} catch (error) {
			console.error(`Error loading icon: ${iconPath}`, error);
			return this.renderFallback();
		}
	}

	renderFallback() {
		const span = document.createElement("span");
		span.textContent = "●";
		span.setAttribute("aria-hidden", "true");
		span.classList.add("lc-icon-fallback");
		return span;
	}

	async render() {
		const size = this.getSizeValue();
		const color = this.getColorValue();

		// Create styles
		const style = document.createElement("style");
		style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .lc-icon-svg {
        display: block;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
      }

      :host([interactive]) .lc-icon-svg,
      :host-context(button:hover) .lc-icon-svg,
      :host-context(a:hover) .lc-icon-svg,
      :host-context(.service-card:hover) .lc-icon-svg,
      :host-context(.bento-card:hover) .lc-icon-svg {
        transform: scale(1.1);
      }

      :host([spin]) .lc-icon-svg {
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .lc-icon-fallback {
        display: block;
        font-size: ${size};
        color: ${color};
      }

      /* Responsive sizing */
      @media (max-width: 768px) {
        .lc-icon-svg {
          width: calc(${size} * 0.85);
          height: calc(${size} * 0.85);
        }
      }
    `;

		// Clear shadow root
		this.shadowRoot.innerHTML = "";
		this.shadowRoot.appendChild(style);

		// Load and append icon
		const iconElement = await this.loadIcon();
		this.shadowRoot.appendChild(iconElement);
	}
}

// Register the custom element
customElements.define("lc-icon", LcIcon);

// Export for module systems
export default LcIcon;
