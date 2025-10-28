/**
 * Breadcrumb Component
 * Navigation breadcrumb trail showing current page location
 * @element lc-breadcrumb
 * @attr {string} separator - Separator character/icon (default: ">")
 * @attr {string} items - JSON array of breadcrumb items [{label, href, current}]
 * @fires lc-breadcrumb-click - Emitted when breadcrumb item is clicked
 * @example
 * <lc-breadcrumb
 *   items='[
 *     {"label": "Home", "href": "/"},
 *     {"label": "Services", "href": "/services"},
 *     {"label": "Treatment", "current": true}
 *   ]'
 * ></lc-breadcrumb>
 */

import Component from '../base/Component.js';

class LCBreadcrumb extends Component {
  static get observedAttributes() {
    return ['separator', 'items'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const separator = this.getAttr('separator', '>');
    const items = this.getJsonAttr('items', []);

    if (items.length === 0) {
      console.warn('lc-breadcrumb: items attribute is required');
      return;
    }

    // Build breadcrumb HTML
    let html = '<ol class="lc-breadcrumb__list">';

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const isCurrent = item.current || isLast;

      html += '<li class="lc-breadcrumb__item">';

      if (isCurrent) {
        // Current page - not a link
        html += `
          <span class="lc-breadcrumb__current" aria-current="page">
            ${this.escapeHtml(item.label)}
          </span>
        `;
      } else {
        // Link to page
        html += `
          <a
            href="${item.href || '#'}"
            class="lc-breadcrumb__link"
          >
            ${this.escapeHtml(item.label)}
          </a>
        `;
      }

      // Add separator (except after last item)
      if (!isLast) {
        html += `
          <span class="lc-breadcrumb__separator" aria-hidden="true">
            ${separator}
          </span>
        `;
      }

      html += '</li>';
    });

    html += '</ol>';

    // Create wrapper
    const wrapper = document.createElement('nav');
    wrapper.className = 'lc-breadcrumb';
    wrapper.setAttribute('aria-label', 'Breadcrumb');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const links = this.$$('.lc-breadcrumb__link');

    links.forEach(link => {
      this.on(link, 'click', (event) => {
        this.emit('lc-breadcrumb-click', {
          breadcrumb: this,
          href: link.href,
          label: link.textContent.trim(),
          originalEvent: event
        });
      });
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-breadcrumb-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-breadcrumb-styles';
    style.textContent = `
      .lc-breadcrumb {
        display: block;
        font-size: var(--breadcrumb-font-size);
      }

      .lc-breadcrumb__list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-2);
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .lc-breadcrumb__item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .lc-breadcrumb__link {
        color: var(--breadcrumb-link);
        text-decoration: none;
        transition: color var(--transition-fast);
      }

      .lc-breadcrumb__link:hover {
        color: var(--text-link-hover);
        text-decoration: underline;
      }

      .lc-breadcrumb__link:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
        border-radius: var(--radius-sm);
      }

      .lc-breadcrumb__current {
        color: var(--breadcrumb-text);
        font-weight: var(--font-weight-medium);
      }

      .lc-breadcrumb__separator {
        color: var(--breadcrumb-separator);
        user-select: none;
      }

      /* Mobile - stack on very small screens if needed */
      @media (max-width: 480px) {
        .lc-breadcrumb__list {
          font-size: var(--font-size-sm);
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-breadcrumb', LCBreadcrumb);
export default LCBreadcrumb;
