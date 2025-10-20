# Technical Architecture

**Project:** Legacy Concierge
**Last Updated:** October 20, 2025
**Architecture Version:** 1.0

---

## Overview

Legacy Concierge is built as a static website using vanilla web technologies with modern patterns. The architecture prioritizes accessibility, maintainability, and progressive enhancement while avoiding framework dependencies.

---

## Core Principles

1. **Vanilla First** - No frameworks, build with web standards
2. **Progressive Enhancement** - Works without JavaScript where possible
3. **Accessibility First** - WCAG 2.2 AA compliance built-in
4. **Light DOM** - Components use global CSS for easier styling
5. **Performance** - Target 95+ Lighthouse scores across all metrics

---

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup with Schema.org microdata
- **CSS3** - Modern CSS with custom properties, grid, flexbox
- **Vanilla JavaScript** - ES6+ modules, no frameworks
- **Web Components** - Custom Elements API (Light DOM architecture)

### Development Tools
- **Biome** - Code formatting and linting
- **ESM Modules** - Native JavaScript modules
- **HTTP Server** - Local development (Python/Node.js)

### Standards Compliance
- **WCAG 2.2 AA** - Accessibility compliance target
- **Schema.org** - Structured data for SEO
- **WAI-ARIA** - Accessibility attributes
- **i18n** - Internationalization (English/Spanish)

---

## Directory Structure

```
legacy-concierge/
├── components/              # Web Components (Custom Elements)
│   ├── templates/           # HTML <template> definitions
│   │   ├── navigation.html  # Header, footer, nav, breadcrumb
│   │   ├── cards.html       # Card component variants
│   │   └── ui-elements.html # Badges, tags, tooltips
│   ├── scripts/             # Component implementations
│   │   ├── lc-header.js     # <lc-header> component
│   │   ├── lc-footer.js     # <lc-footer> component
│   │   └── lc-card.js       # <lc-card> component + grids
│   └── styles/              # Component-specific CSS (optional)
│
├── layouts/                 # Page layout templates
│   └── homepage-video.html  # Fullscreen video background layout
│
├── pages/                   # Site pages organized by section
│   ├── about/
│   ├── treatments/
│   │   └── views/           # Treatment detail pages
│   ├── expertise/
│   │   └── views/           # Expertise detail pages
│   ├── blog/
│   │   ├── posts/
│   │   └── categories/
│   ├── contact/
│   ├── team/
│   └── [other sections]/
│
├── scripts/                 # Core JavaScript modules
│   ├── core/
│   │   ├── component-loader.js  # Template loading system
│   │   └── helpers.js       # Utility functions
│   ├── app.js               # Navigation, mobile menu, interactions
│   ├── i18n.js              # Internationalization engine
│   ├── theme.js             # Dark/light mode management
│   └── language-switcher.js # Language selection (class-based)
│
├── styles/                  # CSS organization
│   ├── style.css            # Global styles (current monolith)
│   ├── layouts/             # Layout-specific CSS (planned)
│   └── utilities/           # Utility classes (planned)
│
├── _locale/                 # Translation files
│   ├── en/                  # English translations
│   │   ├── common.json      # Navigation, footer, accessibility
│   │   ├── home.json        # Homepage translations
│   │   ├── treatments-detail.json  # Shared by all treatment pages
│   │   └── [page].json      # Page-specific translations
│   └── es/                  # Spanish translations
│       └── [same structure]
│
├── assets/                  # Static assets
│   ├── images/              # Image files (categorized)
│   │   ├── team/
│   │   ├── treatments/
│   │   └── conditions/
│   ├── videos/              # Video files
│   └── media/               # Other media
│
└── docs/                    # Documentation
    ├── GETTING_STARTED.md
    ├── ROADMAP.md
    ├── ARCHITECTURE.md (this file)
    └── archive/             # Archived documentation

```

---

## Component Architecture

### Light DOM Custom Elements

**Why Light DOM over Shadow DOM:**
- Global CSS integration - components inherit site styles
- Easier debugging and inspection
- Better CSS cascade control
- Simpler theming and customization
- No style duplication

**Component Structure:**
```javascript
class LCCard extends HTMLElement {
    connectedCallback() {
        // Load template
        const template = document.getElementById('lc-card-template');
        const content = template.content.cloneNode(true);

        // No Shadow DOM - append directly to element
        this.appendChild(content);

        // Add variant classes
        const variant = this.getAttribute('variant');
        if (variant) this.classList.add(`card-${variant}`);

        // Apply data attributes, event listeners, etc.
    }
}
customElements.define('lc-card', LCCard);
```

### Template Loading System

**Hybrid Approach:**
- Critical templates (header, footer) can be inline in HTML
- Optional templates loaded via JavaScript
- Template caching to prevent re-fetching
- Promise-based async loading

**component-loader.js functions:**
```javascript
// Load single template
await loadTemplate('navigation');

// Load multiple templates
await loadTemplates(['navigation', 'cards']);

// Initialize components
await initializeComponents(['navigation', 'cards']);

// Get template element
const template = getTemplate('lc-card-template');

// Clone template content
const clone = cloneTemplate('lc-card-template');
```

### Slot-Based Content

Components use named slots for flexible content structure:

```html
<lc-card variant="service">
    <img slot="image" src="..." alt="...">
    <h3 slot="title">Service Title</h3>
    <p slot="description">Description text</p>
    <a slot="actions" href="..." class="cta-button">Learn More</a>
</lc-card>
```

---

## Internationalization (i18n)

### Architecture

**Translation File Organization:**
- Split by language (`en/`, `es/`)
- Common translations in `common.json` (nav, footer, accessibility)
- Page-specific translations in separate files
- Shared translations for similar pages (e.g., `treatments-detail.json`)

**Path Calculation:**
```javascript
// Automatic relative path calculation based on directory depth
// Root (depth 0): _locale
// pages/about/ (depth 2): ../../_locale
// pages/treatments/views/post-op/ (depth 4): ../../../../_locale
```

**Translation Keys:**
```javascript
// Dot notation for nested keys
data-i18n="navigation.home"
data-i18n="treatments-detail.post-op-recovery.title"

// Bracket notation for arrays
data-i18n="infoCards[0].title"

// Attribute translation
data-i18n-attr="aria-label:accessibility.skipToMain"
```

### Language Detection & Persistence
1. Check localStorage for `preferred-language`
2. Fall back to browser language (`navigator.language`)
3. Default to English if no match
4. Persist selection to localStorage

---

## Styling Architecture

### Current Approach
- **Monolithic CSS**: Single `styles/style.css` file
- **CSS Custom Properties**: Theme variables for colors, spacing
- **Media Queries**: `prefers-color-scheme` for dark mode
- **Flexbox/Grid**: Modern layout techniques

### Planned Evolution
```css
/* Global CSS variables */
:root {
    --brand-hue: 210;
    --brand-saturation: 1;
    --brand-lightness: .36;
    --bg-primary: oklch(98% 0.02 var(--brand-hue));
    --text-primary: oklch(20% 0.02 var(--brand-hue));
    /* ... more variables */
}

/* Dark mode */
[data-theme="dark"] {
    --bg-primary: oklch(15% 0.02 var(--brand-hue));
    --text-primary: oklch(95% 0.02 var(--brand-hue));
}
```

### Modern CSS Patterns (Preferred for New Code)
- **Container Queries** over media queries where applicable
- **Grid** for high-level page structures
- **Flexbox** for low-level component alignment
- **@supports** for progressive enhancement
- **Pseudo-properties** to reduce complexity

### Responsive Design
```css
/* Comprehensive media query support */
@media (prefers-color-scheme: dark) { }
@media (prefers-contrast: more) { }
@media (prefers-reduced-motion: reduce) { }
@media (prefers-reduced-data: reduce) { }
```

---

## JavaScript Architecture

### Module System

**Current (Legacy):**
- Traditional `<script>` tags
- Global scope variables
- Event-driven with `DOMContentLoaded`

**Preferred (New Code):**
```javascript
// ESM modules
import { initializeComponents } from '/scripts/core/component-loader.js';
import { debounce, sanitizeHTML } from '/scripts/core/helpers.js';

// Export functions
export function myFunction() { }
export default ComponentLoader;
```

### Async Patterns

**Preferred:**
```javascript
// Promise.try over async/await where appropriate
Promise.try(() => loadData())
    .then(process)
    .catch(handleError);

// for...of over forEach/traditional loops
for (const item of items) {
    await processItem(item);
}
```

### State Management

**Current:**
- `localStorage` for theme (`preferred-theme`)
- `localStorage` for language (`preferred-language`)

**Planned (Phase 2):**
- **IndexedDB** for complex state
- **localStorage fallback** for progressive enhancement
- Structured state objects
- Event-based state updates

### Performance Optimizations

**Utility Functions:**
```javascript
// Debounce expensive operations
const handleResize = debounce(() => {
    // expensive operation
}, 250);

// Throttle scroll handlers
const handleScroll = throttle(() => {
    // scroll operation
}, 100);
```

**Future:**
- **Web Workers** for heavy computations
- **Generators** for large data processing
- **WeakMap/WeakSet** for memory efficiency

---

## Accessibility Architecture

### WCAG 2.2 AA Compliance

**Required Features:**
- Semantic HTML5 elements
- Skip links on all pages
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Proper heading hierarchy (h1-h6)
- Alt text for images
- Form labels and error messages
- Color contrast ratios (4.5:1 normal text, 3:1 large text)

**Keyboard Navigation:**
- Tab - Navigate interactive elements
- Shift+Tab - Navigate backwards
- Arrow keys - Navigate dropdowns
- Escape - Close menus
- Enter/Space - Activate elements

**Screen Reader Support:**
- `aria-label` for non-visible labels
- `aria-expanded` for expandable sections
- `aria-haspopup` for menus with submenus
- `aria-live` for dynamic updates
- Proper landmark roles (`banner`, `navigation`, `main`, `contentinfo`)

---

## Data Architecture

### Schema.org Microdata

**Structured Data on Every Page:**
```html
<body itemscope itemtype="http://schema.org/WebPage">
    <article itemscope itemtype="http://schema.org/Article">
        <h1 itemprop="headline">Title</h1>
        <p itemprop="description">Description</p>
        <meta itemprop="datePublished" content="2025-10-20">
    </article>
</body>
```

**Common Schema Types:**
- `WebPage` - Generic pages
- `Article` - Blog posts, detail pages
- `AboutPage` - About page
- `ContactPage` - Contact page
- `MedicalBusiness` - Organization data
- `Person` - Team members

---

## Build & Development

### Development Environment

**Requirements:**
- Modern browser (Chrome/Firefox/Safari latest 2 versions)
- HTTP server (Python 3, Node.js, or similar)
- Text editor (VS Code recommended)

**Development Server:**
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```

### Code Quality

**Biome Configuration:**
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

**Commands:**
```bash
# Format code
npx @biomejs/biome format --write .

# Lint code
npx @biomejs/biome lint .
```

---

## Performance Architecture

### Target Metrics
- **Lighthouse Performance:** 95+
- **Lighthouse Accessibility:** 95+
- **Lighthouse Best Practices:** 95+
- **Lighthouse SEO:** 95+
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Total Blocking Time (TBT):** < 300ms
- **Cumulative Layout Shift (CLS):** < 0.1

### Optimization Strategies

**Images:**
- Appropriate formats (JPEG for photos, PNG for graphics, SVG for icons)
- Responsive images with `srcset`
- Lazy loading for below-fold images
- Proper sizing and compression

**CSS:**
- Critical CSS inline in `<head>`
- Non-critical CSS deferred
- CSS custom properties for theming
- Minimal specificity

**JavaScript:**
- ES6 modules for code splitting
- Defer non-critical scripts
- Debounce/throttle expensive operations
- Minimize DOM manipulation

**Fonts:**
- Subset fonts to required characters
- `font-display: swap` for FOUT
- Preload critical fonts

---

## Security Considerations

### XSS Prevention
```javascript
// Sanitize user input
import { sanitizeHTML } from '/scripts/core/helpers.js';
const safe = sanitizeHTML(userInput);
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### HTTPS
- Production site must use HTTPS
- No mixed content
- Secure cookies if authentication added

---

## Browser Support

### Target Browsers
- Chrome/Edge (Chromium) - Latest 2 versions
- Firefox - Latest 2 versions
- Safari (macOS/iOS) - Latest 2 versions

### Required Features
- Custom Elements V1
- ES6 Modules
- CSS Grid & Flexbox
- CSS Custom Properties
- Fetch API
- LocalStorage

### Progressive Enhancement
- Core content accessible without JavaScript
- Critical styles inline
- Polyfills available for older browsers (if needed)

---

## Testing Architecture (Planned)

### Testing Levels

**Unit Tests:**
- Utility functions (`helpers.js`)
- Component logic
- i18n system
- Theme management

**Integration Tests:**
- Component interactions
- Template loading
- Language switching
- Navigation behavior

**End-to-End Tests:**
- User workflows
- Form submissions
- Multi-page navigation
- Accessibility compliance

**Visual Regression:**
- Component snapshots
- Layout consistency
- Theme switching
- Responsive breakpoints

### Testing Tools (To Be Selected)
- **Unit/Integration:** Vitest or Jest
- **E2E:** Playwright or Cypress
- **Accessibility:** axe-core or Pa11y
- **Visual:** Percy or Chromatic

---

## Deployment Architecture (Planned)

### Static Hosting Options
- **Netlify** - Automatic deploys, CDN, forms
- **Vercel** - Edge functions, analytics
- **GitHub Pages** - Simple, free hosting
- **Cloudflare Pages** - Global CDN, fast

### CI/CD Pipeline (Planned)
```yaml
# GitHub Actions workflow
on: [push, pull_request]
jobs:
  test:
    - Lint code (Biome)
    - Run tests
    - Check accessibility
    - Lighthouse CI
  deploy:
    - Build (if needed)
    - Deploy to hosting platform
```

---

## Design Tokens (Planned)

### Color System
```javascript
{
  "color": {
    "brand": {
      "hue": 210,
      "saturation": 1,
      "lightness": 0.36
    },
    "text": {
      "primary": "oklch(20% 0.02 210)",
      "secondary": "oklch(40% 0.02 210)"
    },
    "background": {
      "primary": "oklch(98% 0.02 210)",
      "secondary": "oklch(95% 0.02 210)"
    }
  }
}
```

### Typography
```javascript
{
  "font": {
    "family": {
      "base": "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "heading": "Georgia, serif"
    },
    "size": {
      "base": "16px",
      "scale": 1.25
    }
  }
}
```

---

## Migration Path

### From Legacy to Components

**Phase 1:** Create component templates and scripts ✅
**Phase 2:** Integrate components into new pages
**Phase 3:** Migrate existing pages one-by-one
**Phase 4:** Remove legacy HTML patterns
**Phase 5:** Optimize and consolidate

### Backward Compatibility
- Old pages continue to work during migration
- Components don't break existing functionality
- Gradual migration reduces risk

---

## Future Considerations

### Progressive Web App (PWA)
- Service Worker for offline support
- Web App Manifest
- Add to home screen
- Push notifications (if needed)

### Advanced Features
- **IndexedDB** - Client-side data storage
- **Web Workers** - Background processing
- **WebSocket** - Real-time updates (if needed)
- **Intersection Observer** - Lazy loading, scroll effects

### Content Management
- Headless CMS integration possibility
- Static site generator integration
- API-based content delivery

---

## Key Architectural Decisions

### Decision Log

**1. Vanilla JavaScript over Frameworks**
- **Why:** Longevity, performance, simplicity, no dependencies
- **Trade-off:** More boilerplate, less ecosystem support
- **Status:** Committed

**2. Light DOM over Shadow DOM**
- **Why:** Global CSS integration, easier debugging, simpler theming
- **Trade-off:** Less encapsulation, potential style conflicts
- **Status:** Committed

**3. Component-based architecture**
- **Why:** Reusability, maintainability, consistency
- **Trade-off:** Initial setup complexity
- **Status:** Committed

**4. Static site over dynamic server**
- **Why:** Performance, simplicity, security, low cost
- **Trade-off:** Limited dynamic features
- **Status:** Committed

**5. Vanilla i18n over library**
- **Why:** Control, no dependencies, simple requirements
- **Trade-off:** More code to maintain
- **Status:** Committed

---

## References

- **Custom Elements Spec:** https://html.spec.whatwg.org/multipage/custom-elements.html
- **ES Modules:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **Schema.org:** https://schema.org/
- **ARIA Practices:** https://www.w3.org/WAI/ARIA/apg/

---

**This architecture is living documentation. Update as decisions change and patterns evolve.**
