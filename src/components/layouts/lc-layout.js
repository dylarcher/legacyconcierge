/**
 * Layout Component
 * Page layout with named regions for header, main, aside, and footer
 * Supports various layout patterns (single-column, sidebar, etc.)
 * @element lc-layout
 * @attr {string} variant - Layout pattern (single|sidebar-left|sidebar-right|two-column)
 * @attr {string} sidebar-width - Sidebar width (sm|base|lg) for sidebar layouts
 * @attr {string} gap - Gap between regions
 * @attr {boolean} sticky-header - Make header sticky
 * @attr {boolean} sticky-sidebar - Make sidebar sticky (for sidebar layouts)
 * @slot header - Header content
 * @slot main - Main content
 * @slot aside - Sidebar/aside content
 * @slot footer - Footer content
 * @example
 * <lc-layout variant="single">
 *   <div slot="header">Header content</div>
 *   <div slot="main">Main content</div>
 *   <div slot="footer">Footer content</div>
 * </lc-layout>
 * <lc-layout variant="sidebar-left" sidebar-width="lg">
 *   <div slot="header">Header</div>
 *   <div slot="aside">Sidebar</div>
 *   <div slot="main">Main content</div>
 *   <div slot="footer">Footer</div>
 * </lc-layout>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCLayout extends BaseComponent {
  static get observedAttributes() {
    return [
      'variant',
      'sidebar-width',
      'gap',
      'sticky-header',
      'sticky-sidebar'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const variant = this.getAttr('variant', 'single');
    const sidebarWidth = this.getAttr('sidebar-width', 'base');
    const gap = this.getAttr('gap', '0');
    const stickyHeader = this.getBoolAttr('sticky-header');
    const stickySidebar = this.getBoolAttr('sticky-sidebar');

    // Build classes
    const classes = [
      'lc-layout',
      `lc-layout--${variant}`
    ];

    if (gap !== '0') {
      classes.push(`lc-layout--gap-${gap}`);
    }

    if (stickyHeader) {
      classes.push('lc-layout--sticky-header');
    }

    if (stickySidebar) {
      classes.push('lc-layout--sticky-sidebar');
    }

    // Extract slotted content
    const headerContent = this.querySelector('[slot="header"]')?.outerHTML || '';
    const mainContent = this.querySelector('[slot="main"]')?.outerHTML || '';
    const asideContent = this.querySelector('[slot="aside"]')?.outerHTML || '';
    const footerContent = this.querySelector('[slot="footer"]')?.outerHTML || '';

    // Build layout structure based on variant
    let html = '';

    // Header (if exists)
    if (headerContent) {
      html += `<header class="lc-layout__header">${headerContent.replace('slot="header"', '')}</header>`;
    }

    // Main content area (varies by variant)
    html += '<div class="lc-layout__body">';

    if (variant === 'sidebar-left' && asideContent) {
      html += `<aside class="lc-layout__aside lc-layout__aside--${sidebarWidth}">${asideContent.replace('slot="aside"', '')}</aside>`;
    }

    html += `<main class="lc-layout__main" id="main">${mainContent.replace('slot="main"', '')}</main>`;

    if (variant === 'sidebar-right' && asideContent) {
      html += `<aside class="lc-layout__aside lc-layout__aside--${sidebarWidth}">${asideContent.replace('slot="aside"', '')}</aside>`;
    }

    if (variant === 'two-column' && asideContent) {
      html += `<aside class="lc-layout__aside lc-layout__aside--${sidebarWidth}">${asideContent.replace('slot="aside"', '')}</aside>`;
    }

    html += '</div>'; // Close body

    // Footer (if exists)
    if (footerContent) {
      html += `<footer class="lc-layout__footer">${footerContent.replace('slot="footer"', '')}</footer>`;
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-layout-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-layout-styles';
    style.textContent = `
      .lc-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
      }

      /* Header */
      .lc-layout__header {
        flex-shrink: 0;
        width: 100%;
      }

      .lc-layout--sticky-header .lc-layout__header {
        position: sticky;
        top: 0;
        z-index: var(--z-sticky);
      }

      /* Body (main content area) */
      .lc-layout__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      /* Main content */
      .lc-layout__main {
        flex: 1;
        width: 100%;
        min-width: 0; /* Prevent flex overflow */
      }

      /* Aside/Sidebar */
      .lc-layout__aside {
        flex-shrink: 0;
        width: 100%;
      }

      /* Footer */
      .lc-layout__footer {
        flex-shrink: 0;
        width: 100%;
      }

      /* Gap between regions */
      .lc-layout--gap-2 > * + * { margin-top: var(--space-2); }
      .lc-layout--gap-4 > * + * { margin-top: var(--space-4); }
      .lc-layout--gap-6 > * + * { margin-top: var(--space-6); }
      .lc-layout--gap-8 > * + * { margin-top: var(--space-8); }

      /* Single column (default - mobile first) */
      .lc-layout--single .lc-layout__body {
        flex-direction: column;
      }

      /* Sidebar layouts - mobile first (stack vertically) */
      .lc-layout--sidebar-left .lc-layout__body,
      .lc-layout--sidebar-right .lc-layout__body,
      .lc-layout--two-column .lc-layout__body {
        flex-direction: column;
      }

      /* Sidebar widths */
      .lc-layout__aside--sm {
        max-width: 100%;
      }

      .lc-layout__aside--base {
        max-width: 100%;
      }

      .lc-layout__aside--lg {
        max-width: 100%;
      }

      /* Tablet and up - enable sidebar layouts */
      @media (min-width: 768px) {
        /* Sidebar left */
        .lc-layout--sidebar-left .lc-layout__body {
          flex-direction: row;
          gap: var(--space-8);
        }

        .lc-layout--sidebar-left .lc-layout__aside {
          order: -1;
        }

        .lc-layout--sidebar-left .lc-layout__aside--sm {
          width: 200px;
          max-width: 200px;
        }

        .lc-layout--sidebar-left .lc-layout__aside--base {
          width: 280px;
          max-width: 280px;
        }

        .lc-layout--sidebar-left .lc-layout__aside--lg {
          width: 360px;
          max-width: 360px;
        }

        /* Sidebar right */
        .lc-layout--sidebar-right .lc-layout__body {
          flex-direction: row;
          gap: var(--space-8);
        }

        .lc-layout--sidebar-right .lc-layout__aside--sm {
          width: 200px;
          max-width: 200px;
        }

        .lc-layout--sidebar-right .lc-layout__aside--base {
          width: 280px;
          max-width: 280px;
        }

        .lc-layout--sidebar-right .lc-layout__aside--lg {
          width: 360px;
          max-width: 360px;
        }

        /* Two column (equal width) */
        .lc-layout--two-column .lc-layout__body {
          flex-direction: row;
          gap: var(--space-8);
        }

        .lc-layout--two-column .lc-layout__main,
        .lc-layout--two-column .lc-layout__aside {
          flex: 1;
          max-width: none;
        }

        /* Sticky sidebar */
        .lc-layout--sticky-sidebar .lc-layout__aside {
          position: sticky;
          top: var(--space-4);
          align-self: flex-start;
          max-height: calc(100vh - var(--space-8));
          overflow-y: auto;
        }

        /* If header is sticky, adjust sidebar top position */
        .lc-layout--sticky-header.lc-layout--sticky-sidebar .lc-layout__aside {
          top: calc(var(--nav-height) + var(--space-4));
        }
      }

      /* Desktop - increase gaps */
      @media (min-width: 1024px) {
        .lc-layout--sidebar-left .lc-layout__body,
        .lc-layout--sidebar-right .lc-layout__body,
        .lc-layout--two-column .lc-layout__body {
          gap: var(--space-12);
        }

        .lc-layout--sidebar-left .lc-layout__aside--base {
          width: 320px;
          max-width: 320px;
        }

        .lc-layout--sidebar-left .lc-layout__aside--lg {
          width: 400px;
          max-width: 400px;
        }

        .lc-layout--sidebar-right .lc-layout__aside--base {
          width: 320px;
          max-width: 320px;
        }

        .lc-layout--sidebar-right .lc-layout__aside--lg {
          width: 400px;
          max-width: 400px;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-layout', LCLayout);
export default LCLayout;
