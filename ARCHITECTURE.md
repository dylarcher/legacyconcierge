# Legacy Concierge - Vanilla Web Components Architecture

## Overview

This is a complete rebuild of the Legacy Concierge website using modern vanilla JavaScript, CSS, and HTML with web components. The architecture emphasizes progressive enhancement, accessibility (WCAG 2.2 AAA), mobile-first design, and zero build dependencies.

## Architecture Principles

1. **HTML-First Progressive Enhancement** - Fully functional with just HTML/CSS, enhanced with JavaScript
2. **Mobile-First Responsive Design** - Built for mobile, enhanced for desktop
3. **Zero Build Step** - Pure vanilla JS/CSS/HTML, runs directly in browser
4. **WCAG 2.2 AAA Compliance** - Comprehensive accessibility features
5. **Design Token System** - Hierarchical CSS custom properties for theming
6. **Component Composition** - Reusable web components with template slots
7. **Internationalization** - Multi-language support (English/Spanish)
8. **Performance Optimized** - Code splitting, lazy loading, Core Web Vitals focus

## Project Structure

```
/Users/darcher/Dev/legacy-concierge/
├── src/
│   ├── tokens/                      # Design system tokens
│   │   ├── design-tokens.css       # Base tokens, semantic tokens, themes
│   │   ├── component-tokens.css    # Component-specific token overrides
│   │   └── base.css                # Base styles, reset, typography
│   │
│   ├── utilities/                   # Core utility modules
│   │   ├── path-resolver.js        # Path resolution for all environments
│   │   ├── template-loader.js      # HTML template loading & caching
│   │   ├── theme-manager.js        # Theme switching (light/dark) & system prefs
│   │   └── i18n.js                 # Internationalization engine
│   │
│   ├── components/                  # Web components
│   │   ├── base/                   # Base component classes
│   │   │   └── BaseComponent.js    # Foundation class for all components
│   │   │
│   │   ├── atomic/                 # Atomic components (buttons, icons, etc.)
│   │   │   ├── lc-button.js
│   │   │   ├── lc-icon.js
│   │   │   ├── lc-card.js
│   │   │   └── lc-image.js
│   │   │
│   │   ├── composite/              # Composite components
│   │   │   ├── lc-hero.js
│   │   │   ├── lc-section.js
│   │   │   ├── lc-modal.js
│   │   │   └── lc-slider.js
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── lc-layout.js
│   │   │   ├── lc-grid.js
│   │   │   └── lc-container.js
│   │   │
│   │   └── templates/              # HTML templates
│   │       ├── header.html
│   │       ├── footer.html
│   │       ├── hero.html
│   │       └── ...
│   │
│   ├── pages/                       # Page-specific code
│   │   ├── home-a.html             # Home variant A (Montegrapa-inspired)
│   │   ├── home-b.html             # Home variant B
│   │   ├── home-c.html             # Home variant C
│   │   ├── about-a.html
│   │   ├── contact-a.html
│   │   └── ...
│   │
│   ├── i18n/                        # Internationalization files
│   │   ├── en/                     # English translations
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── about.json
│   │   │   └── ...
│   │   └── es/                     # Spanish translations
│   │       └── [same structure]
│   │
│   └── assets/                      # Static assets
│       ├── icons/
│       ├── images/
│       └── fonts/
│
├── docs/                            # Documentation
│   └── components/                 # Component documentation
│
└── tests/                           # Test suite
    └── e2e/                        # End-to-end tests
```

## Core Systems

### 1. Design Token System

#### Hierarchy

```
Base Tokens → Semantic Tokens → Component Tokens
(primitives)   (contextual)      (specific)
```

#### Token Categories

- **Colors**: Primary, secondary, accent, neutral, status colors
- **Typography**: Font families, sizes (modular scale), weights, line heights
- **Spacing**: 8pt grid system (0.25rem increments)
- **Borders**: Radii, widths
- **Shadows**: Elevation system
- **Z-Index**: Stacking context scale
- **Transitions**: Duration and easing functions
- **Breakpoints**: Responsive design breakpoints

#### Theme Support

- **Light Theme** (default)
- **Dark Theme** (via `data-theme="dark"` or `prefers-color-scheme`)
- **System Preference Detection**
- **User Preference Persistence** (localStorage)

#### Accessibility Media Queries

All `prefers-*` media queries are supported:

- `prefers-color-scheme`: dark/light
- `prefers-reduced-motion`: reduce animations
- `prefers-contrast`: high/low contrast adjustments
- `prefers-reduced-transparency`: reduce opacity effects
- `prefers-reduced-data`: optimize for low bandwidth
- `forced-colors`: Windows High Contrast mode

#### Usage Example

```css
.my-component {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-base) var(--transition-ease-in-out);
}

.my-component:hover {
  box-shadow: var(--shadow-card-hover);
}
```

### 2. Path Resolver

Handles path resolution across development, production, and GitHub Pages environments.

#### Features

- Environment detection (local, production, GitHub Pages)
- Base path detection for deployed sites
- Relative path resolution based on page depth
- Asset path resolution
- i18n file path resolution
- Template path resolution

#### Usage Example

```javascript
import pathResolver from './utilities/path-resolver.js';

// Resolve absolute path
const imagePath = pathResolver.resolveAsset('images/hero.jpg');
// → /images/hero.jpg (local)
// → /legacy-concierge/images/hero.jpg (GitHub Pages)

// Resolve i18n file
const translationPath = pathResolver.resolveI18n('en', 'home');
// → /i18n/en/home.json

// Global helpers
const path = resolvePath('/about');
const asset = resolveAsset('icons/check.svg');
```

### 3. Template Loader

Loads and caches HTML templates for web components.

#### Features

- Template registration and loading
- Response caching
- Concurrent load handling
- Preloading support
- DOM template loading
- Direct insertion into elements

#### Usage Example

```javascript
import templateLoader from './utilities/template-loader.js';

// Load template
const template = await templateLoader.load('header');

// Load into element
await templateLoader.loadInto('footer', document.body);

// Preload multiple templates
await templateLoader.preload(['header', 'footer', 'hero']);

// Register custom template
templateLoader.register('my-component', 'src/components/templates/my-component.html');
```

### 4. Theme Manager

Manages theme switching, system preferences, and accessibility settings.

#### Features

- Light/dark theme switching
- System preference detection
- Theme persistence (localStorage)
- Accessibility preference detection
- Event listeners for preference changes
- Meta theme-color updates

#### Usage Example

```javascript
import themeManager from './utilities/theme-manager.js';

// Set theme
themeManager.setTheme('dark');

// Toggle theme
themeManager.toggle();

// Get current theme
const theme = themeManager.getTheme(); // 'light' or 'dark'

// Check system preference
const systemPref = themeManager.getSystemPreference();

// Get accessibility preferences
const preferences = themeManager.getAllPreferences();
// {
//   theme: 'dark',
//   systemPreference: 'dark',
//   reducedMotion: false,
//   highContrast: false,
//   ...
// }

// Add listener
themeManager.addListener((event, data) => {
  console.log('Theme changed:', data);
});

// Global helpers
setTheme('light');
toggleTheme();
```

### 5. i18n Engine

Internationalization system with translation loading and DOM application.

#### Features

- Multi-language support (English, Spanish)
- Locale detection (localStorage → browser → default)
- Translation file loading with caching
- Nested key support (`page.section.title`)
- Array notation support (`items[0].name`)
- DOM application via `data-i18n` attributes
- Attribute translation (`data-i18n-attr`)
- HTML content translation (`data-i18n-html`)
- Meta tag updates
- Placeholder replacement
- Fallback to default locale

#### Translation File Structure

```json
{
  "meta": {
    "title": "Home - Legacy Concierge",
    "description": "Premium in-home nursing care..."
  },
  "hero": {
    "title": "Compassionate Care at Home",
    "subtitle": "Expert nursing services..."
  },
  "services": {
    "items": [
      {
        "title": "Post-Surgical Recovery",
        "description": "..."
      }
    ]
  }
}
```

#### Usage Example

```html
<!-- Simple text translation -->
<h1 data-i18n="hero.title"></h1>

<!-- Nested key -->
<p data-i18n="services.items[0].description"></p>

<!-- Attribute translation -->
<img data-i18n-attr="alt:hero.imageAlt; title:hero.imageTitle" />

<!-- HTML content (use cautiously) -->
<div data-i18n-html="content.richText"></div>
```

```javascript
import i18n from './utilities/i18n.js';

// Get translation
const title = i18n.t('hero.title', 'home');

// With replacements
const welcome = i18n.t('welcome.message', 'common', { name: 'John' });
// "Hello, {{name}}!" → "Hello, John!"

// Change locale
await i18n.setLocale('es');

// Apply translations to page
await i18n.apply(document.body, 'home');

// Global helpers
const text = t('key', 'page');
await setLocale('es');
```

### 6. Base Component

Foundation class for all web components. Extends `HTMLElement` with common functionality.

#### Features

- Lifecycle management
- Template loading integration
- i18n integration
- Event listener management with auto-cleanup
- Shadow DOM support
- Query selectors (`$`, `$$`)
- Attribute helpers (getAttr, getBoolAttr, getNumAttr, getJsonAttr)
- Visibility helpers (show, hide, toggle)
- Custom event emission
- Automatic resource cleanup

#### Usage Example

```javascript
import BaseComponent from './base/BaseComponent.js';

class MyComponent extends BaseComponent {
  constructor() {
    super();
    this.templateName = 'my-component'; // Optional
    this.useShadowDOM = false; // Optional
  }

  // Override lifecycle hooks
  async render() {
    await super.render();

    // Custom render logic
    this.$('.my-button').textContent = this.getAttr('label', 'Click me');
  }

  setupEventListeners() {
    // Auto-cleanup on disconnect
    this.on('.my-button', 'click', () => {
      this.emit('button-clicked', { value: 'hello' });
    });
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (name === 'label') {
      this.rerender();
    }
  }
}

// Register component
customElements.define('my-component', MyComponent);
```

#### Observed Attributes

```javascript
// Define in subclass
static get observedAttributes() {
  return ['label', 'disabled', 'variant'];
}
```

## Component Architecture

### Component Categories

1. **Base Components** - Abstract foundation classes
2. **Atomic Components** - Smallest reusable units (buttons, icons, inputs)
3. **Composite Components** - Combinations of atomic components (cards, modals)
4. **Layout Components** - Page structure components (grids, containers, sections)
5. **Templates** - HTML template files loaded by components

### Component Naming Convention

- Prefix: `lc-` (Legacy Concierge)
- Pattern: `lc-{component-name}`
- Examples: `lc-button`, `lc-hero`, `lc-card`

### Component Communication

1. **Props** (Attributes) - Parent → Child
2. **Events** (Custom Events) - Child → Parent
3. **Slots** - Content projection
4. **Global State** - Via utilities (theme, i18n)

### Example Component Structure

```javascript
import BaseComponent from '../base/BaseComponent.js';

/**
 * Button Component
 * @element lc-button
 * @attr {string} variant - Button style variant (primary|secondary|outline|ghost)
 * @attr {string} size - Button size (sm|base|lg)
 * @attr {boolean} disabled - Disabled state
 * @fires click - Emitted when button is clicked
 */
class Button extends BaseComponent {
  static get observedAttributes() {
    return ['variant', 'size', 'disabled'];
  }

  constructor() {
    super();
    this.templateName = 'button';
  }

  async render() {
    // Render logic
  }

  setupEventListeners() {
    this.on('this', 'click', this.handleClick.bind(this));
  }

  handleClick(event) {
    if (this.getBoolAttr('disabled')) {
      event.preventDefault();
      return;
    }
    this.emit('button-click', { button: this });
  }
}

customElements.define('lc-button', Button);
```

## Progressive Enhancement Strategy

### HTML-First Approach

1. **Base HTML** - Semantic, accessible, fully functional
2. **CSS Enhancement** - Progressive visual improvements
3. **JavaScript Enhancement** - Interactive features

### Example

```html
<!-- HTML only: functional link -->
<a href="/contact" class="button">Contact Us</a>

<!-- CSS: styled as button -->
<style>
  .button {
    display: inline-block;
    padding: var(--button-padding-y) var(--button-padding-x);
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
    /* ... */
  }
</style>

<!-- JavaScript: enhanced with component -->
<lc-button variant="primary" href="/contact">
  Contact Us
</lc-button>
```

## Responsive Design

### Mobile-First Approach

Start with mobile styles, add complexity for larger screens.

```css
/* Mobile (default) */
.component {
  padding: var(--space-4);
  font-size: var(--font-size-base);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
    font-size: var(--font-size-md);
  }
}
```

### Container Queries

Use for component-level responsiveness:

```css
@container (min-width: 480px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

## Accessibility Features

### WCAG 2.2 AAA Compliance

- **Keyboard Navigation** - All interactive elements accessible via keyboard
- **Focus Management** - Visible focus indicators, logical focus order
- **Screen Reader Support** - Semantic HTML, ARIA labels, live regions
- **Color Contrast** - AAA contrast ratios (7:1 for normal text)
- **Touch Targets** - Minimum 44×44px touch targets
- **Alt Text** - Descriptive alternative text for images
- **Form Labels** - Associated labels for all form inputs
- **Error Identification** - Clear, accessible error messages
- **Skip Links** - Skip to main content links

### ARIA Patterns

```html
<!-- Button -->
<button aria-label="Close dialog" aria-pressed="false">×</button>

<!-- Navigation -->
<nav aria-label="Main navigation">...</nav>

<!-- Tabs -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
</div>
<div role="tabpanel" id="panel-1">...</div>

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true">Loading...</div>
```

## Performance Optimization

### Strategies

1. **Code Splitting** - ES modules with dynamic imports
2. **Lazy Loading** - Components and images loaded on demand
3. **Template Caching** - Loaded templates cached in memory
4. **CSS Custom Properties** - No runtime CSS-in-JS overhead
5. **Minimal JavaScript** - Vanilla JS, no framework bloat
6. **Optimized Assets** - Compressed images, SVG icons
7. **Preloading** - Critical resources preloaded
8. **Service Worker** - Cache static assets (future enhancement)

### Lazy Loading Example

```javascript
// Lazy load component
const loadHeroComponent = () => import('./components/composite/lc-hero.js');

// Load when needed
if (document.querySelector('lc-hero')) {
  await loadHeroComponent();
}
```

## Page Layout System

### Montegrapa-Inspired Layouts

#### Home Page Variants

- **Home A** - Video hero, feature grid, testimonials
- **Home B** - Image carousel hero, service cards, CTA section
- **Home C** - Split hero, highlighted features, blog preview

#### Section Types

- **Hero** - Full-width background, video/image support
- **Feature Grid** - Multi-column feature showcase
- **Service Cards** - Card-based service presentation
- **Testimonials** - Customer testimonials with photos
- **CTA (Call-to-Action)** - Prominent conversion sections
- **Blog Preview** - Latest blog posts grid
- **Contact Form** - Multi-step form with validation

#### Template Regions

- **Banner** - Global navigation (header component)
- **Hero** - Page hero section
- **Main** - Primary page content (multiple sections)
- **Aside** - Sidebar content (optional)
- **Footer** - Global footer component

## Development Workflow

### Local Development

```bash
# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

### File Organization

- Keep components small and focused
- One component per file
- Colocate templates with components
- Use consistent naming conventions
- Document components with JSDoc

### Testing

```bash
# Run E2E tests
npm test

# Run specific test
npm test -- tests/e2e/home.spec.js

# Run in UI mode
npm run test:ui
```

## Migration from Old System

### Preserved Assets

- ✅ i18n translations (30+ JSON files)
- ✅ Icon library (120+ SVG icons)
- ✅ Image assets
- ✅ Brand colors and typography

### New Additions

- ✅ Design token system
- ✅ Component architecture
- ✅ Modern utilities
- ✅ Accessibility features
- ✅ Performance optimizations

## Future Enhancements

- Service Worker for offline support
- Web App Manifest for PWA
- Animation system (GSAP-inspired)
- Advanced form validation
- Enhanced analytics integration
- Blog CMS integration
- Search functionality

## Resources

- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
