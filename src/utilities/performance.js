/**
 * Performance Utilities
 *
 * Comprehensive performance optimization including:
 * - Lazy loading for images and media
 * - Code splitting and dynamic imports
 * - Resource preloading and prefetching
 * - Performance monitoring and metrics
 * - Critical resource prioritization
 */

export class PerformanceManager {
  constructor() {
    this.observers = {
      intersection: null,
      mutation: null,
      performance: null
    };

    this.metrics = {
      images: { loaded: 0, total: 0 },
      components: { loaded: 0, total: 0 },
      resources: { loaded: 0, total: 0 }
    };

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupLazyLoading();
    this.setupResourceHints();
    this.monitorPerformance();
    this.optimizeFonts();
  }

  /**
   * Intersection Observer Setup
   * Used for lazy loading and visibility detection
   */
  setupIntersectionObserver() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      console.warn('[Performance] IntersectionObserver not supported, loading all resources immediately');
      return;
    }

    const options = {
      root: null,
      rootMargin: '50px', // Load 50px before entering viewport
      threshold: 0.01
    };

    this.observers.intersection = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleIntersection(entry.target);
        }
      });
    }, options);

    console.log('[Performance] Intersection Observer initialized');
  }

  /**
   * Handle element entering viewport
   * @param {HTMLElement} element - Element that entered viewport
   */
  handleIntersection(element) {
    if (element.dataset.src) {
      this.lazyLoadImage(element);
    } else if (element.dataset.component) {
      this.lazyLoadComponent(element);
    } else if (element.dataset.video) {
      this.lazyLoadVideo(element);
    }

    // Stop observing once loaded
    this.observers.intersection?.unobserve(element);
  }

  /**
   * Setup Lazy Loading
   * Automatically detect and configure lazy loading for images and media
   */
  setupLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    this.metrics.images.total = lazyImages.length;

    lazyImages.forEach(img => {
      // Native lazy loading support
      if ('loading' in HTMLImageElement.prototype) {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        // If using data-src, swap to src
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
      } else {
        // Fallback to Intersection Observer
        if (this.observers.intersection) {
          this.observers.intersection.observe(img);
        } else {
          // No support at all, load immediately
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        }
      }
    });

    // Lazy load background images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(element => {
      if (this.observers.intersection) {
        this.observers.intersection.observe(element);
      }
    });

    // Lazy load iframes (videos, maps)
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => {
      if (this.observers.intersection) {
        this.observers.intersection.observe(iframe);
      }
    });

    console.log(`[Performance] Configured lazy loading for ${lazyImages.length} images`);
  }

  /**
   * Lazy load an image
   * @param {HTMLImageElement} img - Image element to load
   */
  lazyLoadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src) return;

    // Create temporary image to test loading
    const tempImg = new Image();

    tempImg.onload = () => {
      // Apply source
      img.src = src;
      if (srcset) {
        img.srcset = srcset;
      }

      // Add loaded class for fade-in effect
      img.classList.add('lazy-loaded');

      // Clean up data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;

      this.metrics.images.loaded++;
      console.log(`[Performance] Lazy loaded image: ${src}`);
    };

    tempImg.onerror = () => {
      console.error(`[Performance] Failed to lazy load image: ${src}`);
      img.classList.add('lazy-error');
    };

    tempImg.src = src;
  }

  /**
   * Lazy load a component
   * @param {HTMLElement} element - Component element to load
   */
  async lazyLoadComponent(element) {
    const componentName = element.dataset.component;

    if (!componentName) return;

    try {
      console.log(`[Performance] Lazy loading component: ${componentName}`);

      // Dynamic import based on component name
      const module = await import(`../components/${componentName}.js`);

      // If component exports a default, it's likely a class
      if (module.default) {
        // Let web component registration happen automatically
        console.log(`[Performance] Component loaded: ${componentName}`);
      }

      element.classList.add('component-loaded');
      delete element.dataset.component;

      this.metrics.components.loaded++;
    } catch (error) {
      console.error(`[Performance] Failed to load component ${componentName}:`, error);
      element.classList.add('component-error');
    }
  }

  /**
   * Lazy load a video
   * @param {HTMLElement} element - Video element to load
   */
  lazyLoadVideo(element) {
    const videoSrc = element.dataset.video;

    if (!videoSrc) return;

    if (element.tagName === 'VIDEO') {
      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = this.getVideoMimeType(videoSrc);
      element.appendChild(source);
      element.load();
    } else if (element.tagName === 'IFRAME') {
      element.src = videoSrc;
    }

    element.classList.add('video-loaded');
    delete element.dataset.video;

    console.log(`[Performance] Lazy loaded video: ${videoSrc}`);
  }

  /**
   * Get video MIME type from file extension
   * @param {string} src - Video source URL
   * @returns {string} MIME type
   */
  getVideoMimeType(src) {
    const ext = src.split('.').pop().toLowerCase();
    const types = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg'
    };
    return types[ext] || 'video/mp4';
  }

  /**
   * Setup Resource Hints
   * Preload, prefetch, and preconnect critical resources
   */
  setupResourceHints() {
    // Preconnect to external domains
    this.preconnect([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]);

    // Preload critical resources
    this.preloadCritical();

    // Prefetch next likely pages
    this.prefetchNextPages();

    console.log('[Performance] Resource hints configured');
  }

  /**
   * Preconnect to external domains
   * @param {Array<string>} urls - URLs to preconnect
   */
  preconnect(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      console.log(`[Performance] Preconnecting to: ${url}`);
    });
  }

  /**
   * Preload critical resources
   */
  preloadCritical() {
    // Preload critical CSS
    const criticalCSS = [
      '/src/tokens/design-tokens.css',
      '/src/tokens/component-tokens.css',
      '/src/tokens/base.css'
    ];

    criticalCSS.forEach(href => {
      this.preload(href, 'style');
    });

    // Preload critical JavaScript
    const criticalJS = [
      '/src/init.js'
    ];

    criticalJS.forEach(href => {
      this.preload(href, 'script');
    });

    // Preload hero images (if present)
    const heroImage = document.querySelector('.hero__image, .split-hero__image');
    if (heroImage) {
      const src = heroImage.src || heroImage.dataset.src;
      if (src) {
        this.preload(src, 'image');
      }
    }
  }

  /**
   * Preload a resource
   * @param {string} href - Resource URL
   * @param {string} as - Resource type ('style', 'script', 'image', 'font')
   */
  preload(href, as) {
    // Check if already preloaded
    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;

    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
    console.log(`[Performance] Preloading ${as}: ${href}`);
  }

  /**
   * Prefetch next likely pages
   */
  prefetchNextPages() {
    // Determine current page
    const currentPath = window.location.pathname;

    // Define likely next pages based on current page
    const nextPages = this.getPrefetchPages(currentPath);

    // Use idle time to prefetch
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        nextPages.forEach(page => this.prefetch(page));
      });
    } else {
      setTimeout(() => {
        nextPages.forEach(page => this.prefetch(page));
      }, 1000);
    }
  }

  /**
   * Get pages to prefetch based on current page
   * @param {string} path - Current path
   * @returns {Array<string>} Pages to prefetch
   */
  getPrefetchPages(path) {
    const prefetchMap = {
      '/': ['/services', '/about', '/contact'],
      '/index.html': ['/services.html', '/about-a.html', '/contact-a.html'],
      '/services': ['/contact', '/team'],
      '/services.html': ['/contact-a.html', '/team.html'],
      '/about': ['/services', '/team', '/contact'],
      '/about-a.html': ['/services.html', '/team.html', '/contact-a.html'],
      '/team': ['/services', '/contact'],
      '/team.html': ['/services.html', '/contact-a.html'],
      '/blog': ['/services', '/contact'],
      '/blog.html': ['/services.html', '/contact-a.html']
    };

    return prefetchMap[path] || [];
  }

  /**
   * Prefetch a page
   * @param {string} href - Page URL to prefetch
   */
  prefetch(href) {
    // Check if already prefetched
    const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';

    document.head.appendChild(link);
    console.log(`[Performance] Prefetching page: ${href}`);
  }

  /**
   * Optimize Fonts
   * Configure font loading strategy
   */
  optimizeFonts() {
    // Use font-display: swap for web fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('[Performance] Fonts loaded');
      });
    }

    // Preload critical fonts
    const criticalFonts = document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]');
    criticalFonts.forEach(link => {
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('onload', "this.rel='stylesheet'");
    });
  }

  /**
   * Monitor Performance
   * Track and report performance metrics
   */
  monitorPerformance() {
    // Use Performance Observer for modern metrics
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`[Performance] LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            console.log(`[Performance] FID: ${entry.processingStart - entry.startTime}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          console.log(`[Performance] CLS: ${clsScore}`);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        this.observers.performance = { lcp: lcpObserver, fid: fidObserver, cls: clsObserver };
      } catch (error) {
        console.warn('[Performance] Performance Observer not fully supported:', error);
      }
    }

    // Fallback to Navigation Timing API
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.reportBasicMetrics();
      }, 0);
    });
  }

  /**
   * Report basic performance metrics
   */
  reportBasicMetrics() {
    if (!window.performance || !window.performance.timing) {
      return;
    }

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    const metrics = {
      // Page load times
      'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
      'TCP Connection': timing.connectEnd - timing.connectStart,
      'Request Time': timing.responseStart - timing.requestStart,
      'Response Time': timing.responseEnd - timing.responseStart,
      'DOM Processing': timing.domComplete - timing.domLoading,
      'Total Load Time': timing.loadEventEnd - timing.navigationStart,

      // Rendering times
      'Time to Interactive': timing.domInteractive - timing.navigationStart,
      'DOM Content Loaded': timing.domContentLoadedEventEnd - timing.navigationStart,
      'Page Load Complete': timing.loadEventEnd - timing.navigationStart,

      // Navigation type
      'Navigation Type': ['Navigate', 'Reload', 'Back/Forward'][navigation.type] || 'Unknown'
    };

    console.group('[Performance] Metrics');
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        console.log(`${key}: ${value}ms`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    console.groupEnd();

    // Check against thresholds
    this.checkPerformanceThresholds(metrics);
  }

  /**
   * Check performance against thresholds
   * @param {Object} metrics - Performance metrics
   */
  checkPerformanceThresholds(metrics) {
    const thresholds = {
      'Total Load Time': 3000, // 3 seconds
      'Time to Interactive': 2000, // 2 seconds
      'DOM Content Loaded': 1500 // 1.5 seconds
    };

    const warnings = [];

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      if (metrics[metric] > threshold) {
        warnings.push(`${metric} (${metrics[metric]}ms) exceeds threshold (${threshold}ms)`);
      }
    });

    if (warnings.length > 0) {
      console.group('[Performance] ⚠️ Warnings');
      warnings.forEach(warning => console.warn(warning));
      console.groupEnd();
    } else {
      console.log('[Performance] ✅ All metrics within acceptable thresholds');
    }
  }

  /**
   * Get current performance metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      memory: this.getMemoryUsage(),
      navigation: this.getNavigationTiming()
    };
  }

  /**
   * Get memory usage (if available)
   * @returns {Object|null} Memory usage info
   */
  getMemoryUsage() {
    if (window.performance && window.performance.memory) {
      return {
        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Get navigation timing
   * @returns {Object|null} Navigation timing info
   */
  getNavigationTiming() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        connectTime: timing.connectEnd - timing.connectStart
      };
    }
    return null;
  }

  /**
   * Debounce function for performance
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function for performance
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 250) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Request idle callback polyfill
   * @param {Function} callback - Callback function
   * @param {Object} options - Options object
   * @returns {number} Request ID
   */
  requestIdleCallback(callback, options = {}) {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, options);
    }

    // Polyfill
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  }

  /**
   * Cancel idle callback
   * @param {number} id - Request ID
   */
  cancelIdleCallback(id) {
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceManager = new PerformanceManager();
  });
} else {
  window.performanceManager = new PerformanceManager();
}

// Export for use in other modules
export default PerformanceManager;
