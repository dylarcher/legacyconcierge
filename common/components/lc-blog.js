// @ts-nocheck
/**
 * Blog Components for Legacy Concierge
 * Provides reusable components for blog pages
 *
 * Components:
 * - <lc-blog-card>: Blog post preview card
 * - <lc-blog-meta>: Post metadata display
 * - <lc-blog-filter>: Search and filter interface
 * - <lc-blog-grid>: Responsive blog grid layout
 */

import { cloneTemplate } from "@/core/component-loader.js";
import { getBooleanAttribute } from "@/core/helpers.js";

/**
 * Blog card component for post previews
 *
 * @example
 * <lc-blog-card href="/blog/post-1" category="Health Tips">
 *   <img slot="image" src="..." alt="...">
 *   <h3 slot="title">Post Title</h3>
 *   <p slot="excerpt">Post excerpt...</p>
 *   <lc-blog-meta slot="meta">...</lc-blog-meta>
 * </lc-blog-card>
 */
class LCBlogCard extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-blog-card-template");
		this.appendChild(template);

		const card = this.querySelector(".lc-blog-card");
		const href = this.getAttribute("href");

		// Make entire card clickable if href provided
		if (href) {
			card.style.cursor = "pointer";
			card.addEventListener("click", (event) => {
				// Don't navigate if clicking on a link inside
				if (event.target.tagName !== "A") {
					window.location.href = href;
				}
			});
		}

		// Set category
		const category = this.getAttribute("category");
		if (category) {
			const categorySlot = this.querySelector('[slot="category"]');
			if (!categorySlot) {
				const categorySpan = document.createElement("span");
				categorySpan.setAttribute("slot", "category");
				categorySpan.textContent = category;
				this.insertBefore(categorySpan, this.firstChild);
			}
		}

		// Set data attribute for filtering
		const categoryAttr = this.getAttribute("data-category");
		if (categoryAttr) {
			card.setAttribute("data-category", categoryAttr);
		}
	}
}

/**
 * Blog meta component for displaying post metadata
 *
 * @example
 * <lc-blog-meta author="Dr. Sarah Johnson" date="October 19, 2025" reading-time="5 min read">
 * </lc-blog-meta>
 */
class LCBlogMeta extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-blog-meta-template");
		this.appendChild(template);

		// Set author
		const author = this.getAttribute("author");
		if (author) {
			const authorSlot = this.querySelector('[slot="author"]');
			if (!authorSlot) {
				const authorSpan = document.createElement("span");
				authorSpan.setAttribute("slot", "author");
				authorSpan.textContent = author;
				this.insertBefore(authorSpan, this.firstChild);
			}
		}

		// Set date
		const date = this.getAttribute("date");
		if (date) {
			const dateSlot = this.querySelector('[slot="date"]');
			if (!dateSlot) {
				const dateSpan = document.createElement("span");
				dateSpan.setAttribute("slot", "date");
				dateSpan.textContent = date;
				this.insertBefore(dateSpan, this.firstChild);
			}
		}

		// Set reading time
		const readingTime = this.getAttribute("reading-time");
		if (readingTime) {
			const timeSlot = this.querySelector('[slot="reading-time"]');
			if (!timeSlot) {
				const timeSpan = document.createElement("span");
				timeSpan.setAttribute("slot", "reading-time");
				timeSpan.textContent = readingTime;
				this.insertBefore(timeSpan, this.firstChild);
			}
		}

		// Hide empty sections
		this.hideEmptyMetaItems();
	}

	/**
	 * Hides empty meta items
	 */
	hideEmptyMetaItems() {
		const meta = this.querySelector(".lc-blog-meta");
		if (!meta) return;

		const items = meta.querySelectorAll(
			".lc-blog-meta-author, .lc-blog-meta-date, .lc-blog-meta-reading-time",
		);

		for (const item of items) {
			const slot = item.querySelector("slot");
			if (slot && slot.assignedNodes().length === 0) {
				// Check if content is empty
				const content = item.textContent.trim();
				if (!content || content === "" || content.match(/^\s*$/)) {
					item.style.display = "none";
				}
			}
		}
	}
}

/**
 * Blog filter component for search and category filtering
 *
 * @example
 * <lc-blog-filter target="#blog-grid">
 *   <button data-category="all">All</button>
 *   <button data-category="health">Health Tips</button>
 *   <button data-category="care">Care Guide</button>
 * </lc-blog-filter>
 */
class LCBlogFilter extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-blog-filter-template");
		this.appendChild(template);

		const searchInput = this.querySelector(".lc-blog-filter-search-input");
		const searchButton = this.querySelector(".lc-blog-filter-search-button");

		// Get target selector for filtering
		const target = this.getAttribute("target");

		// Setup search
		if (searchInput && searchButton) {
			const performSearch = () => {
				const query = searchInput.value.toLowerCase().trim();
				this.filterBySearch(query, target);
			};

			searchButton.addEventListener("click", performSearch);
			searchInput.addEventListener("keyup", (event) => {
				if (event.key === "Enter") {
					performSearch();
				}
			});

			// Real-time search if enabled
			if (getBooleanAttribute(this, "live-search")) {
				searchInput.addEventListener("input", () => {
					performSearch();
				});
			}
		}

		// Setup category filters
		this.setupCategoryFilters(target);
	}

	/**
	 * Sets up category filter buttons
	 * @param {string} target - Target selector
	 */
	setupCategoryFilters(target) {
		const buttons = this.querySelectorAll("[data-category]");

		for (const button of buttons) {
			button.addEventListener("click", () => {
				const category = button.getAttribute("data-category");

				// Update active state
				for (const btn of buttons) {
					btn?.classList.remove("active");
				}
				button?.classList.add("active");

				// Filter posts
				this.filterByCategory(category, target);
			});
		}
	}

	/**
	 * Filters posts by search query
	 * @param {string} query - Search query
	 * @param {string} target - Target selector
	 */
	filterBySearch(query, target) {
		if (!target) return;

		const container = document.querySelector(target);
		if (!container) return;

		const cards = container.querySelectorAll(
			"lc-blog-card, .lc-blog-card, [data-searchable]",
		);

		for (const card of cards) {
			const title =
				card
					.querySelector('[slot="title"], .lc-blog-card-title')
					?.textContent.toLowerCase() || "";
			const excerpt =
				card
					.querySelector('[slot="excerpt"], .lc-blog-card-excerpt')
					?.textContent.toLowerCase() || "";

			if (query === "" || title.includes(query) || excerpt.includes(query)) {
				card.style.display = "";
			} else {
				card.style.display = "none";
			}
		}

		this.dispatchEvent(
			new CustomEvent("lc-filter-search", {
				detail: { query },
				bubbles: true,
			}),
		);
	}

	/**
	 * Filters posts by category
	 * @param {string} category - Category to filter by
	 * @param {string} target - Target selector
	 */
	filterByCategory(category, target) {
		if (!target) return;

		const container = document.querySelector(target);
		if (!container) return;

		const cards = container.querySelectorAll(
			"lc-blog-card, .lc-blog-card, [data-category]",
		);

		for (const card of cards) {
			const cardCategory = card.getAttribute("data-category");

			if (category === "all" || cardCategory === category) {
				card.style.display = "";
			} else {
				card.style.display = "none";
			}
		}

		this.dispatchEvent(
			new CustomEvent("lc-filter-category", {
				detail: { category },
				bubbles: true,
			}),
		);
	}

	/**
	 * Resets all filters
	 */
	reset() {
		const searchInput = this.querySelector(".lc-blog-filter-search-input");
		if (searchInput) {
			searchInput.value = "";
		}

		const target = this.getAttribute("target");
		if (target) {
			const container = document.querySelector(target);
			const cards = container?.querySelectorAll(
				"lc-blog-card, .lc-blog-card, [data-category]",
			);

			if (cards) {
				for (const card of cards) {
					card.style.display = "";
				}
			}
		}

		// Reset active category
		const buttons = this.querySelectorAll("[data-category]");
		const allButton = this.querySelector('[data-category="all"]');

		for (const btn of buttons) {
			btn?.classList.remove("active");
		}
		allButton?.classList.add("active");
	}
}

/**
 * Blog grid component for responsive layout
 *
 * @example
 * <lc-blog-grid columns="3" gap="2rem">
 *   <lc-blog-card>...</lc-blog-card>
 *   <lc-blog-card>...</lc-blog-card>
 * </lc-blog-grid>
 */
class LCBlogGrid extends HTMLElement {
	connectedCallback() {
		const template = cloneTemplate("lc-blog-grid-template");
		this.appendChild(template);

		const grid = this.querySelector(".lc-blog-grid");

		// Set custom columns if specified
		const columns = this.getAttribute("columns");
		if (columns) {
			grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${this.getMinWidth(columns)}, 1fr))`;
		}

		// Set custom gap if specified
		const gap = this.getAttribute("gap");
		if (gap) {
			grid.style.gap = gap;
		}

		// Set minimum column width if specified
		const minWidth = this.getAttribute("min-width");
		if (minWidth) {
			grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
		}
	}

	/**
	 * Gets minimum width based on column count
	 * @param {string} columns - Number of columns
	 * @returns {string}
	 */
	getMinWidth(columns) {
		const columnMap = {
			1: "100%",
			2: "400px",
			3: "350px",
			4: "300px",
			5: "250px",
		};

		return columnMap[columns] || "350px";
	}
}

// Define custom elements
customElements.define("lc-blog-card", LCBlogCard);
customElements.define("lc-blog-meta", LCBlogMeta);
customElements.define("lc-blog-filter", LCBlogFilter);
customElements.define("lc-blog-grid", LCBlogGrid);

// Export for use in other modules
export { LCBlogCard, LCBlogFilter, LCBlogGrid, LCBlogMeta };
