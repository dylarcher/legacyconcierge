/**
 * Grid Component
 * Responsive CSS Grid layout with customizable columns and gaps
 * @element lc-grid
 * @attr {string} cols - Number of columns (1-12) or auto
 * @attr {string} cols-sm - Columns at small breakpoint
 * @attr {string} cols-md - Columns at medium breakpoint
 * @attr {string} cols-lg - Columns at large breakpoint
 * @attr {string} cols-xl - Columns at extra large breakpoint
 * @attr {string} gap - Gap size (1-24) or token value
 * @attr {string} align - Vertical alignment (start|center|end|stretch)
 * @attr {string} justify - Horizontal alignment (start|center|end|stretch|between|around|evenly)
 * @attr {boolean} auto-fit - Use auto-fit instead of fixed columns
 * @attr {string} min-col-width - Minimum column width for auto-fit (e.g., "300px")
 * @example
 * <lc-grid cols="3" gap="6">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </lc-grid>
 * <lc-grid cols="1" cols-md="2" cols-lg="3" gap="4">
 *   <div>Responsive item</div>
 * </lc-grid>
 * <lc-grid auto-fit min-col-width="250px" gap="4">
 *   <div>Auto-fit item</div>
 * </lc-grid>
 */

import Component from '../base/Component.js';

class LCGrid extends Component {
  static get observedAttributes() {
    return [
      'cols',
      'cols-sm',
      'cols-md',
      'cols-lg',
      'cols-xl',
      'gap',
      'align',
      'justify',
      'auto-fit',
      'min-col-width'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const cols = this.getAttr('cols', '1');
    const colsSm = this.getAttr('cols-sm');
    const colsMd = this.getAttr('cols-md');
    const colsLg = this.getAttr('cols-lg');
    const colsXl = this.getAttr('cols-xl');
    const gap = this.getAttr('gap', '4');
    const align = this.getAttr('align');
    const justify = this.getAttr('justify');
    const autoFit = this.getBoolAttr('auto-fit');
    const minColWidth = this.getAttr('min-col-width', '250px');

    // Build classes
    const classes = ['lc-grid'];

    if (!autoFit) {
      classes.push(`lc-grid--cols-${cols}`);

      if (colsSm) classes.push(`lc-grid--cols-sm-${colsSm}`);
      if (colsMd) classes.push(`lc-grid--cols-md-${colsMd}`);
      if (colsLg) classes.push(`lc-grid--cols-lg-${colsLg}`);
      if (colsXl) classes.push(`lc-grid--cols-xl-${colsXl}`);
    } else {
      classes.push('lc-grid--auto-fit');
    }

    classes.push(`lc-grid--gap-${gap}`);

    if (align) classes.push(`lc-grid--align-${align}`);
    if (justify) classes.push(`lc-grid--justify-${justify}`);

    // Store original content
    const content = this.innerHTML;

    // Create grid wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');

    if (autoFit) {
      wrapper.style.setProperty('--min-col-width', minColWidth);
    }

    wrapper.innerHTML = content;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-grid-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-grid-styles';
    style.textContent = `
      .lc-grid {
        display: grid;
        width: 100%;
      }

      /* Auto-fit grid */
      .lc-grid--auto-fit {
        grid-template-columns: repeat(auto-fit, minmax(min(var(--min-col-width), 100%), 1fr));
      }

      /* Gap sizes */
      .lc-grid--gap-1 { gap: var(--space-1); }
      .lc-grid--gap-2 { gap: var(--space-2); }
      .lc-grid--gap-3 { gap: var(--space-3); }
      .lc-grid--gap-4 { gap: var(--space-4); }
      .lc-grid--gap-5 { gap: var(--space-5); }
      .lc-grid--gap-6 { gap: var(--space-6); }
      .lc-grid--gap-8 { gap: var(--space-8); }
      .lc-grid--gap-10 { gap: var(--space-10); }
      .lc-grid--gap-12 { gap: var(--space-12); }
      .lc-grid--gap-16 { gap: var(--space-16); }
      .lc-grid--gap-20 { gap: var(--space-20); }
      .lc-grid--gap-24 { gap: var(--space-24); }

      /* Alignment */
      .lc-grid--align-start { align-items: start; }
      .lc-grid--align-center { align-items: center; }
      .lc-grid--align-end { align-items: end; }
      .lc-grid--align-stretch { align-items: stretch; }

      /* Justification */
      .lc-grid--justify-start { justify-items: start; }
      .lc-grid--justify-center { justify-items: center; }
      .lc-grid--justify-end { justify-items: end; }
      .lc-grid--justify-stretch { justify-items: stretch; }
      .lc-grid--justify-between { justify-content: space-between; }
      .lc-grid--justify-around { justify-content: space-around; }
      .lc-grid--justify-evenly { justify-content: space-evenly; }

      /* Column counts - Mobile first (base) */
      .lc-grid--cols-1 { grid-template-columns: repeat(1, 1fr); }
      .lc-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
      .lc-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
      .lc-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
      .lc-grid--cols-5 { grid-template-columns: repeat(5, 1fr); }
      .lc-grid--cols-6 { grid-template-columns: repeat(6, 1fr); }
      .lc-grid--cols-7 { grid-template-columns: repeat(7, 1fr); }
      .lc-grid--cols-8 { grid-template-columns: repeat(8, 1fr); }
      .lc-grid--cols-9 { grid-template-columns: repeat(9, 1fr); }
      .lc-grid--cols-10 { grid-template-columns: repeat(10, 1fr); }
      .lc-grid--cols-11 { grid-template-columns: repeat(11, 1fr); }
      .lc-grid--cols-12 { grid-template-columns: repeat(12, 1fr); }
      .lc-grid--cols-auto { grid-template-columns: auto; }

      /* Small breakpoint (640px and up) */
      @media (min-width: 640px) {
        .lc-grid--cols-sm-1 { grid-template-columns: repeat(1, 1fr); }
        .lc-grid--cols-sm-2 { grid-template-columns: repeat(2, 1fr); }
        .lc-grid--cols-sm-3 { grid-template-columns: repeat(3, 1fr); }
        .lc-grid--cols-sm-4 { grid-template-columns: repeat(4, 1fr); }
        .lc-grid--cols-sm-5 { grid-template-columns: repeat(5, 1fr); }
        .lc-grid--cols-sm-6 { grid-template-columns: repeat(6, 1fr); }
        .lc-grid--cols-sm-7 { grid-template-columns: repeat(7, 1fr); }
        .lc-grid--cols-sm-8 { grid-template-columns: repeat(8, 1fr); }
        .lc-grid--cols-sm-9 { grid-template-columns: repeat(9, 1fr); }
        .lc-grid--cols-sm-10 { grid-template-columns: repeat(10, 1fr); }
        .lc-grid--cols-sm-11 { grid-template-columns: repeat(11, 1fr); }
        .lc-grid--cols-sm-12 { grid-template-columns: repeat(12, 1fr); }
      }

      /* Medium breakpoint (768px and up) */
      @media (min-width: 768px) {
        .lc-grid--cols-md-1 { grid-template-columns: repeat(1, 1fr); }
        .lc-grid--cols-md-2 { grid-template-columns: repeat(2, 1fr); }
        .lc-grid--cols-md-3 { grid-template-columns: repeat(3, 1fr); }
        .lc-grid--cols-md-4 { grid-template-columns: repeat(4, 1fr); }
        .lc-grid--cols-md-5 { grid-template-columns: repeat(5, 1fr); }
        .lc-grid--cols-md-6 { grid-template-columns: repeat(6, 1fr); }
        .lc-grid--cols-md-7 { grid-template-columns: repeat(7, 1fr); }
        .lc-grid--cols-md-8 { grid-template-columns: repeat(8, 1fr); }
        .lc-grid--cols-md-9 { grid-template-columns: repeat(9, 1fr); }
        .lc-grid--cols-md-10 { grid-template-columns: repeat(10, 1fr); }
        .lc-grid--cols-md-11 { grid-template-columns: repeat(11, 1fr); }
        .lc-grid--cols-md-12 { grid-template-columns: repeat(12, 1fr); }
      }

      /* Large breakpoint (1024px and up) */
      @media (min-width: 1024px) {
        .lc-grid--cols-lg-1 { grid-template-columns: repeat(1, 1fr); }
        .lc-grid--cols-lg-2 { grid-template-columns: repeat(2, 1fr); }
        .lc-grid--cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
        .lc-grid--cols-lg-4 { grid-template-columns: repeat(4, 1fr); }
        .lc-grid--cols-lg-5 { grid-template-columns: repeat(5, 1fr); }
        .lc-grid--cols-lg-6 { grid-template-columns: repeat(6, 1fr); }
        .lc-grid--cols-lg-7 { grid-template-columns: repeat(7, 1fr); }
        .lc-grid--cols-lg-8 { grid-template-columns: repeat(8, 1fr); }
        .lc-grid--cols-lg-9 { grid-template-columns: repeat(9, 1fr); }
        .lc-grid--cols-lg-10 { grid-template-columns: repeat(10, 1fr); }
        .lc-grid--cols-lg-11 { grid-template-columns: repeat(11, 1fr); }
        .lc-grid--cols-lg-12 { grid-template-columns: repeat(12, 1fr); }
      }

      /* Extra large breakpoint (1280px and up) */
      @media (min-width: 1280px) {
        .lc-grid--cols-xl-1 { grid-template-columns: repeat(1, 1fr); }
        .lc-grid--cols-xl-2 { grid-template-columns: repeat(2, 1fr); }
        .lc-grid--cols-xl-3 { grid-template-columns: repeat(3, 1fr); }
        .lc-grid--cols-xl-4 { grid-template-columns: repeat(4, 1fr); }
        .lc-grid--cols-xl-5 { grid-template-columns: repeat(5, 1fr); }
        .lc-grid--cols-xl-6 { grid-template-columns: repeat(6, 1fr); }
        .lc-grid--cols-xl-7 { grid-template-columns: repeat(7, 1fr); }
        .lc-grid--cols-xl-8 { grid-template-columns: repeat(8, 1fr); }
        .lc-grid--cols-xl-9 { grid-template-columns: repeat(9, 1fr); }
        .lc-grid--cols-xl-10 { grid-template-columns: repeat(10, 1fr); }
        .lc-grid--cols-xl-11 { grid-template-columns: repeat(11, 1fr); }
        .lc-grid--cols-xl-12 { grid-template-columns: repeat(12, 1fr); }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-grid', LCGrid);
export default LCGrid;
