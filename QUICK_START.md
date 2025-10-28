# Quick Start Guide

## Getting Started with the New Architecture

### Prerequisites

- Python 3 (for local dev server)
- Modern browser (Chrome 88+, Firefox 85+, Safari 14+)
- Text editor/IDE

### Running the Example Page

1. **Start the local development server:**

```bash
cd /Users/darcher/Dev/legacy-concierge
python3 -m http.server 8000
```

2. **Open your browser:**

```
http://localhost:8000/src/pages/example.html
```

3. **Try the features:**
   - Click the theme toggle button (bottom right) to switch between light/dark themes
   - Click the language toggle button (bottom left) to switch between EN/ES
   - Interact with the various button styles
   - Open browser DevTools console to see logs
   - Try keyboard navigation (Tab key)
   - Test with screen reader

### Understanding the Example Page

The example page demonstrates:

- ✅ Design token system in action
- ✅ Theme switching (light/dark)
- ✅ Language switching (EN/ES)
- ✅ Web component usage (`<lc-button>`)
- ✅ Responsive design (resize browser)
- ✅ Accessibility features
- ✅ Progressive enhancement

### File Structure Overview

```
src/
├── tokens/                   # Design system
│   ├── design-tokens.css    # All design tokens
│   ├── component-tokens.css # Component overrides
│   └── base.css             # Base styles
│
├── utilities/                # Core functionality
│   ├── path-resolver.js     # Path resolution
│   ├── template-loader.js   # Template loading
│   ├── theme-manager.js     # Theme switching
│   └── i18n.js              # Translations
│
├── components/
│   ├── base/
│   │   └── BaseComponent.js # Base class
│   └── atomic/
│       └── lc-button.js     # Button component
│
├── pages/
│   └── example.html         # Example page
│
└── i18n/                     # Translations
    ├── en/                  # English
    └── es/                  # Spanish
```

### Creating Your First Component

1. **Create the component file:**

```javascript
// src/components/atomic/lc-card.js
import BaseComponent from '../base/BaseComponent.js';

class LCCard extends BaseComponent {
  constructor() {
    super();
    this.useShadowDOM = false;
  }

  async render() {
    const variant = this.getAttr('variant', 'default');

    this.innerHTML = `
      <div class="lc-card lc-card--${variant}">
        <div class="lc-card__content">
          ${this.innerHTML}
        </div>
      </div>
    `;

    this.applyStyles();
  }

  applyStyles() {
    if (document.getElementById('lc-card-styles')) return;

    const style = document.createElement('style');
    style.id = 'lc-card-styles';
    style.textContent = `
      .lc-card {
        padding: var(--card-padding);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
      }
    `;
    document.head.appendChild(style);
  }
}

customElements.define('lc-card', LCCard);
export default LCCard;
```

2. **Use it in HTML:**

```html
<lc-card variant="elevated">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</lc-card>
```

3. **Import it:**

```html
<script type="module">
  import '../components/atomic/lc-card.js';
</script>
```

### Creating Your First Page

1. **Copy the example template:**

```bash
cp src/pages/example.html src/pages/my-page.html
```

2. **Edit the content:**

```html
<!-- Update title -->
<title>My Page - Legacy Concierge</title>

<!-- Update content -->
<h1 data-i18n="mypage.hero.title">My Page Title</h1>
```

3. **Create translations:**

```json
// src/i18n/en/mypage.json
{
  "hero": {
    "title": "My Page Title"
  }
}
```

4. **Update script:**

```javascript
await i18n.apply(document.body, 'mypage');
```

### Using Design Tokens

Design tokens are CSS custom properties that make styling consistent:

```css
/* Use semantic tokens */
.my-component {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

/* Responsive with tokens */
@media (min-width: 768px) {
  .my-component {
    padding: var(--space-8);
  }
}

/* Button tokens */
.my-button {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}
```

### Available Design Tokens

#### Colors
- `--color-primary-{50-900}` - Primary color scale
- `--color-secondary-{50-900}` - Secondary color scale
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--bg-page`, `--bg-surface`, `--bg-surface-secondary`

#### Spacing
- `--space-{1-64}` - 8pt grid (1 = 4px, 2 = 8px, etc.)

#### Typography
- `--font-size-{xs-5xl}` - Modular scale
- `--font-weight-{light-extrabold}`
- `--line-height-{tight-loose}`

#### Borders & Radius
- `--radius-{sm-full}` - Border radius values
- `--border-{default|light|strong}`

#### Shadows
- `--shadow-{xs-2xl}` - Elevation system

#### Component Tokens
- `--button-*` - Button component tokens
- `--card-*` - Card component tokens
- `--input-*` - Input component tokens
- And many more...

### Using Utilities

#### Path Resolver

```javascript
import pathResolver from '../utilities/path-resolver.js';

// Resolve paths
const imagePath = pathResolver.resolveAsset('images/hero.jpg');
const i18nPath = pathResolver.resolveI18n('en', 'home');

// Global helpers
const path = resolvePath('/about');
```

#### Theme Manager

```javascript
import themeManager from '../utilities/theme-manager.js';

// Set theme
themeManager.setTheme('dark');

// Toggle theme
themeManager.toggle();

// Get theme
const theme = themeManager.getTheme();

// Listen for changes
themeManager.addListener((event, data) => {
  console.log('Theme changed:', data);
});

// Global helpers
setTheme('light');
toggleTheme();
```

#### i18n

```javascript
import i18n from '../utilities/i18n.js';

// Get translation
const text = i18n.t('hero.title', 'home');

// With replacements
const welcome = i18n.t('welcome', 'common', { name: 'John' });

// Change locale
await i18n.setLocale('es');

// Apply to DOM
await i18n.apply(document.body, 'home');

// Global helpers
const text = t('key', 'page');
await setLocale('es');
```

#### Template Loader

```javascript
import templateLoader from '../utilities/template-loader.js';

// Load template
const template = await templateLoader.load('header');

// Preload templates
await templateLoader.preload(['header', 'footer']);
```

### Accessibility Checklist

When building components, ensure:

- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 7:1 (AAA)
- [ ] Touch targets ≥ 44×44px
- [ ] Alt text for images
- [ ] Form labels associated
- [ ] Error messages clear
- [ ] Screen reader tested

### Performance Tips

1. **Lazy load components:**
```javascript
const loadComponent = () => import('./components/atomic/lc-card.js');
if (document.querySelector('lc-card')) {
  await loadComponent();
}
```

2. **Preload critical resources:**
```html
<link rel="preload" href="fonts/font.woff2" as="font" crossorigin>
```

3. **Use Intersection Observer:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Load component
    }
  });
});
```

### Testing

Run E2E tests (when implemented):

```bash
npm test
npm run test:ui
```

### Browser DevTools

Use browser DevTools to:

- Inspect component structure
- Check design token values
- Debug event listeners
- Monitor performance
- Test accessibility

### Common Issues & Solutions

**Issue:** Styles not applying
- **Solution:** Check token imports in HTML `<head>`

**Issue:** Component not registering
- **Solution:** Verify `customElements.define()` is called

**Issue:** Translations not loading
- **Solution:** Check JSON file path and syntax

**Issue:** Theme not switching
- **Solution:** Verify token imports and `data-theme` attribute

### Next Steps

1. Read `ARCHITECTURE.md` for deep dive
2. Read `REBUILD_SUMMARY.md` for progress overview
3. Build remaining components
4. Create page templates
5. Add tests
6. Deploy!

### Resources

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Get Help

- Check console logs for errors
- Review component JSDoc comments
- Refer to example page source
- Review architecture documentation

Happy building! 🚀
