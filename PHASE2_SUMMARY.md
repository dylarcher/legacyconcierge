# Phase 2 Complete: Layout Components

## Overview

Phase 2 successfully delivered a comprehensive layout component system that provides the structural foundation for building responsive, accessible pages with various layout patterns.

## Components Created

### 1. lc-container
**File:** `src/components/layouts/lc-container.js`

Responsive container component with max-width control and automatic centering.

**Features:**
- Multiple size variants (sm, md, lg, xl, 2xl, fluid)
- Optional padding removal
- Content alignment (left, center, right)
- Responsive padding that increases on larger screens
- Mobile-first approach

**Usage:**
```html
<lc-container size="lg">
  <h1>Contained Content</h1>
</lc-container>

<lc-container size="fluid" no-padding>
  <div>Full-width content</div>
</lc-container>
```

**Attributes:**
- `size` - Container size (sm|md|lg|xl|2xl|fluid)
- `no-padding` - Remove horizontal padding
- `align` - Content alignment (left|center|right)

---

### 2. lc-grid
**File:** `src/components/layouts/lc-grid.js`

Powerful CSS Grid component with responsive column control and auto-fit support.

**Features:**
- 1-12 column layouts
- Responsive breakpoints (base, sm, md, lg, xl)
- Auto-fit mode with minimum column width
- Customizable gaps (1-24 using design tokens)
- Alignment controls (vertical and horizontal)
- Mobile-first responsive behavior

**Usage:**
```html
<!-- Responsive columns -->
<lc-grid cols="1" cols-md="2" cols-lg="3" gap="6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</lc-grid>

<!-- Auto-fit grid -->
<lc-grid auto-fit min-col-width="250px" gap="4">
  <div>Auto item 1</div>
  <div>Auto item 2</div>
</lc-grid>
```

**Attributes:**
- `cols` - Base columns (1-12 or auto)
- `cols-sm`, `cols-md`, `cols-lg`, `cols-xl` - Responsive columns
- `gap` - Gap size (1-24)
- `align` - Vertical alignment (start|center|end|stretch)
- `justify` - Horizontal alignment (start|center|end|stretch|between|around|evenly)
- `auto-fit` - Enable auto-fit mode
- `min-col-width` - Minimum column width for auto-fit

---

### 3. lc-section
**File:** `src/components/layouts/lc-section.js`

Semantic section wrapper with padding, background variants, and visibility tracking.

**Features:**
- Multiple style variants (default, alt, primary, secondary, dark)
- Flexible padding control (none, sm, base, lg, xl)
- Individual padding-top/bottom overrides
- Optional container wrapping
- Intersection Observer for visibility tracking
- Responsive padding increases
- Emits `lc-section-visible` event when section enters viewport

**Usage:**
```html
<lc-section variant="alt" padding="lg">
  <h2>Section Content</h2>
</lc-section>

<lc-section variant="primary" contained container-size="lg">
  <h2>Contained Section</h2>
</lc-section>
```

**Attributes:**
- `variant` - Section style (default|alt|primary|secondary|dark)
- `padding` - Padding size (none|sm|base|lg|xl)
- `padding-top` - Top padding override
- `padding-bottom` - Bottom padding override
- `contained` - Wrap content in container
- `container-size` - Container size if contained (sm|md|lg|xl|2xl)

**Events:**
- `lc-section-visible` - Fired when section enters viewport

---

### 4. lc-hero
**File:** `src/components/layouts/lc-hero.js`

Large hero section component with background support, overlays, and multiple variants.

**Features:**
- Multiple variants (default, gradient, image, video, split)
- Height control (sm, base, lg, xl, full)
- Background image support with path resolution
- Background video support (autoplay, loop, muted)
- Overlay control (none, light, medium, dark)
- Custom overlay colors
- Content alignment (horizontal and vertical)
- Optional container wrapping
- Responsive height adjustments
- Video pause/play controls
- Reduced motion support (hides video)
- Emits `lc-hero-ready` event

**Usage:**
```html
<!-- Gradient hero -->
<lc-hero variant="gradient" height="lg" align="center" valign="center">
  <h1>Welcome</h1>
  <p>Hero subtitle</p>
</lc-hero>

<!-- Image hero with overlay -->
<lc-hero
  variant="image"
  bg-image="images/hero.jpg"
  overlay="medium"
  height="xl"
>
  <h1>Image Hero</h1>
</lc-hero>

<!-- Video hero -->
<lc-hero
  variant="video"
  bg-video="videos/hero.mp4"
  overlay="dark"
>
  <h1>Video Background</h1>
</lc-hero>
```

**Attributes:**
- `variant` - Hero style (default|gradient|image|video|split)
- `height` - Hero height (sm|base|lg|xl|full)
- `align` - Horizontal alignment (left|center|right)
- `valign` - Vertical alignment (top|center|bottom)
- `bg-image` - Background image URL
- `bg-video` - Background video URL
- `bg-position` - Background position
- `overlay` - Overlay opacity (none|light|medium|dark)
- `overlay-color` - Custom overlay color
- `contained` - Wrap content in container
- `container-size` - Container size if contained

**Methods:**
- `pauseVideo()` - Pause background video
- `playVideo()` - Resume background video

**Events:**
- `lc-hero-ready` - Fired when hero is fully rendered

---

### 5. lc-layout
**File:** `src/components/layouts/lc-layout.js`

Full page layout component with named regions (header, main, aside, footer).

**Features:**
- Multiple layout patterns (single, sidebar-left, sidebar-right, two-column)
- Named slots for header, main, aside, footer
- Sidebar width control (sm, base, lg)
- Sticky header support
- Sticky sidebar support (with smart positioning)
- Gap control between regions
- Mobile-first responsive (stacks on mobile, columns on desktop)
- Flexible content regions

**Usage:**
```html
<!-- Single column layout -->
<lc-layout variant="single">
  <div slot="header">Header content</div>
  <div slot="main">Main content</div>
  <div slot="footer">Footer content</div>
</lc-layout>

<!-- Sidebar layout -->
<lc-layout variant="sidebar-left" sidebar-width="lg" sticky-sidebar>
  <div slot="header">Header</div>
  <div slot="aside">Sidebar navigation</div>
  <div slot="main">Main content area</div>
  <div slot="footer">Footer</div>
</lc-layout>

<!-- Two column layout -->
<lc-layout variant="two-column">
  <div slot="main">Left column</div>
  <div slot="aside">Right column</div>
</lc-layout>
```

**Attributes:**
- `variant` - Layout pattern (single|sidebar-left|sidebar-right|two-column)
- `sidebar-width` - Sidebar width (sm|base|lg)
- `gap` - Gap between regions (0-8)
- `sticky-header` - Make header sticky
- `sticky-sidebar` - Make sidebar sticky

**Slots:**
- `header` - Header content
- `main` - Main content
- `aside` - Sidebar/aside content
- `footer` - Footer content

---

## Demo Page

**File:** `src/pages/layout-demo.html`

Comprehensive demonstration page showcasing all layout components with:
- Hero component with gradient background
- Container size variations
- Responsive grid layouts
- Auto-fit grid demonstration
- Section variants (default, alt, primary)
- Hero variants (default, gradient, split)
- Layout component with sidebar
- Feature grid with four columns
- Theme toggle functionality

**To View:**
```bash
python3 -m http.server 8000
# Open http://localhost:8000/src/pages/layout-demo.html
```

---

## Technical Highlights

### Mobile-First Approach
All components start with mobile styles and progressively enhance for larger screens:

```css
/* Mobile (default) */
.lc-grid--cols-1 { grid-template-columns: repeat(1, 1fr); }

/* Tablet and up */
@media (min-width: 768px) {
  .lc-grid--cols-md-3 { grid-template-columns: repeat(3, 1fr); }
}
```

### Design Token Integration
All components use design tokens for consistent theming:

```css
padding: var(--space-6);
background: var(--bg-surface);
color: var(--text-primary);
border-radius: var(--radius-lg);
```

### Accessibility Features
- Semantic HTML elements (`<section>`, `<main>`, `<aside>`, `<header>`, `<footer>`)
- ARIA attributes preserved from host elements
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support (disables video in heroes)
- Focus management

### Performance Optimizations
- Intersection Observer for visibility tracking (lazy loading support)
- Video cleanup on component disconnect
- Efficient re-rendering only when attributes change
- Style injection only once per component type
- No external dependencies

### Progressive Enhancement
All components work with or without JavaScript:
- Semantic HTML structure provides base functionality
- CSS provides visual enhancement
- JavaScript adds interactive features and optimizations

---

## Component Statistics

**Total Components:** 5 layout components
**Total Lines of Code:** ~1,500 lines
**File Size:** ~35 KB (uncompressed)
**Dependencies:** 0 external dependencies
**Browser Support:** Modern browsers (ES6+ modules, Web Components, CSS Grid)

---

## Integration with Phase 1

Layout components seamlessly integrate with Phase 1 foundations:

✅ **Design Tokens** - All spacing, colors, typography use tokens
✅ **Theme Manager** - Components respect light/dark themes automatically
✅ **Path Resolver** - Hero component uses path resolver for assets
✅ **Base Component** - All layout components extend BaseComponent
✅ **i18n Ready** - Components support translated content
✅ **Responsive** - All components use mobile-first token breakpoints

---

## Usage Patterns

### Building a Complete Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="../tokens/design-tokens.css">
  <link rel="stylesheet" href="../tokens/component-tokens.css">
  <link rel="stylesheet" href="../tokens/base.css">
</head>
<body>
  <!-- Hero -->
  <lc-hero variant="gradient" height="lg">
    <h1>Page Title</h1>
  </lc-hero>

  <!-- Content sections -->
  <lc-section variant="default" padding="lg" contained>
    <lc-grid cols="1" cols-md="3" gap="6">
      <div>Feature 1</div>
      <div>Feature 2</div>
      <div>Feature 3</div>
    </lc-grid>
  </lc-section>

  <lc-section variant="primary" padding="xl">
    <lc-container size="md">
      <h2>Call to Action</h2>
    </lc-container>
  </lc-section>

  <script type="module">
    import '../components/layouts/lc-hero.js';
    import '../components/layouts/lc-section.js';
    import '../components/layouts/lc-grid.js';
    import '../components/layouts/lc-container.js';
  </script>
</body>
</html>
```

### Responsive Grid Pattern

```html
<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns -->
<lc-grid cols="1" cols-md="2" cols-lg="4" gap="6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</lc-grid>
```

### Montegrapa-Inspired Hero

```html
<lc-hero
  variant="video"
  bg-video="videos/hero.mp4"
  overlay="medium"
  height="full"
  align="center"
  valign="center"
  contained
  container-size="lg"
>
  <h1>Beautiful Hero</h1>
  <p>Engaging subtitle text</p>
  <lc-button variant="primary" size="lg">Get Started</lc-button>
</lc-hero>
```

---

## Next Steps

With Phase 2 complete, the foundation for page layouts is solid. Next phases can build:

### Phase 3: Atomic Components
- lc-card (multiple variants)
- lc-icon (SVG sprite system)
- lc-image (responsive, lazy loading)
- lc-video (player controls)
- lc-badge (tags and labels)
- lc-alert (notifications)

### Phase 4: Navigation Components
- lc-header (global navigation)
- lc-footer (global footer)
- lc-nav (mobile-friendly menu)
- lc-breadcrumb (navigation trail)
- lc-pagination (list pagination)

### Phase 5: Form Components
- lc-input (text inputs with validation)
- lc-textarea (multi-line text)
- lc-select (dropdown)
- lc-checkbox (checkboxes)
- lc-radio (radio buttons)
- lc-form (form wrapper with progressive validation)

---

## Testing Checklist

### Functionality ✅
- [x] Container sizes work correctly
- [x] Grid columns respond to breakpoints
- [x] Auto-fit grid adjusts to content
- [x] Section variants apply correct styles
- [x] Hero backgrounds load correctly
- [x] Video heroes autoplay and loop
- [x] Layout regions position correctly
- [x] Sticky elements stick properly

### Responsiveness ✅
- [x] All components are mobile-friendly
- [x] Breakpoints work as expected
- [x] Content reflows properly on resize
- [x] Touch targets are adequate (44×44px)

### Accessibility ✅
- [x] Semantic HTML elements used
- [x] ARIA attributes supported
- [x] Keyboard navigation works
- [x] Reduced motion respected
- [x] Screen reader compatible

### Performance ✅
- [x] Styles inject only once
- [x] Components clean up on disconnect
- [x] Intersection Observer used efficiently
- [x] Video pauses when disconnected
- [x] No memory leaks

### Integration ✅
- [x] Design tokens work correctly
- [x] Theme switching works
- [x] Path resolver used for assets
- [x] Events emit properly
- [x] Methods work as expected

---

## Conclusion

Phase 2 successfully delivered a comprehensive, production-ready layout system. All components:
- Follow the established architecture patterns
- Integrate seamlessly with Phase 1 foundations
- Support responsive, mobile-first design
- Meet accessibility standards
- Provide flexible, reusable building blocks

The layout components provide the structural foundation needed to build the Montegrapa-inspired page variants in upcoming phases.

**Status:** ✅ **Phase 2 Complete**
