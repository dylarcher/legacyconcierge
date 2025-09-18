# Legacy Concierge Asset Mapping

## Image Assets Inventory

### Team Photos
| Original Filename | New Location | Usage | Dimensions |
|------------------|--------------|-------|------------|
| Melissa.jpg | public/images/team/melissa.jpg | Team page - CEO | Optimize to 400x400 |
| Kurt20Headshot20Tie.jpg | public/images/team/kurt.jpg | Team page - Leadership | Optimize to 400x400 |
| Heather2.jpg | public/images/team/heather.jpg | Team page - Staff | Optimize to 400x400 |
| Sarah.jpg | public/images/team/sarah.jpg | Team page - Staff | Optimize to 400x400 |
| Andrew.jpg | public/images/team/andrew.jpg | Team page - Staff | Optimize to 400x400 |
| Elie.jpg | public/images/team/elie.jpg | Team page - Staff | Optimize to 400x400 |
| Dave.jpg | public/images/team/dave.jpg | Team page - Staff | Optimize to 400x400 |
| Josh2028129.jpg | public/images/team/josh.jpg | Team page - Staff | Optimize to 400x400 |

### Service Images
| Original Filename | New Location | Usage | Optimization |
|------------------|--------------|-------|--------------|
| best-private-duty-nursing-home-care-company-to-work-for-southern-california.jpg | public/images/services/home-care-hero.jpg | Homepage hero | WebP, 1920x1080 |
| iv-infusion-therapy-private-duty-nursing-near-me-.jpg | public/images/services/iv-therapy.jpg | IV Therapy service page | WebP, 800x600 |
| pain-management-private-duty-concierge-nurses-near-me-.jpg | public/images/services/pain-management.jpg | Pain Management page | WebP, 800x600 |
| mental-health-home-care-services-near-me-southern-california.jpg | public/images/services/mental-health.jpg | Mental Health page | WebP, 800x600 |

### Branding Assets
| Original Filename | New Location | Usage | Format |
|------------------|--------------|-------|--------|
| best-concierge-nursing-company-in-california.png | public/images/logo.png | Site logo | PNG, SVG needed |
| facebook20banner.jpg | public/images/social/og-image.jpg | Open Graph image | 1200x630 |
| favicon (to be created) | public/favicon.ico, public/icon-*.png | Browser icons | Multiple sizes |

### Stock Photos
| Original Filename | New Location | Usage |
|------------------|--------------|-------|
| pexels-maurizio-catalucci-*.jpg | public/images/stock/healthcare-1.jpg | General healthcare imagery |
| pexels-jefferson-lucena-*.jpg | public/images/stock/healthcare-2.jpg | Background images |
| pexels-taryn-elliott-*.jpg | public/images/stock/healthcare-3.jpg | Service sections |

## Content Structure Mapping

### Data Files (src/data/)

#### services.json
```json
{
  "specializedExpertise": [
    {
      "id": "als-care",
      "title": "ALS Concierge Nursing",
      "slug": "als-concierge-nursing",
      "description": "Specialized care for ALS patients",
      "icon": "neurological",
      "category": "neurological"
    },
    // ... additional services
  ],
  "treatments": [
    {
      "id": "iv-therapy",
      "title": "IV and Infusion Therapy",
      "slug": "iv-infusion-therapy",
      "description": "Professional IV therapy services",
      "icon": "medical",
      "category": "treatment"
    },
    // ... additional treatments
  ]
}
```

#### team.json
```json
{
  "members": [
    {
      "id": "melissa",
      "name": "Melissa",
      "title": "CEO & Founder",
      "image": "/images/team/melissa.jpg",
      "bio": "Leadership description",
      "credentials": ["RN", "BSN"],
      "order": 1
    },
    // ... additional team members
  ]
}
```

#### locations.json
```json
{
  "serviceAreas": [
    {
      "id": "los-angeles",
      "name": "Los Angeles County",
      "cities": ["Los Angeles", "Beverly Hills", "Santa Monica", "Pasadena"],
      "coverage": "full"
    },
    {
      "id": "orange-county",
      "name": "Orange County",
      "cities": ["Irvine", "Newport Beach", "Anaheim", "Huntington Beach"],
      "coverage": "full"
    },
    {
      "id": "san-diego",
      "name": "San Diego County",
      "cities": ["San Diego", "La Jolla", "Carlsbad", "Del Mar"],
      "coverage": "partial"
    }
  ]
}
```

## Component to Asset Mapping

### Navigation Component
- Logo: `/images/logo.png`
- Mobile menu icon: CSS/SVG (no image needed)

### Hero Component
- Background: `/images/services/home-care-hero.jpg`
- Overlay pattern: CSS gradient

### Service Cards
- Icons: Custom SVG sprite sheet
- Background images: Service-specific images

### Team Cards
- Profile images: `/images/team/[name].jpg`
- Placeholder: `/images/team/placeholder.jpg`

### Footer
- Logo: `/images/logo.png`
- Social icons: SVG sprite sheet

## Image Optimization Strategy

### Format Guidelines
1. **Hero Images**: WebP with JPEG fallback, 1920x1080 max
2. **Service Images**: WebP, 800x600 for cards
3. **Team Photos**: WebP, 400x400 square crop
4. **Logos**: SVG primary, PNG fallback
5. **Icons**: SVG sprite sheet

### Loading Strategy
```javascript
// Lazy loading for non-critical images
<img loading="lazy" src="/images/services/service.jpg" alt="Service description">

// Eager loading for above-the-fold content
<img loading="eager" src="/images/hero.jpg" alt="Hero image">

// Responsive images
<picture>
  <source srcset="/images/hero.webp" type="image/webp">
  <source srcset="/images/hero.jpg" type="image/jpeg">
  <img src="/images/hero.jpg" alt="Hero">
</picture>
```

## CSS Asset References

### Custom Properties
```css
:root {
  --logo-url: url('/images/logo.svg');
  --hero-bg: url('/images/services/home-care-hero.jpg');
  --pattern-overlay: url("data:image/svg+xml,...");
}
```

### Background Images
```css
.hero {
  background-image:
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    var(--hero-bg);
}
```

## PWA Assets Required

### App Icons
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### Splash Screens
- apple-touch-icon.png (180x180)
- splash-640x1136.png
- splash-750x1334.png
- splash-1242x2208.png
- splash-1125x2436.png

## Build Process Integration

### Vite Asset Handling
```javascript
// vite.config.js additions
build: {
  assetsInlineLimit: 4096, // 4kb
  rollupOptions: {
    output: {
      assetFileNames: 'assets/[name]-[hash][extname]',
      chunkFileNames: 'js/[name]-[hash].js',
      entryFileNames: 'js/[name]-[hash].js'
    }
  }
}
```

### Image Processing Pipeline
1. Source images in `src/assets/images/`
2. Process through Vite build
3. Output optimized to `dist/assets/`
4. Serve with proper caching headers

## Next Steps

1. **Image Optimization**
   - Convert all JPEGs to WebP
   - Create responsive image sets
   - Generate SVG logos and icons

2. **Asset Pipeline Setup**
   - Configure Vite image optimization
   - Set up automatic sprite generation
   - Implement lazy loading utilities

3. **Content Migration**
   - Extract text content from HTML files
   - Create JSON data structures
   - Set up content management helpers

4. **Performance Optimization**
   - Implement image lazy loading
   - Set up resource hints (preload, prefetch)
   - Configure CDN integration