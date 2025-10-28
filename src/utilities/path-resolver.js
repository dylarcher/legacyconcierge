/**
 * Path Resolver Utility
 * Handles absolute and relative path resolution for both local dev and deployed environments
 * Supports GitHub Pages and other static hosting platforms
 * @module utilities/path-resolver
 */

/**
 * PathResolver class for managing path resolution across environments
 */
class PathResolver {
  constructor() {
    this.basePath = '';
    this.environment = 'development';
    this.init();
  }

  /**
   * Initialize path resolver and detect environment
   */
  init() {
    this.detectEnvironment();
    this.detectBasePath();
    this.exposeGlobally();
  }

  /**
   * Detect current environment (development, production, GitHub Pages)
   */
  detectEnvironment() {
    const { hostname, pathname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.environment = 'development';
    } else if (hostname.includes('github.io')) {
      this.environment = 'github-pages';
    } else {
      this.environment = 'production';
    }
  }

  /**
   * Detect base path from URL
   * For GitHub Pages: /repository-name/
   * For root domain: /
   */
  detectBasePath() {
    const { pathname } = window.location;

    if (this.environment === 'github-pages') {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        this.basePath = `/${pathParts[0]}`;
      }
    } else {
      this.basePath = '';
    }
  }

  /**
   * Resolve a path relative to the base path
   * @param {string} path - Path to resolve
   * @returns {string} Resolved path
   */
  resolve(path) {
    if (!path) return this.basePath || '/';

    // Already an absolute URL
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path;
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Return with base path
    return this.basePath ? `${this.basePath}/${cleanPath}` : `/${cleanPath}`;
  }

  /**
   * Resolve a relative path from current page depth
   * @param {string} path - Path to resolve
   * @param {number} depth - Current page depth (0 = root, 1 = /page/, 2 = /section/page/)
   * @returns {string} Resolved path with correct ../ prefixes
   */
  resolveRelative(path, depth = 0) {
    if (!path) return './';

    // Already absolute
    if (path.startsWith('/') || path.startsWith('http')) {
      return this.resolve(path);
    }

    // Calculate relative prefix
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return `${prefix}${path}`;
  }

  /**
   * Get current page depth from pathname
   * @returns {number} Page depth
   */
  getCurrentDepth() {
    const { pathname } = window.location;
    const cleanPath = pathname.replace(this.basePath, '');
    const parts = cleanPath.split('/').filter(Boolean);

    // If path ends with .html, it's a file
    const isFile = cleanPath.endsWith('.html');

    // Depth is number of directories, not including the file itself
    return isFile ? Math.max(0, parts.length - 1) : parts.length;
  }

  /**
   * Resolve asset path (images, icons, fonts, etc.)
   * @param {string} assetPath - Path to asset
   * @returns {string} Resolved asset path
   */
  resolveAsset(assetPath) {
    if (!assetPath) return '';

    // Already absolute
    if (assetPath.startsWith('http') || assetPath.startsWith('//') || assetPath.startsWith('data:')) {
      return assetPath;
    }

    // Ensure assets directory prefix
    const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    const assetsPath = cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;

    return this.resolve(assetsPath);
  }

  /**
   * Resolve i18n translation file path
   * @param {string} locale - Locale code (en, es, etc.)
   * @param {string} file - Translation file name
   * @returns {string} Resolved i18n path
   */
  resolveI18n(locale, file) {
    return this.resolve(`i18n/${locale}/${file}.json`);
  }

  /**
   * Resolve template path
   * @param {string} templateName - Template file name
   * @returns {string} Resolved template path
   */
  resolveTemplate(templateName) {
    return this.resolve(`src/components/templates/${templateName}.html`);
  }

  /**
   * Expose resolver globally for easy access
   */
  exposeGlobally() {
    window.pathResolver = this;
    window.resolvePath = this.resolve.bind(this);
    window.resolveAsset = this.resolveAsset.bind(this);
  }

  /**
   * Get base path
   * @returns {string} Base path
   */
  getBasePath() {
    return this.basePath;
  }

  /**
   * Get environment
   * @returns {string} Environment name
   */
  getEnvironment() {
    return this.environment;
  }
}

// Initialize path resolver immediately
const pathResolver = new PathResolver();

export default pathResolver;
export { PathResolver };
