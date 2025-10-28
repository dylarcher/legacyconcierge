/**
 * Footer Component
 * Global site footer with links, social media, and copyright
 * @element lc-footer
 * @attr {string} copyright - Copyright text
 * @attr {string} columns - JSON array of footer columns [{title, links: [{label, href}]}]
 * @attr {string} social - JSON array of social links [{platform, href, icon}]
 * @slot default - Footer content (overrides columns attribute)
 * @slot bottom - Bottom footer content (appears below columns)
 * @example
 * <lc-footer
 *   copyright="© 2025 Legacy Concierge. All rights reserved."
 *   columns='[
 *     {
 *       "title": "Services",
 *       "links": [
 *         {"label": "Treatment", "href": "/services/treatment"},
 *         {"label": "Expertise", "href": "/services/expertise"}
 *       ]
 *     },
 *     {
 *       "title": "Company",
 *       "links": [
 *         {"label": "About", "href": "/about"},
 *         {"label": "Contact", "href": "/contact"}
 *       ]
 *     }
 *   ]'
 *   social='[
 *     {"platform": "facebook", "href": "https://facebook.com"},
 *     {"platform": "twitter", "href": "https://twitter.com"}
 *   ]'
 * ></lc-footer>
 */

import Component from '../base/Component.js';

class LCFooter extends Component {
  static get observedAttributes() {
    return ['copyright', 'columns', 'social'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const copyright = this.getAttr('copyright', `© ${new Date().getFullYear()} All rights reserved.`);
    const columns = this.getJsonAttr('columns', []);
    const social = this.getJsonAttr('social', []);

    // Extract slots
    const defaultSlot = this.querySelector(':not([slot])');
    const bottomSlot = this.querySelector('[slot="bottom"]');

    // Build footer HTML
    let html = '<div class="lc-footer__container">';

    // Main footer content
    html += '<div class="lc-footer__main">';

    if (defaultSlot) {
      // Use custom content from slot
      html += defaultSlot.outerHTML;
    } else if (columns.length > 0) {
      // Build column layout
      html += '<div class="lc-footer__columns">';

      columns.forEach(column => {
        html += '<div class="lc-footer__column">';

        if (column.title) {
          html += `<h3 class="lc-footer__column-title">${this.escapeHtml(column.title)}</h3>`;
        }

        if (column.links && column.links.length > 0) {
          html += '<ul class="lc-footer__links">';

          column.links.forEach(link => {
            html += `
              <li>
                <a href="${link.href}" class="lc-footer__link">
                  ${this.escapeHtml(link.label)}
                </a>
              </li>
            `;
          });

          html += '</ul>';
        }

        html += '</div>'; // Close column
      });

      html += '</div>'; // Close columns
    }

    html += '</div>'; // Close main

    // Bottom footer section
    html += '<div class="lc-footer__bottom">';

    // Social links
    if (social.length > 0) {
      html += '<div class="lc-footer__social">';

      social.forEach(link => {
        const icon = this.getSocialIcon(link.platform);
        html += `
          <a
            href="${link.href}"
            class="lc-footer__social-link"
            aria-label="${link.platform}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${icon}
          </a>
        `;
      });

      html += '</div>'; // Close social
    }

    // Copyright
    html += `<div class="lc-footer__copyright">${copyright}</div>`;

    // Custom bottom content
    if (bottomSlot) {
      html += `<div class="lc-footer__custom">${bottomSlot.innerHTML}</div>`;
    }

    html += '</div>'; // Close bottom

    html += '</div>'; // Close container

    // Create wrapper
    const wrapper = document.createElement('footer');
    wrapper.className = 'lc-footer';
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  /**
   * Get social media icon SVG
   * @param {string} platform - Platform name
   * @returns {string} SVG markup
   */
  getSocialIcon(platform) {
    const icons = {
      facebook: `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      `,
      twitter: `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      `,
      linkedin: `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      `,
      instagram: `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      `,
      youtube: `
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      `
    };

    return icons[platform.toLowerCase()] || icons.facebook;
  }

  /**
   * Escape HTML
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
    if (document.getElementById('lc-footer-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-footer-styles';
    style.textContent = `
      .lc-footer {
        background: var(--footer-bg);
        color: var(--footer-text);
        padding: var(--footer-padding-y) 0;
      }

      .lc-footer__container {
        max-width: var(--container-2xl);
        margin: 0 auto;
        padding: 0 var(--space-4);
      }

      /* Main footer content */
      .lc-footer__main {
        margin-bottom: var(--space-12);
      }

      .lc-footer__columns {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-8);
      }

      .lc-footer__column-title {
        font-family: var(--font-family-sans);
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-semibold);
        margin-bottom: var(--space-4);
        color: var(--footer-text);
      }

      .lc-footer__links {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .lc-footer__links li {
        margin-bottom: var(--space-2);
      }

      .lc-footer__link {
        color: var(--footer-link);
        text-decoration: none;
        font-size: var(--font-size-sm);
        transition: color var(--transition-fast);
        display: inline-block;
      }

      .lc-footer__link:hover {
        color: var(--footer-link-hover);
      }

      .lc-footer__link:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
        border-radius: var(--radius-sm);
      }

      /* Bottom footer section */
      .lc-footer__bottom {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding-top: var(--space-8);
        border-top: 1px solid var(--footer-border);
        align-items: center;
        text-align: center;
      }

      .lc-footer__social {
        display: flex;
        gap: var(--space-3);
      }

      .lc-footer__social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        color: var(--footer-link);
        background: transparent;
        border: 1px solid var(--footer-border);
        border-radius: var(--radius-full);
        text-decoration: none;
        transition: all var(--transition-fast);
      }

      .lc-footer__social-link:hover {
        color: var(--footer-link-hover);
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--footer-link-hover);
      }

      .lc-footer__social-link:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-footer__copyright {
        font-size: var(--font-size-sm);
        color: var(--footer-link);
      }

      /* Tablet and up */
      @media (min-width: 768px) {
        .lc-footer__container {
          padding: 0 var(--space-6);
        }

        .lc-footer__columns {
          grid-template-columns: repeat(2, 1fr);
        }

        .lc-footer__bottom {
          flex-direction: row;
          justify-content: space-between;
          text-align: left;
        }
      }

      /* Desktop */
      @media (min-width: 1024px) {
        .lc-footer__container {
          padding: 0 var(--space-8);
        }

        .lc-footer__columns {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-footer__link,
        .lc-footer__social-link {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-footer', LCFooter);
export default LCFooter;
