# Web Components & Directory Structure Modernization Plan

## New Directory Structure

```plaintext
legacy-concierge/
├── components/              # NEW: Web Components
│   ├── templates/           # HTML <template> definitions
│   │   ├── navigation.html
│   │   ├── footer.html
│   │   ├── cards.html
│   │   ├── dialogs.html
│   │   ├── forms.html
│   │   └── ui-elements.html
│   ├── scripts/             # Component JavaScript
│   │   ├── lc-header.js
│   │   ├── lc-nav.js
│   │   ├── lc-footer.js
│   │   ├── lc-card.js
│   │   ├── lc-dialog.js
│   │   ├── lc-tooltip.js
│   │   └── lc-form.js
│   └── styles/              # Component-specific styles
│       ├── header.css
│       ├── navigation.css
│       ├── cards.css
│       └── forms.css
├── layouts/                 # NEW: Page layout templates
│   ├── homepage-video.html
│   ├── subpage-sidebar.html
│   ├── bentobox-grid.html
│   ├── contact.html
│   ├── splash.html
│   ├── blog-post.html
│   └── blog-gallery.html
├── pages/
│   ├── blog/                # NEW: Blog section
│   │   ├── index.html       # Blog gallery
│   │   ├── posts/
│   │   └── categories/
│   └── [existing pages...]
├── css/
│   ├── style.css            # Global styles (existing)
│   ├── layouts/             # NEW: Layout-specific styles
│   │   ├── homepage.css
│   │   ├── sidebar.css
│   │   ├── bentobox.css
│   │   └── blog.css
│   └── utilities/           # NEW: Utility classes
│       ├── spacing.css
│       ├── typography.css
│       └── animations.css
├── js/
│   ├── core/                # NEW: Core utilities
│   │   ├── component-loader.js
│   │   ├── router.js
│   │   └── helpers.js
│   └── [existing files...]
└── assets/
    └── videos/              # NEW: For homepage background video
```

## Web Components to Create

1. Navigation Components

    - `<lc-header>` &middot; Main header with logo
    - `<lc-nav>` &middot; Navigation with dropdown support
    - `<lc-breadcrumb>` &middot; Breadcrumb navigation
    - `<lc-mobile-menu>` &middot; Mobile hamburger menu

2. Card Components

    - `<lc-card>` &middot; Base card (info, service, team, testimonial variants)
    - `<lc-card-grid>` &middot; Grid container for cards
    - `<lc-bento-card>` &middot; Variable-sized card for bentobox layout

3. Dialog/Modal Components

    - `<lc-dialog>` &middot; Modal dialog
    - `<lc-tooltip>` &middot; Tooltip/hint
    - `<lc-popover>` &middot; Popover menu
    - `<lc-alert>` &middot; Alert/notification banner

4. Form Components

    - `<lc-form>` &middot; Form wrapper with validation
    - `<lc-input>` &middot; Enhanced input field
    - `<lc-textarea>` &middot; Text area
    - `<lc-select>` &middot; Dropdown select
    - `<lc-checkbox>` &middot; Checkbox with label
    - `<lc-radio>` &middot; Radio button group

5. UI Elements

    - `<lc-badge>` &middot; Status/category badge
    - `<lc-tag>` &middot; Tag/chip element
    - `<lc-button>` &middot; Enhanced button
    - `<lc-pagination>` &middot; Page navigation
    - `<lc-filter>` &middot; Filter/search bar

6. Blog Components

    - `<lc-blog-card>` &middot; Blog post preview card
    - `<lc-blog-meta>` &middot; Post metadata (date, author, category)
    - `<lc-blog-filter>` &middot; Category/search filter
    - `<lc-blog-grid>` &middot; Responsive blog grid

7. Layout Components

    - `<lc-sidebar>` &middot; Right sidebar with resources
    - `<lc-section>` &middot; Page section wrapper
    - `<lc-container>` &middot; Responsive container

## Page Layouts (Using `<template>`)

### Template Structure Example:

```html
<!-- layouts/homepage-video.html -->
<template id="layout-homepage">
    <div class="homepage-layout">
        <lc-header></lc-header>
        <section class="hero-video">
            <video autoplay muted loop playsinline>
                <source src="/assets/videos/hero.mp4" type="video/mp4">
            </video>
            <div class="hero-content">
                <slot name="hero"></slot>
            </div>
        </section>
        <main>
            <slot></slot>
        </main>
        <lc-footer></lc-footer>
    </div>
</template>
```

## Implementation Steps

### Phase 1: Foundation

1. Create new directory structure
2. Build core component loader utility
3. Create base `<template>` system
4. Implement `<lc-header>` and `<lc-footer>`

### Phase 2: Core Components

1. Build card components with variants
2. Create form components
3. Implement dialog/modal system
4. Add UI elements (badges, tags, buttons)

### Phase 3: Layouts

1. Homepage with video background
2. Sidebar subpage template
3. Bentobox grid layout
4. Contact page template

### Phase 4: Blog & Advanced

1. Blog post layout
2. Blog gallery with filters
3. Splash page template
4. Migration of 2-3 existing pages as proof-of-concept

## Component Architecture

### Light DOM with Custom Elements

```javascript
// components/scripts/lc-card.js
class LCCard extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('lc-card-template');
        const content = template.content.cloneNode(true);
        
        // No Shadow DOM - uses global CSS
        this.appendChild(content);
        
        // Add variant classes
        const variant = this.getAttribute('variant');
        if (variant) this.classList.add(`card-${variant}`);
    }
}
customElements.define('lc-card', LCCard);
```

### Hybrid Template Loading

```javascript
// Critical templates in HTML (header, footer)
// Optional templates loaded via JS
async function loadTemplate(name) {
    const response = await fetch(`/components/templates/${name}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML('beforeend', html);
}
```

## Benefits

- **DRY Code** &middot; Single source for navigation, footer, cards
- **Maintainability** &middot; Update one template, affects all pages
- **Performance** &middot; Templates cached, minimal overhead
- **Accessibility** &middot; WCAG 2.2 AA built into components
- **i18n Ready** &middot; Works with existing data-i18n system
- **Gradual Migration** &middot; Existing pages continue working
- **Progressive Enhancement** &middot; Works without JS (critical templates)

## Migration Strategy

- `<lc-header>` - Site header with navigation
- `<lc-footer>` - Site footer
- `<lc-card>` - Versatile card component (info, service, team, blog variants)
- `<lc-card-grid>` - Responsive card grid
- `<lc-bento-grid>` - Masonry-style grid layout

See [`components/README.md`](components/README.md) for full documentation.

## Scripts

Core JavaScript modules:

- [`app.js`](scripts/app.js) - Navigation, mobile menu, scroll effects
- [`i18n.js`](scripts/i18n.js) - Internationalization engine
- [`theme.js`](scripts/theme.js) - Dark/light mode management
- [`language-switcher.js`](scripts/language-switcher.js) - Language selection component

See [`scripts/README.md`](scripts/README.md) for detailed documentation.

## Layouts

Pre-built page layout templates in [`layouts/`](layouts/):

- [`homepage-video.html`](layouts/homepage-video.html) - Homepage with background video
- [`subpage-sidebar.html`](layouts/subpage-sidebar.html) - Subpage with right sidebar
- [`bentobox-grid.html`](layouts/bentobox-grid.html) - Masonry-style card grid
- [`contact.html`](layouts/contact.html) - Contact page layout
- [`splash.html`](layouts/splash.html) - Landing page layout
- [`blog-gallery.html`](layouts/blog-gallery.html) - Blog listing layout
- [`blog-post.html`](layouts/blog-post.html) - Individual blog post layout

## Development Status

**Current Phase:** Phase 3 - Component Development & Page Templates

### Completed

- i18n framework (EN/ES support for 30+ pages)
- Code quality tools (Biome configuration)
- Directory structure modernization
- Contact page with form
- Splash/landing page
- Blog infrastructure (gallery + post template)
- Web Components foundation (header, footer, cards)
- Theme system (dark/light mode)
- Navigation system with dropdowns

### In Progress

- Unit test coverage (95%+ target)
- Accessibility audit (WCAG 2.2 AA validation)
- Performance optimization (Lighthouse 95+ target)
- Homepage development
- Subpage templates
- Form components

See [`docs/ROADMAP_TIMELINE.md`](docs/ROADMAP_TIMELINE.md) for full project timeline.

## Links

- **GitHub:** <https://github.com/dylarcher/legacy-concierge>
- **Project Board:** <https://github.com/users/dylarcher/projects/18>
- **Documentation:** [`docs/`](docs/)

## Documentation

- [`docs/ROADMAP_TIMELINE.md`](docs/ROADMAP_TIMELINE.md) - Complete project timeline and progress
- [`docs/WEB_COMPONENTS_SUMMARY.md`](docs/WEB_COMPONENTS_SUMMARY.md) - Web Components implementation notes
- [`docs/QUICK_START.md`](docs/QUICK_START.md) - Quick reference guide

## Contributing

When adding new features:

1. **Maintain accessibility** - Test with keyboard and screen readers
2. **Add i18n support** - All text must be translatable
3. **Format code** - Run Biome before committing
4. **Use modern patterns** - ESM modules, Web Components, IndexedDB
5. **Test themes** - Verify both dark and light modes
6. **Document changes** - Update relevant README files

## Common Tasks

### Adding a New Page

1. Create HTML file in appropriate [`pages/`](pages/) subdirectory
2. Add translation files in [`_locale/en/`](_locale/en/) and [`_locale/es/`](_locale/es/)
3. Add `data-i18n` attributes for all translatable content
4. Ensure correct relative paths for CSS/JS based on directory depth
5. Add Schema.org microdata
6. Test accessibility and theme support

### Modifying Translations

1. Edit JSON files in [`_locale/{lang}/`](_locale/)
2. Maintain consistent key structure across all languages
3. Test language switching
4. Verify special characters and HTML entities

### Updating Components

1. Modify template in [`components/templates/`](components/templates/)
2. Update script in [`components/scripts/`](components/scripts/) if needed
3. Test across all pages using the component
4. Update [`components/README.md`](components/README.md) documentation

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Progressive enhancement ensures core functionality works in older browsers.

## License

[License information to be added]

## Contact

[Contact information to be added]

---

> Built with care for those who need compassionate support
