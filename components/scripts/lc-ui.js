/**
 * UI Element Components for Legacy Concierge
 * Provides reusable UI elements (badges, tags, buttons, pagination, spinners)
 *
 * Components:
 * - <lc-badge>: Status badges
 * - <lc-tag>: Tag/chip elements
 * - <lc-button>: Enhanced buttons
 * - <lc-pagination>: Page navigation
 * - <lc-spinner>: Loading indicators
 */

import { getAttributeOr, getBooleanAttribute } from '/scripts/core/component-loader.js';

/**
 * Badge component for status indicators
 *
 * @example
 * <lc-badge variant="success">Active</lc-badge>
 * <lc-badge variant="info" dot>3</lc-badge>
 */
class LCBadge extends HTMLElement {
    connectedCallback() {
        const variant = getAttributeOr(this, 'variant', 'default');
        const size = getAttributeOr(this, 'size', 'medium');
        const dot = getBooleanAttribute(this, 'dot');
        const pill = getBooleanAttribute(this, 'pill');

        this.className = `lc-badge lc-badge-${variant} lc-badge-${size}`;

        if (dot) this?.classList.add('lc-badge-dot');
        if (pill) this?.classList.add('lc-badge-pill');
    }
}

/**
 * Tag/chip component
 *
 * @example
 * <lc-tag removable>JavaScript</lc-tag>
 * <lc-tag variant="primary">Featured</lc-tag>
 */
class LCTag extends HTMLElement {
    connectedCallback() {
        const variant = getAttributeOr(this, 'variant', 'default');
        const size = getAttributeOr(this, 'size', 'medium');
        const removable = getBooleanAttribute(this, 'removable');

        // Create tag structure
        const tag = document.createElement('span');
        tag.className = `lc-tag lc-tag-${variant} lc-tag-${size}`;
        tag.textContent = this.textContent;

        // Clear current content
        this.textContent = '';

        // Add remove button if removable
        if (removable) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'lc-tag-remove';
            removeBtn.setAttribute('aria-label', 'Remove tag');
            removeBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
                </svg>
            `;

            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                this.remove();
                this.dispatchEvent(new CustomEvent('lc-tag-remove', {
                    detail: { value: tag.textContent },
                    bubbles: true
                }));
            });

            tag.appendChild(removeBtn);
        }

        this.appendChild(tag);
    }
}

/**
 * Enhanced button component
 *
 * @example
 * <lc-button variant="primary" size="large">Click me</lc-button>
 * <lc-button loading>Loading...</lc-button>
 * <lc-button icon-left="✓">Save</lc-button>
 */
class LCButton extends HTMLElement {
    connectedCallback() {
        const variant = getAttributeOr(this, 'variant', 'default');
        const size = getAttributeOr(this, 'size', 'medium');
        const loading = getBooleanAttribute(this, 'loading');
        const disabled = getBooleanAttribute(this, 'disabled');
        const fullWidth = getBooleanAttribute(this, 'full-width');
        const iconLeft = this.getAttribute('icon-left');
        const iconRight = this.getAttribute('icon-right');

        // Create button
        const button = document.createElement('button');
        button.type = getAttributeOr(this, 'type', 'button');
        button.className = `lc-button lc-button-${variant} lc-button-${size}`;

        if (fullWidth) button?.classList.add('lc-button-full-width');
        if (loading) button?.classList.add('lc-button-loading');
        if (disabled) button.disabled = true;

        // Add content
        const content = document.createElement('span');
        content.className = 'lc-button-content';

        // Icon left
        if (iconLeft) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'lc-button-icon lc-button-icon-left';
            iconSpan.textContent = iconLeft;
            content.appendChild(iconSpan);
        }

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'lc-button-text';
        textSpan.textContent = this.textContent;
        content.appendChild(textSpan);

        // Icon right
        if (iconRight) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'lc-button-icon lc-button-icon-right';
            iconSpan.textContent = iconRight;
            content.appendChild(iconSpan);
        }

        button.appendChild(content);

        // Add loading spinner
        if (loading) {
            const spinner = document.createElement('span');
            spinner.className = 'lc-button-spinner';
            spinner.innerHTML = `
                <svg class="lc-spinner" width="20" height="20" viewBox="0 0 50 50">
                    <circle class="lc-spinner-path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                </svg>
            `;
            button.appendChild(spinner);
        }

        this.textContent = '';
        this.appendChild(button);
    }

    /**
     * Sets loading state
     * @param {boolean} loading
     */
    setLoading(loading) {
        const button = this.querySelector('.lc-button');
        if (!button) return;

        if (loading) {
            button?.classList.add('lc-button-loading');
            button.disabled = true;

            if (!button.querySelector('.lc-button-spinner')) {
                const spinner = document.createElement('span');
                spinner.className = 'lc-button-spinner';
                spinner.innerHTML = `
                    <svg class="lc-spinner" width="20" height="20" viewBox="0 0 50 50">
                        <circle class="lc-spinner-path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
                    </svg>
                `;
                button.appendChild(spinner);
            }
        } else {
            button?.classList.remove('lc-button-loading');
            button.disabled = getBooleanAttribute(this, 'disabled');
            button.querySelector('.lc-button-spinner')?.remove();
        }
    }
}

/**
 * Pagination component
 *
 * @example
 * <lc-pagination total="100" current="1" per-page="10"></lc-pagination>
 */
class LCPagination extends HTMLElement {
    connectedCallback() {
        const total = Number.parseInt(getAttributeOr(this, 'total', '0'), 10);
        const current = Number.parseInt(getAttributeOr(this, 'current', '1'), 10);
        const perPage = Number.parseInt(getAttributeOr(this, 'per-page', '10'), 10);
        const showFirstLast = getBooleanAttribute(this, 'show-first-last');

        const totalPages = Math.ceil(total / perPage);

        this.render(current, totalPages, showFirstLast);
    }

    /**
     * Renders the pagination
     * @param {number} current - Current page
     * @param {number} total - Total pages
     * @param {boolean} showFirstLast - Show first/last buttons
     */
    render(current, total, showFirstLast) {
        this.innerHTML = '';

        const nav = document.createElement('nav');
        nav.className = 'lc-pagination';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Pagination');

        const ul = document.createElement('ul');
        ul.className = 'lc-pagination-list';

        // First button
        if (showFirstLast) {
            ul.appendChild(this.createButton('«', 1, current === 1, 'First page'));
        }

        // Previous button
        ul.appendChild(this.createButton('‹', current - 1, current === 1, 'Previous page'));

        // Page numbers
        const pages = this.getPageRange(current, total);
        for (const page of pages) {
            if (page === '...') {
                ul.appendChild(this.createEllipsis());
            } else {
                ul.appendChild(this.createPageButton(page, current));
            }
        }

        // Next button
        ul.appendChild(this.createButton('›', current + 1, current === total, 'Next page'));

        // Last button
        if (showFirstLast) {
            ul.appendChild(this.createButton('»', total, current === total, 'Last page'));
        }

        nav.appendChild(ul);
        this.appendChild(nav);
    }

    /**
     * Creates a pagination button
     * @param {string} text - Button text
     * @param {number} page - Page number
     * @param {boolean} disabled - Whether button is disabled
     * @param {string} label - ARIA label
     * @returns {HTMLLIElement}
     */
    createButton(text, page, disabled, label) {
        const li = document.createElement('li');
        li.className = 'lc-pagination-item';

        if (disabled) {
            const span = document.createElement('span');
            span.className = 'lc-pagination-link lc-pagination-disabled';
            span.textContent = text;
            span.setAttribute('aria-disabled', 'true');
            li.appendChild(span);
        } else {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'lc-pagination-link';
            a.textContent = text;
            a.setAttribute('aria-label', label);

            a.addEventListener('click', (event) => {
                event.preventDefault();
                this.goToPage(page);
            });

            li.appendChild(a);
        }

        return li;
    }

    /**
     * Creates a page number button
     * @param {number} page - Page number
     * @param {number} current - Current page
     * @returns {HTMLLIElement}
     */
    createPageButton(page, current) {
        const li = document.createElement('li');
        li.className = 'lc-pagination-item';

        const a = document.createElement('a');
        a.href = '#';
        a.className = 'lc-pagination-link';
        a.textContent = String(page);
        a.setAttribute('aria-label', `Page ${page}`);

        if (page === current) {
            a?.classList.add('lc-pagination-active');
            a.setAttribute('aria-current', 'page');
        }

        a.addEventListener('click', (event) => {
            event.preventDefault();
            if (page !== current) {
                this.goToPage(page);
            }
        });

        li.appendChild(a);
        return li;
    }

    /**
     * Creates an ellipsis
     * @returns {HTMLLIElement}
     */
    createEllipsis() {
        const li = document.createElement('li');
        li.className = 'lc-pagination-item';

        const span = document.createElement('span');
        span.className = 'lc-pagination-ellipsis';
        span.textContent = '...';

        li.appendChild(span);
        return li;
    }

    /**
     * Gets the range of pages to display
     * @param {number} current - Current page
     * @param {number} total - Total pages
     * @returns {Array<number|string>}
     */
    getPageRange(current, total) {
        const delta = 2; // Pages to show on each side of current
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (prev && i - prev > 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    }

    /**
     * Navigates to a page
     * @param {number} page - Page number
     */
    goToPage(page) {
        this.setAttribute('current', String(page));

        const total = Number.parseInt(getAttributeOr(this, 'total', '0'), 10);
        const perPage = Number.parseInt(getAttributeOr(this, 'per-page', '10'), 10);
        const showFirstLast = getBooleanAttribute(this, 'show-first-last');
        const totalPages = Math.ceil(total / perPage);

        this.render(page, totalPages, showFirstLast);

        this.dispatchEvent(new CustomEvent('lc-page-change', {
            detail: { page },
            bubbles: true
        }));
    }
}

/**
 * Spinner/loading indicator component
 *
 * @example
 * <lc-spinner size="large"></lc-spinner>
 * <lc-spinner variant="primary">Loading...</lc-spinner>
 */
class LCSpinner extends HTMLElement {
    connectedCallback() {
        const size = getAttributeOr(this, 'size', 'medium');
        const variant = getAttributeOr(this, 'variant', 'default');
        const text = this.textContent.trim();

        this.innerHTML = '';
        this.className = `lc-spinner-container lc-spinner-${size} lc-spinner-${variant}`;

        const spinner = document.createElement('div');
        spinner.className = 'lc-spinner';
        spinner.innerHTML = `
            <svg class="lc-spinner-svg" viewBox="0 0 50 50">
                <circle class="lc-spinner-path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
            </svg>
        `;

        this.appendChild(spinner);

        if (text) {
            const label = document.createElement('span');
            label.className = 'lc-spinner-label';
            label.textContent = text;
            this.appendChild(label);
        }

        // Set ARIA attributes
        this.setAttribute('role', 'status');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-label', text || 'Loading');
    }
}

// Define custom elements
customElements.define('lc-badge', LCBadge);
customElements.define('lc-tag', LCTag);
customElements.define('lc-button', LCButton);
customElements.define('lc-pagination', LCPagination);
customElements.define('lc-spinner', LCSpinner);

// Export for use in other modules
export {
    LCBadge,
    LCTag,
    LCButton,
    LCPagination,
    LCSpinner
};
