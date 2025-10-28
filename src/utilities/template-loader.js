/**
 * Template Loader Utility
 * Loads and caches HTML templates for web components
 * Supports lazy loading and preloading strategies
 * @module utilities/template-loader
 */

import pathResolver from './path-resolver.js';

/**
 * TemplateLoader class for managing HTML template loading
 */
class TemplateLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.templateRegistry = new Map();
  }

  /**
   * Register a template location
   * @param {string} name - Template name/key
   * @param {string} path - Path to template file
   */
  register(name, path) {
    this.templateRegistry.set(name, path);
  }

  /**
   * Register multiple templates at once
   * @param {Object<string, string>} templates - Object of name: path pairs
   */
  registerMultiple(templates) {
    Object.entries(templates).forEach(([name, path]) => {
      this.register(name, path);
    });
  }

  /**
   * Load a template from the server
   * @param {string} nameOrPath - Template name (if registered) or path
   * @returns {Promise<DocumentFragment>} Template as document fragment
   */
  async load(nameOrPath) {
    // Check if it's a registered template name
    const path = this.templateRegistry.get(nameOrPath) || nameOrPath;
    const resolvedPath = pathResolver.resolve(path);

    // Return from cache if available
    if (this.cache.has(resolvedPath)) {
      return this.cloneTemplate(this.cache.get(resolvedPath));
    }

    // Wait for existing load if in progress
    if (this.loading.has(resolvedPath)) {
      return this.loading.get(resolvedPath);
    }

    // Start loading
    const loadPromise = this.fetchTemplate(resolvedPath);
    this.loading.set(resolvedPath, loadPromise);

    try {
      const template = await loadPromise;
      this.cache.set(resolvedPath, template);
      this.loading.delete(resolvedPath);
      return this.cloneTemplate(template);
    } catch (error) {
      this.loading.delete(resolvedPath);
      throw error;
    }
  }

  /**
   * Fetch template HTML from server
   * @param {string} path - Resolved path to template
   * @returns {Promise<DocumentFragment>} Template content
   * @private
   */
  async fetchTemplate(path) {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load template: ${path} (${response.status})`);
      }

      const html = await response.text();
      return this.parseHTML(html);
    } catch (error) {
      console.error(`Template loading error for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Parse HTML string into a document fragment
   * @param {string} html - HTML string
   * @returns {DocumentFragment} Parsed document fragment
   * @private
   */
  parseHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
  }

  /**
   * Clone a template (returns a deep clone)
   * @param {DocumentFragment} template - Template to clone
   * @returns {DocumentFragment} Cloned template
   * @private
   */
  cloneTemplate(template) {
    return template.cloneNode(true);
  }

  /**
   * Preload templates for better performance
   * @param {string[]} templates - Array of template names or paths
   * @returns {Promise<void>}
   */
  async preload(templates) {
    const loadPromises = templates.map(template =>
      this.load(template).catch(error => {
        console.warn(`Failed to preload template: ${template}`, error);
      })
    );

    await Promise.all(loadPromises);
  }

  /**
   * Load template from a <template> element in the DOM
   * @param {string} selector - CSS selector for template element
   * @returns {DocumentFragment|null} Template content or null if not found
   */
  loadFromDOM(selector) {
    const templateElement = document.querySelector(selector);

    if (!templateElement || templateElement.tagName !== 'TEMPLATE') {
      console.warn(`Template element not found: ${selector}`);
      return null;
    }

    return this.cloneTemplate(templateElement.content);
  }

  /**
   * Load and insert template into target element
   * @param {string} nameOrPath - Template name or path
   * @param {HTMLElement} target - Target element to insert into
   * @param {boolean} replace - If true, replace target contents; if false, append
   * @returns {Promise<DocumentFragment>} Loaded template
   */
  async loadInto(nameOrPath, target, replace = false) {
    const template = await this.load(nameOrPath);

    if (replace) {
      target.innerHTML = '';
    }

    target.appendChild(template.cloneNode(true));
    return template;
  }

  /**
   * Clear template cache
   * @param {string} [nameOrPath] - Specific template to clear, or all if not provided
   */
  clearCache(nameOrPath) {
    if (nameOrPath) {
      const path = this.templateRegistry.get(nameOrPath) || nameOrPath;
      const resolvedPath = pathResolver.resolve(path);
      this.cache.delete(resolvedPath);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      registered: this.templateRegistry.size
    };
  }

  /**
   * Check if template is cached
   * @param {string} nameOrPath - Template name or path
   * @returns {boolean} True if cached
   */
  isCached(nameOrPath) {
    const path = this.templateRegistry.get(nameOrPath) || nameOrPath;
    const resolvedPath = pathResolver.resolve(path);
    return this.cache.has(resolvedPath);
  }
}

// Create singleton instance
const templateLoader = new TemplateLoader();

// Auto-register common templates
templateLoader.registerMultiple({
  'header': 'src/components/templates/header.html',
  'footer': 'src/components/templates/footer.html',
  'hero': 'src/components/templates/hero.html',
  'card': 'src/components/templates/card.html',
  'form': 'src/components/templates/form.html',
  'modal': 'src/components/templates/modal.html',
  'navigation': 'src/components/templates/navigation.html',
  'breadcrumb': 'src/components/templates/breadcrumb.html'
});

export default templateLoader;
export { TemplateLoader };
