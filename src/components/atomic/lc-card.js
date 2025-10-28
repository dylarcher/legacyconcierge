/**
 * Card Component
 * Versatile card with multiple variants and optional header/footer
 * @element lc-card
 * @attr {string} variant - Card style (default|elevated|outlined|filled)
 * @attr {string} padding - Padding size (none|sm|base|lg)
 * @attr {boolean} hoverable - Add hover effect
 * @attr {boolean} clickable - Make entire card clickable
 * @attr {string} href - URL for clickable cards
 * @attr {string} image - Header image URL
 * @attr {string} image-alt - Alt text for image
 * @attr {string} image-position - Image position (top|bottom|left|right)
 * @fires lc-card-click - Emitted when clickable card is clicked
 * @slot default - Card content
 * @slot header - Card header content
 * @slot footer - Card footer content
 * @example
 * <lc-card variant="elevated" hoverable>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </lc-card>
 * <lc-card variant="outlined" image="/images/card.jpg">
 *   <div slot="header"><h3>Title</h3></div>
 *   <p>Content</p>
 *   <div slot="footer"><button>Action</button></div>
 * </lc-card>
 */

import pathResolver from '../../utils/path-resolver.js';
import Component from '../base/Component.js';

class LCCard extends Component {
  static get observedAttributes() {
    return [
      'variant',
      'padding',
      'hoverable',
      'clickable',
      'href',
      'image',
      'image-alt',
      'image-position'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const variant = this.getAttr('variant', 'default');
    const padding = this.getAttr('padding', 'base');
    const hoverable = this.getBoolAttr('hoverable');
    const clickable = this.getBoolAttr('clickable');
    const href = this.getAttr('href');
    const image = this.getAttr('image');
    const imageAlt = this.getAttr('image-alt', '');
    const imagePosition = this.getAttr('image-position', 'top');

    // Build classes
    const classes = [
      'lc-card',
      `lc-card--${variant}`,
      `lc-card--padding-${padding}`
    ];

    if (hoverable) classes.push('lc-card--hoverable');
    if (clickable || href) classes.push('lc-card--clickable');
    if (image) classes.push(`lc-card--image-${imagePosition}`);

    // Extract slotted content
    const headerContent = this.querySelector('[slot="header"]');
    const footerContent = this.querySelector('[slot="footer"]');
    const defaultContent = Array.from(this.childNodes)
      .filter(node => !node.slot)
      .map(node => node.cloneNode(true));

    // Build card structure
    let html = '';

    // Image (if top or left)
    if (image && (imagePosition === 'top' || imagePosition === 'left')) {
      const imageSrc = pathResolver.resolveAsset(image);
      html += `
        <div class="lc-card__image">
          <img src="${imageSrc}" alt="${imageAlt}" loading="lazy">
        </div>
      `;
    }

    // Content wrapper
    html += '<div class="lc-card__content-wrapper">';

    // Header
    if (headerContent) {
      html += `<div class="lc-card__header">${headerContent.innerHTML}</div>`;
    }

    // Body
    html += '<div class="lc-card__body">';
    const tempDiv = document.createElement('div');
    for (const node of defaultContent) {
      tempDiv.appendChild(node);
    }
    html += tempDiv.innerHTML;
    html += '</div>';

    // Footer
    if (footerContent) {
      html += `<div class="lc-card__footer">${footerContent.innerHTML}</div>`;
    }

    html += '</div>'; // Close content wrapper

    // Image (if bottom or right)
    if (image && (imagePosition === 'bottom' || imagePosition === 'right')) {
      const imageSrc = pathResolver.resolveAsset(image);
      html += `
        <div class="lc-card__image">
          <img src="${imageSrc}" alt="${imageAlt}" loading="lazy">
        </div>
      `;
    }

    // Create wrapper (use <a> if href, otherwise <div>)
    const tag = href ? 'a' : 'div';
    const wrapper = document.createElement(tag);
    wrapper.className = classes.join(' ');

    if (href) {
      wrapper.href = href;
    }

    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  setupEventListeners() {
    const card = this.querySelector('.lc-card');

    if (card && (this.getBoolAttr('clickable') || this.getAttr('href'))) {
      this.on(card, 'click', (event) => {
        // If it's a link, let it navigate naturally
        if (this.getAttr('href')) {
          return;
        }

        this.emit('lc-card-click', {
          card: this,
          originalEvent: event
        });
      });

      // Add keyboard support
      if (!this.getAttr('href')) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        this.on(card, 'keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.emit('lc-card-click', {
              card: this,
              originalEvent: event
            });
          }
        });
      }
    }
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-card-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-card-styles';
    style.textContent = `
      .lc-card {
        display: flex;
        flex-direction: column;
        background: var(--card-bg);
        border-radius: var(--card-radius);
        overflow: hidden;
        transition: transform var(--transition-base) var(--transition-ease-in-out),
                    box-shadow var(--transition-base) var(--transition-ease-in-out);
        text-decoration: none;
        color: inherit;
      }

      /* Variants */
      .lc-card--default {
        border: 1px solid var(--card-border);
        box-shadow: none;
      }

      .lc-card--elevated {
        border: none;
        box-shadow: var(--card-shadow);
      }

      .lc-card--outlined {
        border: 2px solid var(--card-border);
        box-shadow: none;
      }

      .lc-card--filled {
        border: none;
        background: var(--bg-surface-secondary);
        box-shadow: none;
      }

      /* Padding sizes */
      .lc-card--padding-none .lc-card__body {
        padding: 0;
      }

      .lc-card--padding-sm .lc-card__body {
        padding: var(--card-padding-sm);
      }

      .lc-card--padding-base .lc-card__body {
        padding: var(--card-padding);
      }

      .lc-card--padding-lg .lc-card__body {
        padding: var(--card-padding-lg);
      }

      /* Header and footer padding matches body */
      .lc-card--padding-sm .lc-card__header,
      .lc-card--padding-sm .lc-card__footer {
        padding: var(--card-padding-sm);
      }

      .lc-card--padding-base .lc-card__header,
      .lc-card--padding-base .lc-card__footer {
        padding: var(--card-padding);
      }

      .lc-card--padding-lg .lc-card__header,
      .lc-card--padding-lg .lc-card__footer {
        padding: var(--card-padding-lg);
      }

      /* Hoverable state */
      .lc-card--hoverable:hover {
        transform: translateY(-2px);
      }

      .lc-card--elevated.lc-card--hoverable:hover {
        box-shadow: var(--card-shadow-hover);
      }

      /* Clickable state */
      .lc-card--clickable {
        cursor: pointer;
        user-select: none;
      }

      .lc-card--clickable:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-card--clickable:active {
        transform: translateY(0);
      }

      /* Card sections */
      .lc-card__content-wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .lc-card__header {
        border-bottom: 1px solid var(--card-header-border);
      }

      .lc-card__body {
        flex: 1;
      }

      .lc-card__footer {
        border-top: 1px solid var(--card-footer-border);
      }

      /* Image */
      .lc-card__image {
        position: relative;
        overflow: hidden;
        background: var(--bg-surface-secondary);
      }

      .lc-card__image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Image positions */
      .lc-card--image-top .lc-card__image {
        order: -1;
        height: 200px;
      }

      .lc-card--image-bottom .lc-card__image {
        order: 1;
        height: 200px;
      }

      /* Horizontal layouts */
      .lc-card--image-left,
      .lc-card--image-right {
        flex-direction: row;
      }

      .lc-card--image-left .lc-card__image {
        order: -1;
        width: 40%;
        min-height: 200px;
      }

      .lc-card--image-right .lc-card__image {
        order: 1;
        width: 40%;
        min-height: 200px;
      }

      .lc-card--image-left .lc-card__content-wrapper,
      .lc-card--image-right .lc-card__content-wrapper {
        flex: 1;
      }

      /* Responsive - stack horizontal cards on mobile */
      @media (max-width: 767px) {
        .lc-card--image-left,
        .lc-card--image-right {
          flex-direction: column;
        }

        .lc-card--image-left .lc-card__image,
        .lc-card--image-right .lc-card__image {
          width: 100%;
          height: 200px;
          order: -1;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-card {
          transition: none;
        }

        .lc-card--hoverable:hover {
          transform: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-card', LCCard);
export default LCCard;
