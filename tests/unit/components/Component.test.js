/**
 * Base Component Tests
 * Tests for the foundation Component class
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep, } from '../../utils/test-helpers.js';

// Mock dependencies
vi.mock('../../../src/utils/i18n.js', () => ({
  default: {
    detectCurrentPage: vi.fn(() => 'home'),
    apply: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('../../../src/utils/template-loader.js', () => ({
  default: {
    load: vi.fn((templateName) => {
      const template = document.createElement('template');
      template.innerHTML = `<div class="template-content" data-template="${templateName}">Template Content</div>`;
      return Promise.resolve(template.content);
    }),
  },
}));

describe('Component (Base Class)', () => {
  let Component;
  let TestComponent;
  let i18n;
  let templateLoader;
  let componentCounter = 0;

  beforeEach(async () => {
    // Import modules
    const i18nModule = await import('../../../src/utils/i18n.js');
    const templateLoaderModule = await import('../../../src/utils/template-loader.js');
    const componentModule = await import('../../../src/components/base/Component.js');

    Component = componentModule.default;
    i18n = i18nModule.default;
    templateLoader = templateLoaderModule.default;

    // Create a test component class with unique name
    TestComponent = class extends Component {
      static get observedAttributes() {
        return ['test-attr', 'disabled'];
      }
    };

    // Use counter for unique element names
    componentCounter++;
    const uniqueName = `test-component-${componentCounter}-${Date.now()}`;
    customElements.define(uniqueName, TestComponent);

    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with default state', () => {
      const component = new TestComponent();

      expect(component._initialized).toBe(false);
      expect(component._connected).toBe(false);
      expect(component._shadowRoot).toBeNull();
      expect(component._template).toBeNull();
      expect(component._listeners).toBeInstanceOf(Map);
      expect(component._listeners.size).toBe(0);
    });

    it('should have default options', () => {
      const component = new TestComponent();

      expect(component.useShadowDOM).toBe(false);
      expect(component.templateName).toBeNull();
    });

    it('should extend HTMLElement', () => {
      const component = new TestComponent();

      expect(component).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Lifecycle: connectedCallback', () => {
    it('should call init on first connection', () => {
      const component = new TestComponent();
      const initSpy = vi.spyOn(component, 'init');

      document.body.appendChild(component);

      expect(initSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call init on subsequent connections', () => {
      const component = new TestComponent();
      const initSpy = vi.spyOn(component, 'init');

      document.body.appendChild(component);
      document.body.removeChild(component);
      document.body.appendChild(component);

      expect(initSpy).toHaveBeenCalledTimes(1);
    });

    it('should set _connected to true', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      expect(component._connected).toBe(true);
    });

    it('should set _initialized to true after first connection', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      expect(component._initialized).toBe(true);
    });

    it('should call onConnected hook', () => {
      const component = new TestComponent();
      const onConnectedSpy = vi.spyOn(component, 'onConnected');

      document.body.appendChild(component);

      expect(onConnectedSpy).toHaveBeenCalled();
    });
  });

  describe('Lifecycle: disconnectedCallback', () => {
    it('should set _connected to false', () => {
      const component = new TestComponent();
      document.body.appendChild(component);
      document.body.removeChild(component);

      expect(component._connected).toBe(false);
    });

    it('should call cleanup', () => {
      const component = new TestComponent();
      const cleanupSpy = vi.spyOn(component, 'cleanup');

      document.body.appendChild(component);
      document.body.removeChild(component);

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should call onDisconnected hook', () => {
      const component = new TestComponent();
      const onDisconnectedSpy = vi.spyOn(component, 'onDisconnected');

      document.body.appendChild(component);
      document.body.removeChild(component);

      expect(onDisconnectedSpy).toHaveBeenCalled();
    });
  });

  describe('Lifecycle: attributeChangedCallback', () => {
    it('should call onAttributeChanged when attribute changes', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const onAttributeChangedSpy = vi.spyOn(component, 'onAttributeChanged');

      component.setAttribute('test-attr', 'new-value');

      expect(onAttributeChangedSpy).toHaveBeenCalledWith('test-attr', null, 'new-value');
    });

    it('should not call onAttributeChanged when value is the same', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      component.setAttribute('test-attr', 'value');
      const onAttributeChangedSpy = vi.spyOn(component, 'onAttributeChanged');

      component.setAttribute('test-attr', 'value');

      expect(onAttributeChangedSpy).not.toHaveBeenCalled();
    });

    it('should call onAttributeChanged with old and new values', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      component.setAttribute('test-attr', 'old-value');
      const onAttributeChangedSpy = vi.spyOn(component, 'onAttributeChanged');

      component.setAttribute('test-attr', 'new-value');

      expect(onAttributeChangedSpy).toHaveBeenCalledWith('test-attr', 'old-value', 'new-value');
    });
  });

  describe('Lifecycle: adoptedCallback', () => {
    it('should call onAdopted hook', () => {
      const component = new TestComponent();
      const onAdoptedSpy = vi.spyOn(component, 'onAdopted');

      // Simulate adoption
      component.adoptedCallback();

      expect(onAdoptedSpy).toHaveBeenCalled();
    });
  });

  describe('Template Loading', () => {
    it('should load template when templateName is set', async () => {
      const component = new TestComponent();
      component.templateName = '/templates/test.html';

      await component.loadTemplate();

      expect(templateLoader.load).toHaveBeenCalledWith('/templates/test.html');
      expect(component._template).toBeTruthy();
    });

    it('should not load template when templateName is null', async () => {
      const component = new TestComponent();
      component.templateName = null;

      await component.init();

      expect(templateLoader.load).not.toHaveBeenCalled();
    });

    it('should handle template loading errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      templateLoader.load.mockRejectedValueOnce(new Error('Template not found'));

      const component = new TestComponent();
      component.templateName = '/templates/missing.html';

      await component.loadTemplate();

      expect(consoleError).toHaveBeenCalled();
      expect(component._template).toBeNull();

      consoleError.mockRestore();
    });
  });

  describe('Shadow DOM', () => {
    it('should create shadow root when useShadowDOM is true', async () => {
      const component = new TestComponent();
      component.useShadowDOM = true;

      document.body.appendChild(component);
      await sleep(10);

      expect(component._shadowRoot).toBeTruthy();
      expect(component.shadowRoot).toBeTruthy();
    });

    it('should not create shadow root when useShadowDOM is false', async () => {
      const component = new TestComponent();
      component.useShadowDOM = false;

      document.body.appendChild(component);
      await sleep(10);

      expect(component._shadowRoot).toBeNull();
      expect(component.shadowRoot).toBeNull();
    });

    it('should only create shadow root once', async () => {
      const component = new TestComponent();
      component.useShadowDOM = true;

      document.body.appendChild(component);
      await sleep(10);

      const firstShadowRoot = component._shadowRoot;

      await component.init();

      expect(component._shadowRoot).toBe(firstShadowRoot);
    });
  });

  describe('Rendering', () => {
    it('should render template to component', async () => {
      const component = new TestComponent();
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      expect(component.querySelector('.template-content')).toBeTruthy();
    });

    it('should render template to shadow root when using shadow DOM', async () => {
      const component = new TestComponent();
      component.useShadowDOM = true;
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      expect(component.shadowRoot.querySelector('.template-content')).toBeTruthy();
      expect(component.querySelector('.template-content')).toBeNull();
    });

    it('should apply i18n translations after render', async () => {
      const component = new TestComponent();

      document.body.appendChild(component);
      await sleep(10);

      expect(i18n.apply).toHaveBeenCalled();
    });

    it('should call setupEventListeners after render', async () => {
      const component = new TestComponent();
      const setupSpy = vi.spyOn(component, 'setupEventListeners');

      document.body.appendChild(component);
      await sleep(10);

      expect(setupSpy).toHaveBeenCalled();
    });
  });

  describe('Re-rendering', () => {
    it('should clear component content before re-rendering', async () => {
      const component = new TestComponent();
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      expect(component.innerHTML).not.toBe('');

      await component.rerender();

      // After rerender, should have new content
      expect(component.querySelector('.template-content')).toBeTruthy();
    });

    it('should reload template on rerender', async () => {
      const component = new TestComponent();
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      vi.clearAllMocks();

      await component.rerender();

      expect(templateLoader.load).toHaveBeenCalledWith('/templates/test.html');
    });

    it('should call setupEventListeners after rerender', async () => {
      const component = new TestComponent();
      document.body.appendChild(component);
      await sleep(10);

      const setupSpy = vi.spyOn(component, 'setupEventListeners');

      await component.rerender();

      expect(setupSpy).toHaveBeenCalled();
    });
  });

  describe('Event Handling: on()', () => {
    it('should add event listener to element', () => {
      const component = new TestComponent();
      component.innerHTML = '<button class="test-button">Click</button>';
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('.test-button', 'click', handler);

      const button = component.querySelector('.test-button');
      button.click();

      expect(handler).toHaveBeenCalled();
    });

    it('should add event listener to component itself with "this"', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('this', 'click', handler);

      component.click();

      expect(handler).toHaveBeenCalled();
    });

    it('should add event listener to element reference', () => {
      const component = new TestComponent();
      const button = document.createElement('button');
      button.className = 'ref-button';
      component.appendChild(button);
      document.body.appendChild(component);

      const handler = vi.fn();
      // Note: Component.cleanup() doesn't handle element references properly during cleanup
      // It expects selector strings. This test verifies the listener works,
      // but cleanup will fail if the component is disconnected
      component.on(button, 'click', handler);

      button.click();

      expect(handler).toHaveBeenCalled();

      // Manually clean up to avoid cleanup error
      button.removeEventListener('click', handler);
      component._listeners.clear();
    });

    it('should store listener for cleanup', () => {
      const component = new TestComponent();
      component.innerHTML = '<button class="test-button">Click</button>';
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('.test-button', 'click', handler);

      expect(component._listeners.size).toBe(1);
    });

    it('should warn when target element not found', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const handler = vi.fn();

      component.on('.non-existent', 'click', handler);

      expect(consoleWarn).toHaveBeenCalled();
      consoleWarn.mockRestore();
    });

    it('should work with shadow DOM', async () => {
      const component = new TestComponent();
      component.useShadowDOM = true;
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      const handler = vi.fn();
      component.on('.template-content', 'click', handler);

      const element = component.shadowRoot.querySelector('.template-content');
      element.click();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Event Handling: emit()', () => {
    it('should emit custom event', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      component.addEventListener('test-event', listener);

      component.emit('test-event', { data: 'test' });

      expect(listener).toHaveBeenCalled();
      expect(listener.mock.calls[0][0].detail).toEqual({ data: 'test' });
    });

    it('should emit event with null detail by default', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      component.addEventListener('test-event', listener);

      component.emit('test-event');

      expect(listener.mock.calls[0][0].detail).toBeNull();
    });

    it('should emit bubbling events by default', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      document.body.addEventListener('test-event', listener);

      component.emit('test-event');

      expect(listener).toHaveBeenCalled();
    });

    it('should emit composed events by default', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      component.addEventListener('test-event', listener);

      component.emit('test-event');

      expect(listener.mock.calls[0][0].composed).toBe(true);
    });

    it('should allow disabling bubbles', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      component.addEventListener('test-event', listener);

      component.emit('test-event', null, { bubbles: false });

      expect(listener.mock.calls[0][0].bubbles).toBe(false);
    });

    it('should allow setting cancelable', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const listener = vi.fn();
      component.addEventListener('test-event', listener);

      component.emit('test-event', null, { cancelable: true });

      expect(listener.mock.calls[0][0].cancelable).toBe(true);
    });
  });

  describe('Query Helpers: $ and $$', () => {
    it('should query element with $()', () => {
      const component = new TestComponent();
      component.innerHTML = '<div class="test">Test</div>';
      document.body.appendChild(component);

      const element = component.$('.test');

      expect(element).toBeTruthy();
      expect(element.textContent).toBe('Test');
    });

    it('should query all elements with $$()', () => {
      const component = new TestComponent();
      component.innerHTML = '<div class="test">1</div><div class="test">2</div>';
      document.body.appendChild(component);

      const elements = component.$$('.test');

      expect(elements.length).toBe(2);
    });

    it('should query within shadow DOM when useShadowDOM is true', async () => {
      const component = new TestComponent();
      component.useShadowDOM = true;
      component.templateName = '/templates/test.html';

      document.body.appendChild(component);
      await sleep(10);

      const element = component.$('.template-content');

      expect(element).toBeTruthy();
    });

    it('should return null when element not found with $()', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const element = component.$('.non-existent');

      expect(element).toBeNull();
    });

    it('should return empty NodeList when elements not found with $$()', () => {
      const component = new TestComponent();
      document.body.appendChild(component);

      const elements = component.$$('.non-existent');

      expect(elements.length).toBe(0);
    });
  });

  describe('Attribute Helpers: getAttr, getBoolAttr, getNumAttr, getJsonAttr', () => {
    it('should get attribute value with getAttr()', () => {
      const component = new TestComponent();
      component.setAttribute('test-attr', 'value');

      expect(component.getAttr('test-attr')).toBe('value');
    });

    it('should return default value when attribute missing with getAttr()', () => {
      const component = new TestComponent();

      expect(component.getAttr('missing', 'default')).toBe('default');
    });

    it('should return null as default when no default provided with getAttr()', () => {
      const component = new TestComponent();

      expect(component.getAttr('missing')).toBeNull();
    });

    it('should get boolean attribute with getBoolAttr()', () => {
      const component = new TestComponent();
      component.setAttribute('disabled', '');

      expect(component.getBoolAttr('disabled')).toBe(true);
    });

    it('should return false for missing boolean attribute', () => {
      const component = new TestComponent();

      expect(component.getBoolAttr('disabled')).toBe(false);
    });

    it('should get numeric attribute with getNumAttr()', () => {
      const component = new TestComponent();
      component.setAttribute('count', '42');

      expect(component.getNumAttr('count')).toBe(42);
    });

    it('should return default value for invalid numeric attribute', () => {
      const component = new TestComponent();
      component.setAttribute('count', 'invalid');

      expect(component.getNumAttr('count', 10)).toBe(10);
    });

    it('should return 0 as default for missing numeric attribute', () => {
      const component = new TestComponent();

      expect(component.getNumAttr('missing')).toBe(0);
    });

    it('should get JSON attribute with getJsonAttr()', () => {
      const component = new TestComponent();
      component.setAttribute('data', '{"key": "value"}');

      expect(component.getJsonAttr('data')).toEqual({ key: 'value' });
    });

    it('should return default value for invalid JSON attribute', () => {
      const component = new TestComponent();
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      component.setAttribute('data', 'invalid json');

      expect(component.getJsonAttr('data', { default: true })).toEqual({ default: true });
      expect(consoleWarn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });

    it('should return default value for missing JSON attribute', () => {
      const component = new TestComponent();

      expect(component.getJsonAttr('missing', { default: true })).toEqual({ default: true });
    });
  });

  describe('Attribute Helper: setAttrs()', () => {
    it('should set multiple attributes', () => {
      const component = new TestComponent();

      component.setAttrs({
        'attr1': 'value1',
        'attr2': 'value2',
      });

      expect(component.getAttribute('attr1')).toBe('value1');
      expect(component.getAttribute('attr2')).toBe('value2');
    });

    it('should remove attribute when value is null', () => {
      const component = new TestComponent();
      component.setAttribute('test', 'value');

      component.setAttrs({ 'test': null });

      expect(component.hasAttribute('test')).toBe(false);
    });

    it('should remove attribute when value is undefined', () => {
      const component = new TestComponent();
      component.setAttribute('test', 'value');

      component.setAttrs({ 'test': undefined });

      expect(component.hasAttribute('test')).toBe(false);
    });

    it('should set boolean attribute to empty string when true', () => {
      const component = new TestComponent();

      component.setAttrs({ 'disabled': true });

      expect(component.getAttribute('disabled')).toBe('');
      expect(component.hasAttribute('disabled')).toBe(true);
    });

    it('should remove boolean attribute when false', () => {
      const component = new TestComponent();
      component.setAttribute('disabled', '');

      component.setAttrs({ 'disabled': false });

      expect(component.hasAttribute('disabled')).toBe(false);
    });

    it('should convert non-string values to strings', () => {
      const component = new TestComponent();

      component.setAttrs({ 'count': 42 });

      expect(component.getAttribute('count')).toBe('42');
    });
  });

  describe('Visibility: show, hide, toggle, isVisible', () => {
    it('should show component', () => {
      const component = new TestComponent();
      component.setAttribute('hidden', '');

      component.show();

      expect(component.hasAttribute('hidden')).toBe(false);
      expect(component.getAttribute('aria-hidden')).toBe('false');
    });

    it('should hide component', () => {
      const component = new TestComponent();

      component.hide();

      expect(component.hasAttribute('hidden')).toBe(true);
      expect(component.getAttribute('aria-hidden')).toBe('true');
    });

    it('should toggle from visible to hidden', () => {
      const component = new TestComponent();

      component.toggle();

      expect(component.hasAttribute('hidden')).toBe(true);
    });

    it('should toggle from hidden to visible', () => {
      const component = new TestComponent();
      component.setAttribute('hidden', '');

      component.toggle();

      expect(component.hasAttribute('hidden')).toBe(false);
    });

    it('should return true when visible', () => {
      const component = new TestComponent();

      expect(component.isVisible()).toBe(true);
    });

    it('should return false when hidden', () => {
      const component = new TestComponent();
      component.setAttribute('hidden', '');

      expect(component.isVisible()).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should remove all event listeners on cleanup', () => {
      const component = new TestComponent();
      component.innerHTML = '<button class="test">Click</button>';
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('.test', 'click', handler);

      component.cleanup();

      const button = component.querySelector('.test');
      button.click();

      // Handler should not be called after cleanup
      expect(handler).not.toHaveBeenCalled();
    });

    it('should clear listeners map on cleanup', () => {
      const component = new TestComponent();
      component.innerHTML = '<button class="test">Click</button>';
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('.test', 'click', handler);

      expect(component._listeners.size).toBe(1);

      component.cleanup();

      expect(component._listeners.size).toBe(0);
    });

    it('should handle cleanup when element no longer exists', () => {
      const component = new TestComponent();
      component.innerHTML = '<button class="test">Click</button>';
      document.body.appendChild(component);

      const handler = vi.fn();
      component.on('.test', 'click', handler);

      component.innerHTML = ''; // Remove element

      expect(() => component.cleanup()).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full lifecycle', async () => {
      const component = new TestComponent();
      component.templateName = '/templates/test.html';

      // Connect
      document.body.appendChild(component);
      await sleep(10);

      expect(component._initialized).toBe(true);
      expect(component._connected).toBe(true);
      expect(component.querySelector('.template-content')).toBeTruthy();

      // Disconnect
      document.body.removeChild(component);

      expect(component._connected).toBe(false);
    });

    it('should handle attribute changes after initialization', async () => {
      const component = new TestComponent();
      const onAttributeChangedSpy = vi.spyOn(component, 'onAttributeChanged');

      document.body.appendChild(component);
      await sleep(10);

      component.setAttribute('test-attr', 'value');

      expect(onAttributeChangedSpy).toHaveBeenCalledWith('test-attr', null, 'value');
    });

    it('should allow subclass to override lifecycle hooks', async () => {
      const CustomComponent = class extends Component {
        onConnected() {
          this.customProperty = 'initialized';
        }
      };

      componentCounter++;
      customElements.define(`custom-component-${componentCounter}-${Date.now()}`, CustomComponent);

      const component = new CustomComponent();
      document.body.appendChild(component);
      await sleep(10);

      expect(component.customProperty).toBe('initialized');
    });

    it('should work with both light DOM and shadow DOM', async () => {
      // Light DOM
      const lightComponent = new TestComponent();
      lightComponent.useShadowDOM = false;
      lightComponent.templateName = '/templates/test.html';

      document.body.appendChild(lightComponent);
      await sleep(10);

      expect(lightComponent.querySelector('.template-content')).toBeTruthy();

      // Shadow DOM
      const shadowComponent = new TestComponent();
      shadowComponent.useShadowDOM = true;
      shadowComponent.templateName = '/templates/test.html';

      document.body.appendChild(shadowComponent);
      await sleep(10);

      expect(shadowComponent.shadowRoot.querySelector('.template-content')).toBeTruthy();
      expect(shadowComponent.querySelector('.template-content')).toBeNull();
    });
  });
});
