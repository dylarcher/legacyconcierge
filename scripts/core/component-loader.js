/**
 * Legacy Concierge Component Loader
 * Handles loading and initialization of Web Components and templates
 */

/**
 * Calculate the base path relative to the root based on current page location
 * @returns {string} Base path (e.g., '', '../../', '../../../../')
 */
function getBasePath() {
  const path = window.location.pathname;
  // Remove trailing index.html or trailing slash
  const cleanPath = path.replace(/\/index\.html$/, "").replace(/\/$/, "");
  // Count directory depth (excluding empty segments)
  const segments = cleanPath.split("/").filter((s) => s.length > 0);

  // If we're at root or index.html, no base path needed
  if (segments.length === 0 || segments.length === 1) {
    return "";
  }

  // Calculate relative path back to root
  // Subtract 1 because we don't need to go up from the filename itself
  const depth = segments.length - 1;
  return "../".repeat(depth);
}

/**
 * Template cache to avoid re-fetching
 * @type {Map<string, string>}
 */
const templateCache = new Map();

/**
 * Validates that a component name is safe to use in paths.
 * Only allows letters, numbers, underscores, and dashes.
 * @param {string} name - Component name to validate
 * @returns {boolean}
 */
function isValidComponentName(name) {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

/**
 * Load a template from the templates directory
 * @param {string} name - Template name (without .html extension)
 * @returns {Promise<boolean>} True if template loaded successfully
 */
async function loadTemplate(name) {
  // Check cache first
  if (templateCache.has(name)) {
    return true;
  }

  try {
    const basePath = getBasePath();
    const response = await fetch(`${basePath}components/templates/${name}.html`);
    if (!response.ok) {
      throw new Error(`Template ${name} not found: ${response.status}`);
    }

    const html = await response.text();
    templateCache.set(name, html);

    // Insert template into document if not already present
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    console.log(`✓ Template loaded: ${name}`);
    return true;
  } catch (error) {
    console.error(`Failed to load template ${name}:`, error);
    return false;
  }
}

/**
 * Load multiple templates
 * @param {string[]} names - Array of template names
 * @returns {Promise<boolean[]>} Array of load results
 */
async function loadTemplates(names) {
  return Promise.all(names.map((name) => loadTemplate(name)));
}

/**
 * Get a template element by ID
 * @param {string} templateId - Template ID
 * @returns {HTMLTemplateElement|null} Template element or null
 */
function getTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (!template || !(template instanceof HTMLTemplateElement)) {
    console.warn(`Template not found: ${templateId}`);
    return null;
  }
  return template;
}

/**
 * Clone a template's content
 * @param {string} templateId - Template ID
 * @returns {DocumentFragment|null} Cloned template content
 */
function cloneTemplate(templateId) {
  const template = getTemplate(templateId);
  if (!template) return null;
  return template.content.cloneNode(true);
}

/**
 * Initialize a component by loading its template and script
 * @param {string} componentName - Component name (e.g., 'header', 'footer')
 * @returns {Promise<void>}
 */
async function initializeComponent(componentName) {
  // Validate component name before using
  if (!isValidComponentName(componentName)) {
    // Sanitize: remove control characters and limit length
    const safeName = String(componentName)
      .replace(/[\x00-\x1F\x7F]/g, "?")
      .slice(0, 50);
    console.warn(`Invalid component name: ${safeName}`);
    return;
  }
  // Load template first
  await loadTemplate(componentName);

  // Check if script exists and load it
  try {
    const basePath = getBasePath();
    const scriptPath = `${basePath}components/scripts/lc-${componentName}.js`;
    const script = document.createElement("script");
    script.type = "module";
    script.src = scriptPath;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        console.log(`✓ Component initialized: ${componentName}`);
        resolve();
      };
      script.onerror = () => {
        console.warn(`Component script not found: ${componentName}`);
        resolve(); // Don't fail if script doesn't exist
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error(`Failed to initialize component ${componentName}:`, error);
  }
}

/**
 * Initialize multiple components
 * @param {string[]} componentNames - Array of component names
 * @returns {Promise<void[]>}
 */
async function initializeComponents(componentNames) {
  return Promise.all(componentNames.map((name) => initializeComponent(name)));
}

/**
 * Auto-initialize components based on data attributes
 * Looks for elements with data-component attribute
 */
function autoInitializeComponents() {
  const components = document.querySelectorAll("[data-component]");
  const componentNames = new Set();

  for (const element of components) {
    const componentName = element.getAttribute("data-component");
    if (componentName) {
      componentNames.add(componentName);
    }
  }

  if (componentNames.size > 0) {
    initializeComponents(Array.from(componentNames));
  }
}

/**
 * Wait for DOM to be ready
 * @param {Function} callback - Callback to execute when DOM is ready
 */
function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

// Export functions for use in modules
export {
  loadTemplate,
  loadTemplates,
  getTemplate,
  cloneTemplate,
  initializeComponent,
  initializeComponents,
  autoInitializeComponents,
  onReady,
};

// Also expose globally for non-module usage
if (typeof window !== "undefined") {
  window.ComponentLoader = {
    loadTemplate,
    loadTemplates,
    getTemplate,
    cloneTemplate,
    initializeComponent,
    initializeComponents,
    autoInitializeComponents,
    onReady,
  };
}
