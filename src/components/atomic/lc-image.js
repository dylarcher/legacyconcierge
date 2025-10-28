/**
 * Image Component
 * Responsive image with lazy loading, aspect ratio, and loading states
 * @element lc-image
 * @attr {string} src - Image source URL
 * @attr {string} alt - Alternative text (required for accessibility)
 * @attr {string} width - Image width
 * @attr {string} height - Image height
 * @attr {string} aspect-ratio - Aspect ratio (e.g., "16/9", "4/3", "1/1")
 * @attr {string} object-fit - How image fits container (cover|contain|fill|none)
 * @attr {boolean} lazy - Enable lazy loading (default: true)
 * @attr {string} placeholder - Placeholder color or gradient
 * @attr {string} sizes - Responsive image sizes
 * @attr {string} srcset - Responsive image sources
 * @attr {boolean} rounded - Apply border radius
 * @attr {string} radius - Border radius size (sm|base|lg|xl|full)
 * @fires lc-image-load - Emitted when image loads successfully
 * @fires lc-image-error - Emitted when image fails to load
 * @example
 * <lc-image
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   aspect-ratio="16/9"
 *   lazy
 * ></lc-image>
 * <lc-image
 *   src="/images/profile.jpg"
 *   alt="Profile picture"
 *   aspect-ratio="1/1"
 *   rounded
 *   radius="full"
 * ></lc-image>
 */

import pathResolver from '../../utils/path-resolver.js';
import Component from '../base/Component.js';

class LCImage extends Component {
  static get observedAttributes() {
    return [
      'src',
      'alt',
      'width',
      'height',
      'aspect-ratio',
      'object-fit',
      'lazy',
      'placeholder',
      'sizes',
      'srcset',
      'rounded',
      'radius'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.observer = null;
    this.loaded = false;
  }

  async render() {
    const src = this.getAttr('src');
    const alt = this.getAttr('alt', '');
    const width = this.getAttr('width');
    const height = this.getAttr('height');
    const aspectRatio = this.getAttr('aspect-ratio');
    const objectFit = this.getAttr('object-fit', 'cover');
    const lazy = this.getBoolAttr('lazy', true);
    const placeholder = this.getAttr('placeholder', 'var(--bg-surface-secondary)');
    const sizes = this.getAttr('sizes');
    const srcset = this.getAttr('srcset');
    const rounded = this.getBoolAttr('rounded');
    const radius = this.getAttr('radius', 'base');

    if (!src) {
      console.warn('lc-image: src attribute is required');
      return;
    }

    if (!alt) {
      console.warn('lc-image: alt attribute is required for accessibility');
    }

    // Build classes
    const classes = ['lc-image'];

    if (rounded) {
      classes.push(`lc-image--rounded-${radius}`);
    }

    if (this.loaded) {
      classes.push('lc-image--loaded');
    }

    // Resolve image path
    const resolvedSrc = pathResolver.resolveAsset(src);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');

    // Set aspect ratio if provided
    if (aspectRatio) {
      wrapper.style.aspectRatio = aspectRatio;
    }

    // Set background placeholder
    wrapper.style.backgroundColor = placeholder;

    // Create image element
    const img = document.createElement('img');
    img.className = 'lc-image__img';
    img.alt = alt;
    img.style.objectFit = objectFit;

    // Set dimensions
    if (width) img.width = width;
    if (height) img.height = height;

    // Set responsive attributes
    if (sizes) img.sizes = sizes;
    if (srcset) img.srcset = srcset;

    // Lazy loading
    if (lazy && 'loading' in HTMLImageElement.prototype) {
      // Native lazy loading
      img.loading = 'lazy';
      img.src = resolvedSrc;
    } else if (lazy) {
      // Fallback to Intersection Observer
      img.dataset.src = resolvedSrc;
      // Actual loading will happen in onConnected
    } else {
      // Immediate loading
      img.src = resolvedSrc;
    }

    // Add image to wrapper
    wrapper.appendChild(img);

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Setup image load handlers
    this.setupImageHandlers(img);
  }

  onConnected() {
    // Setup Intersection Observer for lazy loading (fallback)
    const img = this.querySelector('.lc-image__img');

    if (img?.dataset.src && !img.src) {
      this.setupIntersectionObserver(img);
    }
  }

  onDisconnected() {
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Setup Intersection Observer for lazy loading
   * @param {HTMLImageElement} img - Image element
   */
  setupIntersectionObserver(img) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers - load immediately
      img.src = img.dataset.src;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
            delete img.dataset.src;
            this.observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px' // Start loading 50px before image enters viewport
      }
    );

    this.observer.observe(this);
  }

  /**
   * Setup image load/error handlers
   * @param {HTMLImageElement} img - Image element
   */
  setupImageHandlers(img) {
    img.addEventListener('load', () => {
      this.loaded = true;
      const wrapper = this.querySelector('.lc-image');
      if (wrapper) {
        wrapper.classList.add('lc-image--loaded');
      }

      this.emit('lc-image-load', {
        image: this,
        src: img.src
      });
    });

    img.addEventListener('error', (error) => {
      console.error('Image failed to load:', img.src);

      this.emit('lc-image-error', {
        image: this,
        src: img.src,
        error
      });

      // Show error state
      const wrapper = this.querySelector('.lc-image');
      if (wrapper) {
        wrapper.classList.add('lc-image--error');
      }
    });
  }

  onAttributeChanged(name, _oldValue, newValue) {
    if (this._initialized && name !== 'alt') {
      // Alt can be updated without re-rendering
      if (name === 'alt') {
        const img = this.querySelector('.lc-image__img');
        if (img) {
          img.alt = newValue || '';
        }
      } else {
        this.rerender();
      }
    }
  }

  applyStyles() {
    if (document.getElementById('lc-image-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-image-styles';
    style.textContent = `
      .lc-image {
        position: relative;
        display: block;
        width: 100%;
        overflow: hidden;
        background-color: var(--bg-surface-secondary);
      }

      .lc-image__img {
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0;
        transition: opacity var(--transition-base) var(--transition-ease-in-out);
      }

      /* Loaded state */
      .lc-image--loaded .lc-image__img {
        opacity: 1;
      }

      /* Error state */
      .lc-image--error {
        background-color: var(--color-neutral-200);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .lc-image--error::after {
        content: '⚠';
        font-size: var(--font-size-2xl);
        color: var(--color-neutral-500);
      }

      /* Border radius */
      .lc-image--rounded-sm {
        border-radius: var(--radius-sm);
      }

      .lc-image--rounded-base {
        border-radius: var(--radius-base);
      }

      .lc-image--rounded-lg {
        border-radius: var(--radius-lg);
      }

      .lc-image--rounded-xl {
        border-radius: var(--radius-xl);
      }

      .lc-image--rounded-full {
        border-radius: var(--radius-full);
      }

      /* Ensure aspect ratio is maintained */
      .lc-image[style*="aspect-ratio"] {
        height: auto;
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-image__img {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-image', LCImage);
export default LCImage;
