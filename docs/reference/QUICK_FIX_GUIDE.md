# Quick Fix Guide - Broken Links

This document provides exact line-by-line fixes for all broken links found in the audit.

---

## File 1: `/pages/demos/index.html`

**Issue:** 7 broken relative links to non-existent demo pages

### Line 222
```html
<!-- CURRENT (BROKEN) -->
<a href="homepage-video/" class="bento-card large featured">

<!-- FIX TO -->
<a href="/pages/demos/hero/" class="bento-card large featured">
```

### Line 236
```html
<!-- CURRENT (BROKEN) -->
<a href="subpage-sidebar/" class="bento-card">

<!-- FIX TO -->
<a href="/pages/demos/subpage/sidebar/" class="bento-card">
```

### Line 250
```html
<!-- CURRENT (BROKEN) -->
<a href="bentobox-grid/" class="bento-card">

<!-- FIX TO -->
<a href="/pages/demos/subpage/gallery/" class="bento-card">
```

### Line 264
```html
<!-- CURRENT (BROKEN) -->
<a href="blog-gallery/" class="bento-card wide">

<!-- FIX TO -->
<a href="/pages/demos/blog/" class="bento-card wide">
```

### Line 278
```html
<!-- CURRENT (BROKEN) -->
<a href="blog-post/" class="bento-card">

<!-- FIX TO -->
<a href="/pages/demos/blog/post/" class="bento-card">
```

### Line 292
```html
<!-- CURRENT (BROKEN) -->
<a href="contact-form/" class="bento-card tall">

<!-- FIX TO -->
<a href="/pages/demos/subpage/contact/" class="bento-card tall">
```

### Line 306
```html
<!-- CURRENT (BROKEN) -->
<a href="splash-landing/" class="bento-card">

<!-- FIX TO -->
<a href="/pages/demos/entry/landing/" class="bento-card">
```

---

## File 2: `/pages/demos/entry/landing/index.html`

**Issue:** Links to `/pages/contact` which doesn't exist (should be `/pages/about/contact`)

### Line 470
```html
<!-- CURRENT (BROKEN) -->
<a href="/pages/contact" data-i18n="splash.header.contact">Contact</a>

<!-- FIX TO -->
<a href="/pages/about/contact" data-i18n="splash.header.contact">Contact</a>
```

### Line 516
```html
<!-- CURRENT (BROKEN) -->
href="/pages/contact"

<!-- FIX TO -->
href="/pages/about/contact"
```

---

## File 3: `/pages/demos/subpage/sidebar/index.html`

**Issue:** Links to `/pages/team` and `/pages/contact` which don't exist

### Line 246
```html
<!-- CURRENT (BROKEN) -->
<a href="/pages/team" data-i18n="sidebar.quickLinks.team"

<!-- FIX TO -->
<a href="/pages/about/team" data-i18n="sidebar.quickLinks.team"
```

### Line 252
```html
<!-- CURRENT (BROKEN) -->
href="/pages/contact"

<!-- FIX TO -->
href="/pages/about/contact"
```

### Line 310
```html
<!-- CURRENT (BROKEN) -->
href="/pages/contact"

<!-- FIX TO -->
href="/pages/about/contact"
```

---

## Summary of Changes

**Total Files to Fix:** 3
**Total Lines to Change:** 14 (across 9 unique broken links)

### File Edit Summary
1. `/pages/demos/index.html` - 7 lines
2. `/pages/demos/entry/landing/index.html` - 2 lines
3. `/pages/demos/subpage/sidebar/index.html` - 3 lines

### Search & Replace Commands (Terminal)

If you prefer to use sed or similar tools:

```bash
# Fix /pages/contact -> /pages/about/contact
sed -i.bak 's|href="/pages/contact"|href="/pages/about/contact"|g' pages/demos/entry/landing/index.html
sed -i.bak 's|href="/pages/contact"|href="/pages/about/contact"|g' pages/demos/subpage/sidebar/index.html

# Fix /pages/team -> /pages/about/team
sed -i.bak 's|href="/pages/team"|href="/pages/about/team"|g' pages/demos/subpage/sidebar/index.html
```

**Note:** The `/pages/demos/index.html` file requires manual edits as each link is different.

---

## Verification

After making changes, run the audit script to verify all fixes:

```bash
node comprehensive-audit.cjs
```

Expected result after fixes:
- **Missing pages:** 0
- **Broken links:** 0
- **Relative link issues:** 0
- **Total issues:** 0

---

## Testing Checklist

- [ ] All links in `/pages/demos/index.html` navigate correctly
- [ ] Contact links in landing page work
- [ ] Team and contact links in sidebar demo work
- [ ] No console errors (404s) when navigating
- [ ] Run audit script confirms 0 issues
