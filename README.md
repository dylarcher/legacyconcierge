# Legacy Concierge

An elegant and minimal website for end-of-life in-home nursing support, built with vanilla HTML/CSS/JavaScript featuring a sophisticated internationalization system.

## Project Overview

Legacy Concierge provides compassionate, professional in-home nursing care for elderly individuals and those at end-of-life. This website serves as the primary digital presence for the service, targeting individuals aged 45-85 and their families seeking premium care services.

### Design Philosophy

- **Elegant & Minimal** - Clean, sophisticated design prioritizing clarity
- **Accessible First** - WCAG 2.2 AA compliant with comprehensive WAI-ARIA support
- **Large Touch Targets** - Minimum 44x44px for interactive elements
- **High Contrast** - Clear visual hierarchy with strong contrast ratios
- **Intuitive Navigation** - Simple, clear paths through content

## Quick Start

### Local Development

This is a static site with no build process required:

```bash
# Clone the repository
git clone https://github.com/dylarcher/legacy-concierge.git
cd legacy-concierge

# Option 1: Use Python's built-in server
python3 -m http.server 8000

# Option 2: Use Node.js http-server
npx http-server -p 8000

# Visit http://localhost:8000
```

### Code Quality

The project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Format code
npx @biomejs/biome format --write .

# Lint code
npx @biomejs/biome lint .

# Check without changes
npx @biomejs/biome check .
```

Configuration: [`biome.json`](biome.json) (2-space indentation, 80-char line width)

## Technology Stack

### Core Technologies

- **HTML5** - Semantic markup with Schema.org microdata
- **CSS3** - Modern CSS with custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ with no framework dependencies

### Key Features

- **i18n System** - Custom internationalization supporting EN/ES
- **Theme Support** - Dark/light mode with system preference detection
- **Web Components** - Reusable UI components using Custom Elements
- **Progressive Enhancement** - Works without JavaScript for critical features
- **IndexedDB** - Client-side storage for preferences and state

## Directory Structure

```
legacy-concierge/
├── _locale/              # Translation files (EN, ES)
├── assets/               # Images, media, static files
│   ├── images/           # Site images
│   └── media/            # Videos, audio, icons, logos
├── components/           # Web Components
│   ├── templates/        # HTML <template> definitions
│   └── scripts/          # Component JavaScript
├── docs/                 # Project documentation
├── layouts/              # Page layout templates
├── pages/                # Site pages
│   ├── about/            # About page
│   ├── blog/             # Blog section
│   ├── contact/          # Contact page
│   ├── expertise/        # Expertise detail pages
│   ├── splash/           # Landing/splash page
│   ├── team/             # Team page
│   └── treatments/       # Treatment detail pages
├── scripts/              # Core JavaScript modules
│   ├── core/             # Core utilities
│   ├── app.js            # Navigation, mobile menu
│   ├── i18n.js           # Internationalization engine
│   └── theme.js          # Theme management
├── styles/               # CSS stylesheets
│   └── style.css         # Global styles
├── index.html            # Homepage
├── biome.json            # Biome configuration
├── jsconfig.json         # JavaScript IDE support
└── package.json          # Dependencies
```

## Internationalization (i18n)

The site features a custom vanilla JavaScript i18n system:

- **Languages:** English (EN), Spanish (ES)
- **Translation Files:** [`_locale/{lang}/*.json`](_locale/) (14 files per language)
- **Dynamic Loading:** Automatic path calculation based on directory depth
- **Features:** Nested keys, arrays, variable interpolation, pluralization

### Usage

```html
<!-- Simple translation -->
<h1 data-i18n="page.title">Title</h1>

<!-- Nested key -->
<p data-i18n="section.content.text">Content</p>

<!-- Array notation -->
<span data-i18n="items[0].label">Label</span>

<!-- Attribute translation -->
<button data-i18n-attr="aria-label:buttons.submit">Submit</button>
```

See [`_locale/README.md`](_locale/README.md) for detailed documentation.

## Theming

Dual theme support with automatic detection:

- **Dark Mode** - Low-light optimized with high contrast
- **Light Mode** - Bright, clean interface
- **System Detection** - Respects `prefers-color-scheme`
- **Manual Toggle** - User preference stored in localStorage
- **Smooth Transitions** - Animated theme switching

Themes use CSS custom properties defined in [`styles/style.css`](styles/style.css).

## Accessibility

Committed to WCAG 2.2 AA compliance:

- Semantic HTML5 structure
- ARIA landmarks and roles
- Keyboard navigation (Arrow keys, Escape, Enter)
- Skip links on all pages
- Screen reader support
- Focus management
- High contrast ratios (4.5:1 for text, 3:1 for large text)
- Responsive up to 200% zoom

### Keyboard Navigation

- **Dropdowns:** Arrow keys to navigate, Enter to select, Escape to close
- **Cards:** Enter/Space to activate links
- **Forms:** Tab to navigate, standard form controls

## Pages

### Current Pages

- **Homepage** ([`index.html`](index.html)) - Main landing page
- **About** ([`pages/about/`](pages/about/)) - Company information
- **Team** ([`pages/team/`](pages/team/)) - Staff profiles
- **Contact** ([`pages/contact/`](pages/contact/)) - Contact form and information
- **Splash** ([`pages/splash/`](pages/splash/)) - Promotional landing page
- **Blog** ([`pages/blog/`](pages/blog/)) - Blog gallery and posts
- **Careers** ([`pages/careers/`](pages/careers/)) - Job opportunities
- **Locations** ([`pages/locations/`](pages/locations/)) - Service areas
- **Partners** ([`pages/partners/`](pages/partners/)) - Partner information

### Detail Pages

- **Treatments** ([`pages/treatments/views/`](pages/treatments/views/)) - 7 treatment detail pages
- **Expertise** ([`pages/expertise/views/`](pages/expertise/views/)) - 11 expertise detail pages

## Web Components

Custom elements for reusable UI:

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

- [`.claude/CLAUDE.md`](.claude/CLAUDE.md) - AI assistant instructions and project guidelines
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
