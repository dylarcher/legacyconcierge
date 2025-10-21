# Internationalization (_locale)

This directory contains all translation files for the Legacy Concierge website's custom i18n (internationalization) system.

## Supported Languages

- **English (EN)** - `_locale/en/` - Primary language
- **Spanish (ES)** - `_locale/es/` - Secondary language

Each language directory contains 14 JSON translation files covering all pages and UI elements.

## =Á Translation Files

### Common Files

**common.json** - Shared UI elements across all pages:

- Navigation menu items
- Footer content
- Accessibility labels (skip links, ARIA labels)
- Common buttons and actions

### Page-Specific Files

| File | Used By | Description |
|------|---------|-------------|
| **home.json** | `index.html` | Homepage content |
| **about.json** | `pages/about/` | About page |
| **team.json** | `pages/team/` | Team page with staff profiles |
| **contact.json** | `pages/contact/` | Contact form and business info |
| **splash.json** | `pages/splash/` | Landing/splash page |
| **blog.json** | `pages/blog/` | Blog gallery and blog posts |
| **careers.json** | `pages/careers/` | Career opportunities |
| **locations.json** | `pages/locations/` | Service locations |
| **partners.json** | `pages/partners/` | Partner information |
| **treatments.json** | `pages/treatments/` | Treatments overview |
| **treatments-detail.json** | `pages/treatments/views/*` | All treatment detail pages (shared) |
| **expertise.json** | `pages/expertise/` | Expertise overview |
| **expertise-detail.json** | `pages/expertise/views/*` | All expertise detail pages (shared) |

### Shared Detail Files

**Important:** `treatments-detail.json` and `expertise-detail.json` are shared across multiple pages:

**treatments-detail.json** contains nested objects for 7 treatment pages:
- `post-op-recovery`
- `chronic-pain`
- `wound-care`
- `medication-management`
- `mobility-assistance`
- `nutrition-support`
- `emotional-support`

**expertise-detail.json** contains nested objects for 11 expertise pages:
- `als`, `parkinsons`, `dementia`, `alzheimers`
- `hospice-care`, `palliative-care`, `cancer-care`, `respiratory-care`
- `cardiac-care`, `stroke-recovery`, `diabetes-management`

## =' How It Works

### 1. Core Engine

The i18n system is powered by `scripts/i18n.js`, which:
- Detects browser language on first visit
- Stores user preference in `localStorage` (key: `preferred-language`)
- Calculates relative paths to `_locale/` based on directory depth
- Loads appropriate translation files
- Applies translations to elements with `data-i18n` attributes

### 2. Path Calculation

The system automatically calculates the correct relative path to `_locale/`:

```javascript
// Root level (depth 0): index.html
// Path: _locale/en/home.json

// 2 levels deep: pages/about/index.html
// Path: ../../_locale/en/about.json

// 4 levels deep: pages/treatments/views/post-op-recovery/index.html
// Path: ../../../../_locale/en/treatments-detail.json
```

### 3. Translation Loading

Each page loads:
1. **common.json** - Always loaded first for navigation/footer
2. **Page-specific JSON** - Determined by URL path

```javascript
// Page: pages/about/index.html
// Loads: common.json + about.json

// Page: pages/treatments/views/post-op-recovery/index.html
// Loads: common.json + treatments-detail.json
```

## Translation Key Structure

### Simple Keys

```json
{
  "title": "Welcome to Legacy Concierge",
  "description": "Compassionate in-home nursing care"
}
```

Usage:
```html
<h1 data-i18n="title">Welcome to Legacy Concierge</h1>
<p data-i18n="description">Compassionate in-home nursing care</p>
```

### Nested Keys (Dot Notation)

```json
{
  "hero": {
    "title": "Expert Care",
    "subtitle": "In the comfort of your home"
  }
}
```

Usage:
```html
<h1 data-i18n="hero.title">Expert Care</h1>
<h2 data-i18n="hero.subtitle">In the comfort of your home</h2>
```

### Array Keys (Bracket Notation)

```json
{
  "services": [
    {
      "title": "24/7 Support",
      "description": "Round-the-clock care"
    },
    {
      "title": "Licensed Nurses",
      "description": "Certified professionals"
    }
  ]
}
```

Usage:
```html
<h3 data-i18n="services[0].title">24/7 Support</h3>
<p data-i18n="services[0].description">Round-the-clock care</p>

<h3 data-i18n="services[1].title">Licensed Nurses</h3>
<p data-i18n="services[1].description">Certified professionals</p>
```

### Shared Detail Pages

For treatments and expertise detail pages, use nested keys with page identifier:

```json
{
  "post-op-recovery": {
    "hero": {
      "title": "Post-Operative Recovery",
      "subtitle": "Expert care after surgery"
    },
    "content": {
      "intro": "Comprehensive post-op support..."
    }
  },
  "wound-care": {
    "hero": {
      "title": "Wound Care",
      "subtitle": "Professional wound management"
    }
  }
}
```

Usage in `pages/treatments/views/post-op-recovery/index.html`:
```html
<h1 data-i18n="post-op-recovery.hero.title">Post-Operative Recovery</h1>
<h2 data-i18n="post-op-recovery.hero.subtitle">Expert care after surgery</h2>
<p data-i18n="post-op-recovery.content.intro">Comprehensive post-op support...</p>
```

### Attribute Translations

For ARIA labels, alt text, title attributes, etc.:

```json
{
  "accessibility": {
    "skipToMain": "Skip to main content",
    "closeMenu": "Close navigation menu"
  }
}
```

Usage:
```html
<a href="#main" data-i18n-attr="aria-label:accessibility.skipToMain">Skip</a>
<button data-i18n-attr="aria-label:accessibility.closeMenu">×</button>
```

## <¯ Usage in HTML

### Basic Translation

```html
<h1 data-i18n="page.title">Page Title</h1>
```

### Multiple Elements

```html
<div>
  <h2 data-i18n="section.heading">Heading</h2>
  <p data-i18n="section.text">Text content</p>
  <a href="#" data-i18n="section.link">Read More</a>
</div>
```

### Attributes

```html
<!-- Single attribute -->
<img data-i18n-attr="alt:images.hero">

<!-- Multiple attributes -->
<button data-i18n-attr="aria-label:buttons.submit|title:buttons.submit">
  <span data-i18n="buttons.submit">Submit</span>
</button>
```

### HTML Content

Some translations contain HTML (sanitized for safety):

```json
{
  "richText": "This is <strong>bold</strong> and this is <em>italic</em>."
}
```

```html
<p data-i18n="richText">This is <strong>bold</strong> and this is <em>italic</em>.</p>
```

## =à Adding a New Language

To add a new language (e.g., French):

1. **Create directory:**
   ```bash
   mkdir _locale/fr
   ```

2. **Copy English files:**
   ```bash
   cp _locale/en/*.json _locale/fr/
   ```

3. **Translate all 14 JSON files:**
   - Maintain the same key structure
   - Only change the values, not the keys
   - Preserve HTML tags in rich text

4. **Update `scripts/i18n.js`:**
   - Add 'fr' to supported languages array
   - Update language detection logic if needed

5. **Update language switcher:**
   - Add French option to language switcher component

##  Translation Best Practices

### 1. Maintain Consistent Structure

All languages must have identical key structures:

```json
//  Good - Same structure
// en/about.json
{ "hero": { "title": "About Us" } }

// es/about.json
{ "hero": { "title": "Sobre Nosotros" } }
```

```json
// L Bad - Different structure
// en/about.json
{ "hero": { "title": "About Us" } }

// es/about.json
{ "titulo": "Sobre Nosotros" }  // Wrong key name
```

### 2. Use Semantic Keys

Choose descriptive key names:

```json
//  Good
{ "hero": { "title": "...", "subtitle": "..." } }

// L Bad
{ "h1": "...", "h2": "..." }
```

### 3. Organize by Section

Group related content:

```json
{
  "hero": { "title": "...", "subtitle": "..." },
  "features": { "title": "...", "items": [...] },
  "cta": { "title": "...", "button": "..." }
}
```

### 4. Handle Pluralization

Include both singular and plural forms:

```json
{
  "results": {
    "one": "1 result found",
    "other": "{count} results found"
  }
}
```

### 5. Variable Interpolation

Use `{variable}` placeholders for dynamic content:

```json
{
  "greeting": "Welcome back, {name}!",
  "updated": "Last updated: {date} at {time}"
}
```

### 6. Preserve HTML

Keep HTML tags in translations:

```json
{
  "terms": "By submitting, you agree to our <a href='/terms'>Terms of Service</a>."
}
```

### 7. Escape Special Characters

Use proper JSON escaping:

```json
{
  "quote": "She said, \"Hello!\"",
  "path": "C:\\Users\\Documents"
}
```
## Testing Translations
## =
 Testing Translations

### Manual Testing

1. **Switch languages:**
   - Use language switcher in navigation
   - Or modify localStorage: `localStorage.setItem('preferred-language', 'es')`

2. **Verify all pages:**
   - Check every page in both languages
   - Verify navigation, footer, and page content
   - Test all interactive elements

3. **Check for missing translations:**
   - Look for untranslated text
   - Check browser console for errors
   - Verify attribute translations (aria-label, alt, title)

### Automated Testing

```bash
# Check JSON syntax
find _locale -name "*.json" -exec node -e "require('{}')" \;

# Compare key structures (ensure EN and ES match)
# (Script to be added)
```

## = Common Issues

### Issue: Translation not appearing

**Causes:**
- Missing `data-i18n` attribute
- Incorrect translation key
- JSON syntax error
- File not loaded

**Solutions:**
```html
<!-- Check attribute exists -->
<h1 data-i18n="page.title">Fallback Text</h1>

<!-- Verify key exists in JSON -->
// Check _locale/en/page.json for "page.title"

<!-- Validate JSON syntax -->
// Use jsonlint.com or VS Code linter

<!-- Check browser console for errors -->
```

### Issue: HTML tags showing as text

**Cause:** Translation contains HTML but not marked for innerHTML

**Solution:** The i18n system automatically handles HTML in translations and sanitizes them.

### Issue: Shared detail page loading wrong translations

**Cause:** Incorrect key path in `data-i18n`

**Solution:** Use page identifier prefix:
```html
<!-- For pages/treatments/views/post-op-recovery/index.html -->
<h1 data-i18n="post-op-recovery.hero.title">Title</h1>
<!-- NOT: hero.title -->
```

### Issue: Wrong language loads on first visit

**Cause:** Browser language preference not matching supported languages

**Solution:** System defaults to English if browser language not supported. Check `navigator.language` in console.

## =Ê Translation File Statistics

| Language | Files | Total Keys | Words (approx.) |
|----------|-------|------------|-----------------|
| English  | 14    | ~400       | ~5,000          |
| Spanish  | 14    | ~400       | ~5,500          |

## = Related Files

- **scripts/i18n.js** - Core i18n engine
- **scripts/language-switcher.js** - Language selection component (optional)
- **.claude/CLAUDE.md** - Project documentation with i18n notes

## Further Reading

- [i18n Best Practices](https://www.w3.org/International/questions/qa-i18n)
- [JSON Format Specification](https://www.json.org/)
- [Internationalization API (Intl)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

---

**Need help?** Check `scripts/i18n.js` for implementation details or refer to existing translation files for examples.
