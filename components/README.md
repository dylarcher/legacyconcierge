# Legacy Concierge Web Components

This directory contains reusable Web Components built using Vanilla JavaScript Custom Elements with Light DOM for better global CSS integration.

## 📁 Directory Structure

```
components/
├── templates/       # HTML <template> definitions
├── scripts/         # JavaScript component definitions
└── styles/          # Component-specific CSS (optional)
```

## 🚀 Quick Start

### 1. Load Core Utilities

Add to your HTML `<head>` or before `</body>`:

```html
<script type="module" src="/script/core/component-loader.js"></script>
<script type="module" src="/script/core/helpers.js"></script>
```

### 2. Load Required Templates

Templates are loaded automatically when components are used, or manually:

```javascript
// Automatic (recommended)
import { initializeComponents } from '/script/core/component-loader.js';
await initializeComponents(['navigation', 'cards']);

// Manual
<script>
  ComponentLoader.loadTemplates(['navigation', 'footer', 'cards']).then(() => {
    console.log('Templates loaded!');
  });
</script>
```

### 3. Use Components

```html
<!-- Header -->
<lc-header solid></lc-header>

<!-- Cards -->
<lc-card variant="service" href="/services/nursing" animated>
  <img slot="image" src="/images/service.jpg" alt="Service">
  <h3 slot="title">In-Home Nursing</h3>
  <p slot="description">Compassionate care in the comfort of your home.</p>
  <a slot="actions" href="/services/nursing" class="cta-button">Learn More</a>
</lc-card>

<!-- Card Grid -->
<lc-card-grid columns="3" gap="2rem">
  <lc-card variant="info">...</lc-card>
  <lc-card variant="info">...</lc-card>
  <lc-card variant="info">...</lc-card>
</lc-card-grid>

<!-- Bento Grid (masonry-style) -->
<lc-bento-grid pattern="default">
  <lc-card variant="bento">...</lc-card>
  <lc-card variant="bento">...</lc-card>
</lc-bento-grid>

<!-- Footer -->
<lc-footer></lc-footer>
```

## 🧩 Available Components

### Navigation

#### `<lc-header>`
Main site header with navigation.

**Attributes:**
- `solid` - Apply solid background (no hero section)
- `variant` - Header style variant (default, minimal, etc.)

**Example:**
```html
<lc-header solid></lc-header>
```

#### `<lc-footer>`
Site footer with copyright.

**Attributes:**
- `variant` - Footer style variant

**Example:**
```html
<lc-footer variant="extended"></lc-footer>
```

### Cards

#### `<lc-card>`
Versatile card component with multiple variants.

**Attributes:**
- `variant` - Card type: `base`, `info`, `service`, `team`, `testimonial`, `blog`, `bento`
- `href` - Make entire card clickable
- `target` - Link target (`_self`, `_blank`)
- `elevation` - Shadow depth (1-5)
- `animated` - Enable scroll fade-in animation

**Slots:**
- `image` - Card image
- `title` - Card title
- `description` / `body` - Main content
- `actions` - Action buttons/links
- For specific variants, see templates

**Examples:**
```html
<!-- Info Card -->
<lc-card variant="info">
  <h4 slot="title">24/7 Care</h4>
  <p>Round-the-clock nursing support when you need it.</p>
</lc-card>

<!-- Service Card -->
<lc-card variant="service" href="/services/post-op" animated>
  <img slot="image" src="/images/post-op.jpg" alt="Post-Op Care">
  <h3 slot="title">Post-Op Recovery</h3>
  <p slot="description">Expert care after surgery.</p>
  <a slot="actions" class="cta-button">Learn More</a>
</lc-card>

<!-- Team Member Card -->
<lc-card variant="team">
  <img slot="image" src="/images/team/nurse.jpg" alt="Jane Doe">
  <h3 slot="name">Jane Doe, RN</h3>
  <p slot="role">Senior Nurse</p>
  <p slot="bio">20+ years of experience in home care.</p>
</lc-card>

<!-- Testimonial Card -->
<lc-card variant="testimonial">
  <p slot="quote">The care we received was exceptional. Truly life-changing.</p>
  <span slot="author">John Smith</span>
  <span slot="title">Family Member</span>
</lc-card>
```

#### `<lc-card-grid>`
Responsive grid container for cards.

**Attributes:**
- `columns` - Number of columns or `auto` (default: `auto`)
- `gap` - Gap between cards (e.g., `2rem`)

**Example:**
```html
<lc-card-grid columns="3" gap="1.5rem">
  <lc-card variant="info">...</lc-card>
  <lc-card variant="info">...</lc-card>
  <lc-card variant="info">...</lc-card>
</lc-card-grid>
```

#### `<lc-bento-grid>`
Masonry-style grid with variable card sizes.

**Attributes:**
- `pattern` - Size pattern: `default`, `uniform`

**Example:**
```html
<lc-bento-grid pattern="default">
  <lc-card variant="bento">
    <h3 slot="title">Large Feature</h3>
    <p slot="description">This card spans 2x2.</p>
  </lc-card>
  <lc-card variant="bento">
    <h3 slot="title">Small Item</h3>
  </lc-card>
</lc-bento-grid>
```

### UI Elements

Components for badges, tags, tooltips, alerts, etc. (Templates ready, scripts in progress)

## 🎨 Styling

### Global CSS Integration

Components use **Light DOM**, so they inherit global styles from `/style/style.css`.

Component-specific styles can be added to:
- `/components/styles/[component].css` - Component styles
- `/style/layouts/` - Layout-specific styles
- `/style/utilities/` - Utility classes

### CSS Custom Properties

Use CSS variables for theming:

```css
.card {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

### Variants

Add variant classes:

```html
<lc-card variant="service"></lc-card>
<!-- Renders with class "card card-service" -->
```

## 🌐 i18n Support

Components work with the existing i18n system using `data-i18n` attributes:

```html
<lc-card variant="info">
  <h4 slot="title" data-i18n="infoCards[0].title"></h4>
  <p data-i18n="infoCards[0].text"></p>
</lc-card>
```

## ♿ Accessibility

All components are built with WCAG 2.2 AA compliance:

- Semantic HTML
- Proper ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

### Keyboard Navigation

- **Header Dropdowns:**
  - `Arrow Down` - Open/navigate down
  - `Arrow Up` - Navigate up
  - `Arrow Right` - Open submenu
  - `Arrow Left` - Close submenu
  - `Escape` - Close menu
  - `Enter` - Activate link

- **Clickable Cards:**
  - `Enter` or `Space` - Navigate to link

## 📦 Progressive Enhancement

Components work without JavaScript:

### Critical Templates in HTML

For header/footer, include templates directly in HTML:

```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <!-- Include critical templates -->
  <link rel="preload" href="/components/templates/navigation.html" as="fetch">

  <!-- Components still work -->
  <lc-header solid></lc-header>

  <main>
    <!-- Content -->
  </main>

  <lc-footer></lc-footer>

  <!-- Load component scripts -->
  <script type="module" src="/components/scripts/lc-header.js"></script>
  <script type="module" src="/components/scripts/lc-footer.js"></script>
</body>
</html>
```

### Hybrid Approach

Use `<template>` tags directly in HTML for critical components, load others via JavaScript.

## 🔧 Extending Components

### Create New Component

1. **Add Template** (`components/templates/my-component.html`):
```html
<template id="lc-my-component-template">
  <div class="my-component">
    <slot></slot>
  </div>
</template>
```

2. **Create Script** (`components/scripts/lc-my-component.js`):
```javascript
import { cloneTemplate } from '../../script/core/component-loader.js';

class LCMyComponent extends HTMLElement {
  connectedCallback() {
    const template = cloneTemplate('lc-my-component-template');
    this.appendChild(template);
  }
}

customElements.define('lc-my-component', LCMyComponent);
```

3. **Use Component**:
```html
<lc-my-component>Content</lc-my-component>
```

## 🐛 Debugging

### Template Not Found

Check:
1. Template file is in `/components/templates/`
2. Template has correct ID
3. Template is loaded before component

### Component Not Rendering

Check browser console for errors:
```javascript
// Manually test template loading
ComponentLoader.loadTemplate('my-component').then(success => {
  console.log('Template loaded:', success);
});
```

### Styling Not Applied

Components use Light DOM, so check:
1. Global CSS is loaded
2. Component classes are correct
3. CSS specificity isn't too high

## 📚 Further Reading

- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
- [Shadow DOM vs Light DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

## 🎯 Next Steps

Phase 2 components coming soon:
- Form components (`<lc-form>`, `<lc-input>`, etc.)
- Dialog/Modal system
- Blog components
- Advanced UI elements

---

**Need help?** Check `/components/templates/` for template structure or `/components/scripts/` for implementation examples.
