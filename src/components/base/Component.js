/**
 * Base Web Component
 * Foundation class for all web components
 * Provides common functionality: templating, i18n, events, lifecycle
 * @module components/base/Component
 */

import i18n from '../../utils/i18n.js';
import templateLoader from '../../utils/template-loader.js';

/**
 * Component class - extends HTMLElement
 */
class Component extends HTMLElement {
  constructor() {
    super();

    // Component state
    this._initialized = false;
    this._connected = false;
    this._shadowRoot = null;
    this._template = null;
    this._listeners = new Map();

    // Options
    this.useShadowDOM = false; // Override in subclass if needed
    this.templateName = null; // Override in subclass
  }

  /**
   * Lifecycle: Element added to DOM
   */
  connectedCallback() {
    if (!this._initialized) {
      this.init();
      this._initialized = true;
    }

    this._connected = true;
    this.onConnected();
  }

  /**
   * Lifecycle: Element removed from DOM
   */
  disconnectedCallback() {
    this._connected = false;
    this.cleanup();
    this.onDisconnected();
  }

  /**
   * Lifecycle: Attribute changed
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old value
   * @param {string} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.onAttributeChanged(name, oldValue, newValue);
    }
  }

  /**
   * Lifecycle: Element adopted to new document
   */
  adoptedCallback() {
    this.onAdopted();
  }

  /**
   * Initialize component
   * Override this method to add initialization logic
   */
  async init() {
    // Setup shadow DOM if requested
    if (this.useShadowDOM && !this._shadowRoot) {
      this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    // Load template if specified
    if (this.templateName) {
      await this.loadTemplate();
    }

    // Apply initial render
    await this.render();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Load template from template loader
   * @returns {Promise<void>}
   */
  async loadTemplate() {
    try {
      this._template = await templateLoader.load(this.templateName);
    } catch (error) {
      console.error(`Failed to load template for ${this.constructor.name}:`, error);
    }
  }

  /**
   * Render component
   * Override this method to customize rendering
   * @returns {Promise<void>}
   */
  async render() {
    // Default implementation: append template to component or shadow root
    if (this._template) {
      const root = this.useShadowDOM ? this._shadowRoot : this;
      root.appendChild(this._template.cloneNode(true));
    }

    // Apply i18n translations
    await this.applyTranslations();
  }

  /**
   * Re-render component (clears and re-renders)
   * @returns {Promise<void>}
   */
  async rerender() {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    root.innerHTML = '';

    // Reload template
    if (this.templateName) {
      await this.loadTemplate();
    }

    await this.render();
    this.setupEventListeners();
  }

  /**
   * Apply i18n translations to component
   * @returns {Promise<void>}
   */
  async applyTranslations() {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    const page = this.getAttribute('data-page') || i18n.detectCurrentPage();
    await i18n.apply(root, page);
  }

  /**
   * Setup event listeners
   * Override this method to add event listeners
   */
  setupEventListeners() {
    // Override in subclass
  }

  /**
   * Cleanup event listeners and resources
   */
  cleanup() {
    // Remove all registered event listeners
    this._listeners.forEach((listener, key) => {
      const [element, event] = key.split(':');
      const el = element === 'this' ? this : this.querySelector(element);
      if (el) {
        el.removeEventListener(event, listener);
      }
    });

    this._listeners.clear();
  }

  /**
   * Add event listener with automatic cleanup
   * @param {string|HTMLElement} target - Target selector or element ('this' for component itself)
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  on(target, event, handler, options = {}) {
    let element;

    if (target === 'this') {
      element = this;
    } else if (typeof target === 'string') {
      const root = this.useShadowDOM ? this._shadowRoot : this;
      element = root.querySelector(target);
    } else {
      element = target;
    }

    if (!element) {
      console.warn(`Event target not found: ${target}`);
      return;
    }

    element.addEventListener(event, handler, options);

    // Store for cleanup
    const key = `${target}:${event}`;
    this._listeners.set(key, handler);
  }

  /**
   * Emit custom event
   * @param {string} name - Event name
   * @param {*} detail - Event detail data
   * @param {Object} options - Event options
   */
  emit(name, detail = null, options = {}) {
    const event = new CustomEvent(name, {
      detail,
      bubbles: options.bubbles !== false,
      composed: options.composed !== false,
      cancelable: options.cancelable || false
    });

    this.dispatchEvent(event);
  }

  /**
   * Query selector within component (respects shadow DOM)
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null}
   */
  $(selector) {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    return root.querySelector(selector);
  }

  /**
   * Query selector all within component (respects shadow DOM)
   * @param {string} selector - CSS selector
   * @returns {NodeList}
   */
  $$(selector) {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    return root.querySelectorAll(selector);
  }

  /**
   * Get attribute value with default
   * @param {string} name - Attribute name
   * @param {*} defaultValue - Default value if attribute doesn't exist
   * @returns {string|*}
   */
  getAttr(name, defaultValue = null) {
    return this.getAttribute(name) || defaultValue;
  }

  /**
   * Get boolean attribute
   * @param {string} name - Attribute name
   * @returns {boolean}
   */
  getBoolAttr(name) {
    return this.hasAttribute(name);
  }

  /**
   * Get numeric attribute
   * @param {string} name - Attribute name
   * @param {number} defaultValue - Default value
   * @returns {number}
   */
  getNumAttr(name, defaultValue = 0) {
    const value = this.getAttribute(name);
    const num = Number(value);
    return Number.isNaN(num) ? defaultValue : num;
  }

  /**
   * Get JSON attribute
   * @param {string} name - Attribute name
   * @param {*} defaultValue - Default value
   * @returns {*}
   */
  getJsonAttr(name, defaultValue = null) {
    const value = this.getAttribute(name);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn(`Failed to parse JSON attribute ${name}:`, error);
      return defaultValue;
    }
  }

  /**
   * Set multiple attributes
   * @param {Object} attrs - Object of attribute name: value pairs
   */
  setAttrs(attrs) {
    Object.entries(attrs).forEach(([name, value]) => {
      if (value === null || value === undefined) {
        this.removeAttribute(name);
      } else if (typeof value === 'boolean') {
        if (value) {
          this.setAttribute(name, '');
        } else {
          this.removeAttribute(name);
        }
      } else {
        this.setAttribute(name, String(value));
      }
    });
  }

  /**
   * Show component
   */
  show() {
    this.style.display = '';
    this.removeAttribute('hidden');
    this.setAttribute('aria-hidden', 'false');
  }

  /**
   * Hide component
   */
  hide() {
    this.setAttribute('hidden', '');
    this.setAttribute('aria-hidden', 'true');
  }

  /**
   * Toggle component visibility
   */
  toggle() {
    if (this.hasAttribute('hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Check if component is visible
   * @returns {boolean}
   */
  isVisible() {
    return !this.hasAttribute('hidden');
  }

  // ============================================
  // Lifecycle hooks (override in subclass)
  // ============================================

  /**
   * Called when component is connected to DOM
   * Override to add connection logic
   */
  onConnected() {
    // Override in subclass
  }

  /**
   * Called when component is disconnected from DOM
   * Override to add disconnection logic
   */
  onDisconnected() {
    // Override in subclass
  }

  /**
   * Called when attribute changes
   * Override to handle attribute changes
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old value
   * @param {string} newValue - New value
   */
  onAttributeChanged(_name, _oldValue, _newValue) {
    // Override in subclass
  }

  /**
   * Called when component is adopted to new document
   * Override to handle adoption
   */
  onAdopted() {
    // Override in subclass
  }
}

export default Component;
export { Component };
