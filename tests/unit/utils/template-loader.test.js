/**
 * Template Loader Tests
 * Tests for HTML template loading, caching, and management
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockFetch } from '../../utils/test-helpers.js';

// Mock pathResolver
vi.mock('../../../src/utils/path-resolver.js', () => ({
  default: {
    resolve: (path) => (path.startsWith('/') ? path : `/${path}`),
  },
}));

describe('TemplateLoader', () => {
  let TemplateLoader;
  let templateLoader;
  let originalFetch;

  beforeEach(async () => {
    // Save original fetch
    originalFetch = global.fetch;

    // Import TemplateLoader class
    const module = await import('../../../src/utils/template-loader.js');
    TemplateLoader = module.TemplateLoader;

    // Create new instance
    templateLoader = new TemplateLoader();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('Initialization', () => {
    it('should initialize with empty cache', () => {
      expect(templateLoader.cache.size).toBe(0);
    });

    it('should initialize with empty loading map', () => {
      expect(templateLoader.loading.size).toBe(0);
    });

    it('should initialize with empty template registry', () => {
      expect(templateLoader.templateRegistry.size).toBe(0);
    });
  });

  describe('Template Registration', () => {
    it('should register a template', () => {
      templateLoader.register('test', '/templates/test.html');

      expect(templateLoader.templateRegistry.get('test')).toBe('/templates/test.html');
    });

    it('should register multiple templates', () => {
      const templates = {
        'header': '/templates/header.html',
        'footer': '/templates/footer.html',
        'sidebar': '/templates/sidebar.html',
      };

      templateLoader.registerMultiple(templates);

      expect(templateLoader.templateRegistry.get('header')).toBe('/templates/header.html');
      expect(templateLoader.templateRegistry.get('footer')).toBe('/templates/footer.html');
      expect(templateLoader.templateRegistry.get('sidebar')).toBe('/templates/sidebar.html');
    });

    it('should overwrite existing registration', () => {
      templateLoader.register('test', '/templates/test1.html');
      templateLoader.register('test', '/templates/test2.html');

      expect(templateLoader.templateRegistry.get('test')).toBe('/templates/test2.html');
    });
  });

  describe('Template Loading', () => {
    it('should load template from path', async () => {
      const mockHTML = '<div class="test">Test Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('/templates/test.html');

      expect(template).toBeInstanceOf(DocumentFragment);
      expect(template.querySelector('.test')).toBeDefined();
      expect(template.querySelector('.test').textContent).toBe('Test Template');
    });

    it('should load template from registered name', async () => {
      templateLoader.register('test', '/templates/test.html');

      const mockHTML = '<div class="test">Test Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('test');

      expect(template).toBeInstanceOf(DocumentFragment);
      expect(template.querySelector('.test')).toBeDefined();
    });

    it('should cache loaded templates', async () => {
      const mockHTML = '<div>Cached Template</div>';
      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(mockHTML),
        })
      );
      global.fetch = fetchMock;

      // Load twice
      await templateLoader.load('/templates/test.html');
      await templateLoader.load('/templates/test.html');

      // Fetch should only be called once
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should return clone of cached template', async () => {
      const mockHTML = '<div class="test">Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template1 = await templateLoader.load('/templates/test.html');
      const template2 = await templateLoader.load('/templates/test.html');

      // Should be different instances
      expect(template1).not.toBe(template2);

      // But should have same content
      expect(template1.querySelector('.test').textContent).toBe(
        template2.querySelector('.test').textContent
      );
    });

    it('should handle concurrent loads of same template', async () => {
      const mockHTML = '<div>Template</div>';
      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(mockHTML),
        })
      );
      global.fetch = fetchMock;

      // Load concurrently
      const [template1, template2, template3] = await Promise.all([
        templateLoader.load('/templates/test.html'),
        templateLoader.load('/templates/test.html'),
        templateLoader.load('/templates/test.html'),
      ]);

      // Fetch should only be called once
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // All should be valid templates
      expect(template1).toBeInstanceOf(DocumentFragment);
      expect(template2).toBeInstanceOf(DocumentFragment);
      expect(template3).toBeInstanceOf(DocumentFragment);
    });

    it('should throw error on failed fetch', async () => {
      global.fetch = mockFetch({
        ok: false,
        status: 404,
      });

      await expect(templateLoader.load('/templates/nonexistent.html')).rejects.toThrow(
        'Failed to load template'
      );
    });

    it('should throw error on network error', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      await expect(templateLoader.load('/templates/test.html')).rejects.toThrow();
    });

    it('should remove from loading map after successful load', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      await templateLoader.load('/templates/test.html');

      expect(templateLoader.loading.size).toBe(0);
    });

    it('should remove from loading map after failed load', async () => {
      global.fetch = mockFetch({
        ok: false,
        status: 404,
      });

      try {
        await templateLoader.load('/templates/test.html');
      } catch (_error) {
        // Expected
      }

      expect(templateLoader.loading.size).toBe(0);
    });
  });

  describe('HTML Parsing', () => {
    it('should parse simple HTML', () => {
      const html = '<div>Test</div>';
      const fragment = templateLoader.parseHTML(html);

      expect(fragment).toBeInstanceOf(DocumentFragment);
      expect(fragment.querySelector('div').textContent).toBe('Test');
    });

    it('should parse complex HTML', () => {
      const html = `
        <div class="container">
          <h1>Title</h1>
          <p>Paragraph</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      const fragment = templateLoader.parseHTML(html);

      expect(fragment.querySelector('.container')).toBeDefined();
      expect(fragment.querySelector('h1').textContent).toContain('Title');
      expect(fragment.querySelectorAll('li').length).toBe(2);
    });

    it('should handle HTML with attributes', () => {
      const html = '<div class="test" data-value="123" id="test-div">Content</div>';
      const fragment = templateLoader.parseHTML(html);

      const div = fragment.querySelector('div');
      expect(div.className).toBe('test');
      expect(div.getAttribute('data-value')).toBe('123');
      expect(div.id).toBe('test-div');
    });

    it('should trim whitespace', () => {
      const html = '   <div>Test</div>   ';
      const fragment = templateLoader.parseHTML(html);

      expect(fragment.querySelector('div')).toBeDefined();
    });

    it('should handle empty HTML', () => {
      const html = '';
      const fragment = templateLoader.parseHTML(html);

      expect(fragment.childNodes.length).toBe(0);
    });
  });

  describe('Template Cloning', () => {
    it('should create deep clone of template', () => {
      const html = '<div class="test">Original</div>';
      const original = templateLoader.parseHTML(html);
      const clone = templateLoader.cloneTemplate(original);

      // Modify clone
      clone.querySelector('.test').textContent = 'Modified';

      // Original should be unchanged
      expect(original.querySelector('.test').textContent).toBe('Original');
      expect(clone.querySelector('.test').textContent).toBe('Modified');
    });

    it('should clone nested elements', () => {
      const html = `
        <div class="parent">
          <div class="child">
            <span>Text</span>
          </div>
        </div>
      `;
      const original = templateLoader.parseHTML(html);
      const clone = templateLoader.cloneTemplate(original);

      expect(clone.querySelector('.parent')).toBeDefined();
      expect(clone.querySelector('.child')).toBeDefined();
      expect(clone.querySelector('span').textContent).toBe('Text');
    });
  });

  describe('Template Preloading', () => {
    it('should preload multiple templates', async () => {
      const mockHTML = '<div>Template</div>';
      const fetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(mockHTML),
        })
      );
      global.fetch = fetchMock;

      await templateLoader.preload([
        '/templates/test1.html',
        '/templates/test2.html',
        '/templates/test3.html',
      ]);

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(templateLoader.cache.size).toBe(3);
    });

    it('should continue preloading even if one fails', async () => {
      const fetchMock = vi.fn((url) => {
        if (url.includes('test2')) {
          return Promise.resolve({ ok: false, status: 404 });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve('<div>Template</div>'),
        });
      });
      global.fetch = fetchMock;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await templateLoader.preload([
        '/templates/test1.html',
        '/templates/test2.html',
        '/templates/test3.html',
      ]);

      expect(templateLoader.cache.size).toBe(2); // test1 and test3 loaded
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle empty preload array', async () => {
      await expect(templateLoader.preload([])).resolves.not.toThrow();
    });
  });

  describe('DOM Template Loading', () => {
    it('should load template from DOM', () => {
      const templateEl = document.createElement('template');
      templateEl.id = 'test-template';
      templateEl.innerHTML = '<div class="from-dom">DOM Template</div>';
      document.body.appendChild(templateEl);

      const fragment = templateLoader.loadFromDOM('#test-template');

      expect(fragment).toBeInstanceOf(DocumentFragment);
      expect(fragment.querySelector('.from-dom').textContent).toBe('DOM Template');

      templateEl.remove();
    });

    it('should return null if template not found', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const fragment = templateLoader.loadFromDOM('#nonexistent');

      expect(fragment).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should return null if element is not a template', () => {
      const div = document.createElement('div');
      div.id = 'not-template';
      document.body.appendChild(div);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const fragment = templateLoader.loadFromDOM('#not-template');

      expect(fragment).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      div.remove();
    });

    it('should clone template from DOM', () => {
      const templateEl = document.createElement('template');
      templateEl.id = 'test-template';
      templateEl.innerHTML = '<div class="test">Original</div>';
      document.body.appendChild(templateEl);

      const fragment = templateLoader.loadFromDOM('#test-template');
      fragment.querySelector('.test').textContent = 'Modified';

      // Template element should be unchanged
      expect(templateEl.content.querySelector('.test').textContent).toBe('Original');

      templateEl.remove();
    });
  });

  describe('Load Into Target', () => {
    it('should load template into target element (append)', async () => {
      const mockHTML = '<div class="loaded">Loaded Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const target = document.createElement('div');
      target.innerHTML = '<div class="existing">Existing</div>';

      await templateLoader.loadInto('/templates/test.html', target, false);

      expect(target.querySelector('.existing')).toBeDefined();
      expect(target.querySelector('.loaded')).toBeDefined();
    });

    it('should load template into target element (replace)', async () => {
      const mockHTML = '<div class="loaded">Loaded Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const target = document.createElement('div');
      target.innerHTML = '<div class="existing">Existing</div>';

      await templateLoader.loadInto('/templates/test.html', target, true);

      expect(target.querySelector('.existing')).toBeNull();
      expect(target.querySelector('.loaded')).toBeDefined();
    });

    it('should return loaded template', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const target = document.createElement('div');
      const template = await templateLoader.loadInto('/templates/test.html', target);

      expect(template).toBeInstanceOf(DocumentFragment);
    });
  });

  describe('Cache Management', () => {
    it('should clear specific template from cache', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      await templateLoader.load('/templates/test1.html');
      await templateLoader.load('/templates/test2.html');

      expect(templateLoader.cache.size).toBe(2);

      templateLoader.clearCache('/templates/test1.html');

      expect(templateLoader.cache.size).toBe(1);
      expect(templateLoader.isCached('/templates/test1.html')).toBe(false);
      expect(templateLoader.isCached('/templates/test2.html')).toBe(true);
    });

    it('should clear all templates from cache', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      await templateLoader.load('/templates/test1.html');
      await templateLoader.load('/templates/test2.html');
      await templateLoader.load('/templates/test3.html');

      expect(templateLoader.cache.size).toBe(3);

      templateLoader.clearCache();

      expect(templateLoader.cache.size).toBe(0);
    });

    it('should clear registered template by name', async () => {
      templateLoader.register('test', '/templates/test.html');

      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      await templateLoader.load('test');
      expect(templateLoader.isCached('test')).toBe(true);

      templateLoader.clearCache('test');
      expect(templateLoader.isCached('test')).toBe(false);
    });
  });

  describe('Cache Statistics', () => {
    it('should return cache statistics', async () => {
      templateLoader.register('test1', '/templates/test1.html');
      templateLoader.register('test2', '/templates/test2.html');

      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      await templateLoader.load('test1');

      const stats = templateLoader.getCacheStats();

      expect(stats.cached).toBe(1);
      expect(stats.loading).toBe(0);
      expect(stats.registered).toBe(2);
    });

    it('should show loading templates in stats', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                text: () => Promise.resolve(mockHTML),
              });
            }, 100);
          })
      );

      // Start loading but don't await
      const loadPromise = templateLoader.load('/templates/test.html');

      // Check stats while loading
      const stats = templateLoader.getCacheStats();
      expect(stats.loading).toBe(1);

      // Wait for completion
      await loadPromise;
    });
  });

  describe('Cache Checking', () => {
    it('should check if template is cached by path', async () => {
      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      expect(templateLoader.isCached('/templates/test.html')).toBe(false);

      await templateLoader.load('/templates/test.html');

      expect(templateLoader.isCached('/templates/test.html')).toBe(true);
    });

    it('should check if template is cached by name', async () => {
      templateLoader.register('test', '/templates/test.html');

      const mockHTML = '<div>Template</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      expect(templateLoader.isCached('test')).toBe(false);

      await templateLoader.load('test');

      expect(templateLoader.isCached('test')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle template with special characters', async () => {
      const mockHTML = '<div data-test="value with spaces">Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('/templates/test.html');

      expect(template.querySelector('[data-test="value with spaces"]')).toBeDefined();
    });

    it('should handle template with scripts', async () => {
      const mockHTML = '<div><script>console.log("test")</script>Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('/templates/test.html');

      expect(template.querySelector('script')).toBeDefined();
    });

    it('should handle template with style tags', async () => {
      const mockHTML = '<style>.test { color: red; }</style><div>Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('/templates/test.html');

      expect(template.querySelector('style')).toBeDefined();
    });

    it('should handle very large templates', async () => {
      const largeHTML = `<div>${'x'.repeat(10000)}</div>`;
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(largeHTML),
      });

      const template = await templateLoader.load('/templates/large.html');

      expect(template.querySelector('div').textContent.length).toBe(10000);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full template workflow', async () => {
      // Register template
      templateLoader.register('card', '/templates/card.html');

      // Load template
      const mockHTML = '<div class="card">Card Content</div>';
      global.fetch = mockFetch({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockHTML),
      });

      const template = await templateLoader.load('card');

      // Verify loaded
      expect(template.querySelector('.card')).toBeDefined();

      // Verify cached
      expect(templateLoader.isCached('card')).toBe(true);

      // Load again (should use cache)
      const template2 = await templateLoader.load('card');
      expect(template2.querySelector('.card')).toBeDefined();

      // Clear cache
      templateLoader.clearCache('card');
      expect(templateLoader.isCached('card')).toBe(false);
    });

    it('should handle multiple concurrent workflows', async () => {
      const mockHTML1 = '<div class="template1">Template 1</div>';
      const mockHTML2 = '<div class="template2">Template 2</div>';
      const mockHTML3 = '<div class="template3">Template 3</div>';

      global.fetch = vi.fn((url) => {
        if (url.includes('test1')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockHTML1),
          });
        }
        if (url.includes('test2')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockHTML2),
          });
        }
        if (url.includes('test3')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockHTML3),
          });
        }
      });

      const [t1, t2, t3] = await Promise.all([
        templateLoader.load('/templates/test1.html'),
        templateLoader.load('/templates/test2.html'),
        templateLoader.load('/templates/test3.html'),
      ]);

      expect(t1.querySelector('.template1')).toBeDefined();
      expect(t2.querySelector('.template2')).toBeDefined();
      expect(t3.querySelector('.template3')).toBeDefined();
      expect(templateLoader.cache.size).toBe(3);
    });
  });
});
