# Page Layouts

This directory contains pre-built HTML page layout templates that can be used as starting points for creating new pages or as reference implementations for common page patterns.

## Available Layouts

### Homepage with Video Background

**File:** `homepage-video.html`

**Description:** Hero section with autoplay background video, ideal for engaging landing experiences.

**Features:**

- Full-screen video background
- Overlay content area
- Accessible video controls (muted, autoplay, loop)
- Fallback image for browsers without video support
- Responsive design with mobile optimization

**Use Cases:**

- Homepage/landing page
- Campaign pages
- Product showcases

**Key Sections:**

```html
<section class="hero-video">
  <video autoplay muted loop playsinline>
    <source src="assets/media/hero-video.mp4" type="video/mp4">
  </video>
  <div class="hero-content">
    <!-- Hero content overlay -->
  </div>
</section>
```

---

### Subpage with Sidebar

**File:** `subpage-sidebar.html`

**Description:** Standard subpage layout with right sidebar for resources, links, or supplementary content.

**Features:**

- Main content area (70% width)
- Right sidebar (30% width)
- Responsive collapse to single column on mobile
- Sticky sidebar option
- Accessible landmark regions

**Use Cases:**

- About pages
- Service detail pages
- Documentation pages
- Resource pages

**Layout Structure:**

```html
<main class="subpage-sidebar">
  <article class="main-content">
    <!-- Primary content -->
  </article>
  <aside class="sidebar">
    <!-- Resources, links, related content -->
  </aside>
</main>
```

**Sidebar Content Ideas:**

- Table of contents
- Quick links
- Related resources
- CTA widgets
- Contact information

---

### Bentobox Grid

**File:** `bentobox-grid.html`

**Description:** Masonry-style grid layout with variable card sizes, creating a dynamic, magazine-like appearance.

**Features:**

- CSS Grid-based layout
- Variable card sizes (1x1, 2x1, 1x2, 2x2)
- Responsive reflow on smaller screens
- Accessible card navigation
- Animated card reveals on scroll

**Use Cases:**

- Service overview pages
- Feature showcases
- Portfolio displays
- Treatment/expertise galleries

**Grid Patterns:**

```css
.bentobox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card-large {
  grid-column: span 2;
  grid-row: span 2;
}
```

**Example Usage:**

```html
<div class="bentobox-grid">
  <div class="card card-large">Large featured card</div>
  <div class="card">Standard card</div>
  <div class="card">Standard card</div>
  <div class="card card-wide">Wide card</div>
</div>
```

---

### Contact Page

**File:** `contact.html`

**Description:** Comprehensive contact page with form, business information, and emergency support details.

**Features:**

- Contact form with validation
- Business hours table
- Emergency contact card
- Contact information sidebar
- Map integration placeholder
- Schema.org ContactPage markup

**Form Fields:**

- Name (required)
- Email (required, validated)
- Phone (optional)
- Subject dropdown
- Message textarea
- Submit button with loading state

**Use Cases:**

- Contact pages
- Support request forms
- Consultation booking

**Example Structure:**

```html
<main class="contact-page">
  <section class="contact-form">
    <form><!-- Contact form --></form>
  </section>
  <section class="contact-info">
    <!-- Business hours, address, phone -->
  </section>
  <section class="emergency-support">
    <!-- 24/7 emergency contact -->
  </section>
</main>
```

---

### Splash/Landing Page

**File:** `splash.html`

**Description:** Focused landing page for campaigns, promotions, or product launches with minimal navigation.

**Features:**

- Minimal header (no full navigation)
- Prominent hero section
- Feature highlights with icons
- Dual CTAs (primary + secondary)
- Conversion-focused layout
- Social proof section

**Use Cases:**

- Marketing campaigns
- Product launches
- Promotional pages
- Lead capture pages

**Key Elements:**

```html
<header class="splash-header">
  <!-- Logo only, minimal nav -->
</header>

<section class="hero">
  <h1><!-- Value proposition --></h1>
  <p><!-- Supporting text --></p>
  <div class="cta-buttons">
    <a href="#" class="btn-primary">Primary CTA</a>
    <a href="#" class="btn-secondary">Secondary CTA</a>
  </div>
</section>

<section class="features">
  <!-- Feature cards with icons -->
</section>
```

---

### Blog Gallery

**File:** `blog-gallery.html`

**Description:** Blog post listing page with search, filters, and grid display.

**Features:**

- Featured article section
- Blog post grid (3 columns)
- Search functionality
- Category filters
- Tag cloud
- Sort options (Recent, Popular, Oldest)
- Pagination

**Use Cases:**

- Blog index pages
- News listings
- Article archives

**Components:**

```html
<main class="blog-gallery">
  <aside class="blog-sidebar">
    <form class="blog-search"><!-- Search --></form>
    <div class="blog-filters"><!-- Categories --></div>
    <div class="blog-tags"><!-- Tag cloud --></div>
  </aside>

  <div class="blog-content">
    <article class="featured-post"><!-- Featured --></article>
    <div class="blog-grid">
      <!-- Blog post cards -->
    </div>
    <nav class="pagination"><!-- Pages --></nav>
  </div>
</main>
```

---

### Blog Post

**File:** `blog-post.html`

**Description:** Individual blog post template with table of contents, author info, and related posts.

**Features:**

- Article layout with proper typography
- Breadcrumb navigation
- Author bio with avatar
- Table of contents sidebar (sticky)
- Related articles section
- Tags and social sharing
- CTA widget in sidebar
- Comments section placeholder
- Schema.org Article/BlogPosting markup

**Use Cases:**

- Blog posts
- Articles
- Long-form content

**Layout:**

```html
<main class="blog-post">
  <article class="post-content">
    <header>
      <nav class="breadcrumb"><!-- Breadcrumb --></nav>
      <h1><!-- Post title --></h1>
      <div class="post-meta"><!-- Date, author, reading time --></div>
    </header>

    <div class="post-body">
      <!-- Article content -->
    </div>

    <footer>
      <div class="post-tags"><!-- Tags --></div>
      <div class="social-share"><!-- Share buttons --></div>
    </footer>
  </article>

  <aside class="post-sidebar">
    <nav class="toc"><!-- Table of contents --></nav>
    <div class="cta-widget"><!-- CTA --></div>
  </aside>
</main>
```

---

## Using Layout Templates

### 1. Copy Template

```bash
# Copy template to new page
cp layouts/subpage-sidebar.html pages/new-page/index.html
```

### 2. Update Relative Paths

Adjust CSS/JS paths based on directory depth:

```html
<!-- For pages/new-page/index.html (2 levels deep) -->
<link rel="stylesheet" href="../../theme/style.css">
<script src="../../tools/app.js"></script>
<script src="../../tools/theme.js"></script>
<script src="../../tools/i18n.js"></script>
```

### 3. Add Content

Replace placeholder content with actual page content.

### 4. Add i18n Attributes

```html
<!-- Add data-i18n attributes to all translatable text -->
<h1 data-i18n="page.title">Page Title</h1>
<p data-i18n="page.description">Description text</p>
```

### 5. Create Translation Files

Add corresponding JSON files in `_locale/en/` and `_locale/es/`:

```json
{
  "page": {
    "title": "Page Title",
    "description": "Description text"
  }
}
```

### 6. Update Metadata

```html
<title data-i18n="meta.title">Page Title | Legacy Concierge</title>
<meta name="description" data-i18n-attr="content:meta.description" content="...">
```

### 7. Add Schema.org Markup

Include appropriate structured data for the page type:

```html
<!-- WebPage for standard pages -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Name",
  "description": "Page description"
}
</script>
```

---

## Layout Customization

### Modifying Layouts

To customize a layout:

1. **Don't modify the template directly** - Copy first
2. **Maintain accessibility** - Keep ARIA attributes and semantic HTML
3. **Test responsiveness** - Verify mobile, tablet, desktop views
4. **Update i18n** - Ensure all new text is translatable
5. **Preserve schema markup** - Keep or update structured data

### Common Customizations

**Changing Grid Columns:**

```css
/* In theme/style.css or custom CSS */
.blog-grid {
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr; /* 1 column on mobile */
  }
}
```

**Adjusting Sidebar Width:**

```css
.subpage-sidebar {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 66% / 33% split */
  gap: 2rem;
}
```

**Changing Hero Video:**

```html
<video autoplay muted loop playsinline>
  <source src="assets/media/new-video.mp4" type="video/mp4">
  <source src="assets/media/new-video.webm" type="video/webm">
  Your browser does not support video.
</video>
```

---

##  Accessibility Considerations

All layouts include:

-  Semantic HTML5 elements (`<header>`, `<main>`, `<article>`, `<aside>`)
-  ARIA landmarks and roles
-  Skip links for keyboard navigation
-  Proper heading hierarchy (h1 → h2 → h3)
-  Focus indicators for interactive elements
-  Alt text for images
-  Form labels and ARIA attributes
-  Keyboard navigation support

### Testing Accessibility

```bash
# Run accessibility audit
npx @axe-core/cli pages/new-page/index.html

# Test with screen reader (macOS VoiceOver)
# CMD + F5 to toggle VoiceOver

# Test keyboard navigation
# Tab through all interactive elements
# Verify all functionality works without mouse
```

---

## Responsive Design

All layouts are mobile-first and responsive:

**Breakpoints:**

- **Mobile:** 0-599px (1 column)
- **Tablet:** 600-1023px (2 columns or adjusted)
- **Desktop:** 1024px+ (full layout)

**Testing:**

```bash
# Test in browser DevTools
# Chrome: CMD + Option + I → Toggle device toolbar

# Test on actual devices
# iOS Simulator (macOS)
# Android Emulator
```

---

## = Related Files

- **theme/style.css** - Global styles applied to all layouts
- **theme/layouts/** - Layout-specific CSS (if needed)
- **components/** - Web Components used in layouts
- **tools/app.js** - Interactive functionality (navigation, mobile menu)

---

## Further Reading

- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Schema.org Markup](https://schema.org/)

---

**Need help?** Check existing pages in `pages/` for implementation examples or refer to `.claude/CLAUDE.md` for project guidelines.
