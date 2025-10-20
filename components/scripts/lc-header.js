/**
 * Legacy Concierge Header Component
 * Custom element for consistent header across all pages
 */

import { cloneTemplate } from '../../scripts/core/component-loader.js';
import { getAttributeOr } from '../../scripts/core/helpers.js';

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
        this.setupNavigation();
        this.markActivePage();
    }

    /**
     * Render the header from template
     */
    render() {
        const template = cloneTemplate('lc-header-template');
        if (!template) {
            console.error('Header template not found');
            return;
        }

        // Insert template content
        this.appendChild(template);

        // Cache DOM references
        this.navToggle = this.querySelector('.nav-toggle');
        this.mainNav = this.querySelector('#main-nav');
        this.header = this.querySelector('header');

        // Apply variant if specified
        const variant = getAttributeOr(this, 'variant', 'default');
        if (variant !== 'default') {
            this.header.classList.add(`header-${variant}`);
        }

        // Check if solid header (no hero section)
        if (this.hasAttribute('solid')) {
            this.header.classList.add('solid-header');
        }
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        if (!this.navToggle || !this.mainNav) return;

        const nav = this.querySelector('nav');

        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            const isOpen = this.mainNav.classList.toggle('open');
            this.navToggle.classList.toggle('open');
            this.navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target) && this.mainNav.classList.contains('open')) {
                this.mainNav.classList.remove('open');
                this.navToggle.classList.remove('open');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.mainNav.classList.contains('open')) {
                this.mainNav.classList.remove('open');
                this.navToggle.classList.remove('open');
                this.navToggle.setAttribute('aria-expanded', 'false');
                this.navToggle.focus();
            }
        });

        // Dropdown keyboard navigation
        this.setupDropdownNavigation();

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
                                toggle.focus();
                            }
                        }

                        // Arrow Right - open nested submenu
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
    }

    /**
     * Setup viewport-aware dropdowns
     */
    setupViewportAwareDropdowns() {
        const dropdownLi = this.querySelectorAll('.dropdown-menu > li');

        for (const li of dropdownLi) {
            li.addEventListener('mouseenter', function() {
                const submenu = this.querySelector('.dropdown-submenu');
                if (submenu) {
                    const submenuRect = submenu.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;

                    if (submenuRect.right > viewportWidth) {
                        submenu.classList.add('opens-left');
                    }
                }
            });

            li.addEventListener('mouseleave', function() {
                const submenu = this.querySelector('.dropdown-submenu');
                if (submenu) {
                    submenu.classList.remove('opens-left');
                }
            });
        }
    }

    /**
     * Setup scroll effects
     */
    setupScrollEffects() {
        if (!this.header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }

    /**
     * Mark active page in navigation
     */
    markActivePage() {
        const currentPath = window.location.pathname;
        const links = this.querySelectorAll('nav a[href]');

        for (const link of links) {
            const href = link.getAttribute('href');
            if (href === currentPath || currentPath.startsWith(href + '/')) {
                link.setAttribute('aria-current', 'page');
                break;
            }
        }
    }
}

// Register the custom element
customElements.define('lc-header', LCHeader);
