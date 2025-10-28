/**
 * Section Component
 * Semantic section wrapper with padding and background variants
 * @element lc-section
 * @attr {string} variant - Section style (default|alt|primary|secondary|dark)
 * @attr {string} padding - Padding size (none|sm|base|lg|xl)
 * @attr {string} padding-top - Top padding override
 * @attr {string} padding-bottom - Bottom padding override
 * @attr {boolean} contained - Wrap content in container
 * @attr {string} container-size - Container size if contained (sm|md|lg|xl|2xl)
 * @attr {string} id - Section ID for anchor links
 * @fires lc-section-visible - Emitted when section enters viewport (Intersection Observer)
 * @example
 * <lc-section variant="alt" padding="lg">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </lc-section>
 * <lc-section variant="primary" contained container-size="lg">
 *   <h2>Contained Section</h2>
 * </lc-section>
 */

import Component from '../base/Component.js';

class LCSection extends Component {
  static get observedAttributes() {
    return [
      'variant',
      'padding',
      'padding-top',
      'padding-bottom',
      'contained',
      'container-size'
    ];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.observer = null;
  }

  async render() {
    const variant = this.getAttr('variant', 'default');
    const padding = this.getAttr('padding', 'base');
    const paddingTop = this.getAttr('padding-top');
    const paddingBottom = this.getAttr('padding-bottom');
    const contained = this.getBoolAttr('contained');
    const containerSize = this.getAttr('container-size', 'xl');

    // Build classes
    const classes = [
      'lc-section',
      `lc-section--${variant}`,
      `lc-section--padding-${padding}`
    ];

    if (paddingTop) classes.push(`lc-section--padding-top-${paddingTop}`);
    if (paddingBottom) classes.push(`lc-section--padding-bottom-${paddingBottom}`);

    // Store original content
    let content = this.innerHTML;

    // Wrap in container if requested
    if (contained) {
      content = `<div class="lc-section__container lc-section__container--${containerSize}">${content}</div>`;
    }

    // Create section wrapper
    const wrapper = document.createElement('div');
    wrapper.className = classes.join(' ');
    wrapper.innerHTML = content;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();
  }

  onConnected() {
    // Set up Intersection Observer for visibility tracking
    this.setupIntersectionObserver();
  }

  onDisconnected() {
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Setup Intersection Observer to track section visibility
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      return; // Fallback for older browsers
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.emit('lc-section-visible', {
              section: this,
              entry
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px'
      }
    );

    this.observer.observe(this);
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-section-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-section-styles';
    style.textContent = `
      .lc-section {
        position: relative;
        width: 100%;
        transition: background-color var(--transition-base) var(--transition-ease-in-out);
      }

      /* Variant backgrounds */
      .lc-section--default {
        background: var(--bg-page);
        color: var(--text-primary);
      }

      .lc-section--alt {
        background: var(--bg-surface);
        color: var(--text-primary);
      }

      .lc-section--primary {
        background: var(--brand-primary);
        color: var(--text-on-primary);
      }

      .lc-section--secondary {
        background: var(--brand-secondary);
        color: var(--text-on-primary);
      }

      .lc-section--dark {
        background: var(--color-neutral-900);
        color: var(--color-white);
      }

      /* Padding sizes - Mobile first */
      .lc-section--padding-none {
        padding-top: 0;
        padding-bottom: 0;
      }

      .lc-section--padding-sm {
        padding-top: var(--space-8);
        padding-bottom: var(--space-8);
      }

      .lc-section--padding-base {
        padding-top: var(--space-12);
        padding-bottom: var(--space-12);
      }

      .lc-section--padding-lg {
        padding-top: var(--space-16);
        padding-bottom: var(--space-16);
      }

      .lc-section--padding-xl {
        padding-top: var(--space-24);
        padding-bottom: var(--space-24);
      }

      /* Padding top overrides */
      .lc-section--padding-top-none { padding-top: 0 !important; }
      .lc-section--padding-top-sm { padding-top: var(--space-8) !important; }
      .lc-section--padding-top-base { padding-top: var(--space-12) !important; }
      .lc-section--padding-top-lg { padding-top: var(--space-16) !important; }
      .lc-section--padding-top-xl { padding-top: var(--space-24) !important; }

      /* Padding bottom overrides */
      .lc-section--padding-bottom-none { padding-bottom: 0 !important; }
      .lc-section--padding-bottom-sm { padding-bottom: var(--space-8) !important; }
      .lc-section--padding-bottom-base { padding-bottom: var(--space-12) !important; }
      .lc-section--padding-bottom-lg { padding-bottom: var(--space-16) !important; }
      .lc-section--padding-bottom-xl { padding-bottom: var(--space-24) !important; }

      /* Container wrapper */
      .lc-section__container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding-left: var(--space-4);
        padding-right: var(--space-4);
      }

      .lc-section__container--sm { max-width: var(--container-sm); }
      .lc-section__container--md { max-width: var(--container-md); }
      .lc-section__container--lg { max-width: var(--container-lg); }
      .lc-section__container--xl { max-width: var(--container-xl); }
      .lc-section__container--2xl { max-width: var(--container-2xl); }

      /* Responsive padding increases */
      @media (min-width: 640px) {
        .lc-section__container {
          padding-left: var(--space-6);
          padding-right: var(--space-6);
        }
      }

      @media (min-width: 768px) {
        .lc-section--padding-sm {
          padding-top: var(--space-12);
          padding-bottom: var(--space-12);
        }

        .lc-section--padding-base {
          padding-top: var(--space-16);
          padding-bottom: var(--space-16);
        }

        .lc-section--padding-lg {
          padding-top: var(--space-20);
          padding-bottom: var(--space-20);
        }

        .lc-section--padding-xl {
          padding-top: var(--space-32);
          padding-bottom: var(--space-32);
        }
      }

      @media (min-width: 1024px) {
        .lc-section__container {
          padding-left: var(--space-8);
          padding-right: var(--space-8);
        }

        .lc-section--padding-lg {
          padding-top: var(--space-24);
          padding-bottom: var(--space-24);
        }

        .lc-section--padding-xl {
          padding-top: var(--space-40);
          padding-bottom: var(--space-40);
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-section', LCSection);
export default LCSection;
