// @ts-nocheck
/**
 * Legacy Concierge Header Component
 * Custom element for consistent header across all pages
 */

import { cloneTemplate } from "/common/core/component-loader.js";
import { getAttributeOr } from "/common/core/helpers.js";

class LCHeader extends HTMLElement {
	constructor() {
		super();
		this.navToggle = null;
		this.mainNav = null;
	}

	/**
	 * Called when element is inserted into DOM
	 */
	connectedCallback() {
		this.render();
		this.fixNavigationPaths();
		this.setupNavigation();
		this.markActivePage();
	}

	/**
	 * Render the header from template
	 */
	render() {
		const template = cloneTemplate("lc-header-template");
		if (!template) {
			console.error("Header template not found");
			return;
		}

		// Insert template content
		this.appendChild(template);

		// Cache DOM references
		this.navToggle = this.querySelector(".nav-toggle");
		this.mainNav = this.querySelector("#main-nav");
		this.header = this.querySelector("header");

		// Apply variant if specified
		const variant = getAttributeOr(this, "variant", "default");
		if (variant !== "default") {
			this.header?.classList.add(`header-${variant}`);
		}

		// Check if transparent header (hero section)
		if (this.hasAttribute("transparent")) {
			this.header?.classList.add("transparent-header");
		}

		// Check if solid header (no hero section) - backwards compatibility
		if (this.hasAttribute("solid")) {
			this.header?.classList.add("solid-header");
		}
	}

	/**
	 * Fix navigation paths for GitHub Pages deployment
	 */
	fixNavigationPaths() {
		const path = window.location.pathname;
		const pathParts = path.split("/").filter((p) => p);

		// Detect GitHub Pages base path (e.g., /legacyconcierge/)
		let basePath = "";
		if (
			pathParts.length > 0 &&
			pathParts[0] !== "pages" &&
			!pathParts[0].includes(".html")
		) {
			// First segment looks like a repository name
			basePath = `/${pathParts[0]}`;
		}

		// If we have a base path, update all navigation links
		if (basePath) {
			const links = this.querySelectorAll("nav a[href]");
			for (const link of links) {
				const href = link.getAttribute("href");
				// Only update absolute paths starting with /
				if (href?.startsWith("/") && !href.startsWith(basePath)) {
					link.setAttribute("href", basePath + href);
				}
			}
		}
	}

	/**
	 * Setup navigation functionality
	 */
	setupNavigation() {
		if (!this.navToggle || !this.mainNav) return;

		const nav = this.querySelector("nav");

		// Enhance ARIA and IDs for all submenu triggers
		this.enhanceAria();

		// Mobile menu toggle
		this.navToggle.addEventListener("click", () => {
			const isOpen = this.mainNav?.classList.toggle("open");
			this.navToggle?.classList.toggle("open");
			this.navToggle.setAttribute("aria-expanded", isOpen);
		});

		// Close menu when clicking outside
		document.addEventListener("click", (event) => {
			if (
				!nav.contains(event.target) &&
				this.mainNav?.classList.contains("open")
			) {
				this.mainNav?.classList.remove("open");
				this.navToggle?.classList.remove("open");
				this.navToggle.setAttribute("aria-expanded", "false");
			}
		});

		// Close menu on Escape key
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && this.mainNav?.classList.contains("open")) {
				this.mainNav?.classList.remove("open");
				this.navToggle?.classList.remove("open");
				this.navToggle.setAttribute("aria-expanded", "false");
				this.navToggle.focus();
			}
		});

		// Dropdown keyboard navigation
		this.setupDropdownNavigation();

		// Mobile-first click-to-expand for submenu triggers
		this.setupMobileSubmenuToggles();

		// Viewport-aware dropdowns
		this.setupViewportAwareDropdowns();

		// Scroll effects
		this.setupScrollEffects();
	}

	/**
	 * Setup keyboard navigation for dropdowns
	 */
	setupDropdownNavigation() {
		const dropdownToggles = this.querySelectorAll('[aria-haspopup="true"]');

		for (const toggle of dropdownToggles) {
			const parent = toggle.parentElement;
			const submenu = parent.querySelector(".dropdown-menu, .dropdown-submenu");

			// Arrow Down to open dropdown and focus first item
			toggle.addEventListener("keydown", (event) => {
				if (event.key === "ArrowDown") {
					event.preventDefault();
					toggle.setAttribute("aria-expanded", "true");

					if (submenu) {
						const firstLink = submenu.querySelector("a");
						if (firstLink) {
							firstLink.focus();
						}
					}
				}

				// Escape to close dropdown
				if (event.key === "Escape") {
					event.preventDefault();
					toggle.setAttribute("aria-expanded", "false");
					toggle.focus();
				}
			});

			// Handle keyboard navigation within submenus
			if (submenu) {
				const submenuLinks = Array.from(submenu.querySelectorAll("a"));
				for (let index = 0; index < submenuLinks.length; index++) {
					const link = submenuLinks[index];
					link.addEventListener("keydown", (event) => {
						// Arrow Down - next item
						if (event.key === "ArrowDown") {
							event.preventDefault();
							const nextLink = submenuLinks[index + 1];
							if (nextLink) {
								nextLink.focus();
							}
						}

						// Arrow Up - previous item
						if (event.key === "ArrowUp") {
							event.preventDefault();
							const prevLink = submenuLinks[index - 1];
							if (prevLink) {
								prevLink.focus();
							} else {
								toggle.focus();
							}
						}

						// Arrow Right - open nested submenu
						if (event.key === "ArrowRight") {
							const parentLi = link.parentElement;
							const nestedSubmenu = parentLi.querySelector(".dropdown-submenu");
							if (nestedSubmenu) {
								event.preventDefault();
								const firstNestedLink = nestedSubmenu.querySelector("a");
								if (firstNestedLink) {
									firstNestedLink.focus();
								}
							}
						}

						// Arrow Left - close submenu and return to parent
						if (event.key === "ArrowLeft") {
							const isInSubmenu = link.closest(".dropdown-submenu");
							if (isInSubmenu) {
								event.preventDefault();
								const parentLink = isInSubmenu.parentElement.querySelector("a");
								if (parentLink) {
									parentLink.focus();
								}
							}
						}

						// Escape - close all and return to main toggle
						if (event.key === "Escape") {
							event.preventDefault();
							toggle.setAttribute("aria-expanded", "false");
							toggle.focus();
						}
					});
				}
			}

			// Update aria-expanded on hover for mouse users
			parent.addEventListener("mouseenter", () => {
				toggle.setAttribute("aria-expanded", "true");
			});

			parent.addEventListener("mouseleave", () => {
				toggle.setAttribute("aria-expanded", "false");
			});
		}
	}

	/**
	 * Ensure submenu triggers have proper ARIA and unique controls
	 */
	enhanceAria() {
		let idCounter = 0;
		const nav = this.querySelector("nav");
		if (!nav) return;

		// Find any li that directly contains a submenu ul
		const submenuParents = nav.querySelectorAll(
			"li > ul.dropdown-menu, li > ul.dropdown-submenu",
		);
		for (const submenu of submenuParents) {
			const parentLi = submenu.parentElement;
			const trigger = parentLi.querySelector(":scope > a, :scope > button");
			if (!trigger) continue;

			if (!submenu.id) {
				submenu.id = `nav-submenu-${++idCounter}`;
			}
			trigger.setAttribute("aria-haspopup", "true");
			trigger.setAttribute("aria-expanded", "false");
			trigger.setAttribute("aria-controls", submenu.id);
		}
	}

	/**
	 * On mobile, intercept single click on submenu triggers to expand instead of navigating
	 */
	setupMobileSubmenuToggles() {
		const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
		const triggers = this.querySelectorAll('[aria-haspopup="true"]');

		for (const trigger of triggers) {
			trigger.addEventListener("click", (event) => {
				// Only intercept when mobile and the main nav is open
				if (!isMobile() || !this.mainNav?.classList.contains("open")) return;

				const parentLi = trigger.closest("li");
				const submenu = parentLi?.querySelector(":scope > ul");
				if (!submenu) return;

				const expanded = trigger.getAttribute("aria-expanded") === "true";
				if (!expanded) {
					// First tap: expand submenu and prevent navigation
					event.preventDefault();
					parentLi?.classList.add("expanded");
					trigger.setAttribute("aria-expanded", "true");
					return;
				}
				// If already expanded, allow navigation
			});
		}

		// Close expanded submenus when closing the mobile menu
		this.navToggle?.addEventListener("click", () => {
			if (!this.mainNav?.classList.contains("open")) {
				for (const li of this.mainNav?.querySelectorAll(".expanded") ?? []) {
					li.classList.remove("expanded");
					const a = li.querySelector(":scope > a");
					a?.setAttribute("aria-expanded", "false");
				}
			}
		});
	}

	/**
	 * Setup viewport-aware dropdowns
	 */
	setupViewportAwareDropdowns() {
		const nav = this.querySelector("nav");
		if (!nav) return;

		// Attach to any li that directly contains a submenu, at any depth
		const allParents = nav.querySelectorAll("li");
		for (const li of allParents) {
			li.addEventListener("mouseenter", function () {
				const submenu = this.querySelector(":scope > .dropdown-submenu");
				if (submenu) {
					const rect = submenu.getBoundingClientRect();
					const vw = window.innerWidth;
					if (rect.right > vw && vw > 0) {
						submenu.classList.add("opens-left");
					} else {
						submenu.classList.remove("opens-left");
					}
				}
			});

			li.addEventListener("mouseleave", function () {
				const submenu = this.querySelector(":scope > .dropdown-submenu");
				if (submenu) submenu.classList.remove("opens-left");
			});
		}
	}

	/**
	 * Setup scroll effects
	 */
	setupScrollEffects() {
		if (!this.header) return;

		window.addEventListener("scroll", () => {
			if (window.scrollY > 50) {
				this.header?.classList.add("scrolled");
			} else {
				this.header?.classList.remove("scrolled");
			}
		});
	}

	/**
	 * Mark active page in navigation
	 */
	markActivePage() {
		const currentPath = window.location.pathname;
		const links = this.querySelectorAll("nav a[href]");

		for (const link of links) {
			const href = link.getAttribute("href");
			if (href === currentPath || currentPath.startsWith(`${href}/`)) {
				link.setAttribute("aria-current", "page");
				break;
			}
		}
	}
}

// Register the custom element
customElements.define("lc-header", LCHeader);
