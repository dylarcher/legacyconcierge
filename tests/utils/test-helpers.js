/**
 * Test Helpers
 * Common utilities for testing web components and modules
 */

import { vi } from 'vitest';

/**
 * Create and mount a test component
 * @param {string} tagName - Component tag name (e.g., 'lc-button')
 * @param {Object} attributes - Attributes to set on the component
 * @param {string} innerHTML - Inner HTML content
 * @returns {HTMLElement} The created component
 */
export function createTestComponent(tagName, attributes = {}, innerHTML = '') {
  const component = document.createElement(tagName);

  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) component.setAttribute(key, '');
    } else {
      component.setAttribute(key, String(value));
    }
  });

  // Set inner HTML
  if (innerHTML) {
    component.innerHTML = innerHTML;
  }

  // Append to document body
  document.body.appendChild(component);

  return component;
}

/**
 * Wait for component to be initialized and connected
 * @param {HTMLElement} component - The component element
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HTMLElement>}
 */
export async function waitForComponent(component, timeout = 1000) {
  const startTime = Date.now();

  while (!component._initialized && Date.now() - startTime < timeout) {
    await sleep(10);
  }

  if (!component._initialized) {
    throw new Error(`Component ${component.tagName} did not initialize within ${timeout}ms`);
  }

  return component;
}

/**
 * Clean up all components from the document
 */
export function cleanupComponents() {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
}

/**
 * Create a mock DOM element
 * @param {string} tagName - Tag name
 * @param {Object} attributes - Attributes
 * @param {string} innerHTML - Inner HTML
 * @returns {HTMLElement}
 */
export function createMockElement(tagName, attributes = {}, innerHTML = '') {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
}

/**
 * Mock the fetch API
 * @param {Object|Function} response - Response object or function returning response
 * @returns {vi.Mock} The mocked fetch function
 */
export function mockFetch(response) {
  const mockResponse = typeof response === 'function' ? response : () => response;

  return vi.fn((url) => {
    const responseData = mockResponse(url);

    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData)),
      ...responseData,
    });
  });
}

/**
 * Mock fetch for a specific URL pattern
 * @param {string|RegExp} pattern - URL pattern to match
 * @param {*} response - Response data
 * @returns {vi.Mock}
 */
export function mockFetchForUrl(pattern, response) {
  return mockFetch((url) => {
    const matches = typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url);

    if (matches) {
      return response;
    }

    throw new Error(`Unexpected fetch to: ${url}`);
  });
}

/**
 * Wait for an element to appear in the DOM
 * @param {string} selector - CSS selector
 * @param {HTMLElement} root - Root element to search in
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HTMLElement>}
 */
export async function waitForElement(selector, root = document.body, timeout = 1000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = root.querySelector(selector);
    if (element) return element;
    await sleep(10);
  }

  throw new Error(`Element "${selector}" did not appear within ${timeout}ms`);
}

/**
 * Wait for a condition to be true
 * @param {Function} condition - Condition function
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} message - Error message if timeout
 * @returns {Promise<void>}
 */
export async function waitFor(condition, timeout = 1000, message = 'Condition not met') {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) return;
    await sleep(10);
  }

  throw new Error(`${message} (timeout: ${timeout}ms)`);
}

/**
 * Simulate a user click event
 * @param {HTMLElement} element - Element to click
 * @param {Object} options - Event options
 */
export function clickElement(element, options = {}) {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
    ...options,
  });

  element.dispatchEvent(event);
}

/**
 * Simulate keyboard event
 * @param {HTMLElement} element - Element to trigger event on
 * @param {string} key - Key name (e.g., 'Enter', 'Escape')
 * @param {Object} options - Event options
 */
export function pressKey(element, key, options = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });

  element.dispatchEvent(event);
}

/**
 * Simulate input event
 * @param {HTMLInputElement} input - Input element
 * @param {string} value - Value to set
 */
export function typeIntoInput(input, value) {
  input.value = value;

  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      cancelable: true,
    })
  );

  input.dispatchEvent(
    new Event('change', {
      bubbles: true,
      cancelable: true,
    })
  );
}

/**
 * Get computed styles of an element
 * @param {HTMLElement} element - Element
 * @returns {CSSStyleDeclaration}
 */
export function getStyles(element) {
  return window.getComputedStyle(element);
}

/**
 * Check if element has class
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element
 * @returns {boolean}
 */
export function isVisible(element) {
  return !element.hasAttribute('hidden') && element.style.display !== 'none';
}

/**
 * Create a spy on a method
 * @param {Object} object - Object containing the method
 * @param {string} methodName - Method name
 * @returns {vi.Mock}
 */
export function spyOn(object, methodName) {
  const original = object[methodName];
  const spy = vi.fn((...args) => original.apply(object, args));
  object[methodName] = spy;
  return spy;
}

/**
 * Create a mock template element
 * @param {string} html - Template HTML
 * @returns {HTMLTemplateElement}
 */
export function createTemplate(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fire a custom event on an element
 * @param {HTMLElement} element - Element to fire event on
 * @param {string} eventName - Event name
 * @param {*} detail - Event detail
 * @param {Object} options - Event options
 */
export function fireCustomEvent(element, eventName, detail = null, options = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true,
    ...options,
  });

  element.dispatchEvent(event);
}

/**
 * Wait for a custom event
 * @param {HTMLElement} element - Element to listen on
 * @param {string} eventName - Event name
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<CustomEvent>}
 */
export function waitForEvent(element, eventName, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      element.removeEventListener(eventName, handler);
      reject(new Error(`Event "${eventName}" did not fire within ${timeout}ms`));
    }, timeout);

    const handler = (event) => {
      clearTimeout(timer);
      element.removeEventListener(eventName, handler);
      resolve(event);
    };

    element.addEventListener(eventName, handler);
  });
}

/**
 * Create a mock i18n translations object
 * @param {Object} translations - Translation key-value pairs
 * @returns {Object}
 */
export function createMockI18n(translations = {}) {
  return {
    t: vi.fn((key, _page = 'common', replacements = {}) => {
      let value = translations[key] || key;

      if (typeof value === 'string' && Object.keys(replacements).length > 0) {
        value = value.replace(/\{\{(\w+)\}\}/g, (match, replKey) => {
          return replacements[replKey] !== undefined ? replacements[replKey] : match;
        });
      }

      return value;
    }),
    apply: vi.fn(),
    setLocale: vi.fn(),
    getLocale: vi.fn(() => 'en'),
    getSupportedLocales: vi.fn(() => ['en', 'es']),
    loadTranslations: vi.fn(() => Promise.resolve(translations)),
  };
}

/**
 * Assert element has attribute with value
 * @param {HTMLElement} element - Element
 * @param {string} attribute - Attribute name
 * @param {string} expectedValue - Expected value (optional)
 */
export function assertAttribute(element, attribute, expectedValue = undefined) {
  const hasAttr = element.hasAttribute(attribute);
  if (!hasAttr) {
    throw new Error(`Expected element to have attribute "${attribute}"`);
  }

  if (expectedValue !== undefined) {
    const actualValue = element.getAttribute(attribute);
    if (actualValue !== expectedValue) {
      throw new Error(
        `Expected attribute "${attribute}" to be "${expectedValue}", but got "${actualValue}"`
      );
    }
  }
}

/**
 * Assert element has ARIA attribute
 * @param {HTMLElement} element - Element
 * @param {string} ariaAttribute - ARIA attribute (without aria- prefix)
 * @param {string} expectedValue - Expected value (optional)
 */
export function assertAria(element, ariaAttribute, expectedValue = undefined) {
  assertAttribute(element, `aria-${ariaAttribute}`, expectedValue);
}
