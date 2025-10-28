/**
 * Path Resolver Tests
 * Tests for path resolution utility across different environments
 */

import { afterEach, beforeEach, describe, expect, it, } from 'vitest';
import { PathResolver } from '../../../src/utils/path-resolver.js';

describe('PathResolver', () => {
  let pathResolver;
  let originalLocation;

  beforeEach(() => {
    // Save original location
    originalLocation = window.location;

    // Create new path resolver instance for each test
    pathResolver = new PathResolver();
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  describe('Environment Detection', () => {
    it('should detect development environment on localhost', () => {
      mockLocation('http://localhost:8000/');
      pathResolver.detectEnvironment();

      expect(pathResolver.getEnvironment()).toBe('development');
    });

    it('should detect development environment on 127.0.0.1', () => {
      mockLocation('http://127.0.0.1:8000/');
      pathResolver.detectEnvironment();

      expect(pathResolver.getEnvironment()).toBe('development');
    });

    it('should detect GitHub Pages environment', () => {
      mockLocation('https://username.github.io/repository/');
      pathResolver.detectEnvironment();

      expect(pathResolver.getEnvironment()).toBe('github-pages');
    });

    it('should detect production environment', () => {
      mockLocation('https://legacyconcierge.com/');
      pathResolver.detectEnvironment();

      expect(pathResolver.getEnvironment()).toBe('production');
    });
  });

  describe('Base Path Detection', () => {
    it('should set empty base path for localhost', () => {
      mockLocation('http://localhost:8000/');
      pathResolver.detectEnvironment();
      pathResolver.detectBasePath();

      expect(pathResolver.getBasePath()).toBe('');
    });

    it('should set base path for GitHub Pages', () => {
      mockLocation('https://username.github.io/repository/');
      pathResolver.detectEnvironment();
      pathResolver.detectBasePath();

      expect(pathResolver.getBasePath()).toBe('/repository');
    });

    it('should set empty base path for production on root domain', () => {
      mockLocation('https://legacyconcierge.com/');
      pathResolver.detectEnvironment();
      pathResolver.detectBasePath();

      expect(pathResolver.getBasePath()).toBe('');
    });

    it('should handle GitHub Pages with nested paths', () => {
      mockLocation('https://username.github.io/repository/pages/about/');
      pathResolver.detectEnvironment();
      pathResolver.detectBasePath();

      expect(pathResolver.getBasePath()).toBe('/repository');
    });
  });

  describe('Path Resolution', () => {
    it('should resolve paths with base path', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolve('assets/images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });

    it('should resolve paths without base path', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolve('assets/images/logo.png');

      expect(resolved).toBe('/assets/images/logo.png');
    });

    it('should handle paths with leading slash', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolve('/assets/images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });

    it('should not modify absolute URLs', () => {
      pathResolver.basePath = '/repository';
      const url = 'https://example.com/image.png';
      const resolved = pathResolver.resolve(url);

      expect(resolved).toBe(url);
    });

    it('should not modify protocol-relative URLs', () => {
      pathResolver.basePath = '/repository';
      const url = '//cdn.example.com/image.png';
      const resolved = pathResolver.resolve(url);

      expect(resolved).toBe(url);
    });

    it('should handle empty path', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolve('');

      expect(resolved).toBe('/repository');
    });

    it('should return root when base path empty and path empty', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolve('');

      expect(resolved).toBe('/');
    });
  });

  describe('Relative Path Resolution', () => {
    it('should resolve relative paths at depth 0', () => {
      const resolved = pathResolver.resolveRelative('assets/images/logo.png', 0);

      expect(resolved).toBe('./assets/images/logo.png');
    });

    it('should resolve relative paths at depth 1', () => {
      const resolved = pathResolver.resolveRelative('assets/images/logo.png', 1);

      expect(resolved).toBe('../assets/images/logo.png');
    });

    it('should resolve relative paths at depth 2', () => {
      const resolved = pathResolver.resolveRelative('assets/images/logo.png', 2);

      expect(resolved).toBe('../../assets/images/logo.png');
    });

    it('should handle absolute paths', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolveRelative('/assets/images/logo.png', 1);

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });

    it('should handle empty path', () => {
      const resolved = pathResolver.resolveRelative('', 2);

      expect(resolved).toBe('./');
    });

    it('should handle http URLs', () => {
      pathResolver.basePath = '';
      const url = 'https://example.com/image.png';
      const resolved = pathResolver.resolveRelative(url, 1);

      expect(resolved).toBe(url);
    });
  });

  describe('Current Depth Calculation', () => {
    it('should calculate depth 0 for root', () => {
      mockLocation('http://localhost:8000/');
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(0);
    });

    it('should calculate depth 0 for root index.html', () => {
      mockLocation('http://localhost:8000/index.html');
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(0);
    });

    it('should calculate depth 1 for pages directory', () => {
      mockLocation('http://localhost:8000/pages/about.html');
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(1);
    });

    it('should calculate depth 2 for nested pages', () => {
      mockLocation('http://localhost:8000/pages/services/recovery.html');
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(2);
    });

    it('should handle paths without .html extension', () => {
      mockLocation('http://localhost:8000/pages/about/');
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(2);
    });

    it('should handle GitHub Pages base path', () => {
      mockLocation('https://username.github.io/repository/pages/about.html');
      pathResolver.basePath = '/repository';
      const depth = pathResolver.getCurrentDepth();

      expect(depth).toBe(1);
    });
  });

  describe('Asset Path Resolution', () => {
    it('should resolve asset path with assets prefix', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolveAsset('images/logo.png');

      expect(resolved).toBe('/assets/images/logo.png');
    });

    it('should not duplicate assets prefix', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolveAsset('assets/images/logo.png');

      expect(resolved).toBe('/assets/images/logo.png');
    });

    it('should resolve with base path', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolveAsset('images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });

    it('should not modify absolute URLs', () => {
      pathResolver.basePath = '/repository';
      const url = 'https://cdn.example.com/image.png';
      const resolved = pathResolver.resolveAsset(url);

      expect(resolved).toBe(url);
    });

    it('should not modify data URLs', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGg...';
      const resolved = pathResolver.resolveAsset(dataUrl);

      expect(resolved).toBe(dataUrl);
    });

    it('should handle empty path', () => {
      const resolved = pathResolver.resolveAsset('');

      expect(resolved).toBe('');
    });

    it('should handle paths with leading slash', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolveAsset('/images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });
  });

  describe('i18n Path Resolution', () => {
    it('should resolve i18n path for English', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolveI18n('en', 'common');

      expect(resolved).toBe('/i18n/en/common.json');
    });

    it('should resolve i18n path for Spanish', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolveI18n('es', 'home');

      expect(resolved).toBe('/i18n/es/home.json');
    });

    it('should resolve with base path', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolveI18n('en', 'services');

      expect(resolved).toBe('/repository/i18n/en/services.json');
    });

    it('should handle various page names', () => {
      pathResolver.basePath = '';
      const pages = ['common', 'home', 'about', 'services', 'contact'];

      pages.forEach((page) => {
        const resolved = pathResolver.resolveI18n('en', page);
        expect(resolved).toBe(`/i18n/en/${page}.json`);
      });
    });
  });

  describe('Template Path Resolution', () => {
    it('should resolve template path', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolveTemplate('lc-button');

      expect(resolved).toBe('/src/components/templates/lc-button.html');
    });

    it('should resolve with base path', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolveTemplate('lc-modal');

      expect(resolved).toBe('/repository/src/components/templates/lc-modal.html');
    });

    it('should handle various component names', () => {
      pathResolver.basePath = '';
      const components = ['lc-button', 'lc-card', 'lc-modal', 'lc-tabs'];

      components.forEach((component) => {
        const resolved = pathResolver.resolveTemplate(component);
        expect(resolved).toBe(`/src/components/templates/${component}.html`);
      });
    });
  });

  describe('Global Exposure', () => {
    it('should expose pathResolver globally', () => {
      pathResolver.exposeGlobally();

      expect(window.pathResolver).toBe(pathResolver);
    });

    it('should expose resolvePath globally', () => {
      pathResolver.exposeGlobally();
      pathResolver.basePath = '/repository';

      const resolved = window.resolvePath('assets/images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });

    it('should expose resolveAsset globally', () => {
      pathResolver.exposeGlobally();
      pathResolver.basePath = '/repository';

      const resolved = window.resolveAsset('images/logo.png');

      expect(resolved).toBe('/repository/assets/images/logo.png');
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly in localhost development', () => {
      mockLocation('http://localhost:8000/pages/about.html');
      const resolver = new PathResolver();

      expect(resolver.getEnvironment()).toBe('development');
      expect(resolver.getBasePath()).toBe('');
      expect(resolver.resolve('assets/images/logo.png')).toBe('/assets/images/logo.png');
      expect(resolver.getCurrentDepth()).toBe(1);
    });

    it('should work correctly on GitHub Pages', () => {
      mockLocation('https://username.github.io/repository/pages/about.html');
      const resolver = new PathResolver();

      expect(resolver.getEnvironment()).toBe('github-pages');
      expect(resolver.getBasePath()).toBe('/repository');
      expect(resolver.resolve('assets/images/logo.png')).toBe(
        '/repository/assets/images/logo.png'
      );
      expect(resolver.getCurrentDepth()).toBe(1);
    });

    it('should work correctly in production', () => {
      mockLocation('https://legacyconcierge.com/pages/services/recovery.html');
      const resolver = new PathResolver();

      expect(resolver.getEnvironment()).toBe('production');
      expect(resolver.getBasePath()).toBe('');
      expect(resolver.resolve('assets/images/logo.png')).toBe('/assets/images/logo.png');
      expect(resolver.getCurrentDepth()).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined inputs', () => {
      expect(pathResolver.resolve(null)).toBe('/');
      expect(pathResolver.resolve(undefined)).toBe('/');
      expect(pathResolver.resolveAsset(null)).toBe('');
      expect(pathResolver.resolveAsset(undefined)).toBe('');
    });

    it('should handle double slashes', () => {
      pathResolver.basePath = '/repository';
      const resolved = pathResolver.resolve('//assets/images/logo.png');

      expect(resolved).toBe('//assets/images/logo.png');
    });

    it('should handle empty strings', () => {
      expect(pathResolver.resolveAsset('')).toBe('');
      expect(pathResolver.resolveRelative('', 0)).toBe('./');
    });

    it('should handle paths with special characters', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolve('assets/images/logo%20(1).png');

      expect(resolved).toBe('/assets/images/logo%20(1).png');
    });

    it('should handle paths with query strings', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolve('assets/images/logo.png?v=1.0');

      expect(resolved).toBe('/assets/images/logo.png?v=1.0');
    });

    it('should handle paths with fragments', () => {
      pathResolver.basePath = '';
      const resolved = pathResolver.resolve('pages/about.html#section');

      expect(resolved).toBe('/pages/about.html#section');
    });
  });
});

/**
 * Helper function to mock window.location
 * @param {string} url - URL to mock
 */
function mockLocation(url) {
  const urlObj = new URL(url);

  delete window.location;
  window.location = {
    href: url,
    protocol: urlObj.protocol,
    host: urlObj.host,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
    origin: urlObj.origin,
  };
}
