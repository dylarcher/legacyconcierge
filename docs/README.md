# Legacy Concierge Documentation

## Project Overview

Legacy Concierge is a modern vanilla JavaScript website and content management system (CMS) designed for a premium healthcare concierge service provider in California. The project emphasizes accessibility (WCAG 2.2 AA), performance optimization, and SEO best practices while maintaining a framework-free architecture.

## Documentation Structure

### Core Documentation

#### [Website Architecture Analysis](./website-architecture-analysis.md)
Comprehensive analysis of the Legacy Concierge website structure including:
- Original site structure and pages
- Service categorization (12 specialized expertise areas, 8 concierge treatments)
- Component requirements and specifications
- Technical implementation roadmap
- SEO and accessibility requirements
- Performance targets and metrics

#### [Asset Mapping](./asset-mapping.md)
Complete inventory and organization strategy for project assets:
- Image assets (team photos, service images, branding)
- Content structure mapping
- Data file schemas (JSON structures)
- Image optimization guidelines
- PWA asset requirements
- Build process integration

#### [Project Instructions](../CLAUDE.md)
Core development guidelines and standards:
- Technology stack (Vanilla JS, Modern CSS, HTML5)
- Project philosophy and principles
- Development standards and patterns
- Testing and validation requirements
- Performance goals
- Sustainability considerations

## Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Modern browser with ES6+ support

### Installation
```bash
# Clone the repository
git clone https://github.com/dylarcher/legacyconcierge.git
cd legacyconcierge

# Install dependencies (development only)
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run test suite
npm run lint       # Run linting checks
npm run a11y       # Run accessibility tests
npm run perf       # Run performance tests
npm run check      # Run all quality checks
```

## Project Architecture

### Directory Structure
```bash
legacyconcierge/
├── bin/               # Build scripts and utilities
├── conf/              # Configuration files
├── docs/              # Project documentation
├── public/            # Static assets
│   ├── images/        # Image assets
│   ├── fonts/         # Web fonts
│   └── icons/         # Icon assets
├── src/               # Source code
│   ├── components/    # UI components
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom JavaScript patterns
│   ├── styles/        # Global styles
│   ├── data/          # Static data files
│   └── workers/       # Service workers
└── test/              # Test files
```

### Component Architecture

The project uses a component-based architecture with vanilla JavaScript:

1. **Web Components** - Custom elements for reusable UI
2. **ES Modules** - Modern module system for code organization
3. **CSS Custom Properties** - Dynamic theming and styling
4. **Service Workers** - PWA functionality and offline support

## Key Features

### Healthcare Services

#### Specialized Expertise (12 Conditions)
- Neurological: ALS, Alzheimer's, Dementia, Parkinson's, MS, Stroke, TBI
- Chronic Conditions: Diabetes, Heart Disease, Oncology, Ostomy
- General Specialized Care

#### Concierge Treatments (8 Services)
- Cardiac and Pulmonary Oversight
- IV and Infusion Therapy
- Pain Management
- Mental Health Services
- Post-Op Recovery
- Rehabilitation Services
- Eating Disorder Monitoring
- General Treatment Services

### Technical Features

#### Accessibility (WCAG 2.2 AA)
- Semantic HTML structure
- ARIA attributes and roles
- Keyboard navigation with visual indicators
- Screen reader optimization
- High contrast support
- Reduced motion preferences

#### Performance Optimization
- Code splitting and lazy loading
- Image optimization (WebP, responsive images)
- Critical CSS inlining
- Service Worker caching
- Resource hints (preload, prefetch)

#### SEO Features
- Structured data (JSON-LD)
- Meta tags optimization
- XML sitemap generation
- Canonical URLs
- Open Graph and Twitter Cards

#### Progressive Web App
- Installable application
- Offline functionality
- Push notifications
- Background sync
- App shortcuts

## Development Guidelines

### Code Standards

#### JavaScript
- ES6+ features (async/await, modules, destructuring)
- JSDoc type annotations
- Error boundaries and handling
- Event delegation patterns
- Memory management

#### CSS
- BEM naming convention
- CSS Custom Properties for theming
- Modern layout (Grid, Flexbox, Container Queries)
- Logical properties for i18n
- CSS Layers for cascade management

#### HTML
- Semantic elements
- Proper heading hierarchy
- ARIA labels and descriptions
- Responsive images with srcset
- Loading and fetchpriority attributes

### Testing Strategy

1. **Unit Testing** - Vitest for component logic
2. **E2E Testing** - Playwright for user flows
3. **Accessibility Testing** - Pa11y and axe-core
4. **Performance Testing** - Lighthouse CI
5. **Visual Regression** - Screenshot comparisons

### Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| FCP | < 1.8s | First Contentful Paint |
| LCP | < 2.5s | Largest Contentful Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| FID | < 100ms | First Input Delay |
| INP | < 200ms | Interaction to Next Paint |
| TBT | < 300ms | Total Blocking Time |

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to production
npm run deploy
```

### Environment Variables
```bash
NODE_ENV=production
API_URL=https://api.legacyconcierge.com
ANALYTICS_ID=UA-XXXXXXXXX
```

### Hosting Requirements
- HTTPS enabled
- HTTP/2 support
- Gzip/Brotli compression
- CDN for static assets
- CSP headers configuration

## Contributing

Please read our [Contributing Guide](../.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Ensure all checks pass
5. Submit pull request

### Quality Checklist
- [ ] Code passes linting
- [ ] Tests are passing
- [ ] Accessibility checks pass
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Cross-browser tested

## Security

For security concerns, please review our [Security Policy](../.github/SECURITY.md) and report vulnerabilities through the appropriate channels.

## Support

### Resources
- [Issue Tracker](https://github.com/dylarcher/legacyconcierge/issues)
- [Discussions](https://github.com/dylarcher/legacyconcierge/discussions)
- Email: dylarcher@gmail.com

### Documentation Links
- [Project Website](https://legacy-concierge.com)
- [API Documentation](#) (Coming soon)
- [Component Library](#) (Coming soon)

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- Healthcare content and service definitions from Legacy Concierge
- Built with modern web standards and accessibility in mind
- Inspired by framework-free, performance-first development

---

*Last Updated: September 2025*
*Version: 0.1.0*
