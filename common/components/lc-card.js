/**
 * Legacy Concierge Card Components
 * Custom elements for various card types
 */

import { cloneTemplate } from "@/core/component-loader.js";
import { getAttributeOr, getBooleanAttribute } from "@/core/helpers.js";

/**
 * Base Card Component
 */
class LCCard extends HTMLElement {
	/**
	 * Get base path for resource loading (handles GitHub Pages deployment)
	 */
	getBasePath() {
		const path = window.location.pathname;
		const pathParts = path.split("/").filter((p) => p);

		// Check if first segment looks like a GitHub Pages repo name
		if (
			pathParts.length > 0 &&
			pathParts[0] !== "pages" &&
			!pathParts[0].includes(".html")
		) {
			return `/${pathParts[0]}/`;
		}
		return "/";
	}

	connectedCallback() {
		// Don't reinitialize if already set up
		if (this.shadowRoot) return;

		const variant = getAttributeOr(this, "variant", "base");
		const templateId = `lc-card-${variant}-template`;

		const template = cloneTemplate(templateId);
		if (!template) {
			console.warn(`Card template not found: ${templateId}`);
			return;
		}

		// Create shadow DOM
		const shadow = this.attachShadow({ mode: "open" });

		// Create a link element to import global styles (more reliable than @import in Shadow DOM)
		const basePath = this.getBasePath();
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = `${basePath}shared/theme/style.css`;
		shadow.appendChild(link);

		// Add host styles
		const style = document.createElement("style");
		style.textContent = `
      :host {
        display: contents;
      }
    `;
		shadow.appendChild(style);

		// Append the template to shadow DOM
		shadow.appendChild(template);

		// Add variant class
		const card = shadow.querySelector(".card");
		if (card && variant !== "base") {
			card?.classList.add(`card-${variant}`);
		}

		// Handle clickable cards
		if (this.hasAttribute("href")) {
			this.makeClickable();
		}

		// Handle elevation
		const elevation = getAttributeOr(this, "elevation", null);
		if (elevation && card) {
			card?.classList.add(`elevation-${elevation}`);
		}

		// Handle animations
		if (getBooleanAttribute(this, "animated")) {
			this.setupAnimations();
		}
	}

	/**
	 * Make the entire card clickable
	 */
	makeClickable() {
		const href = this.getAttribute("href");
		const target = getAttributeOr(this, "target", "_self");
		const card = this.shadowRoot?.querySelector(".card");

		if (!card) return;

		card.style.cursor = "pointer";
		card.setAttribute("role", "link");
		card.setAttribute("tabindex", "0");

		const handleClick = (e) => {
			if (e.target.tagName === "A" || e.target.closest("a")) {
				return; // Don't interfere with nested links
			}

			if (
				e.type === "click" ||
				(e.type === "keydown" && (e.key === "Enter" || e.key === " "))
			) {
				if (e.type === "keydown") e.preventDefault();
				window.open(href, target);
			}
		};

		card.addEventListener("click", handleClick);
		card.addEventListener("keydown", handleClick);
	}

	/**
	 * Setup scroll animations
	 */
	setupAnimations() {
		const card = this.shadowRoot?.querySelector(".card");
		if (!card) return;

		card?.classList.add("fade-in");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target?.classList.add("visible");
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(card);
	}
}

/**
 * Card Grid Component
 */
class LCCardGrid extends HTMLElement {
	/**
	 * Get base path for resource loading (handles GitHub Pages deployment)
	 */
	getBasePath() {
		const path = window.location.pathname;
		const pathParts = path.split("/").filter((p) => p);

		// Check if first segment looks like a GitHub Pages repo name
		if (
			pathParts.length > 0 &&
			pathParts[0] !== "pages" &&
			!pathParts[0].includes(".html")
		) {
			return `/${pathParts[0]}/`;
		}
		return "/";
	}

	connectedCallback() {
		// Don't reinitialize if already set up
		if (this.shadowRoot) return;

		const template = cloneTemplate("lc-card-grid-template");
		if (!template) {
			console.error("Card grid template not found");
			return;
		}

		// Create shadow DOM
		const shadow = this.attachShadow({ mode: "open" });

		// Get column and gap settings
		const columns = getAttributeOr(this, "columns", "5rem");
		const gap = getAttributeOr(this, "gap", "1rem");

		// Create a style element with grid styles
		const style = document.createElement("style");
		
			/**
		// Always use responsive columns to prevent overflow
		const gridColumns =
			columns === "auto"
				? "repeat(auto-fit, minmax(260px, 1fr))"
				: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`;
		*/
		style.textContent = `
      :host {
        display: contents;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
				gap: ${gap};
        width: 100%;
      }

      /* Responsive breakpoints for fixed column counts */
			/**
      ${columns !== "auto" ? `
      @media (min-width: 1200px) {
        .card-grid {
          grid-template-columns: repeat(auto-fit, minmax(${columns}, 1fr));
					row-gap: ${gap};
					column-gap: calc(${gap} + 1.5rem);
        }
      }

      @media (min-width: 768px) and (max-width: 1199px) {
        .card-grid {
          grid-template-columns: repeat(${Math.min(3, parseInt(columns, 10))}, 1fr);
        }
      }

      @media (min-width: 480px) and (max-width: 767px) {
        .card-grid {
          grid-template-columns: repeat(${Math.min(2, parseInt(columns, 10))}, 1fr);
        }
      }

      @media (max-width: 479px) {
        .card-grid {
          grid-template-columns: 1fr;
        }
      }
				*/
      ` : ''}
    `;
		shadow.appendChild(style);
		shadow.appendChild(template);
	}
}

/**
 * Bento Grid Component (masonry-style with variable sizes)
 */
class LCBentoGrid extends HTMLElement {
	/**
	 * Get base path for resource loading (handles GitHub Pages deployment)
	 */
	getBasePath() {
		const path = window.location.pathname;
		const pathParts = path.split("/").filter((p) => p);

		// Check if first segment looks like a GitHub Pages repo name
		if (
			pathParts.length > 0 &&
			pathParts[0] !== "pages" &&
			!pathParts[0].includes(".html")
		) {
			return `/${pathParts[0]}/`;
		}
		return "/";
	}

	connectedCallback() {
		// Don't reinitialize if already set up
		if (this.shadowRoot) return;

		const template = cloneTemplate("lc-bento-grid-template");
		if (!template) {
			console.error("Bento grid template not found");
			return;
		}

		// Create shadow DOM
		const shadow = this.attachShadow({ mode: "open" });

		// Create a link element to import global styles
		const basePath = this.getBasePath();
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = `${basePath}theme/style.css`;
		shadow.appendChild(link);

		// Add bento grid styles
		const style = document.createElement("style");
		style.textContent = `
      :host {
        display: contents;
      }

      .bento-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        width: 100%;
      }
    `;
		shadow.appendChild(style);
		shadow.appendChild(template);

		// Apply custom grid layout
		this.applyBentoLayout();
	}

	/**
	 * Apply bento box grid layout with varying card sizes
	 */
	applyBentoLayout() {
		const grid = this.shadowRoot?.querySelector(".bento-grid");
		if (!grid) return;

		const cards = grid.querySelectorAll(".bento-card");

		// Define size patterns (can be customized via attributes)
		const sizePattern = getAttributeOr(this, "pattern", "default");
		const patterns = {
			default: [
				{ span: 2, spanRow: 2 }, // Large
				{ span: 1, spanRow: 1 }, // Small
				{ span: 1, spanRow: 1 }, // Small
				{ span: 1, spanRow: 2 }, // Tall
				{ span: 2, spanRow: 1 }, // Wide
				{ span: 1, spanRow: 1 }, // Small
			],
			uniform: [
				{ span: 1, spanRow: 1 }, // All same size
			],
		};

		const pattern = patterns[sizePattern] || patterns.default;

		cards.forEach((card, index) => {
			const size = pattern[index % pattern.length];
			card.style.gridColumn = `span ${size.span}`;
			card.style.gridRow = `span ${size.spanRow}`;
		});
	}
}

// Register custom elements
customElements.define("lc-card", LCCard);
customElements.define("lc-card-grid", LCCardGrid);
customElements.define("lc-bento-grid", LCBentoGrid);
