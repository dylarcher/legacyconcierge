# CMS Deployment Guide

This guide explains how to deploy the Legacy Concierge website to various Content Management Systems (CMS) and platforms. The unified build system supports multiple CMS platforms while maintaining the same modern vanilla JavaScript and CSS codebase.

## Supported Platforms

### Traditional CMS Platforms
- **WordPress** - Complete PHP theme with custom post types
- **Drupal** - Full Drupal theme with custom content types
- **Ghost** - Modern publishing platform theme

### E-commerce Platforms
- **Shopify** - Complete Liquid theme for healthcare services

### Static Site Generators
- **Static HTML** - Pure HTML/CSS/JS for any web server

### Headless CMS Platforms
- **Strapi** - Self-hosted headless CMS
- **Contentful** - Cloud-based headless CMS
- **Sanity** - Real-time collaborative CMS
- **Webflow** - Visual web design platform with CMS
- **Prismic** - Slice-based headless CMS
- **Directus** - Data-first headless CMS
- **Netlify CMS** - Git-based content management

## Quick Start

Build all platforms at once:
```bash
npm run build:all
```

Or build specific platforms:
```bash
npm run build:wordpress    # WordPress theme
npm run build:shopify      # Shopify theme
npm run build:drupal       # Drupal theme
npm run build:ghost        # Ghost theme
npm run build:static       # Static website
npm run build:cms          # Headless CMS configs
```

## Platform-Specific Deployment

### WordPress Deployment

**Output:** `dist/wordpress/`

**Installation:**
1. Upload the generated theme to `/wp-content/themes/`
2. Activate the theme in WordPress admin
3. Install recommended plugins:
   - Advanced Custom Fields (for custom fields)
   - Yoast SEO (for enhanced SEO)
   - Contact Form 7 (for contact forms)

**Features:**
- Responsive design with mobile-first approach
- Custom post types for services and testimonials
- Widget-ready sidebar areas
- SEO-optimized templates
- Accessibility features (WCAG 2.2 AA)
- Contact form integration
- Schema.org structured data

**Customization:**
- Theme options in Customizer
- Custom CSS support
- Widget areas for flexible content
- Menu locations for navigation

### Shopify Deployment

**Output:** `dist/shopify/`

**Installation:**
1. Create a new Shopify store or access existing one
2. Go to Online Store > Themes
3. Upload the theme ZIP file
4. Customize using Shopify's theme editor

**Features:**
- Product catalog for healthcare services
- Customer account management
- Contact forms for consultation requests
- Responsive mobile design
- SEO optimized for health services
- Customizable color schemes and fonts
- Integration with Shopify's built-in analytics

**Configuration:**
- Set up service "products" for each healthcare offering
- Configure collections for service categories
- Set up consultation request forms
- Customize contact information in theme settings

### Drupal Deployment

**Output:** `dist/drupal/`

**Installation:**
1. Extract theme to `/themes/custom/legacy_concierge/`
2. Enable the theme in Drupal admin
3. Create content types:
   - Service (machine name: service)
   - Testimonial (machine name: testimonial)
   - Team Member (machine name: team_member)

**Features:**
- Drupal 9+ compatible
- Twig templates for all components
- Custom content types with fields
- Views integration for content listing
- Responsive design with breakpoints
- Accessibility compliant
- Multilingual support ready

**Content Structure:**
- Pages for general content
- Services with categories and descriptions
- Team member profiles
- Client testimonials
- News and blog posts

### Ghost Deployment

**Output:** `dist/ghost/`

**Installation:**
1. Access Ghost admin panel
2. Go to Settings > Design
3. Upload the theme ZIP file
4. Activate the new theme

**Features:**
- Modern publishing platform
- Built-in SEO optimization
- Member subscription system
- Newsletter integration
- Social media sharing
- Responsive design
- Fast loading performance

**Content Setup:**
- Create pages for services
- Set up navigation menus
- Configure social media links
- Set up member subscription (optional)
- Create service-related tags

### Static Site Deployment

**Output:** `dist/static/`

**Installation:**
1. Upload files to any web server
2. Ensure server supports HTML5 and modern browsers
3. Configure server for proper MIME types
4. Set up HTTPS (recommended)

**Features:**
- No database required
- Fast loading times
- Works with any web server
- CDN-friendly
- Progressive Web App capabilities
- Offline functionality

**Hosting Options:**
- Netlify (recommended for ease)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web hosting

### Headless CMS Deployment

**Output:** `dist/headless-cms/`

Each headless CMS has its own configuration files and integration guides:

#### Strapi
- **Files:** `strapi/page.json`, `strapi/treatment.json`
- **Setup:** Import content types via Strapi admin
- **Features:** Self-hosted, customizable API, media management

#### Contentful
- **Files:** `contentful/schema.json`
- **Setup:** Import content model via Contentful CLI
- **Features:** CDN delivery, image optimization, webhooks

#### Sanity
- **Files:** `sanity/schema.js`
- **Setup:** Add to your Sanity Studio project
- **Features:** Real-time collaboration, GROQ queries, image pipeline

#### Webflow
- **Files:** `webflow/collections.json`, `webflow/integration-guide.md`
- **Setup:** Import CMS collections via Webflow designer
- **Features:** Visual design, form handling, e-commerce ready

#### Prismic
- **Files:** `prismic/custom_types.json`
- **Setup:** Import custom types in Prismic dashboard
- **Features:** Slice-based editing, A/B testing, multi-language

#### Directus
- **Files:** `directus/schema.json`
- **Setup:** Import schema via Directus admin
- **Features:** Database-agnostic, REST + GraphQL APIs, permissions

#### Netlify CMS
- **Files:** `config.yml`
- **Setup:** Place in `/admin/` folder of your static site
- **Features:** Git-based workflow, markdown editing, media management

## Build System Architecture

### Core Components

The build system consists of several specialized builders:

```
build/
├── build-all.js              # Master build orchestrator
├── wordpress/
│   └── theme-builder.js       # WordPress theme generator
├── shopify/
│   └── theme-builder.js       # Shopify Liquid theme generator
├── drupal/
│   └── theme-builder.js       # Drupal Twig theme generator
├── ghost/
│   └── theme-builder.js       # Ghost Handlebars theme generator
├── static/
│   └── site-generator.js      # Static HTML site generator
└── cms-adapters/
    └── headless-cms.js        # Headless CMS configurations
```

### Shared Assets

All builders share common assets from the `src/` directory:

- **CSS:** Modern vanilla CSS with custom properties
- **JavaScript:** ES6+ modules with Web Components
- **Images:** Optimized media assets
- **Content:** Structured content from WordPress extraction
- **Fonts:** Web fonts and font loading strategies

### Build Process

1. **Asset Processing:** CSS and JavaScript files are processed and optimized
2. **Template Generation:** Platform-specific templates are created from shared components
3. **Content Migration:** Extracted WordPress content is adapted for each platform
4. **Configuration:** Platform-specific configuration files are generated
5. **Optimization:** Assets are minified and optimized for production

## Customization Guide

### Styling

All platforms share the same CSS foundation with platform-specific overrides:

- **Base styles:** `src/styles/main.css`
- **Components:** `src/styles/components/`
- **Utilities:** `src/styles/utilities/`

### JavaScript

Modern ES6+ JavaScript modules used across all platforms:

- **Core functionality:** `src/js/main.js`
- **Components:** `src/js/components/`
- **Utilities:** `src/js/utils/`

### Content Structure

Unified content model across all platforms:

- **Pages:** General website pages
- **Services:** Healthcare service offerings
- **Testimonials:** Client testimonials and reviews
- **Team:** Healthcare professional profiles
- **Blog:** News and educational content

### SEO and Performance

All builds include:

- Semantic HTML structure
- Meta tags and Open Graph
- Schema.org structured data
- Optimized images with lazy loading
- Progressive Web App features
- Core Web Vitals optimization

## Support and Maintenance

### Version Updates

Update all platforms simultaneously:

```bash
# Make changes to src/ files
npm run build:all
```

### Testing

Each build includes testing capabilities:

```bash
npm run lint          # Code linting
npm run test          # Unit tests
npm run a11y          # Accessibility testing
npm run validate:html # HTML validation
```

### Performance Monitoring

Monitor Core Web Vitals:

```bash
npm run perf          # Performance testing
```

### Security

Regular security practices:

```bash
npm run audit         # Security audit
npm run audit:fix     # Fix security issues
```

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (>=18.0.0)
- Ensure all dependencies are installed
- Verify file permissions

**Theme Installation:**
- Check platform-specific requirements
- Verify PHP/Node.js versions
- Ensure proper file structure

**Content Migration:**
- Verify source content format
- Check for missing images or assets
- Validate HTML structure

### Getting Help

1. Check the platform-specific documentation
2. Review build logs for error messages
3. Verify all required dependencies are installed
4. Test with a fresh installation

## Best Practices

### Development

1. **Keep source files in `src/`** - Never edit generated files directly
2. **Use semantic HTML** - Maintain accessibility standards
3. **Test across platforms** - Ensure consistency across all builds
4. **Optimize assets** - Compress images and minify code
5. **Follow security practices** - Keep dependencies updated

### Deployment

1. **Backup existing sites** before deploying
2. **Test in staging** environments first
3. **Monitor performance** after deployment
4. **Set up automated backups**
5. **Keep themes updated** regularly

### Content Management

1. **Use consistent naming** conventions
2. **Optimize images** before upload
3. **Write descriptive alt text** for accessibility
4. **Structure content** with proper headings
5. **Include relevant keywords** for SEO

This comprehensive build system ensures your Legacy Concierge website can be deployed to any modern CMS while maintaining design consistency, performance, and accessibility standards across all platforms.