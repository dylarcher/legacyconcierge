/**
 * Slider/Carousel Component
 * Image and content carousel with navigation and autoplay
 * @element lc-slider
 * @attr {string} slides - JSON array of slides [{image, alt, title, caption}] or use slot
 * @attr {number} active - Active slide index (0-based)
 * @attr {boolean} autoplay - Enable autoplay
 * @attr {number} interval - Autoplay interval in ms (default: 5000)
 * @attr {boolean} loop - Loop slides (default: true)
 * @attr {boolean} show-arrows - Show navigation arrows (default: true)
 * @attr {boolean} show-dots - Show dot indicators (default: true)
 * @attr {string} transition - Transition type (slide|fade) default: slide
 * @fires lc-slider-change - Emitted when active slide changes
 * @fires lc-slider-play - Emitted when autoplay starts
 * @fires lc-slider-pause - Emitted when autoplay pauses
 * @example
 * <lc-slider
 *   slides='[
 *     {"image": "/images/slide1.jpg", "alt": "Slide 1", "title": "Title 1"},
 *     {"image": "/images/slide2.jpg", "alt": "Slide 2", "title": "Title 2"}
 *   ]'
 *   autoplay
 *   interval="5000"
 * ></lc-slider>
 */

import BaseComponent from '../base/BaseComponent.js';
import pathResolver from '../../utilities/path-resolver.js';

class LCSlider extends BaseComponent {
  static get observedAttributes() {
    return [
      'slides',
      'active',
      'autoplay',
      'interval',
      'loop',
      'show-arrows',
      'show-dots',
      'transition'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.sliderId = `lc-slider-${Math.random().toString(36).substr(2, 9)}`;
    this.autoplayTimer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  async render() {
    const slides = this.getJsonAttr('slides', []);
    const active = this.getNumAttr('active', 0);
    const autoplay = this.getBoolAttr('autoplay');
    const interval = this.getNumAttr('interval', 5000);
    const loop = this.getBoolAttr('loop') !== false; // Default true
    const showArrows = this.getBoolAttr('show-arrows') !== false; // Default true
    const showDots = this.getBoolAttr('show-dots') !== false; // Default true
    const transition = this.getAttr('transition', 'slide');

    // Use slotted content if no slides provided
    const slottedSlides = Array.from(this.children).filter(el => !el.hasAttribute('slot'));
    const hasSlottedContent = slottedSlides.length > 0;

    const totalSlides = hasSlottedContent ? slottedSlides.length : slides.length;

    if (totalSlides === 0) {
      console.warn('lc-slider: slides attribute or slotted content required');
      return;
    }

    // Build classes
    const wrapperClasses = [
      'lc-slider',
      `lc-slider--${transition}`
    ];

    // Build HTML
    let html = '<div class="lc-slider__viewport">';
    html += '<div class="lc-slider__track">';

    if (hasSlottedContent) {
      // Use slotted content
      slottedSlides.forEach((slide, index) => {
        const isActive = index === active;
        html += `
          <div
            class="lc-slider__slide ${isActive ? 'lc-slider__slide--active' : ''}"
            data-index="${index}"
            role="group"
            aria-roledescription="slide"
            aria-label="Slide ${index + 1} of ${totalSlides}"
          >
            ${slide.innerHTML}
          </div>
        `;
      });
    } else {
      // Use JSON slides
      slides.forEach((slide, index) => {
        const isActive = index === active;
        const imageSrc = slide.image ? pathResolver.resolveAsset(slide.image) : '';

        html += `
          <div
            class="lc-slider__slide ${isActive ? 'lc-slider__slide--active' : ''}"
            data-index="${index}"
            role="group"
            aria-roledescription="slide"
            aria-label="Slide ${index + 1} of ${totalSlides}"
          >
            ${imageSrc ? `<img src="${imageSrc}" alt="${slide.alt || ''}" class="lc-slider__image" loading="lazy">` : ''}
            ${slide.title || slide.caption ? `
              <div class="lc-slider__caption">
                ${slide.title ? `<h3 class="lc-slider__title">${this.escapeHtml(slide.title)}</h3>` : ''}
                ${slide.caption ? `<p class="lc-slider__text">${this.escapeHtml(slide.caption)}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      });
    }

    html += '</div>'; // Close track
    html += '</div>'; // Close viewport

    // Navigation arrows
    if (showArrows && totalSlides > 1) {
      html += `
        <button
          type="button"
          class="lc-slider__arrow lc-slider__arrow--prev"
          aria-label="Previous slide"
          ${!loop && active === 0 ? 'disabled' : ''}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          class="lc-slider__arrow lc-slider__arrow--next"
          aria-label="Next slide"
          ${!loop && active === totalSlides - 1 ? 'disabled' : ''}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      `;
    }

    // Dot indicators
    if (showDots && totalSlides > 1) {
      html += '<div class="lc-slider__dots">';
      for (let i = 0; i < totalSlides; i++) {
        html += `
          <button
            type="button"
            class="lc-slider__dot ${i === active ? 'lc-slider__dot--active' : ''}"
            aria-label="Go to slide ${i + 1}"
            data-index="${i}"
          ></button>
        `;
      }
      html += '</div>';
    }

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Start autoplay if enabled
    if (autoplay) {
      this.startAutoplay();
    }
  }

  setupEventListeners() {
    const prevArrow = this.$('.lc-slider__arrow--prev');
    const nextArrow = this.$('.lc-slider__arrow--next');
    const dots = this.$$('.lc-slider__dot');
    const viewport = this.$('.lc-slider__viewport');

    // Previous arrow
    if (prevArrow) {
      this.on(prevArrow, 'click', () => {
        this.prevSlide();
      });
    }

    // Next arrow
    if (nextArrow) {
      this.on(nextArrow, 'click', () => {
        this.nextSlide();
      });
    }

    // Dots
    dots.forEach(dot => {
      this.on(dot, 'click', () => {
        const index = parseInt(dot.dataset.index, 10);
        this.goToSlide(index);
      });
    });

    // Keyboard navigation
    this.on(document, 'keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (event.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Touch gestures
    if (viewport) {
      this.on(viewport, 'touchstart', (event) => {
        this.touchStartX = event.changedTouches[0].screenX;
      }, { passive: true });

      this.on(viewport, 'touchend', (event) => {
        this.touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Pause autoplay on hover
    if (this.getBoolAttr('autoplay')) {
      this.on(this, 'mouseenter', () => {
        this.pauseAutoplay();
      });

      this.on(this, 'mouseleave', () => {
        this.startAutoplay();
      });
    }
  }

  /**
   * Go to specific slide
   * @param {number} index
   */
  goToSlide(index) {
    const slides = this.$$('.lc-slider__slide');
    const totalSlides = slides.length;

    if (index < 0 || index >= totalSlides) return;

    this.setAttribute('active', index);

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('lc-slider__slide--active', i === index);
    });

    // Update dots
    const dots = this.$$('.lc-slider__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('lc-slider__dot--active', i === index);
    });

    // Update arrows
    const loop = this.getBoolAttr('loop') !== false;
    const prevArrow = this.$('.lc-slider__arrow--prev');
    const nextArrow = this.$('.lc-slider__arrow--next');

    if (prevArrow && !loop) {
      prevArrow.disabled = index === 0;
    }

    if (nextArrow && !loop) {
      nextArrow.disabled = index === totalSlides - 1;
    }

    this.emit('lc-slider-change', {
      slider: this,
      index,
      total: totalSlides
    });
  }

  /**
   * Go to next slide
   */
  nextSlide() {
    const active = this.getNumAttr('active', 0);
    const slides = this.$$('.lc-slider__slide');
    const totalSlides = slides.length;
    const loop = this.getBoolAttr('loop') !== false;

    let nextIndex = active + 1;

    if (nextIndex >= totalSlides) {
      nextIndex = loop ? 0 : totalSlides - 1;
    }

    this.goToSlide(nextIndex);
  }

  /**
   * Go to previous slide
   */
  prevSlide() {
    const active = this.getNumAttr('active', 0);
    const slides = this.$$('.lc-slider__slide');
    const totalSlides = slides.length;
    const loop = this.getBoolAttr('loop') !== false;

    let prevIndex = active - 1;

    if (prevIndex < 0) {
      prevIndex = loop ? totalSlides - 1 : 0;
    }

    this.goToSlide(prevIndex);
  }

  /**
   * Handle swipe gesture
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        this.nextSlide();
      } else {
        // Swipe right - previous slide
        this.prevSlide();
      }
    }
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    const autoplay = this.getBoolAttr('autoplay');
    if (!autoplay) return;

    this.stopAutoplay(); // Clear any existing timer

    const interval = this.getNumAttr('interval', 5000);
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, interval);

    this.emit('lc-slider-play', { slider: this });
  }

  /**
   * Pause autoplay
   */
  pauseAutoplay() {
    this.stopAutoplay();
    this.emit('lc-slider-pause', { slider: this });
  }

  /**
   * Stop autoplay
   */
  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
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
    if (name === 'active' && this._initialized && oldValue !== newValue) {
      const index = parseInt(newValue, 10);
      if (!isNaN(index)) {
        this.goToSlide(index);
      }
    } else if (name === 'autoplay' && this._initialized) {
      if (newValue !== null) {
        this.startAutoplay();
      } else {
        this.stopAutoplay();
      }
    } else if (this._initialized && name !== 'active' && name !== 'autoplay') {
      this.rerender();
    }
  }

  onDisconnected() {
    this.stopAutoplay();
  }

  applyStyles() {
    if (document.getElementById('lc-slider-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-slider-styles';
    style.textContent = `
      .lc-slider {
        position: relative;
        width: 100%;
        overflow: hidden;
      }

      .lc-slider__viewport {
        position: relative;
        width: 100%;
        overflow: hidden;
      }

      .lc-slider__track {
        position: relative;
        width: 100%;
      }

      .lc-slider__slide {
        display: none;
        position: relative;
        width: 100%;
      }

      .lc-slider__slide--active {
        display: block;
        animation: lc-slider-fade-in var(--transition-base) ease-out;
      }

      .lc-slider--slide .lc-slider__slide--active {
        animation: lc-slider-slide-in var(--transition-base) ease-out;
      }

      .lc-slider__image {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
      }

      .lc-slider__caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--space-6);
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        color: white;
      }

      .lc-slider__title {
        font-family: var(--font-family-serif);
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--space-2);
        color: white;
      }

      .lc-slider__text {
        font-size: var(--font-size-base);
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
      }

      /* Arrows */
      .lc-slider__arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--slider-arrow-size);
        height: var(--slider-arrow-size);
        padding: 0;
        border: none;
        background: var(--slider-arrow-bg);
        color: var(--slider-arrow-color);
        border-radius: 50%;
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: var(--shadow-sm);
      }

      .lc-slider__arrow:hover:not(:disabled) {
        background: var(--slider-arrow-hover-bg);
        box-shadow: var(--shadow-md);
      }

      .lc-slider__arrow:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-slider__arrow:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .lc-slider__arrow--prev {
        left: var(--space-4);
      }

      .lc-slider__arrow--next {
        right: var(--space-4);
      }

      /* Dots */
      .lc-slider__dots {
        position: absolute;
        bottom: var(--space-4);
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        gap: var(--space-2);
      }

      .lc-slider__dot {
        width: var(--slider-dot-size);
        height: var(--slider-dot-size);
        padding: 0;
        border: none;
        background: var(--slider-dot-color);
        border-radius: 50%;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .lc-slider__dot:hover {
        background: var(--slider-dot-active-color);
        transform: scale(1.2);
      }

      .lc-slider__dot:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }

      .lc-slider__dot--active {
        background: var(--slider-dot-active-color);
        transform: scale(1.3);
      }

      /* Animations */
      @keyframes lc-slider-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes lc-slider-slide-in {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .lc-slider__arrow {
          width: 40px;
          height: 40px;
        }

        .lc-slider__arrow--prev {
          left: var(--space-2);
        }

        .lc-slider__arrow--next {
          right: var(--space-2);
        }

        .lc-slider__caption {
          padding: var(--space-4);
        }

        .lc-slider__title {
          font-size: var(--font-size-xl);
        }

        .lc-slider__text {
          font-size: var(--font-size-sm);
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-slider__slide--active {
          animation: none;
        }

        .lc-slider__arrow,
        .lc-slider__dot {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-slider', LCSlider);
export default LCSlider;
