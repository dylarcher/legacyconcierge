# Assets

This directory contains all static assets for the Legacy Concierge website, including images, media files, icons, and logos.

## Directory Structure

```
assets/
images/          # Page images (treatments, expertise, team photos)
media/           # Media assets organized by type
   bg/          # Background images
   icons/       # SVG and icon files
   logos/       # Logo variations
   misc/        # Miscellaneous media
   team/        # Team member photos
```

## Images Directory (`assets/images/`)

Contains 53 images used throughout the site:

### Team Member Photos

Professional headshots of Legacy Concierge staff:

- Andrew.jpg
- Cassie.jpg
- Dave.jpg
- Diane.jpg
- Elie.jpg
- Eyleen.jpg
- Hannah2028129.jpg
- Heather2.jpg
- Josh2028129.jpg
- Kurt20Headshot20Tie.jpg
- Melissa.jpg
- Rylie-1.jpg
- Sarah.jpg
- Zehra.jpg

**Usage:** `pages/team/index.html`

**Dimensions:** Various (typically 500-1000px width)

### Treatment Images

Images for treatment detail pages (`pages/treatments/views/`):

- **post-op-recovery.jpg** - Post-operative care imagery
- **pain-management.jpg** - Pain management services
- **iv-therapy.jpg** - IV infusion therapy
- **mental-health.jpg** - Mental health support
- **rehab-addiction.jpg** - Rehabilitation services
- **eating-disorders.jpg** - Eating disorder support

### Expertise Images

Images for expertise detail pages (`pages/expertise/views/`):

- **als.jpg** - ALS care
- **alzheimers.jpg** - Alzheimer's care
- **dementia.jpg** - Dementia care
- **parkinsons.jpg** - Parkinson's disease care
- **cardiac-pulmonary.jpg** - Cardiac/pulmonary care
- **heart-disease.jpg** - Heart disease management
- **diabetes-management.jpg** - Diabetes care
- **stroke-recovery.jpg** - Stroke rehabilitation
- **tbi.jpg** - Traumatic brain injury care
- **ms.jpg** - Multiple sclerosis care
- **oncology.jpg** - Cancer care
- **ostomy-management.jpg** - Ostomy management

### General/Homepage Images

- **hero-nurse.jpg** - Hero section image
- **logo-light.png** - Site logo (light version)
- **best-concierge-private-duty-nursing-services-near-me-southern-california.jpg** - Service showcase
- **best-private-duty-nursing-company-to-work-for-near-me-1024x1024.jpg** - Careers page
- **best-private-duty-nursing-home-care-company-to-work-for-southern-california.jpg** - Company culture
- Various pexels stock photos (pexels-*.jpg)

## Media Directory (`assets/media/`)

### Background Images (`assets/media/bg/`)

Background images and textures for sections:

- Hero backgrounds
- Section overlays
- Decorative elements

**Formats:** JPG, PNG

### Icons (`assets/media/icons/`)

SVG and icon files (120 files):

- UI icons (navigation, forms, actions)
- Service icons (medical, care types)
- Social media icons
- Feature indicators

**Format:** Primarily SVG for scalability

**Usage:** Throughout site for visual indicators and UI elements

### Logos (`assets/media/logos/`)

Logo variations for different contexts:

- Light mode logo
- Dark mode logo
- Favicon
- Social media logos

**Formats:** PNG, SVG

**Usage:** Header, footer, meta tags

### Miscellaneous (`assets/media/misc/`)

Other media assets:

- Decorative images
- Patterns
- Illustrations
- Supporting graphics

### Team Photos (`assets/media/team/`)

Alternative or optimized team member photos (25 files):

- Web-optimized versions
- Thumbnail sizes
- Different formats

## Image Guidelines

### Recommended Dimensions

| Usage | Dimensions | Format | Max Size |
|-------|------------|--------|----------|
| Hero images | 1920x1080px | JPG | 300KB |
| Team photos | 800x800px | JPG | 150KB |
| Treatment/expertise | 1200x800px | JPG | 250KB |
| Thumbnails | 400x400px | JPG/PNG | 50KB |
| Icons | 64x64px | SVG | 10KB |
| Logos | Various | SVG/PNG | 20KB |

### Optimization

All images should be optimized before deployment:

```bash
# Using ImageOptim (macOS)
# Drag and drop images to ImageOptim app

# Using imagemin-cli (Node.js)
npx imagemin assets/images/*.jpg --out-dir=assets/images/optimized

# Using squoosh-cli
npx @squoosh/cli --webp auto assets/images/*.jpg
```

### Formats

- **JPG** - Photographs, complex images with gradients
- **PNG** - Images requiring transparency, logos
- **SVG** - Icons, logos, simple graphics (preferred for scalability)
- **WebP** - Modern format for better compression (future enhancement)

### Naming Conventions

Use descriptive, lowercase, hyphenated names:

```bash
# Good
hero-nurse-care.jpg
team-member-jane-doe.jpg
icon-24-7-support.svg

# Bad
IMG_1234.jpg
photo.jpg
icon1.svg
```

### Accessibility

All images must have appropriate alt text in HTML:

```html
<!-- Decorative images -->
<img src="assets/images/hero-nurse.jpg" alt="" role="presentation">

<!-- Informative images -->
<img src="assets/images/team/jane-doe.jpg" alt="Jane Doe, RN - Senior Nurse">

<!-- Functional images (icons with meaning) -->
<img src="assets/media/icons/phone.svg" alt="Call us">
```

## Adding New Assets

### 1. Choose Appropriate Directory

```bash
# Team photos
assets/images/john-smith.jpg

# Treatment images
assets/images/new-treatment.jpg

# Icons
assets/media/icons/new-icon.svg

# Logos
assets/media/logos/logo-variant.svg
```

### 2. Optimize Image

```bash
# Compress with ImageOptim, TinyPNG, or similar tool
# Target: < 300KB for photos, < 50KB for icons
```

### 3. Use Descriptive Names

```bash
# Describe content, not context
team-member-john-smith.jpg    # Good
page3-photo.jpg               # Bad
```

### 4. Add to HTML with Alt Text

```html
<img
  src="assets/images/team-member-john-smith.jpg"
  alt="John Smith, RN - Head Nurse with 15 years experience"
  width="800"
  height="800"
  loading="lazy"
>
```

### 5. Add Translations

If image has alt text, add to `_locale/{lang}/*.json`:

```json
{
  "images": {
    "teamJohnSmith": "John Smith, RN - Enfermero jefe con 15 a�os de experiencia"
  }
}
```

```html
<img
  src="assets/images/team-member-john-smith.jpg"
  data-i18n-attr="alt:images.teamJohnSmith"
  alt="John Smith, RN - Head Nurse with 15 years experience"
>
```

## Responsive Images

Use responsive image techniques for better performance:

### srcset for Resolution Switching

```html
<img
  src="assets/images/hero-nurse.jpg"
  srcset="
    assets/images/hero-nurse-400.jpg 400w,
    assets/images/hero-nurse-800.jpg 800w,
    assets/images/hero-nurse-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Compassionate nurse providing in-home care"
>
```

### picture for Art Direction

```html
<picture>
  <source
    media="(max-width: 600px)"
    srcset="assets/images/hero-mobile.jpg"
  >
  <source
    media="(max-width: 1000px)"
    srcset="assets/images/hero-tablet.jpg"
  >
  <img
    src="assets/images/hero-desktop.jpg"
    alt="Compassionate nurse providing in-home care"
  >
</picture>
```

## Copyright & Licensing

### Team Photos

All team member photos are proprietary and � Legacy Concierge.

**Usage:** Internal use only, not for redistribution.

### Stock Photos

Images from Pexels (pexels-*.jpg) are licensed under:

- **Pexels License** - Free for personal and commercial use
- **Attribution:** Not required but appreciated

### Icons

Icons should be:

- Created in-house
- Licensed from icon libraries (Font Awesome, Heroicons, etc.)
- Public domain or CC0 licensed

**Always verify licensing before adding third-party assets.**

## Current Asset Statistics

| Type | Count | Total Size | Avg Size |
|------|-------|------------|----------|
| Team photos (images/) | 14 | ~4.5MB | ~320KB |
| Treatment images | 6 | ~5MB | ~830KB |
| Expertise images | 12 | ~2.5MB | ~210KB |
| General images | 21 | ~9MB | ~430KB |
| Icons (media/icons/) | 120 | ~1MB | ~8KB |
| Total | 173 | ~22MB | ~127KB |

**Note:** Images should be optimized to reduce total size to under 10MB.

## Asset Management

### Organizing Assets

- **Keep related assets together** - Treatment images in one location
- **Use subdirectories** - Group by type (icons, logos, team)
- **Version control** - Don't commit unoptimized originals
- **Clean up unused assets** - Remove assets no longer in use

### Asset Pipeline (Future Enhancement)

```bash
# Automated optimization pipeline
npm run optimize-images

# Generate responsive image variants
npm run generate-responsive

# Convert to modern formats
npm run convert-webp
```

## Related Files

- **HTML files** - All pages reference assets via relative paths
- **theme/style.css** - Some assets used as CSS backgrounds
- **_locale/*.json** - Alt text translations for images

## Tools & Resources

### Optimization Tools

- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [ImageOptim](https://imageoptim.com/) - Mac app for optimization
- [Squoosh](https://squoosh.app/) - Web-based image optimizer
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimizer

### Stock Photos

- [Pexels](https://www.pexels.com/) - Free stock photos
- [Unsplash](https://unsplash.com/) - High-quality free images
- [Pixabay](https://pixabay.com/) - Free images and vectors

### Icon Libraries

- [Heroicons](https://heroicons.com/) - Beautiful SVG icons
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Feather Icons](https://feathericons.com/) - Simple, open-source icons

---

**Best Practice:** Always optimize images before committing to version control to keep repository size manageable.
