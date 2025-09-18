# Legacy Concierge

A modern vanilla JavaScript website and CMS for premium healthcare concierge services in California, built with focus on accessibility (WCAG 2.2 AA), performance optimization, and SEO best practices.

## 🏥 Overview

Legacy Concierge provides comprehensive, bespoke healthcare services across Southern California, specializing in:
- **12 Specialized Expertise Areas**: Neurological conditions, chronic disease management, and specialized care
- **8 Concierge Treatment Services**: From IV therapy to post-operative recovery
- **24/7 Clinical Coordination**: Round-the-clock care management and oversight

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/dylarcher/legacyconcierge.git
cd legacyconcierge

# Install dependencies (development only)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Modern browser with ES6+ support

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), Web Components
- **Styling**: Modern CSS (Grid, Flexbox, Custom Properties, Container Queries)
- **Build**: Vite, ESBuild
- **Testing**: Vitest, Playwright, Pa11y
- **PWA**: Service Workers, Web App Manifest
- **No Runtime Dependencies**: Pure web standards implementation

## 📁 Project Structure

```
legacyconcierge/
├── bin/               # Build scripts and utilities
├── conf/              # Configuration files
├── docs/              # Project documentation
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # Reusable UI components
│   ├── services/      # Business logic and API services
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom JavaScript patterns
│   ├── styles/        # Global styles
│   └── workers/       # Service workers
├── test/              # Test infrastructure
└── .github/           # GitHub configuration

```

## ✨ Key Features

### Healthcare Services
- **Specialized Expertise**: ALS, Alzheimer's, Dementia, Parkinson's, MS, Stroke Recovery, Diabetes, Heart Disease, Oncology
- **Concierge Treatments**: IV Therapy, Pain Management, Mental Health Services, Post-Op Recovery, Rehabilitation
- **Service Areas**: Los Angeles County, Orange County, San Diego County

### Technical Features
- **🌐 Accessibility**: WCAG 2.2 AA compliant, keyboard navigation, screen reader support
- **⚡ Performance**: Core Web Vitals optimized, lazy loading, code splitting
- **📱 Progressive Web App**: Offline support, installable, push notifications
- **🔍 SEO Optimized**: Structured data, meta tags, XML sitemap
- **🎨 Modern Design**: Responsive, dark mode, reduced motion support
- **🔒 Security**: CSP headers, HTTPS enforced, input sanitization

## 📊 Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| FCP | < 1.8s | First Contentful Paint |
| LCP | < 2.5s | Largest Contentful Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| FID | < 100ms | First Input Delay |
| INP | < 200ms | Interaction to Next Paint |
| Bundle | < 100KB | Initial load (gzipped) |

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Accessibility testing
npm run a11y

# Performance testing
npm run perf

# Linting and formatting
npm run lint
npm run format
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run a11y` | Run accessibility tests |
| `npm run perf` | Run performance tests |
| `npm run check` | Run all quality checks |
| `npm run deploy` | Deploy to production |

## 🔧 GitHub Configuration

This repository includes comprehensive GitHub configuration:

- **Bug Report** - Comprehensive bug reporting with accessibility considerations
- **Feature Request** - Feature proposals aligned with project goals
- **Performance Issue** - Performance problem reporting
- **Documentation** - Documentation improvements

### GitHub Workflows
- **CI/CD Pipeline** - Automated testing, linting, and building
- **Release Automation** - Semantic versioning and npm publishing
- **Accessibility Testing** - Automated WCAG compliance checks
- **Performance Monitoring** - Bundle analysis and Core Web Vitals

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./.github/CONTRIBUTING.md) for details on:
- Development setup and workflow
- Code standards and conventions
- Testing requirements
- Pull request process
- Code of conduct

## 🔒 Security

For security concerns, please review our [Security Policy](./.github/SECURITY.md) for:
- Supported versions
- Vulnerability reporting
- Security best practices
- Response timelines

## 📚 Documentation

- [Full Documentation](./docs/README.md)
- [Architecture Analysis](./docs/website-architecture-analysis.md)
- [Asset Mapping](./docs/asset-mapping.md)
- [Project Instructions](./CLAUDE.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards and accessibility-first approach
- Framework-free, performance-optimized architecture
- Healthcare service definitions from Legacy Concierge
- Sustainable web development practices

## 📞 Support

- 📋 [Issues](https://github.com/dylarcher/legacyconcierge/issues)
- 💬 [Discussions](https://github.com/dylarcher/legacyconcierge/discussions)
- 📧 Email: dylarcher@gmail.com
- 💝 [Sponsor](https://github.com/sponsors/dylarcher)

---

**Version**: 0.1.0
**Last Updated**: September 2025
**Status**: 🚧 Active Development
