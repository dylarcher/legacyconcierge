# Legacy Concierge Website Path Audit Report

Generated: 2025-10-23T06:30:28.343Z

## Summary

- Total expected pages: 41
- Missing pages: 0
- CSS path issues: 7
- JS path issues: 0
- Image path issues: 0
- Link issues: 7

## CSS Path Issues

Pages with incorrect CSS paths (should use `/shared/theme/style.css`):

### pages/demos/blog/index.html:10
- **Found:** `/shared/theme/layouts/blog.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/blog/post/index.html:10
- **Found:** `/shared/theme/layouts/blog.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/entry/index.html:10
- **Found:** `/shared/theme/layouts/homepage.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/entry/landing/index.html:10
- **Found:** `/shared/theme/layouts/splash.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/subpage/contact/index.html:10
- **Found:** `/shared/theme/layouts/contact.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/subpage/gallery/index.html:10
- **Found:** `/shared/theme/layouts/bentobox.css`
- **Expected:** `/shared/theme/style.css`

### pages/demos/subpage/sidebar/index.html:10
- **Found:** `/shared/theme/layouts/sidebar.css`
- **Expected:** `/shared/theme/style.css`

## Navigation Link Issues

Pages with relative navigation links (should use absolute paths):

### pages/demos/index.html:222
- **Found:** `homepage-video/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:236
- **Found:** `subpage-sidebar/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:250
- **Found:** `bentobox-grid/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:264
- **Found:** `blog-gallery/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:278
- **Found:** `blog-post/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:292
- **Found:** `contact-form/`
- **Expected:** `Absolute path starting with /`

### pages/demos/index.html:306
- **Found:** `splash-landing/`
- **Expected:** `Absolute path starting with /`
