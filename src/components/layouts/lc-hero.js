/**
 * Hero Component
 * Large hero section with multiple variants, background support, and overlay
 * @element lc-hero
 * @attr {string} variant - Hero style (default|gradient|image|video|split)
 * @attr {string} height - Hero height (sm|base|lg|xl|full)
 * @attr {string} align - Content alignment (left|center|right)
 * @attr {string} valign - Vertical alignment (top|center|bottom)
 * @attr {string} bg-image - Background image URL
 * @attr {string} bg-video - Background video URL
 * @attr {string} bg-position - Background position (center, top, bottom, etc.)
 * @attr {string} overlay - Overlay opacity (none|light|medium|dark)
 * @attr {string} overlay-color - Overlay color (default uses bg-overlay token)
 * @attr {boolean} contained - Wrap content in container
 * @attr {string} container-size - Container size if contained
 * @fires lc-hero-ready - Emitted when hero is fully rendered
 * @slot default - Hero content
 * @example
 * <lc-hero variant="gradient" height="lg" align="center" valign="center">
 *   <h1>Welcome</h1>
 *   <p>Subtitle text</p>
 * </lc-hero>
 * <lc-hero variant="image" bg-image="/images/hero.jpg" overlay="medium">
 *   <h1>Image Hero</h1>
 * </lc-hero>
 * <lc-hero variant="video" bg-video="/videos/hero.mp4">
 *   <h1>Video Hero</h1>
 * </lc-hero>
 */

import pathResolver from '../../utils/path-resolver.js';
import Component from '../base/Component.js';

class LCHero extends Component {
  static get observedAttributes() {
    return [
      'variant',
      'height',
      'align',
      'valign',
      'bg-image',
      'bg-video',
      'bg-position',
      'overlay',
      'overlay-color',
      'contained',
      'container-size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.videoElement = null;
  }

  async render() {
    const variant = this.getAttr('variant', 'default');
    const height = this.getAttr('height', 'base');
    const align = this.getAttr('align', 'center');
    const valign = this.getAttr('valign', 'center');
    const bgImage = this.getAttr('bg-image');
    const bgVideo = this.getAttr('bg-video');
    const bgPosition = this.getAttr('bg-position', 'center');
    const overlay = this.getAttr('overlay', 'none');
    const overlayColor = this.getAttr('overlay-color');
    const contained = this.getBoolAttr('contained');
    const containerSize = this.getAttr('container-size', 'xl');

    // Build classes
    const classes = [
      'lc-hero',
      `lc-hero--${variant}`,
      `lc-hero--height-${height}`,
      `lc-hero--align-${align}`,
      `lc-hero--valign-${valign}`
    ];

    if (overlay !== 'none') {
      classes.push(`lc-hero--overlay-${overlay}`);
    }

    // Store original content
    let content = this.innerHTML;

    // Wrap in container if requested
    if (contained) {
      content = `<div class="lc-hero__container lc-hero__container--${containerSize}">${content}</div>`;
    }

    // Build hero structure
    let html = '';

    // Add background media
    if (bgVideo) {
      const videoSrc = pathResolver.resolveAsset(bgVideo);
      html += `
        <div class="lc-hero__background">
          <video
            class="lc-hero__video"
            autoplay
            loop
            muted
            playsinline
            aria-hidden="true"
          >
            <source src="${videoSrc}" type="video/mp4">
          </video>
        </div>
      `;
    } else if (bgImage) {
      const imageSrc = pathResolver.resolveAsset(bgImage);
      html += `
        <div class="lc-hero__background" style="background-image: url('${imageSrc}'); background-position: ${bgPosition};"></div>
      `;
    }

    // Add overlay
    if (overlay !== 'none') {
      const overlayStyle = overlayColor ? `style="background-color: ${overlayColor}"` : '';
      html += `<div class="lc-hero__overlay" ${overlayStyle}></div>`;
    }

    // Add content
    html += `<div class="lc-hero__content">${content}</div>`;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Store video reference
    this.videoElement = this.querySelector('.lc-hero__video');

    // Emit ready event
    this.emit('lc-hero-ready', { hero: this });
  }

  onConnected() {
    // Ensure video plays on mobile
    if (this.videoElement) {
      this.videoElement.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
      });
    }
  }

  onDisconnected() {
    // Pause video to save resources
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement = null;
    }
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  /**
   * Pause video playback
   */
  pauseVideo() {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  /**
   * Resume video playback
   */
  playVideo() {
    if (this.videoElement) {
      this.videoElement.play().catch((error) => {
        console.warn('Video play failed:', error);
      });
    }
  }

  applyStyles() {
    if (document.getElementById('lc-hero-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-hero-styles';
    style.textContent = `
      .lc-hero {
        position: relative;
        width: 100%;
        display: flex;
        overflow: hidden;
        isolation: isolate;
      }

      /* Heights - Mobile first */
      .lc-hero--height-sm {
        min-height: 40vh;
      }

      .lc-hero--height-base {
        min-height: var(--hero-min-height-mobile);
      }

      .lc-hero--height-lg {
        min-height: 70vh;
      }

      .lc-hero--height-xl {
        min-height: 85vh;
      }

      .lc-hero--height-full {
        min-height: 100vh;
      }

      /* Background layer */
      .lc-hero__background {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      .lc-hero__video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* Overlay layer */
      .lc-hero__overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
      }

      .lc-hero--overlay-light .lc-hero__overlay {
        background-color: rgba(0, 0, 0, 0.25);
      }

      .lc-hero--overlay-medium .lc-hero__overlay {
        background-color: rgba(0, 0, 0, 0.4);
      }

      .lc-hero--overlay-dark .lc-hero__overlay {
        background-color: rgba(0, 0, 0, 0.6);
      }

      /* Content layer */
      .lc-hero__content {
        position: relative;
        z-index: 2;
        width: 100%;
        padding: var(--hero-padding-y-mobile) var(--space-4);
      }

      /* Horizontal alignment */
      .lc-hero--align-left {
        justify-content: flex-start;
        text-align: left;
      }

      .lc-hero--align-center {
        justify-content: center;
        text-align: center;
      }

      .lc-hero--align-right {
        justify-content: flex-end;
        text-align: right;
      }

      /* Vertical alignment */
      .lc-hero--valign-top {
        align-items: flex-start;
      }

      .lc-hero--valign-center {
        align-items: center;
      }

      .lc-hero--valign-bottom {
        align-items: flex-end;
      }

      /* Variants */
      .lc-hero--default {
        background: var(--bg-surface);
        color: var(--text-primary);
      }

      .lc-hero--gradient {
        background: linear-gradient(
          135deg,
          var(--color-primary-700) 0%,
          var(--color-primary-500) 100%
        );
        color: var(--color-white);
      }

      .lc-hero--image,
      .lc-hero--video {
        color: var(--color-white);
      }

      .lc-hero--split {
        background: linear-gradient(
          90deg,
          var(--color-primary-800) 0%,
          var(--color-primary-800) 50%,
          var(--bg-surface) 50%,
          var(--bg-surface) 100%
        );
      }

      /* Container wrapper */
      .lc-hero__container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      }

      .lc-hero__container--sm { max-width: var(--container-sm); }
      .lc-hero__container--md { max-width: var(--container-md); }
      .lc-hero__container--lg { max-width: var(--container-lg); }
      .lc-hero__container--xl { max-width: var(--container-xl); }
      .lc-hero__container--2xl { max-width: var(--container-2xl); }

      /* Responsive enhancements */
      @media (min-width: 640px) {
        .lc-hero__content {
          padding-left: var(--space-6);
          padding-right: var(--space-6);
        }
      }

      @media (min-width: 768px) {
        .lc-hero--height-base {
          min-height: var(--hero-min-height);
        }

        .lc-hero__content {
          padding-top: var(--hero-padding-y);
          padding-bottom: var(--hero-padding-y);
        }
      }

      @media (min-width: 1024px) {
        .lc-hero__content {
          padding-left: var(--space-8);
          padding-right: var(--space-8);
        }

        .lc-hero--height-lg {
          min-height: 80vh;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .lc-hero__video {
          display: none;
        }

        .lc-hero__background {
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-hero', LCHero);
export default LCHero;
