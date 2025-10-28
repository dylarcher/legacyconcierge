/**
 * Mock Implementations
 * Mock modules and utilities for testing
 */

import { vi } from 'vitest';

/**
 * Mock i18n module
 */
export const mockI18n = {
  currentLocale: 'en',
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  translations: {
    'en:common': {
      'button.submit': 'Submit',
      'button.cancel': 'Cancel',
      'button.save': 'Save',
      'form.required': 'This field is required',
      'form.invalid': 'Invalid input',
    },
  },

  init: vi.fn(() => Promise.resolve()),
  detectLocale: vi.fn(),
  loadCommonTranslations: vi.fn(() => Promise.resolve()),
  loadTranslations: vi.fn((_page) => Promise.resolve({})),
  t: vi.fn((key, page = 'common', _replacements = {}) => {
    const cacheKey = `${mockI18n.currentLocale}:${page}`;
    const translations = mockI18n.translations[cacheKey] || {};
    return translations[key] || key;
  }),
  apply: vi.fn(() => Promise.resolve()),
  setLocale: vi.fn((locale) => {
    mockI18n.currentLocale = locale;
    return Promise.resolve();
  }),
  getLocale: vi.fn(() => mockI18n.currentLocale),
  getSupportedLocales: vi.fn(() => mockI18n.supportedLocales),
  detectCurrentPage: vi.fn(() => 'home'),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  exposeGlobally: vi.fn(),
};

/**
 * Mock template loader
 */
export const mockTemplateLoader = {
  cache: new Map(),

  load: vi.fn((templateName) => {
    // Return a mock template element
    const template = document.createElement('template');
    template.innerHTML = `<div class="mock-template" data-template="${templateName}">Mock Template Content</div>`;
    return Promise.resolve(template.content);
  }),

  get: vi.fn((templateName) => {
    const cached = mockTemplateLoader.cache.get(templateName);
    if (cached) return cached;

    const template = document.createElement('template');
    template.innerHTML = `<div class="mock-template" data-template="${templateName}">Mock Template Content</div>`;
    return template.content;
  }),

  clear: vi.fn(() => {
    mockTemplateLoader.cache.clear();
  }),
};

/**
 * Mock path resolver
 */
export const mockPathResolver = {
  basePath: '/',

  resolve: vi.fn((path) => {
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
      return path;
    }
    return `${mockPathResolver.basePath}${path}`;
  }),

  resolveI18n: vi.fn((locale, page) => {
    return `/src/i18n/${locale}/${page}.json`;
  }),

  resolveTemplate: vi.fn((componentName) => {
    return `/src/components/templates/${componentName}.html`;
  }),

  resolveAsset: vi.fn((assetPath) => {
    return `/src/assets/${assetPath}`;
  }),

  resolveComponent: vi.fn((componentName) => {
    return `/src/components/${componentName}.js`;
  }),
};

/**
 * Mock theme manager
 */
export const mockThemeManager = {
  currentTheme: 'light',
  themes: ['light', 'dark'],

  init: vi.fn(() => Promise.resolve()),
  getTheme: vi.fn(() => mockThemeManager.currentTheme),
  setTheme: vi.fn((theme) => {
    mockThemeManager.currentTheme = theme;
    return Promise.resolve();
  }),
  toggleTheme: vi.fn(() => {
    mockThemeManager.currentTheme = mockThemeManager.currentTheme === 'light' ? 'dark' : 'light';
    return Promise.resolve();
  }),
  applyTheme: vi.fn(() => Promise.resolve()),
};

/**
 * Mock performance utility
 */
export const mockPerformance = {
  mark: vi.fn((name) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  }),

  measure: vi.fn((name, startMark, endMark) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (_e) {
        // Ignore errors in mock
      }
    }
  }),

  getMetrics: vi.fn(() => ({
    lcp: 1234,
    fcp: 567,
    cls: 0.05,
    fid: 89,
    ttfb: 123,
  })),

  reportMetrics: vi.fn(() => Promise.resolve()),
};

/**
 * Mock accessibility utility
 */
export const mockAccessibility = {
  setFocusTrap: vi.fn((_element) => {
    // Mock focus trap setup
    return () => {
      // Mock cleanup
    };
  }),

  restoreFocus: vi.fn((previousElement) => {
    if (previousElement?.focus) {
      previousElement.focus();
    }
  }),

  announceToScreenReader: vi.fn((_message, _priority = 'polite') => {
    // Mock screen reader announcement
  }),

  ensureVisible: vi.fn((element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }),

  getFirstFocusable: vi.fn((container) => {
    return container.querySelector(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }),

  getAllFocusable: vi.fn((container) => {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }),
};

/**
 * Create a mock fetch response
 * @param {*} data - Response data
 * @param {Object} options - Response options
 * @returns {Promise<Response>}
 */
export function createMockFetchResponse(data, options = {}) {
  const { status = 200, statusText = 'OK', headers = {} } = options;

  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: new Headers(headers),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
    blob: () => Promise.resolve(new Blob([JSON.stringify(data)])),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    clone: function () {
      return this;
    },
  });
}

/**
 * Setup global fetch mock
 * @param {Function} implementation - Mock implementation
 */
export function setupFetchMock(implementation) {
  global.fetch = vi.fn(implementation);
  return global.fetch;
}

/**
 * Mock Component for testing
 */
export class MockComponent extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
    this._connected = false;
    this._shadowRoot = null;
    this._template = null;
    this._listeners = new Map();
    this.useShadowDOM = false;
    this.templateName = null;
  }

  connectedCallback() {
    if (!this._initialized) {
      this.init();
      this._initialized = true;
    }
    this._connected = true;
    this.onConnected();
  }

  disconnectedCallback() {
    this._connected = false;
    this.cleanup();
    this.onDisconnected();
  }

  init() {
    // Mock init
  }

  render() {
    // Mock render
    return Promise.resolve();
  }

  cleanup() {
    this._listeners.clear();
  }

  on(_target, _event, _handler) {
    // Mock event listener registration
  }

  emit(name, detail = null) {
    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  $(selector) {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    return root ? root.querySelector(selector) : null;
  }

  $$(selector) {
    const root = this.useShadowDOM ? this._shadowRoot : this;
    return root ? root.querySelectorAll(selector) : [];
  }

  getAttr(name, defaultValue = null) {
    return this.getAttribute(name) || defaultValue;
  }

  getBoolAttr(name) {
    return this.hasAttribute(name);
  }

  getNumAttr(name, defaultValue = 0) {
    const value = this.getAttribute(name);
    const num = Number(value);
    return Number.isNaN(num) ? defaultValue : num;
  }

  onConnected() {}
  onDisconnected() {}
  onAttributeChanged() {}
  onAdopted() {}
}

/**
 * Reset all mocks
 */
export function resetAllMocks() {
  vi.clearAllMocks();
  mockI18n.currentLocale = 'en';
  mockTemplateLoader.cache.clear();
  mockThemeManager.currentTheme = 'light';
}

/**
 * Mock console methods (to reduce noise in tests)
 */
export function mockConsole() {
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

/**
 * Restore console methods
 */
export function restoreConsole() {
  global.console = console;
}

export default {
  mockI18n,
  mockTemplateLoader,
  mockPathResolver,
  mockThemeManager,
  mockPerformance,
  mockAccessibility,
  createMockFetchResponse,
  setupFetchMock,
  MockComponent,
  resetAllMocks,
  mockConsole,
  restoreConsole,
};
