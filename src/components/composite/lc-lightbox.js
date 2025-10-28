/**
 * Lightbox Component
 * Image lightbox gallery with zoom and navigation
 * @element lc-lightbox
 * @attr {string} images - JSON array of images [{src, alt, title, description}]
 * @attr {number} active - Active image index (0-based)
 * @attr {boolean} open - Open/close lightbox
 * @attr {boolean} show-thumbnails - Show thumbnail strip (default: false)
 * @attr {boolean} show-counter - Show image counter (default: true)
 * @attr {boolean} loop - Loop through images (default: true)
 * @fires lc-lightbox-open - Emitted when lightbox opens
 * @fires lc-lightbox-close - Emitted when lightbox closes
 * @fires lc-lightbox-change - Emitted when image changes
 * @example
 * <lc-lightbox
 *   images='[
 *     {"src": "/images/1.jpg", "alt": "Image 1", "title": "Title 1"},
 *     {"src": "/images/2.jpg", "alt": "Image 2", "title": "Title 2"}
 *   ]'
 * ></lc-lightbox>
 */

import BaseComponent from '../base/BaseComponent.js';
import pathResolver from '../../utilities/path-resolver.js';

class LCLightbox extends BaseComponent {
  static get observedAttributes() {
    return [
      'images',
      'active',
      'open',
      'show-thumbnails',
      'show-counter',
      'loop'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.lightboxId = `lc-lightbox-${Math.random().toString(36).substr(2, 9)}`;
    this.previousFocus = null;
  }

  async render() {
    const images = this.getJsonAttr('images', []);
    const active = this.getNumAttr('active', 0);
    const open = this.getBoolAttr('open');
    const showThumbnails = this.getBoolAttr('show-thumbnails');
    const showCounter = this.getBoolAttr('show-counter') !== false; // Default true
    const loop = this.getBoolAttr('loop') !== false; // Default true

    if (images.length === 0) {
      console.warn('lc-lightbox: images attribute is required');
      return;
    }

    // Build classes
    const wrapperClasses = ['lc-lightbox'];
    if (open) wrapperClasses.push('lc-lightbox--open');

    const currentImage = images[active] || images[0];
    const imageSrc = currentImage.src ? pathResolver.resolveAsset(currentImage.src) : '';

    // Build HTML
    let html = `
      <!-- Backdrop -->
      <div class="lc-lightbox__backdrop" aria-hidden="true"></div>

      <!-- Container -->
      <div
        class="lc-lightbox__container"
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
      >
        <!-- Header -->
        <div class="lc-lightbox__header">
          ${showCounter ? `
            <div class="lc-lightbox__counter">
              ${active + 1} / ${images.length}
            </div>
          ` : ''}
          <button
            type="button"
            class="lc-lightbox__close"
            aria-label="Close lightbox"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <!-- Image container -->
        <div class="lc-lightbox__content">
          <img
            src="${imageSrc}"
            alt="${currentImage.alt || ''}"
            class="lc-lightbox__image"
            loading="lazy"
          >

          ${currentImage.title || currentImage.description ? `
            <div class="lc-lightbox__caption">
              ${currentImage.title ? `<h3 class="lc-lightbox__title">${this.escapeHtml(currentImage.title)}</h3>` : ''}
              ${currentImage.description ? `<p class="lc-lightbox__description">${this.escapeHtml(currentImage.description)}</p>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Navigation arrows -->
        ${images.length > 1 ? `
          <button
            type="button"
            class="lc-lightbox__arrow lc-lightbox__arrow--prev"
            aria-label="Previous image"
            ${!loop && active === 0 ? 'disabled' : ''}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="32" height="32">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            class="lc-lightbox__arrow lc-lightbox__arrow--next"
            aria-label="Next image"
            ${!loop && active === images.length - 1 ? 'disabled' : ''}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="32" height="32">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        ` : ''}

        <!-- Thumbnails -->
        ${showThumbnails && images.length > 1 ? `
          <div class="lc-lightbox__thumbnails">
            ${images.map((image, index) => {
              const thumbSrc = pathResolver.resolveAsset(image.src);
              return `
                <button
                  type="button"
                  class="lc-lightbox__thumbnail ${index === active ? 'lc-lightbox__thumbnail--active' : ''}"
                  aria-label="View image ${index + 1}"
                  data-index="${index}"
                >
                  <img src="${thumbSrc}" alt="${image.alt || ''}" loading="lazy">
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Handle open state
    if (open) {
      this.handleOpen();
    }
  }

  setupEventListeners() {
    const backdrop = this.$('.lc-lightbox__backdrop');
    const closeButton = this.$('.lc-lightbox__close');
    const prevArrow = this.$('.lc-lightbox__arrow--prev');
    const nextArrow = this.$('.lc-lightbox__arrow--next');
    const thumbnails = this.$$('.lc-lightbox__thumbnail');

    // Close button
    if (closeButton) {
      this.on(closeButton, 'click', () => {
        this.close();
      });
    }

    // Backdrop click
    if (backdrop) {
      this.on(backdrop, 'click', () => {
        this.close();
      });
    }

    // Navigation arrows
    if (prevArrow) {
      this.on(prevArrow, 'click', () => {
        this.prevImage();
      });
    }

    if (nextArrow) {
      this.on(nextArrow, 'click', () => {
        this.nextImage();
      });
    }

    // Thumbnails
    thumbnails.forEach(thumb => {
      this.on(thumb, 'click', () => {
        const index = parseInt(thumb.dataset.index, 10);
        this.goToImage(index);
      });
    });

    // Keyboard navigation
    this.on(document, 'keydown', (event) => {
      if (!this.getBoolAttr('open')) return;

      if (event.key === 'Escape') {
        this.close();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      }
    });
  }

  /**
   * Open lightbox
   */
  open(index = 0) {
    this.setAttribute('open', '');
    if (index !== undefined) {
      this.setAttribute('active', index);
    }
  }

  /**
   * Close lightbox
   */
  close() {
    this.removeAttribute('open');
    this.handleClose();
    this.emit('lc-lightbox-close', { lightbox: this });
  }

  /**
   * Go to specific image
   * @param {number} index
   */
  goToImage(index) {
    const images = this.getJsonAttr('images', []);
    if (index < 0 || index >= images.length) return;

    this.setAttribute('active', index);
    this.updateImage(index);

    this.emit('lc-lightbox-change', {
      lightbox: this,
      index,
      total: images.length
    });
  }

  /**
   * Go to next image
   */
  nextImage() {
    const active = this.getNumAttr('active', 0);
    const images = this.getJsonAttr('images', []);
    const loop = this.getBoolAttr('loop') !== false;

    let nextIndex = active + 1;

    if (nextIndex >= images.length) {
      nextIndex = loop ? 0 : images.length - 1;
    }

    this.goToImage(nextIndex);
  }

  /**
   * Go to previous image
   */
  prevImage() {
    const active = this.getNumAttr('active', 0);
    const images = this.getJsonAttr('images', []);
    const loop = this.getBoolAttr('loop') !== false;

    let prevIndex = active - 1;

    if (prevIndex < 0) {
      prevIndex = loop ? images.length - 1 : 0;
    }

    this.goToImage(prevIndex);
  }

  /**
   * Update displayed image
   * @param {number} index
   */
  updateImage(index) {
    const images = this.getJsonAttr('images', []);
    const image = images[index];
    if (!image) return;

    const imageSrc = pathResolver.resolveAsset(image.src);
    const imgElement = this.$('.lc-lightbox__image');
    const captionElement = this.$('.lc-lightbox__caption');
    const counterElement = this.$('.lc-lightbox__counter');

    // Update image
    if (imgElement) {
      imgElement.src = imageSrc;
      imgElement.alt = image.alt || '';
    }

    // Update caption
    if (captionElement) {
      let captionHtml = '';
      if (image.title) {
        captionHtml += `<h3 class="lc-lightbox__title">${this.escapeHtml(image.title)}</h3>`;
      }
      if (image.description) {
        captionHtml += `<p class="lc-lightbox__description">${this.escapeHtml(image.description)}</p>`;
      }
      captionElement.innerHTML = captionHtml;
      captionElement.style.display = captionHtml ? 'block' : 'none';
    }

    // Update counter
    if (counterElement) {
      counterElement.textContent = `${index + 1} / ${images.length}`;
    }

    // Update thumbnails
    const thumbnails = this.$$('.lc-lightbox__thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('lc-lightbox__thumbnail--active', i === index);
    });

    // Update arrows
    const loop = this.getBoolAttr('loop') !== false;
    const prevArrow = this.$('.lc-lightbox__arrow--prev');
    const nextArrow = this.$('.lc-lightbox__arrow--next');

    if (prevArrow && !loop) {
      prevArrow.disabled = index === 0;
    }

    if (nextArrow && !loop) {
      nextArrow.disabled = index === images.length - 1;
    }
  }

  /**
   * Handle lightbox open
   */
  handleOpen() {
    // Save current focus
    this.previousFocus = document.activeElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => {
      this.$('.lc-lightbox__close')?.focus();
    }, 100);

    this.emit('lc-lightbox-open', { lightbox: this });
  }

  /**
   * Handle lightbox close
   */
  handleClose() {
    // Restore body scroll
    document.body.style.overflow = '';

    // Restore previous focus
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }

  /**
   * Escape HTML
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (name === 'open' && this._initialized) {
      const isOpen = newValue !== null;
      const wrapper = this.$('.lc-lightbox');

      if (isOpen) {
        wrapper?.classList.add('lc-lightbox--open');
        this.handleOpen();
      } else {
        wrapper?.classList.remove('lc-lightbox--open');
        this.handleClose();
      }
    } else if (name === 'active' && this._initialized && oldValue !== newValue) {
      const index = parseInt(newValue, 10);
      if (!isNaN(index)) {
        this.updateImage(index);
      }
    } else if (this._initialized && name !== 'open' && name !== 'active') {
      this.rerender();
    }
  }

  onDisconnected() {
    // Clean up body overflow
    if (this.getBoolAttr('open')) {
      document.body.style.overflow = '';
    }
  }

  applyStyles() {
    if (document.getElementById('lc-lightbox-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-lightbox-styles';
    style.textContent = `
      .lc-lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-modal);
      }

      .lc-lightbox--open {
        display: block;
      }

      .lc-lightbox__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        animation: lc-lightbox-fade-in var(--transition-base) ease-out;
      }

      .lc-lightbox__container {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .lc-lightbox__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4);
        color: white;
        flex-shrink: 0;
      }

      .lc-lightbox__counter {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: rgba(255, 255, 255, 0.8);
      }

      .lc-lightbox__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .lc-lightbox__close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .lc-lightbox__close:focus-visible {
        outline: var(--focus-ring-width) solid white;
        outline-offset: var(--focus-ring-offset);
      }

      /* Content */
      .lc-lightbox__content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
        position: relative;
      }

      .lc-lightbox__image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        animation: lc-lightbox-zoom-in var(--transition-base) ease-out;
      }

      .lc-lightbox__caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--space-6);
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        color: white;
        text-align: center;
      }

      .lc-lightbox__title {
        font-family: var(--font-family-serif);
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--space-2);
        color: white;
      }

      .lc-lightbox__description {
        font-size: var(--font-size-base);
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
      }

      /* Navigation arrows */
      .lc-lightbox__arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        padding: 0;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .lc-lightbox__arrow:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
      }

      .lc-lightbox__arrow:focus-visible {
        outline: var(--focus-ring-width) solid white;
        outline-offset: var(--focus-ring-offset);
      }

      .lc-lightbox__arrow:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .lc-lightbox__arrow--prev {
        left: var(--space-6);
      }

      .lc-lightbox__arrow--next {
        right: var(--space-6);
      }

      /* Thumbnails */
      .lc-lightbox__thumbnails {
        display: flex;
        gap: var(--space-2);
        padding: var(--space-4);
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        flex-shrink: 0;
      }

      .lc-lightbox__thumbnails::-webkit-scrollbar {
        height: 6px;
      }

      .lc-lightbox__thumbnails::-webkit-scrollbar-track {
        background: transparent;
      }

      .lc-lightbox__thumbnails::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }

      .lc-lightbox__thumbnail {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        padding: 0;
        border: 2px solid transparent;
        background: transparent;
        border-radius: var(--radius-base);
        overflow: hidden;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .lc-lightbox__thumbnail:hover {
        border-color: rgba(255, 255, 255, 0.5);
      }

      .lc-lightbox__thumbnail:focus-visible {
        outline: var(--focus-ring-width) solid white;
        outline-offset: 2px;
      }

      .lc-lightbox__thumbnail--active {
        border-color: white;
      }

      .lc-lightbox__thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Animations */
      @keyframes lc-lightbox-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes lc-lightbox-zoom-in {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .lc-lightbox__arrow {
          width: 48px;
          height: 48px;
        }

        .lc-lightbox__arrow--prev {
          left: var(--space-2);
        }

        .lc-lightbox__arrow--next {
          right: var(--space-2);
        }

        .lc-lightbox__caption {
          padding: var(--space-4);
        }

        .lc-lightbox__title {
          font-size: var(--font-size-lg);
        }

        .lc-lightbox__description {
          font-size: var(--font-size-sm);
        }

        .lc-lightbox__thumbnail {
          width: 60px;
          height: 60px;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-lightbox__backdrop,
        .lc-lightbox__image {
          animation: none;
        }

        .lc-lightbox__arrow,
        .lc-lightbox__close,
        .lc-lightbox__thumbnail {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-lightbox', LCLightbox);
export default LCLightbox;
