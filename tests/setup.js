/**
 * Vitest Global Setup
 * Runs before each test file
 */

import { afterEach, vi } from 'vitest';

// Mock navigator.language
if (!navigator.language) {
  Object.defineProperty(navigator, 'language', {
    writable: true,
    configurable: true,
    value: 'en-US',
  });
}

if (!navigator.userLanguage) {
  Object.defineProperty(navigator, 'userLanguage', {
    writable: true,
    configurable: true,
    value: 'en-US',
  });
}

// Mock window.matchMedia (not available in happy-dom by default)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (used for lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
};

// Mock ResizeObserver (used by some components)
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
};

// Mock localStorage and sessionStorage - ensure they're always available
const createStorage = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

// Set up storage mocks
if (!window.localStorage || typeof window.localStorage.clear !== 'function') {
  Object.defineProperty(window, 'localStorage', {
    value: createStorage(),
    writable: true,
    configurable: true,
  });
}

if (!window.sessionStorage || typeof window.sessionStorage.clear !== 'function') {
  Object.defineProperty(window, 'sessionStorage', {
    value: createStorage(),
    writable: true,
    configurable: true,
  });
}

// Clean up DOM after each test
afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Clear storage safely
  try {
    if (window.localStorage && typeof window.localStorage.clear === 'function') {
      window.localStorage.clear();
    }
    if (window.sessionStorage && typeof window.sessionStorage.clear === 'function') {
      window.sessionStorage.clear();
    }
  } catch (_e) {
    // Ignore storage clear errors in tests
  }
});

// Global test helpers available in all tests
global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock console methods to reduce noise (optional)
// Uncomment to silence console during tests
// global.console = {
//   ...console,
//   log: vi.fn(),
//   debug: vi.fn(),
//   info: vi.fn(),
//   warn: vi.fn(),
//   error: vi.fn(),
// };
