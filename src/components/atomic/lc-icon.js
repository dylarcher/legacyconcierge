/**
 * Icon Component
 * SVG icon component with sprite support and sizing
 * @element lc-icon
 * @attr {string} name - Icon name (matches SVG sprite ID)
 * @attr {string} size - Icon size (xs|sm|base|md|lg|xl|2xl|custom)
 * @attr {string} custom-size - Custom size (e.g., "32px", "2rem")
 * @attr {string} color - Icon color (uses currentColor by default)
 * @attr {string} label - Accessible label for standalone icons
 * @attr {boolean} decorative - Mark icon as decorative (aria-hidden)
 * @fires lc-icon-loaded - Emitted when icon SVG is loaded
 * @example
 * <lc-icon name="check" size="lg"></lc-icon>
 * <lc-icon name="heart" size="custom" custom-size="48px" color="red"></lc-icon>
 * <lc-icon name="menu" label="Open menu"></lc-icon>
 * <lc-icon name="decorative-star" decorative></lc-icon>
 */

import pathResolver from '../../utils/path-resolver.js';
import Component from '../base/Component.js';

class LCIcon extends Component {
  static get observedAttributes() {
    return ['name', 'size', 'custom-size', 'color', 'label', 'decorative'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.svgCache = LCIcon.svgCache || new Map();
    LCIcon.svgCache = this.svgCache;
  }

  async render() {
    const name = this.getAttr('name');
    const size = this.getAttr('size', 'base');
    const customSize = this.getAttr('custom-size');
    const color = this.getAttr('color');
    const label = this.getAttr('label');
    const decorative = this.getBoolAttr('decorative');

    if (!name) {
      console.warn('lc-icon: name attribute is required');
      return;
    }

    // Build classes
    const classes = [
      'lc-icon',
      size === 'custom' ? 'lc-icon--custom' : `lc-icon--${size}`
    ];

    // Load SVG
    const svgContent = await this.loadIcon(name);

    if (!svgContent) {
      console.warn(`lc-icon: Icon "${name}" not found`);
      return;
    }

    // Create wrapper
    const wrapper = document.createElement('span');
    wrapper.className = classes.join(' ');
    wrapper.setAttribute('role', 'img');

    // Set custom size if provided
    if (size === 'custom' && customSize) {
      wrapper.style.width = customSize;
      wrapper.style.height = customSize;
    }

    // Set color
    if (color) {
      wrapper.style.color = color;
    }

    // Accessibility
    if (decorative) {
      wrapper.setAttribute('aria-hidden', 'true');
    } else if (label) {
      wrapper.setAttribute('aria-label', label);
    } else {
      // Use icon name as fallback label
      wrapper.setAttribute('aria-label', name.replace(/-/g, ' '));
    }

    // Set SVG content
    wrapper.innerHTML = svgContent;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    this.applyStyles();

    // Emit loaded event
    this.emit('lc-icon-loaded', { icon: this, name });
  }

  /**
   * Load icon SVG
   * First tries to load from sprite, then falls back to individual file
   * @param {string} name - Icon name
   * @returns {Promise<string>} SVG content
   */
  async loadIcon(name) {
    // Check cache first
    if (this.svgCache.has(name)) {
      return this.svgCache.get(name);
    }

    try {
      // Try sprite first (more efficient)
      const spriteUrl = pathResolver.resolveAsset('icons/sprite.svg');
      const svgContent = `<svg><use href="${spriteUrl}#${name}"></use></svg>`;

      // Cache and return
      this.svgCache.set(name, svgContent);
      return svgContent;
    } catch (_error) {
      console.warn(`Icon sprite not available, loading individual file for: ${name}`);

      try {
        // Fall back to individual SVG file
        const iconUrl = pathResolver.resolveAsset(`icons/${name}.svg`);
        const response = await fetch(iconUrl);

        if (!response.ok) {
          throw new Error(`Icon not found: ${name}`);
        }

        const svgContent = await response.text();

        // Cache and return
        this.svgCache.set(name, svgContent);
        return svgContent;
      } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
        return null;
      }
    }
  }

  onAttributeChanged(_name, _oldValue, _newValue) {
    if (this._initialized) {
      this.rerender();
    }
  }

  /**
   * Clear icon cache
   * @param {string} [name] - Specific icon to clear, or all if not provided
   */
  static clearCache(name) {
    if (name) {
      LCIcon.svgCache?.delete(name);
    } else {
      LCIcon.svgCache?.clear();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-icon-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-icon-styles';
    style.textContent = `
      .lc-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 1;
        vertical-align: middle;
        color: currentColor;
      }

      .lc-icon svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
        stroke: currentColor;
      }

      /* Size variants */
      .lc-icon--xs {
        width: 12px;
        height: 12px;
      }

      .lc-icon--sm {
        width: 16px;
        height: 16px;
      }

      .lc-icon--base {
        width: 20px;
        height: 20px;
      }

      .lc-icon--md {
        width: 24px;
        height: 24px;
      }

      .lc-icon--lg {
        width: 32px;
        height: 32px;
      }

      .lc-icon--xl {
        width: 40px;
        height: 40px;
      }

      .lc-icon--2xl {
        width: 48px;
        height: 48px;
      }

      /* Custom size uses inline styles */
      .lc-icon--custom {
        /* Size set via inline style */
      }

      /* Ensure icons maintain aspect ratio */
      .lc-icon svg {
        max-width: 100%;
        max-height: 100%;
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-icon', LCIcon);
export default LCIcon;
