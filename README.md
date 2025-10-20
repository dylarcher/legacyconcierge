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

## Page Layouts (Using <template>)

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

1. Start with NEW pages (blog, splash)
2. Migrate homepage to video background layout
3. Convert 2-3 subpages to sidebar template
4. Convert treatments/expertise to bentobox grid
5. Gradually migrate remaining pages
6. Keep old code until all pages migrated
7. Final cleanup and removal of legacy code
