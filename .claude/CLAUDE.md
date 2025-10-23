# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working
with code in this repository.

## Project Overview

Legacy Concierge is an elegant and minimal website for end-of-life in-home
nursing support. The site is built with vanilla HTML/CSS/JavaScript and
features a sophisticated i18n (internationalization) system supporting
English and Spanish.

### Target Demographics

- **Primary Audience:** Elderly individuals and those looking on their
  behalf
  - Age range: 45-85 years old
  - Demographic: Wealthier individuals seeking premium in-home care

**Design Implications:** The interface must be elegant yet minimal for easy
interactivity, with larger touch targets, clear typography, and intuitive
navigation suitable for this age range.

## Code Formatting and Linting

This project uses Biome for code formatting and linting:

```bash
# Format code
npx @biomejs/biome format --write .

# Lint code
npx @biomejs/biome lint .

# Check formatting without writing
npx @biomejs/biome format .
```

Configuration is in `biome.json` with 2-space indentation, 80-character
line width, and recommended linting rules enabled.

## Technology Stack & Standards

This project follows modern web standards using vanilla technologies
without frameworks.

### JavaScript Standards

**Current Implementation:**

- Vanilla JavaScript with standard script tags
- Uses `async`/`await` for asynchronous operations
- Event-driven architecture with `DOMContentLoaded`

**Preferred Patterns (for new code):**

- **JSDocs** for type annotation support throughout the codebase
- **ESM modules** (`import`/`export`) by default instead of script tags
- **tsconfig.json** for IDE support (type checking without TypeScript
  compilation)
- **for...of iteration** over traditional for loops or forEach
- **Promise.try** approach preferred over async/await where appropriate
- **WeakMap and WeakSet** for memory-efficient data structures
- **Generators** for optimizations on large data processing
- **Workers (Web Workers)** to isolate intensive processes and provide
  multi-threading
- **Vanilla Web Components** for reusable UI elements where appropriate

### CSS Standards

**Current Implementation:**

- Single `css/style.css` file
- CSS variables (custom properties) for theming
- Media query for `prefers-color-scheme`
- Flexbox for layouts

**Preferred Patterns (for new code):**

- **Container queries** over media queries where possible
- **Grid** for high-level page structures, **Flexbox** for low-level
  component alignment
- **Latest CSS features** wrapped in `@supports` queries for progressive
  enhancement
- **Comprehensive media queries** for:
  - `prefers-contrast` (high/low contrast support)
  - `prefers-color-scheme` (dark/light mode) ✓ Already implemented
  - `prefers-reduced-motion` (animation control)
  - `prefers-reduced-data` (bandwidth-conscious users)
- **CSS Variables** at both global (`--some-variable-name`) and local
  (`--someVariableName`) scopes ✓ Partially implemented
- **Pseudo-properties** to reduce CSS line count and complexity

### HTML Standards

**Current Implementation:**

- Semantic HTML5 elements
- Schema.org microdata
- WAI-ARIA attributes
- WCAG 2.1 AA compliance

**Preferred Patterns (for new code):**

- **Latest HTML specification** elements
- **Full microdata schema** for all document types ✓ Already implemented
- **Full WAI-ARIA and WCAG 2.2 AA support** (upgrade from 2.1)
- **`<template>` elements** for repeated UI patterns (navigation, cards,
  etc.)
- **Native HTML functionality** preferred over JavaScript/CSS
  implementations

### Browser Storage

**Current Implementation:**

- localStorage for theme preferences (`preferred-theme`)
- localStorage for language preferences (`preferred-language`)

**Preferred Patterns (for new code):**

- **IndexedDB** as primary storage for:
  - User preferences
  - Custom presets
  - Application state
  - Browsing history
- **localStorage fallback** for progressive enhancement when IndexedDB is
  unavailable

### Web Components

**Future Enhancement:**

- Vanilla Web Components for UI elements (navigation, language switcher,
  theme toggle)
- Ensure components are accessible and semantic
- Support server-side rendering where applicable

Note: The `js/language-switcher.js` file contains a class-based component
that could be refactored into a Web Component.

## Architecture

### Directory Structure

- `index.html` - Homepage (root level)
- `pages/` - All other pages organized by section
  - `pages/treatments/views/` - Treatment detail pages (7 pages)
  - `pages/expertise/views/` - Expertise detail pages (11 pages)
  - `pages/about/`, `pages/team/`, `pages/contact/`, etc.
- `_locale/` - Translation JSON files organized by language (en, es) -
  follows i18n specification
- `js/` - JavaScript modules
- `css/style.css` - Single stylesheet for entire site
- `assets/images/` - Image assets

### Internationalization (i18n) System

The i18n system is the most complex part of this codebase. Understanding
it is critical:

**How It Works:**

1. `js/i18n.js` contains the core i18n engine
2. HTML elements use `data-i18n` attributes to reference translation keys
3. Translation files are split into `common.json` (navigation, footer,
   etc.) and page-specific files
4. The system calculates relative paths to `_locale/` based on directory
   depth

**Translation File Mapping:**

- Root `index.html` → `_locale/{lang}/home.json`
- Detail pages like `pages/treatments/views/post-op-recovery/` →
  `_locale/{lang}/treatments-detail.json` (shared by all treatment detail
  pages)
- Detail pages like `pages/expertise/views/als/` →
  `_locale/{lang}/expertise-detail.json` (shared by all expertise detail
  pages)
- Other pages like `pages/about/` → `_locale/{lang}/about.json`

**Path Calculation:**
The i18n system automatically calculates the correct relative path to
`_locale/` based on directory depth:

- Root (depth 0): `_locale`
- `pages/about/` (depth 2): `../../_locale`
- `pages/treatments/views/post-op-recovery/` (depth 4):
  `../../../../_locale`

**Translation Keys:**

- Use dot notation for nested keys: `navigation.home`,
  `treatments-detail.post-op-recovery.title`
- Use bracket notation for arrays: `infoCards[0].title`
- Special attributes use `data-i18n-attr`:
  `data-i18n-attr="aria-label:accessibility.skipToMain"`

### JavaScript Modules

- `js/app.js` - Navigation, mobile menu, scroll effects, keyboard
  navigation for dropdowns
- `js/i18n.js` - Core i18n system (translation loading, application, meta
  tag updates)
- `js/language-switcher.js` - Language switcher component (currently
  unused, but available)
- `js/theme.js` - Dark/light mode theme management with localStorage
  persistence
- `js/i18n-updater.js` - Utility for batch updating HTML files with i18n
  attributes
- `js/batch-i18n-update.js` - Batch processing for i18n updates

### HTML Structure Patterns

All pages follow a consistent structure:

1. Skip link for accessibility
2. Header with logo and navigation (includes nested dropdowns for
   treatments/expertise)
3. Main content area with semantic HTML5 and Schema.org microdata
4. Footer with copyright
5. Script imports: `theme.js`, `app.js`, `i18n.js` (in that order)

**Important:** Relative paths in HTML must account for directory depth:

- Root: `css/style.css`, `js/app.js`
- 2 levels deep: `../../style/style.css`, `../../script/app.js`
- 4 levels deep: `../../../../style/style.css`, `../../../../script/app.js`

### Theming System

The theme system uses:

- `data-theme` attribute on `<html>` element
- CSS variables defined for both light and dark themes
- localStorage persistence with key `preferred-theme`
- Automatic detection of system preference via `prefers-color-scheme`

## Development Workflow

### Testing Changes

Since this is a static site, there's no build process. To test:

1. Open HTML files directly in a browser (file://)
2. Use a local web server for proper CORS handling:

   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node.js (if http-server is installed)
   npx http-server -p 8000
   ```

3. Navigate to `http://localhost:8000`

### Adding New Pages

When creating new pages:

1. Create HTML file in appropriate directory
2. Add corresponding translation files in `_locale/en/` and `_locale/es/`
3. Ensure relative paths for CSS/JS are correct based on directory depth
4. Add `data-i18n` attributes for all translatable content
5. Update navigation in all HTML files if the page should appear in nav

### Modifying Translations

1. Edit appropriate JSON files in `_locale/{lang}/`
2. Maintain consistent key structure across languages
3. Test language switching to ensure all content displays correctly
4. Remember that `treatments-detail.json` and `expertise-detail.json` are
   shared across multiple pages - they contain nested objects keyed by
   page identifier

## Common Pitfalls

1. **Relative Paths:** The most common error is incorrect relative paths.
   Always count directory depth carefully.
2. **i18n Key Structure:** Detail pages use nested keys like
   `treatments-detail.post-op-recovery.title` within shared JSON files.
3. **Common vs Page JSON:** Navigation, footer, accessibility strings are
   in `common.json`. Page content is in page-specific files.
4. **Script Load Order:** Theme must load before app and i18n to prevent
   flash of unstyled content.
5. **Language Detection:** The system auto-detects browser language on
   first visit, then uses localStorage for persistence.
6. **Technology Standards:** When adding new features, prefer modern
   patterns (ESM modules, Web Components, IndexedDB) over the current
   implementation patterns. The existing code uses legacy patterns that
   work but should not be replicated in new code.
7. **Target Audience:** Always consider the 45-85 age demographic when
   making UI/UX decisions. Prioritize clarity and simplicity over
   complexity.

## Design Requirements

The site must maintain an **elegant and minimal** aesthetic that supports
the target demographic:

- Large, readable typography
- Generous spacing and touch targets (minimum 44x44px for interactive
  elements)
- Clear visual hierarchy
- High contrast ratios (WCAG 2.2 AA compliant)
- Minimal cognitive load - simple, intuitive navigation

### Page layouts & templates

- Page layouts:
  - Create a homepage template that uses a fullscreen background video for
    the top portion of the page.
    - The same navbar can be used for the homepage & subpages throughout
      the entire website.
  - Create a simple subpage template that has a minimal right-sidebar that
    contains resources & reference lists or images.
  - Create a bentobox grid subpage that uses cards with differing
    dimensions in a masonry-like layout.
  - Create a contact page for support and other user submissions (like
    responses to job listings, etc.)
  - Create a splash page layout that is for promotional content and
    landing page announcement style contexts.
  - Create a blog page layout that displays blog/forum like content.
  - Create a blog gallery layout that shows all the blogs in a sortable,
    filterable, and searchable format.

### Theme Support

- **Dark mode** and **light mode** support ✓ Implemented
- Respects user's system preferences
- Manual toggle available
- Smooth transitions between themes

## Accessibility

The site must achieve **WCAG 2.2 AA compliance** with comprehensive
**WAI-ARIA** support:

**Current Implementation (WCAG 2.1 AA):**

- Skip links on all pages (`data-i18n="accessibility.skipToMain"`)
- ARIA labels and roles throughout navigation
- Keyboard navigation for dropdowns (Arrow keys, Escape, Enter)
- Semantic HTML5 structure
- Schema.org microdata for SEO
- `aria-expanded` states for dropdown menus
- `aria-haspopup` attributes for menus with submenus
- Focus management for modal interactions

**Required Enhancements for WCAG 2.2 AA:**

- Additional focus indicators meeting enhanced requirements
- Dragging movements alternatives (if any drag interactions are added)
- Consistent help mechanisms
- Redundant entry prevention (form submissions)
- Accessible authentication (if user accounts are added)

**WAI-ARIA Best Practices:**

- Landmark roles: `banner`, `navigation`, `main`, `contentinfo`
- Live regions for dynamic content updates (language switching, theme
  changes)
- Proper heading hierarchy (h1-h6)
- Form labels and error messaging
- Status messages for user actions

**Accessibility Testing:**

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation verification
- Color contrast validation (4.5:1 for normal text, 3:1 for large text)
- Zoom testing up to 200%

**Documentation & Markdown files:**

- Place all *.md files generated somewhere in the [docs/**](./docs/)
  folder.
- Attempt to consolidate documentation to the four categories in
  [docs/](./docs/):
  - [docs/explanation/](./docs/explanation/): Explanation is a discursive
    treatment of a subject, that permits reflection. Explanation is
    understanding-oriented.
  - [docs/how-to-guides/](./docs/how-to-guides/): How-to guides are
    directions that guide the reader through a problem or towards a
    result. How-to guides are goal-oriented.
  - [docs/reference/](./docs/reference/): Reference guides are technical
    descriptions of the machinery and how to operate it. Reference
    material is information-oriented.
  - [docs/tutorials/](./docs/tutorials/): A tutorial is an experience that
    takes place under the guidance of a tutor. A tutorial is always
    learning-oriented.
  - [docs/reports/](./docs/reports/): For generated metrics and analysis
    documents.
- Always put utility scripts/helpers that do not pertain to the code used in the live production environment in the bin folder.