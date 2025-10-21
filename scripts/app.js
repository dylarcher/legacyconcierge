/**
 * Main Application Module
 * Handles navigation, mobile menu, scroll effects, keyboard navigation,
 * and viewport-aware dropdowns
 */

document.addEventListener("DOMContentLoaded", () => {
	const nav = document.querySelector("nav");
	const header = document.querySelector("header");

	// Check if this is a subpage (no hero section) and apply solid header
	const heroSection = document.querySelector("#hero");
	if (!heroSection && header) {
		header?.classList.add("solid-header");
	}

	// Mobile navigation toggle
	const navToggle = document.querySelector(".nav-toggle");
	const navMenu = document.querySelector("#main-nav");

	if (navToggle && navMenu) {
		navToggle.addEventListener("click", () => {
			const isOpen = navMenu?.classList.toggle("open");
			navToggle?.classList.toggle("open");
			navToggle.setAttribute("aria-expanded", isOpen);
		});

		// Close menu when clicking outside
		document.addEventListener("click", (event) => {
			if (!nav.contains(event.target) && navMenu?.classList.contains("open")) {
				navMenu?.classList.remove("open");
				navToggle?.classList.remove("open");
				navToggle.setAttribute("aria-expanded", "false");
			}
		});

		// Close menu on Escape key
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && navMenu?.classList.contains("open")) {
				navMenu?.classList.remove("open");
				navToggle?.classList.remove("open");
				navToggle.setAttribute("aria-expanded", "false");
				navToggle.focus();
			}
		});
	}

	// Header scroll effect
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header?.classList.add("scrolled");
		} else {
			header?.classList.remove("scrolled");
		}
	});

    // Fade-in animations on scroll
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target?.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.1 });

    for (const element of fadeInElements) {
        observer.observe(element);
    }

    // Viewport-aware dropdowns
    const dropdownLi = document.querySelectorAll('.dropdown-menu > li');
    for (const li of dropdownLi) {
        li.addEventListener('mouseenter', function() {
            const submenu = this.querySelector('.dropdown-submenu');
            if (submenu) {
                const submenuRect = submenu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                if (submenuRect.right > viewportWidth) {
                    submenu?.classList.add('opens-left');
                }
            }
        });

        li.addEventListener('mouseleave', function() {
            const submenu = this.querySelector('.dropdown-submenu');
            if (submenu) {
                submenu?.classList.remove('opens-left');
            }
        });
    }

    // Keyboard navigation for dropdowns
    const dropdownToggles = document.querySelectorAll('[aria-haspopup="true"]');
    for (const toggle of dropdownToggles) {
        const parent = toggle.parentElement;
        const submenu = parent.querySelector('.dropdown-menu, .dropdown-submenu');

        // Arrow Down to open dropdown and focus first item
        toggle.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                toggle.setAttribute('aria-expanded', 'true');

                if (submenu) {
                    const firstLink = submenu.querySelector('a');
                    if (firstLink) {
                        firstLink.focus();
                    }
                }
            }

            // Escape to close dropdown
            if (event.key === 'Escape') {
                event.preventDefault();
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });

        // Handle keyboard navigation within submenus
        if (submenu) {
            const submenuLinks = Array.from(submenu.querySelectorAll('a'));
            for (let index = 0; index < submenuLinks.length; index++) {
                const link = submenuLinks[index];
                link.addEventListener('keydown', (event) => {
                    // Arrow Down - next item
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const nextLink = submenuLinks[index + 1];
                        if (nextLink) {
                            nextLink.focus();
                        }
                    }

                    // Arrow Up - previous item
                    if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const prevLink = submenuLinks[index - 1];
                        if (prevLink) {
                            prevLink.focus();
                        } else {
                            // Return to parent toggle
                            toggle.focus();
                        }
                    }

                    // Arrow Right - open submenu if exists
                    if (event.key === 'ArrowRight') {
                        const parentLi = link.parentElement;
                        const nestedSubmenu = parentLi.querySelector('.dropdown-submenu');
                        if (nestedSubmenu) {
                            event.preventDefault();
                            const firstNestedLink = nestedSubmenu.querySelector('a');
                            if (firstNestedLink) {
                                firstNestedLink.focus();
                            }
                        }
                    }

                    // Arrow Left - close submenu and return to parent
                    if (event.key === 'ArrowLeft') {
                        const isInSubmenu = link.closest('.dropdown-submenu');
                        if (isInSubmenu) {
                            event.preventDefault();
                            const parentLink = isInSubmenu.parentElement.querySelector('a');
                            if (parentLink) {
                                parentLink.focus();
                            }
                        }
                    }

                    // Escape - close all and return to main toggle
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        toggle.setAttribute('aria-expanded', 'false');
                        toggle.focus();
                    }
                });
            }
        }

        // Update aria-expanded on hover for mouse users
        parent.addEventListener('mouseenter', () => {
            toggle.setAttribute('aria-expanded', 'true');
        });

        parent.addEventListener('mouseleave', () => {
            toggle.setAttribute('aria-expanded', 'false');
        });
    }
});
