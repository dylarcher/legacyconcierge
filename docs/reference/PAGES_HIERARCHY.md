# Pages

This directory contains all website pages organized by section. The homepage (`index.html`) is located at the project root, while all other pages are organized here.

## Directory Structure

```
pages/
   about/                # About page
   blog/                 # Blog section
      index.html        # Blog gallery/listing
      posts/            # Individual blog posts
          post-op-care/ # Example blog post
   careers/              # Careers/jobs page
   contact/              # Contact page
   expertise/            # Expertise section
      index.html        # Expertise overview
      views/            # Detail pages (11 pages)
          als/
          alzheimers/
          cardiac-care/
          cancer-care/
          dementia/
          diabetes-management/
          hospice-care/
          palliative-care/
          parkinsons/
          respiratory-care/
          stroke-recovery/
   locations/            # Service locations page
   partners/             # Partners page
   splash/               # Landing/splash page
   team/                 # Team page
   treatments/           # Treatments section
       index.html        # Treatments overview
       views/            # Detail pages (7 pages)
           chronic-pain/
           emotional-support/
           medication-management/
           mobility-assistance/
           nutrition-support/
           post-op-recovery/
           wound-care/
```

## Page Inventory

### Main Pages

| Page | Path | Translation File | Description |
|------|------|------------------|-------------|
| **Homepage** | `../index.html` | `home.json` | Main landing page |
| **About** | `about/index.html` | `about.json` | Company information |
| **Team** | `team/index.html` | `team.json` | Staff profiles |
| **Contact** | `contact/index.html` | `contact.json` | Contact form and info |
| **Careers** | `careers/index.html` | `careers.json` | Job opportunities |
| **Locations** | `locations/index.html` | `locations.json` | Service areas |
| **Partners** | `partners/index.html` | `partners.json` | Partner information |
| **Splash** | `splash/index.html` | `splash.json` | Landing page |

### Blog Section

| Page | Path | Translation File | Description |
|------|------|------------------|-------------|
| **Blog Gallery** | `blog/index.html` | `blog.json` | Blog post listing with search/filters |
| **Blog Post** | `blog/posts/*/index.html` | `blog.json` | Individual blog post template |

**Current Posts:**

- Post-Operative Care (`blog/posts/post-op-care/`)

### Treatments Section

| Page | Path | Translation File | Description |
|------|------|------------------|-------------|
| **Overview** | `treatments/index.html` | `treatments.json` | All treatments overview |
| **Post-Op Recovery** | `treatments/views/post-op-recovery/` | `treatments-detail.json` | Post-operative care |
| **Chronic Pain** | `treatments/views/chronic-pain/` | `treatments-detail.json` | Pain management |
| **Wound Care** | `treatments/views/wound-care/` | `treatments-detail.json` | Wound management |
| **Medication Management** | `treatments/views/medication-management/` | `treatments-detail.json` | Medication administration |
| **Mobility Assistance** | `treatments/views/mobility-assistance/` | `treatments-detail.json` | Mobility support |
| **Nutrition Support** | `treatments/views/nutrition-support/` | `treatments-detail.json` | Nutritional care |
| **Emotional Support** | `treatments/views/emotional-support/` | `treatments-detail.json` | Mental health support |

**Note:** All treatment detail pages share `treatments-detail.json` with nested keys.

### Expertise Section

| Page | Path | Translation File | Description |
|------|------|------------------|-------------|
| **Overview** | `expertise/index.html` | `expertise.json` | All expertise areas overview |
| **ALS** | `expertise/views/als/` | `expertise-detail.json` | ALS care |
| **Alzheimer's** | `expertise/views/alzheimers/` | `expertise-detail.json` | Alzheimer's care |
| **Dementia** | `expertise/views/dementia/` | `expertise-detail.json` | Dementia care |
| **Parkinson's** | `expertise/views/parkinsons/` | `expertise-detail.json` | Parkinson's care |
| **Hospice Care** | `expertise/views/hospice-care/` | `expertise-detail.json` | End-of-life care |
| **Palliative Care** | `expertise/views/palliative-care/` | `expertise-detail.json` | Comfort care |
| **Cancer Care** | `expertise/views/cancer-care/` | `expertise-detail.json` | Oncology support |
| **Respiratory Care** | `expertise/views/respiratory-care/` | `expertise-detail.json` | Breathing support |
| **Cardiac Care** | `expertise/views/cardiac-care/` | `expertise-detail.json` | Heart disease management |
| **Stroke Recovery** | `expertise/views/stroke-recovery/` | `expertise-detail.json` | Post-stroke rehabilitation |
| **Diabetes Management** | `expertise/views/diabetes-management/` | `expertise-detail.json` | Diabetes care |

**Note:** All expertise detail pages share `expertise-detail.json` with nested keys.

## Common Page Structure

All pages follow this consistent structure:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n="meta.title">Page Title | Legacy Concierge</title>
  <meta name="description" data-i18n-attr="content:meta.description" content="...">

  <!-- Open Graph / Facebook -->
  <meta property="og:title" data-i18n-attr="content:meta.title" content="...">
  <meta property="og:description" data-i18n-attr="content:meta.description" content="...">

  <!-- CSS -->
  <link rel="stylesheet" href="../../theme/style.css">
</head>
<body>
  <!-- Skip Link -->
  <a href="#main" class="skip-link" data-i18n="accessibility.skipToMain">Skip to main content</a>

  <!-- Header with Navigation -->
  <header>
    <!-- Logo and navigation -->
  </header>

  <!-- Main Content -->
  <main id="main">
    <!-- Page content -->
  </main>

  <!-- Footer -->
  <footer>
    <!-- Copyright, etc. -->
  </footer>

  <!-- Scripts (in order) -->
  <script src="../../tools/theme.js"></script>
  <script src="../../tools/app.js"></script>
  <script src="../../tools/i18n.js"></script>
</body>
</html>
```

## Internationalization (i18n)

### Translation Files

Each page loads:

1. **common.json** - Navigation, footer, accessibility labels (always loaded)
2. **Page-specific JSON** - Page content (loaded based on URL)

### Translation Key Patterns

**Standard pages:**

```html
<!-- pages/about/index.html uses about.json -->
<h1 data-i18n="page.title">About Us</h1>
```

**Shared detail pages (treatments, expertise):**

```html
<!-- pages/treatments/views/post-op-recovery/index.html uses treatments-detail.json -->
<h1 data-i18n="post-op-recovery.hero.title">Post-Operative Recovery</h1>
```

**Blog posts:**

```html
<!-- pages/blog/posts/post-op-care/index.html uses blog.json -->
<h1 data-i18n="blog.post.title">Blog Post Title</h1>
```

See `_locale/README.md` for complete i18n documentation.

## Relative Paths

**Critical:** Adjust relative paths based on directory depth:

```html
<!-- Root level (../index.html) - depth 0 -->
<link rel="stylesheet" href="theme/style.css">
<script src="tools/app.js"></script>

<!-- 2 levels deep (pages/about/index.html) - depth 2 -->
<link rel="stylesheet" href="../../theme/style.css">
<script src="../../tools/app.js"></script>

<!-- 4 levels deep (pages/treatments/views/post-op-recovery/index.html) - depth 4 -->
<link rel="stylesheet" href="../../../../theme/style.css">
<script src="../../../../tools/app.js"></script>
```

**Formula:** `../` repeated for each directory level + `theme/` or `tools/`

## Adding a New Page

### 1. Choose Location

```bash
# Standard page
pages/new-page/index.html

# Detail page in section
pages/treatments/views/new-treatment/index.html
```

### 2. Copy Template

```bash
# Use appropriate layout template
cp layouts/subpage-sidebar.html pages/new-page/index.html
```

### 3. Update Relative Paths

```html
<!-- For pages/new-page/index.html (2 levels deep) -->
<link rel="stylesheet" href="../../theme/style.css">
<script src="../../tools/theme.js"></script>
<script src="../../tools/app.js"></script>
<script src="../../tools/i18n.js"></script>
```

### 4. Create Translation Files

```bash
# Create English translation
_locale/en/new-page.json

# Create Spanish translation
_locale/es/new-page.json
```

```json
{
  "meta": {
    "title": "New Page | Legacy Concierge",
    "description": "Page description"
  },
  "page": {
    "title": "Page Title",
    "content": "..."
  }
}
```

### 5. Add i18n Attributes

```html
<h1 data-i18n="page.title">Page Title</h1>
<p data-i18n="page.content">Content</p>
```

### 6. Add Schema.org Markup

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Name",
  "description": "Page description",
  "url": "https://legacyconcierge.com/pages/new-page/"
}
</script>
```

### 7. Update Navigation

Add link to navigation in all HTML files:

```html
<nav>
  <ul>
    <!-- Existing nav items -->
    <li><a href="/pages/new-page/" data-i18n="navigation.newPage">New Page</a></li>
  </ul>
</nav>
```

Update `_locale/*/common.json`:

```json
{
  "navigation": {
    "newPage": "New Page"
  }
}
```

### 8. Test

- Verify page loads correctly
- Test all relative paths (CSS, JS, images)
- Test language switching
- Test theme switching
- Validate HTML (<https://validator.w3.org/>)
- Check accessibility (keyboard nav, screen reader)
- Test on mobile, tablet, desktop

## Page Types

### Content Pages

Standard informational pages (about, team, locations):

- Use `subpage-sidebar.html` layout
- Include relevant images
- Add Schema.org WebPage markup

### Form Pages

Pages with forms (contact, careers):

- Use `contact.html` layout as reference
- Include proper form validation
- Add ARIA attributes for accessibility
- Use Schema.org ContactPage markup

### Gallery/Listing Pages

Pages displaying multiple items (blog, treatments, expertise):

- Use `blog-gallery.html` or `bentobox-grid.html` layout
- Include search/filter functionality
- Add pagination if needed
- Use Schema.org ItemList or CollectionPage markup

### Detail Pages

Individual item pages (blog posts, treatment details):

- Use `blog-post.html` or `subpage-sidebar.html` layout
- Include breadcrumb navigation
- Add related items section
- Use specific Schema.org types (Article, MedicalProcedure, etc.)

### Landing Pages

Campaign or promotional pages (splash):

- Use `splash.html` layout
- Minimize navigation
- Focus on single CTA
- Add conversion tracking

## Accessibility Requirements

All pages must include:

- Skip link (`<a href="#main" class="skip-link">`)
- Semantic HTML5 structure
- ARIA landmarks (`role="navigation"`, `role="main"`, etc.)
- Proper heading hierarchy (h1 → h2 → h3, no skipping)
- Alt text for all images
- Form labels and ARIA attributes
- Keyboard navigation support
- Focus indicators
- Language attribute (`lang="en"` or `lang="es"`)
- Color contrast ratios (WCAG 2.2 AA)

## Page Statistics

| Section | Pages | Translation Files | Total Keys (approx.) |
|---------|-------|-------------------|----------------------|
| Main pages | 8 | 8 | ~150 |
| Blog | 2+ | 1 (shared) | ~80 |
| Treatments | 8 (1 overview + 7 details) | 2 | ~200 |
| Expertise | 12 (1 overview + 11 details) | 2 | ~300 |
| **Total** | **30+** | **13 unique** | **~730** |

## Related Resources

- **layouts/** - Page layout templates
- **_locale/** - Translation files
- **assets/** - Images and media
- **theme/** - CSS stylesheets
- **tools/** - JavaScript modules
- **.claude/CLAUDE.md** - Project guidelines

## Further Reading

- [HTML Best Practices](https://github.com/hail2u/html-best-practices)
- [Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Schema.org Documentation](https://schema.org/)

---

**Need help?** Check existing pages for examples or refer to layout templates in `layouts/` for starting points.
