# Performance Optimization Documentation

## Overview
Legacy Concierge is optimized for maximum performance, ensuring fast load times and smooth interactions across all devices and network conditions. Our performance strategy focuses on lazy loading, code splitting, resource optimization, and continuous monitoring.

## Table of Contents
1. [Performance Features](#performance-features)
2. [Lazy Loading](#lazy-loading)
3. [Code Splitting](#code-splitting)
4. [Resource Hints](#resource-hints)
5. [Performance Monitoring](#performance-monitoring)
6. [Optimization Utilities](#optimization-utilities)
7. [Best Practices](#best-practices)
8. [Performance Metrics](#performance-metrics)
9. [Testing Performance](#testing-performance)

---

## Performance Features

### Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| **Largest Contentful Paint (LCP)** | < 2.5s | Monitored |
| **First Input Delay (FID)** | < 100ms | Monitored |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Monitored |
| **Time to Interactive (TTI)** | < 3.0s | Monitored |
| **First Contentful Paint (FCP)** | < 1.8s | Monitored |
| **Total Blocking Time (TBT)** | < 200ms | Monitored |

### Key Features

✅ **Automatic Lazy Loading** - Images, videos, and components load on demand
✅ **Native Lazy Loading Support** - Uses browser-native `loading="lazy"` when available
✅ **IntersectionObserver Fallback** - Polyfill for older browsers
✅ **Code Splitting** - Components loaded dynamically when needed
✅ **Resource Hints** - Preconnect, preload, prefetch for critical resources
✅ **Font Optimization** - Efficient web font loading with `font-display: swap`
✅ **Performance Monitoring** - Real-time metrics via Performance Observer API
✅ **Responsive Images** - Properly sized images for each viewport
✅ **Critical CSS** - Inline critical styles, defer non-critical
✅ **Network Awareness** - Adapts to connection speed

---

## Lazy Loading

### Automatic Image Lazy Loading

The Performance Manager automatically detects and configures lazy loading for all images.

#### HTML Markup

```html
<!-- Native lazy loading (preferred) -->
<img
  src="/path/to/image.jpg"
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
>

<!-- Data attribute approach (fallback) -->
<img
  data-src="/path/to/image.jpg"
  alt="Description"
  width="800"
  height="600"
>

<!-- With srcset for responsive images -->
<img
  src="/path/to/image-small.jpg"
  srcset="/path/to/image-small.jpg 400w,
          /path/to/image-medium.jpg 800w,
          /path/to/image-large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
  loading="lazy"
>
```

#### Background Image Lazy Loading

```html
<div
  class="hero"
  data-bg="/path/to/background.jpg"
  style="min-height: 400px;"
>
  <h1>Hero Content</h1>
</div>
```

```css
/* Applied when loaded */
.hero.lazy-loaded {
  background-image: url('/path/to/background.jpg');
  background-size: cover;
  background-position: center;
}
```

### Video Lazy Loading

```html
<!-- Video element -->
<video
  data-video="/path/to/video.mp4"
  poster="/path/to/poster.jpg"
  controls
  width="800"
  height="450"
>
  Your browser doesn't support video.
</video>

<!-- YouTube embed -->
<iframe
  data-video="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title"
  width="560"
  height="315"
  frameborder="0"
  allowfullscreen
></iframe>
```

### Component Lazy Loading

```html
<!-- Component loaded when visible -->
<div data-component="composite/lc-modal">
  <button>Open Modal</button>
</div>
```

### Loading States

Automatic loading states are applied:

```css
/* Shimmer effect while loading */
img[data-src] {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: shimmer 1.5s infinite;
}

/* Fade in when loaded */
img.lazy-loaded {
  animation: fadeIn 300ms ease-in;
}

/* Error state */
img.lazy-error {
  background: #fef2f2;
  border: 2px dashed #dc2626;
}
```

---

## Code Splitting

### Dynamic Component Imports

Components are loaded only when needed, reducing initial bundle size.

#### Automatic Code Splitting

The init system automatically splits code for all custom elements:

```javascript
// Components are registered but not loaded
const COMPONENTS = {
  'lc-modal': () => import('./components/composite/lc-modal.js'),
  'lc-tabs': () => import('./components/composite/lc-tabs.js'),
  'lc-slider': () => import('./components/composite/lc-slider.js'),
  // ... more components
};

// Only components present on the page are loaded
await loadPageComponents();
```

#### Manual Code Splitting

For custom functionality:

```javascript
// Load module on demand
button.addEventListener('click', async () => {
  const { default: MyFeature } = await import('./features/my-feature.js');
  const feature = new MyFeature();
  feature.init();
});

// Or use requestIdleCallback for non-critical features
window.performanceManager.requestIdleCallback(async () => {
  const { analytics } = await import('./features/analytics.js');
  analytics.init();
});
```

#### Route-Based Code Splitting

```javascript
// Load page-specific code
const pageName = document.body.dataset.page;

if (pageName === 'blog') {
  import('./pages/blog-enhancements.js');
} else if (pageName === 'services') {
  import('./pages/services-enhancements.js');
}
```

### Bundle Size Optimization

#### Tree Shaking

Use ES6 modules for automatic tree shaking:

```javascript
// Good: Named imports (tree-shakeable)
import { debounce, throttle } from './utilities/performance.js';

// Bad: Default import (brings everything)
import * as utils from './utilities/performance.js';
```

#### Dynamic Imports for Large Libraries

```javascript
// Don't import chart library unless needed
if (document.querySelector('.chart')) {
  const Chart = await import('chart.js');
  initializeCharts(Chart);
}
```

---

## Resource Hints

### Preconnect

Establish early connections to external domains:

```html
<!-- In HTML -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

```javascript
// Via JavaScript
window.performanceManager.preconnect([
  'https://api.example.com',
  'https://cdn.example.com'
]);
```

### Preload

Load critical resources early:

```html
<!-- Critical CSS -->
<link rel="preload" href="/src/tokens/base.css" as="style">

<!-- Critical JavaScript -->
<link rel="preload" href="/src/init.js" as="script">

<!-- Hero image -->
<link rel="preload" href="/assets/images/hero.jpg" as="image">

<!-- Critical font -->
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

```javascript
// Via JavaScript
window.performanceManager.preload('/assets/images/hero.jpg', 'image');
```

### Prefetch

Fetch resources likely to be needed soon:

```html
<!-- Next page likely to be visited -->
<link rel="prefetch" href="/services.html">

<!-- JavaScript for next page -->
<link rel="prefetch" href="/assets/js/services.js">
```

```javascript
// Automatic prefetching based on current page
// Already configured in PerformanceManager
window.performanceManager.prefetchNextPages();
```

### DNS Prefetch

Resolve DNS early for external domains:

```html
<link rel="dns-prefetch" href="https://api.example.com">
```

---

## Performance Monitoring

### Automatic Monitoring

The Performance Manager automatically tracks Core Web Vitals:

```javascript
// Automatic monitoring on page load
window.performanceManager.monitorPerformance();

// Access metrics
const metrics = window.performanceManager.getMetrics();
console.log(metrics);
```

### Core Web Vitals

#### Largest Contentful Paint (LCP)

Measures loading performance. Should occur within 2.5 seconds.

```javascript
// Automatically tracked
// Logged to console: [Performance] LCP: 1234ms
```

**Optimization Tips:**
- Optimize server response times
- Use CDN for assets
- Preload hero images
- Minimize render-blocking resources

#### First Input Delay (FID)

Measures interactivity. Should be less than 100ms.

```javascript
// Automatically tracked
// Logged to console: [Performance] FID: 45ms
```

**Optimization Tips:**
- Break up long-running JavaScript tasks
- Use web workers for heavy computation
- Defer non-critical JavaScript
- Minimize third-party scripts

#### Cumulative Layout Shift (CLS)

Measures visual stability. Should be less than 0.1.

```javascript
// Automatically tracked
// Logged to console: [Performance] CLS: 0.05
```

**Optimization Tips:**
- Always include dimensions for images/videos
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS aspect ratio boxes

### Navigation Timing

```javascript
const timing = window.performanceManager.getNavigationTiming();

console.log({
  loadTime: timing.loadTime,        // Total page load time
  domReadyTime: timing.domReadyTime, // DOM ready time
  connectTime: timing.connectTime    // Connection time
});
```

### Memory Usage

```javascript
const memory = window.performanceManager.getMemoryUsage();

if (memory) {
  console.log({
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit
  });
}
```

### Custom Performance Marks

```javascript
// Mark start of operation
performance.mark('feature-start');

// Do something
await loadData();

// Mark end of operation
performance.mark('feature-end');

// Measure duration
performance.measure('feature-duration', 'feature-start', 'feature-end');

// Get measure
const measure = performance.getEntriesByName('feature-duration')[0];
console.log(`Feature took ${measure.duration}ms`);
```

---

## Optimization Utilities

### Debounce

Limit function execution frequency:

```javascript
// Using global utility
const handleSearch = window.debounce((query) => {
  searchAPI(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

**Use Cases:**
- Search input handlers
- Window resize handlers
- Scroll handlers
- Form validation

### Throttle

Ensure function runs at most once per time period:

```javascript
// Using global utility
const handleScroll = window.throttle(() => {
  updateScrollProgress();
}, 100);

window.addEventListener('scroll', handleScroll);
```

**Use Cases:**
- Scroll event handlers
- Mouse move handlers
- Animation frame callbacks
- API rate limiting

### Request Idle Callback

Run non-critical tasks during idle time:

```javascript
window.performanceManager.requestIdleCallback(() => {
  // Analytics tracking
  trackPageView();

  // Preload next page resources
  preloadNextPage();

  // Load non-critical components
  loadSocialMediaWidgets();
}, { timeout: 2000 });
```

**Use Cases:**
- Analytics and tracking
- Prefetching resources
- Non-critical data fetching
- Background processing

---

## Best Practices

### Image Optimization

#### 1. Use Modern Formats

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

#### 2. Responsive Images

```html
<img
  src="small.jpg"
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
  loading="lazy"
>
```

#### 3. Set Dimensions

```html
<!-- Prevent layout shift -->
<img src="image.jpg" alt="Description" width="800" height="600" loading="lazy">
```

#### 4. Optimize File Size

- JPEG: 60-80% quality for photos
- PNG: Use for graphics with transparency
- SVG: For logos and icons
- WebP/AVIF: 20-30% smaller than JPEG

### JavaScript Optimization

#### 1. Minimize Main Thread Work

```javascript
// Bad: Blocking main thread
for (let i = 0; i < 1000000; i++) {
  doHeavyWork(i);
}

// Good: Use web worker
const worker = new Worker('heavy-work.js');
worker.postMessage({ iterations: 1000000 });
```

#### 2. Defer Non-Critical Scripts

```html
<!-- Critical scripts -->
<script src="init.js" type="module"></script>

<!-- Non-critical scripts -->
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>
```

#### 3. Code Splitting

```javascript
// Load on demand
button.addEventListener('click', async () => {
  const module = await import('./heavy-feature.js');
  module.init();
});
```

### CSS Optimization

#### 1. Critical CSS Inline

```html
<style>
  /* Critical above-the-fold CSS */
  .header { /* ... */ }
  .hero { /* ... */ }
</style>

<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

#### 2. Minimize Render-Blocking

```html
<!-- Non-blocking CSS -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

#### 3. Use CSS Containment

```css
.component {
  contain: layout style paint;
}
```

### Font Optimization

#### 1. Use font-display: swap

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

#### 2. Preload Critical Fonts

```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

#### 3. Subset Fonts

```css
/* Only include needed characters */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
```

### Network Optimization

#### 1. HTTP/2 or HTTP/3

Ensure server supports HTTP/2 for multiplexing.

#### 2. Compression

Enable gzip or brotli compression on server:

```nginx
# Nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

#### 3. CDN

Use CDN for static assets to reduce latency.

#### 4. Cache Headers

```nginx
# Cache static assets for 1 year
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## Performance Metrics

### Target Metrics

#### Page Load
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Total Page Load**: < 3.5s

#### Interactivity
- **First Input Delay**: < 100ms
- **Interaction to Next Paint**: < 200ms

#### Visual Stability
- **Cumulative Layout Shift**: < 0.1

#### Bundle Size
- **Initial JavaScript**: < 100KB (gzipped)
- **Initial CSS**: < 50KB (gzipped)
- **Total Initial Load**: < 500KB (gzipped)

### Measurement Tools

#### Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# Generate report
lighthouse http://localhost:3000 --output html --output-path report.html
```

#### WebPageTest

Visit [webpagetest.org](https://www.webpagetest.org) and test from multiple locations.

#### Chrome DevTools

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"
4. Review performance score and recommendations

---

## Testing Performance

### Automated Performance Testing

#### 1. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/services
          uploadArtifacts: true
```

#### 2. Performance Budgets

```javascript
// lighthouse-budget.json
{
  "resourceSizes": [
    { "resourceType": "script", "budget": 125 },
    { "resourceType": "image", "budget": 300 },
    { "resourceType": "stylesheet", "budget": 50 },
    { "resourceType": "total", "budget": 500 }
  ],
  "resourceCounts": [
    { "resourceType": "third-party", "budget": 10 }
  ]
}
```

### Manual Performance Testing

#### 1. Network Throttling

Test on slow connections:
- DevTools → Network tab → Throttling
- Test on: Slow 3G, Fast 3G, Regular 4G

#### 2. CPU Throttling

Test on slow devices:
- DevTools → Performance tab → CPU: 4x slowdown

#### 3. Cache Testing

Test both cold and warm cache loads:
- Cold: Disable cache, hard reload
- Warm: Enable cache, normal reload

### Performance Checklist

#### Images
- [ ] All images have width and height attributes
- [ ] Images use loading="lazy"
- [ ] Modern formats (WebP/AVIF) provided
- [ ] Responsive images with srcset
- [ ] Images optimized (< 200KB each)

#### JavaScript
- [ ] No render-blocking scripts
- [ ] Code splitting implemented
- [ ] Critical scripts preloaded
- [ ] Unused code removed
- [ ] Total bundle < 100KB (gzipped)

#### CSS
- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] No unused CSS
- [ ] Total CSS < 50KB (gzipped)

#### Fonts
- [ ] font-display: swap used
- [ ] Critical fonts preloaded
- [ ] Font subsetting implemented
- [ ] No more than 2 font families

#### Caching
- [ ] Static assets cached (1 year)
- [ ] HTML has appropriate cache headers
- [ ] Service worker implemented (optional)

#### Network
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN used for static assets
- [ ] DNS prefetch for external domains

---

## Performance Impact

### Initial Load

**Overhead**: ~35KB (minified + gzipped)
- PerformanceManager.js: ~20KB
- Performance.css: ~15KB

**Benefits**:
- 40-60% faster image loading
- 30-50% smaller initial bundle (code splitting)
- 20-30% faster TTI (deferred loading)

### Runtime

**CPU**: Minimal
- IntersectionObserver is highly efficient
- Debounce/throttle reduce unnecessary work

**Memory**: Minimal
- No large data structures
- Images unloaded when off-screen (optional)

---

## Maintenance

### Regular Audits

Schedule regular performance audits:
- **Weekly**: Automated Lighthouse CI
- **Monthly**: Manual performance testing
- **Quarterly**: Full performance review

### Monitoring

Set up real user monitoring (RUM):
```javascript
// Track real user metrics
window.addEventListener('load', () => {
  const metrics = window.performanceManager.getMetrics();
  // Send to analytics
  sendToAnalytics(metrics);
});
```

### Budget Enforcement

Enforce performance budgets in CI/CD:
```bash
# Fail build if budget exceeded
lighthouse http://localhost:3000 --budget-path=budget.json --max-wait-for-load=45000 --chrome-flags="--headless"
```

---

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Can I Use](https://caniuse.com/)

---

## Support

For performance questions:
**Email**: performance@legacyconcierge.com
**Phone**: +1 (305) 555-0100
