/**
 * Container Component
 * Responsive container with max-width control and padding
 * @element lc-container
 * @attr {string} size - Container size (sm|md|lg|xl|2xl|fluid)
 * @attr {boolean} no-padding - Remove horizontal padding
 * @attr {string} align - Content alignment (left|center|right)
 * @example
 * <lc-container size="lg">Content here</lc-container>
 * <lc-container size="fluid" no-padding>Full width content</lc-container>
 */

import BaseComponent from '../base/BaseComponent.js';

class LCContainer extends BaseComponent {
  static get observedAttributes() {
    return ['size', 'no-padding', 'align'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const size = this.getAttr('size', 'xl');
    const noPadding = this.getBoolAttr('no-padding');
    const align = this.getAttr('align', 'center');

    // Build classes
    const classes = ['lc-container', `lc-container--${size}`];

    if (noPadding) {
      classes.push('lc-container--no-padding');
    }

    if (align !== 'center') {
      classes.push(`lc-container--${align}`);
    }

    // Store original content
    const content = this.innerHTML;

    // Create container wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = content;

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
    if (document.getElementById('lc-container-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-container-styles';
    style.textContent = `
      .lc-container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding-left: var(--space-4);
        padding-right: var(--space-4);
      }

      /* Sizes */
      .lc-container--sm {
        max-width: var(--container-sm);
      }

      .lc-container--md {
        max-width: var(--container-md);
      }

      .lc-container--lg {
        max-width: var(--container-lg);
      }

      .lc-container--xl {
        max-width: var(--container-xl);
      }

      .lc-container--2xl {
        max-width: var(--container-2xl);
      }

      .lc-container--fluid {
        max-width: none;
      }

      /* No padding variant */
      .lc-container--no-padding {
        padding-left: 0;
        padding-right: 0;
      }

      /* Alignment */
      .lc-container--left {
        margin-left: 0;
        margin-right: auto;
      }

      .lc-container--right {
        margin-left: auto;
        margin-right: 0;
      }

      /* Responsive padding */
      @media (min-width: 640px) {
        .lc-container:not(.lc-container--no-padding) {
          padding-left: var(--space-6);
          padding-right: var(--space-6);
        }
      }

      @media (min-width: 1024px) {
        .lc-container:not(.lc-container--no-padding) {
          padding-left: var(--space-8);
          padding-right: var(--space-8);
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-container', LCContainer);
export default LCContainer;
