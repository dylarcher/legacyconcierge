/**
 * Pagination Component
 * Page navigation with previous/next and page numbers
 * @element lc-pagination
 * @attr {number} current - Current page number (1-based)
 * @attr {number} total - Total number of pages
 * @attr {number} siblings - Number of siblings to show on each side of current (default: 1)
 * @attr {boolean} show-first-last - Show first/last page buttons
 * @attr {boolean} show-prev-next - Show previous/next buttons (default: true)
 * @attr {string} prev-label - Label for previous button (default: "Previous")
 * @attr {string} next-label - Label for next button (default: "Next")
 * @fires lc-pagination-change - Emitted when page changes
 * @example
 * <lc-pagination
 *   current="3"
 *   total="10"
 *   siblings="2"
 *   show-first-last
 * ></lc-pagination>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCPagination extends BaseComponent {
  static get observedAttributes() {
    return [
      'current',
      'total',
      'siblings',
      'show-first-last',
      'show-prev-next',
      'prev-label',
      'next-label'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const current = this.getNumAttr('current', 1);
    const total = this.getNumAttr('total', 1);
    const siblings = this.getNumAttr('siblings', 1);
    const showFirstLast = this.getBoolAttr('show-first-last');
    const showPrevNext = this.getBoolAttr('show-prev-next') !== false; // Default true
    const prevLabel = this.getAttr('prev-label', 'Previous');
    const nextLabel = this.getAttr('next-label', 'Next');

    if (total < 1) {
      console.warn('lc-pagination: total must be at least 1');
      return;
    }

    // Calculate page range to show
    const pages = this.calculatePageRange(current, total, siblings);

    // Build pagination HTML
    let html = '';

    // Previous button
    if (showPrevNext) {
      html += `
        <button
          type="button"
          class="lc-pagination__button lc-pagination__button--prev"
          ${current <= 1 ? 'disabled' : ''}
          aria-label="Go to previous page"
          data-page="${current - 1}"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
          <span class="lc-pagination__label">${prevLabel}</span>
        </button>
      `;
    }

    // First page button
    if (showFirstLast && !pages.includes(1)) {
      html += this.createPageButton(1, current);
      html += '<span class="lc-pagination__ellipsis" aria-hidden="true">...</span>';
    }

    // Page number buttons
    pages.forEach(page => {
      html += this.createPageButton(page, current);
    });

    // Last page button
    if (showFirstLast && !pages.includes(total)) {
      html += '<span class="lc-pagination__ellipsis" aria-hidden="true">...</span>';
      html += this.createPageButton(total, current);
    }

    // Next button
    if (showPrevNext) {
      html += `
        <button
          type="button"
          class="lc-pagination__button lc-pagination__button--next"
          ${current >= total ? 'disabled' : ''}
          aria-label="Go to next page"
          data-page="${current + 1}"
        >
          <span class="lc-pagination__label">${nextLabel}</span>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      `;
    }

    // Create wrapper
    const wrapper = document.createElement('nav');
    wrapper.className = 'lc-pagination';
    wrapper.setAttribute('role', 'navigation');
    wrapper.setAttribute('aria-label', 'Pagination');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  /**
   * Create a page number button
   * @param {number} page - Page number
   * @param {number} current - Current page
   * @returns {string} Button HTML
   */
  createPageButton(page, current) {
    const isCurrent = page === current;

    return `
      <button
        type="button"
        class="lc-pagination__button lc-pagination__button--page ${isCurrent ? 'lc-pagination__button--current' : ''}"
        ${isCurrent ? 'aria-current="page"' : ''}
        aria-label="Go to page ${page}"
        data-page="${page}"
        ${isCurrent ? 'disabled' : ''}
      >
        ${page}
      </button>
    `;
  }

  /**
   * Calculate which page numbers to show
   * @param {number} current - Current page
   * @param {number} total - Total pages
   * @param {number} siblings - Siblings on each side
   * @returns {number[]} Array of page numbers to show
   */
  calculatePageRange(current, total, siblings) {
    const range = [];
    const start = Math.max(1, current - siblings);
    const end = Math.min(total, current + siblings);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  setupEventListeners() {
    const buttons = this.$$('.lc-pagination__button:not([disabled])');

    buttons.forEach(button => {
      this.on(button, 'click', () => {
        const page = parseInt(button.dataset.page, 10);

        if (!isNaN(page)) {
          this.changePage(page);
        }
      });
    });
  }

  /**
   * Change to a specific page
   * @param {number} page - Page number to change to
   */
  changePage(page) {
    const total = this.getNumAttr('total', 1);

    // Validate page number
    if (page < 1 || page > total) {
      return;
    }

    // Update current attribute
    this.setAttribute('current', page);

    // Emit event
    this.emit('lc-pagination-change', {
      pagination: this,
      page,
      total
    });
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-pagination-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-pagination-styles';
    style.textContent = `
      .lc-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        flex-wrap: wrap;
      }

      .lc-pagination__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-1);
        min-width: 44px; /* WCAG touch target */
        min-height: 44px;
        padding: var(--space-2) var(--space-3);
        font-family: var(--font-family-sans);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-secondary);
        background: var(--bg-surface);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-base);
        cursor: pointer;
        transition: all var(--transition-fast);
        user-select: none;
      }

      .lc-pagination__button:hover:not(:disabled) {
        background: var(--bg-surface-secondary);
        color: var(--text-primary);
        border-color: var(--border-strong);
      }

      .lc-pagination__button:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-pagination__button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lc-pagination__button--current {
        background: var(--interactive-default);
        color: var(--text-on-primary);
        border-color: var(--interactive-default);
      }

      .lc-pagination__button--prev,
      .lc-pagination__button--next {
        padding: var(--space-2) var(--space-4);
      }

      .lc-pagination__label {
        display: none;
      }

      .lc-pagination__ellipsis {
        display: inline-flex;
        align-items: center;
        padding: 0 var(--space-2);
        color: var(--text-muted);
        user-select: none;
      }

      /* Show labels on larger screens */
      @media (min-width: 640px) {
        .lc-pagination__label {
          display: inline;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-pagination__button {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-pagination', LCPagination);
export default LCPagination;
