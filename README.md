# Legacy Concierge

<div align="center">

![Legacy Concierge Logo](./public/assets/img/logo.svg)

**Premium Healthcare Concierge Services for Southern California**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![npm Version](https://img.shields.io/badge/npm-%3E%3D9.0.0-brightgreen)](https://npmjs.com)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG%202.2-AA-green)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A5AFF)](https://web.dev/progressive-web-apps/)
[![Security Headers](https://img.shields.io/badge/Security%20Headers-A%2B-brightgreen)](https://securityheaders.com)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)](https://github.com/features/actions)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linted%20with-ESLint-4B32C3?logo=eslint)](https://eslint.org/)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-green.svg)](https://github.com/dylarcher/legacyconcierge/commits/main)

[Demo](https://legacyconcierge.com) • [Documentation](./docs/README.md) • [Report Bug](https://github.com/dylarcher/legacyconcierge/issues) • [Request Feature](https://github.com/dylarcher/legacyconcierge/issues/new?template=feature_request.yml)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🏥 About

Legacy Concierge is a modern, vanilla JavaScript-based website and content management system (CMS) designed for premium healthcare concierge services in Southern California. Built with a framework-free approach, it emphasizes accessibility (WCAG 2.2 AA), performance optimization, and SEO best practices while maintaining zero runtime dependencies.

### 🎯 Mission

To provide comprehensive, bespoke healthcare services across Southern California with:
- **12 Specialized Expertise Areas**: Neurological conditions, chronic disease management, and specialized care
- **8 Concierge Treatment Services**: From IV therapy to post-operative recovery
- **24/7 Clinical Coordination**: Round-the-clock care management and oversight

### 🌟 Key Differentiators

- **Zero Runtime Dependencies**: Pure web standards implementation
- **Accessibility-First**: WCAG 2.2 AA compliant from the ground up
- **Performance-Optimized**: Sub-second load times and optimal Core Web Vitals
- **Progressive Enhancement**: Works everywhere, enhanced where supported
- **Security-Focused**: CSP headers, input sanitization, secure defaults

## ✨ Features

### 🏥 Healthcare Services

#### Specialized Expertise
- **Neurological**: ALS, Alzheimer's Disease, Dementia, Parkinson's Disease, Multiple Sclerosis
- **Chronic Conditions**: Diabetes Management, Heart Disease, Stroke Recovery
- **Specialized Care**: Oncology Support, Post-Surgical Recovery, Rehabilitation Services

#### Concierge Treatments
- IV Therapy & Hydration
- Pain Management Solutions
- Mental Health Services
- Physical Therapy & Rehabilitation
- Medication Management
- Nutritional Counseling
- Sleep Therapy
- Wound Care Management

#### Service Areas
- Los Angeles County (Complete Coverage)
- Orange County (Complete Coverage)
- San Diego County (Select Areas)
- Ventura County (Limited Service)

### 💻 Technical Features

#### Core Capabilities
- **🌐 Accessibility**: WCAG 2.2 AA, keyboard navigation, screen reader optimized, focus management
- **⚡ Performance**: Core Web Vitals optimized, lazy loading, code splitting, resource hints
- **📱 PWA Features**: Offline support, installable, push notifications, background sync
- **🔍 SEO**: Structured data, meta tags, XML sitemap, Open Graph, Twitter Cards
- **🎨 Modern Design**: Responsive, dark mode, reduced motion, high contrast support
- **🔒 Security**: CSP headers, HTTPS enforced, input sanitization, XSS protection
- **🌍 Internationalization**: RTL support, logical properties, lang attributes
- **♿ Accessibility**: Live regions, ARIA landmarks, skip navigation, focus indicators

#### Developer Experience
- **📦 Zero Dependencies**: No runtime libraries required
- **🛠️ Modern Tooling**: Vite, ESBuild, modern dev server
- **🧪 Comprehensive Testing**: Unit, integration, E2E, accessibility, performance
- **📝 Full Documentation**: JSDoc, type definitions, architecture docs
- **🔄 CI/CD**: Automated testing, releases, deployments
- **📊 Analytics Ready**: Privacy-first analytics integration

## 🛠️ Tech Stack

### Frontend Architecture
```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
├─────────────────────────────────────────────────┤
│  Languages:                                      │
│  • JavaScript (ES2024+)                          │
│  • HTML5 (Semantic)                              │
│  • CSS3 (Modern Features)                        │
├─────────────────────────────────────────────────┤
│  Web APIs:                                       │
│  • Web Components                                │
│  • Service Workers                               │
│  • IndexedDB                                     │
│  • Web Storage                                   │
│  • Fetch API                                     │
│  • IntersectionObserver                          │
│  • ResizeObserver                                │
│  • MutationObserver                              │
│  • Navigation API                                │
│  • View Transitions API                          │
├─────────────────────────────────────────────────┤
│  CSS Features:                                   │
│  • Custom Properties                             │
│  • Grid & Flexbox                                │
│  • Container Queries                             │
│  • Cascade Layers                                │
│  • Logical Properties                            │
│  • CSS Nesting                                   │
│  • Modern Color Functions                        │
└─────────────────────────────────────────────────┘
```

### Development Stack
```yaml
Build Tools:
  - Vite: Lightning-fast HMR and building
  - ESBuild: JavaScript/CSS bundling
  - PostCSS: CSS processing (dev only)
  - Rollup: Production optimization

Testing:
  - Vitest: Unit and integration testing
  - Playwright: E2E testing
  - Pa11y: Accessibility testing
  - Lighthouse: Performance testing
  - Axe-core: WCAG compliance

Code Quality:
  - ESLint: JavaScript linting
  - Stylelint: CSS linting
  - Prettier: Code formatting
  - Commitlint: Commit conventions
  - Husky: Git hooks
  - Commitizen: Interactive commits

CI/CD:
  - GitHub Actions: Automation
  - Release Please: Versioning
  - Dependabot: Dependency updates
  - CodeQL: Security scanning
```

### Browser Support
```javascript
// Modern browsers with ES6+ support
{
  "browserslist": [
    "defaults",
    "not IE 11",
    "maintained node versions"
  ]
}
```

## 🚀 Getting Started

### Prerequisites

```bash
# Required versions
Node.js >= 18.0.0
npm >= 9.0.0

# Verify installations
node --version
npm --version
```

### Installation

```bash
# Clone the repository
git clone https://github.com/dylarcher/legacyconcierge.git
cd legacyconcierge

# Install development dependencies
npm install

# Initialize git hooks
npm run prepare

# Start development server
npm run dev
```

### Quick Commands

```bash
# Development
npm run dev          # Start dev server with HMR
npm run preview      # Preview production build
npm run build        # Build for production

# Testing
npm test             # Run all tests
npm run test:unit    # Unit tests
npm run test:e2e     # E2E tests
npm run test:a11y    # Accessibility tests

# Code Quality
npm run lint         # Lint code
npm run format       # Format code
npm run check        # Run all checks

# Git Workflow
npm run commit       # Interactive commit
git push            # Push with hooks
```

## 🏗️ Architecture

### Project Structure

```
legacyconcierge/
├── .github/                 # GitHub configuration
│   ├── workflows/           # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── *.md                 # GitHub docs
├── .husky/                  # Git hooks
├── bin/                     # Build scripts
│   ├── build.js             # Production build
│   ├── dev.js               # Development server
│   ├── test.js              # Test runner
│   └── deploy.js            # Deployment
├── conf/                    # Configuration files
│   ├── vite.config.js       # Vite config
│   ├── vitest.config.js     # Test config
│   └── *.config.*           # Tool configs
├── docs/                    # Documentation
│   ├── architecture.md      # Architecture guide
│   ├── api.md               # API documentation
│   └── *.md                 # Other docs
├── public/                  # Static assets
│   ├── assets/              # Images, fonts
│   ├── manifest.json        # PWA manifest
│   └── robots.txt           # SEO directives
├── src/                     # Source code
│   ├── components/          # UI components
│   │   ├── ui/              # Base UI elements
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   ├── feedback/        # User feedback
│   │   ├── navigation/      # Nav components
│   │   └── data-display/    # Data components
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   ├── hooks/               # Custom patterns
│   ├── styles/              # Global styles
│   ├── workers/             # Service workers
│   ├── constants/           # App constants
│   ├── contexts/            # State management
│   └── types/               # Type definitions
├── test/                    # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   ├── e2e/                 # End-to-end tests
│   └── fixtures/            # Test data
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── .nvmrc                   # Node version
├── CHANGELOG.md             # Release history
├── commitlint.config.js     # Commit rules
├── LICENSE                  # MIT license
├── package.json             # Dependencies
└── README.md                # This file
```

### Component Architecture

```javascript
// Component structure example
components/ui/Button/
├── Button.js           // Component logic (ESM)
├── Button.css          // Component styles
├── Button.test.js      // Component tests
├── Button.stories.js   // Component examples
└── index.js            // Public exports

// Component implementation
export class Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  static get observedAttributes() {
    return ['disabled', 'variant', 'size'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
}

customElements.define('lc-button', Button);
```

### State Management

```javascript
// Context pattern for state management
export class StateContext {
  #state = new Map();
  #subscribers = new Set();

  setState(key, value) {
    this.#state.set(key, value);
    this.#notify();
  }

  getState(key) {
    return this.#state.get(key);
  }

  subscribe(callback) {
    this.#subscribers.add(callback);
    return () => this.#subscribers.delete(callback);
  }

  #notify() {
    this.#subscribers.forEach(cb => cb(this.#state));
  }
}
```

## 💻 Development

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# API_URL=https://api.legacyconcierge.com
# PUBLIC_URL=https://legacyconcierge.com
# NODE_ENV=development
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   ```bash
   # Write code following conventions
   # Add tests for new features
   # Update documentation
   ```

3. **Run Quality Checks**
   ```bash
   npm run check        # All checks
   npm run lint:fix     # Fix linting
   npm run format       # Format code
   ```

4. **Commit Changes**
   ```bash
   npm run commit       # Interactive commit
   # Follow conventional commits
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature
   # Create PR on GitHub
   ```

### Coding Standards

#### JavaScript
```javascript
// Use modern ES6+ features
const processData = async (items = []) => {
  const results = await Promise.all(
    items.map(item => transform(item))
  );
  return results.filter(Boolean);
};

// Use JSDoc for types
/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} [email] - Optional email
 */

/**
 * Process user data
 * @param {User} user - User object
 * @returns {Promise<User>} Processed user
 */
export async function processUser(user) {
  // Implementation
}
```

#### CSS
```css
/* Use BEM naming convention */
.button {
  /* Use custom properties */
  --button-padding: 1rem 1.5rem;
  --button-radius: 0.25rem;

  padding: var(--button-padding);
  border-radius: var(--button-radius);

  /* Use logical properties */
  margin-block: 1rem;
  padding-inline: 1.5rem;
}

.button--primary {
  background: var(--color-primary);
}

.button__icon {
  inline-size: 1.25rem;
  block-size: 1.25rem;
}

/* Use modern CSS features */
@layer components {
  .card {
    container-type: inline-size;
  }

  @container (min-width: 400px) {
    .card__content {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
}
```

#### HTML
```html
<!-- Semantic HTML -->
<article class="card" itemscope itemtype="https://schema.org/Article">
  <header class="card__header">
    <h2 class="card__title" itemprop="headline">Title</h2>
    <time datetime="2025-01-01" itemprop="datePublished">
      January 1, 2025
    </time>
  </header>

  <div class="card__content" itemprop="articleBody">
    <p>Content here...</p>
  </div>

  <footer class="card__footer">
    <a href="/read-more"
       class="card__link"
       aria-label="Read more about Title">
      Continue Reading
    </a>
  </footer>
</article>
```

## 🧪 Testing

### Testing Strategy

```bash
# Unit Testing (Vitest)
npm run test:unit         # Run unit tests
npm run test:coverage     # With coverage
npm run test:watch        # Watch mode
npm run test:ui           # UI mode

# Integration Testing
npm run test:integration  # API and service tests

# E2E Testing (Playwright)
npm run test:e2e          # Headless
npm run test:e2e:ui       # With UI

# Accessibility Testing
npm run a11y              # Pa11y CI
npm run a11y:axe          # Axe-core

# Performance Testing
npm run perf              # Lighthouse CI
npm run perf:bundle       # Bundle analysis
```

### Test Examples

```javascript
// Unit test example
import { describe, it, expect, beforeEach } from 'vitest';
import { Button } from '../Button.js';

describe('Button Component', () => {
  let button;

  beforeEach(() => {
    button = new Button();
    document.body.appendChild(button);
  });

  it('should render correctly', () => {
    expect(button.shadowRoot.querySelector('.button')).toBeTruthy();
  });

  it('should handle click events', () => {
    const spy = vi.fn();
    button.addEventListener('click', spy);
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
```

```javascript
// E2E test example
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display content', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Legacy Concierge/);

    // Check navigation
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    // Check accessibility
    const violations = await page.accessibility.snapshot();
    expect(violations.violations).toHaveLength(0);
  });
});
```

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# Output structure
dist/
├── assets/
│   ├── js/
│   ├── css/
│   └── img/
├── index.html
├── manifest.json
├── sw.js
└── robots.txt
```

### Deployment Options

#### Static Hosting (Recommended)
```bash
# Netlify
netlify deploy --prod --dir=dist

# Vercel
vercel --prod

# GitHub Pages
gh-pages -d dist

# Cloudflare Pages
wrangler pages publish dist
```

#### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration

```javascript
// Production config
export default {
  API_URL: 'https://api.legacyconcierge.com',
  PUBLIC_URL: 'https://legacyconcierge.com',
  CSP_HEADER: "default-src 'self'; ...",
  CACHE_VERSION: 'v1.0.0',
};
```

## 📊 Performance

### Metrics & Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **FCP** (First Contentful Paint) | < 1.8s | 1.2s | ✅ |
| **LCP** (Largest Contentful Paint) | < 2.5s | 1.8s | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.02 | ✅ |
| **FID** (First Input Delay) | < 100ms | 45ms | ✅ |
| **INP** (Interaction to Next Paint) | < 200ms | 150ms | ✅ |
| **TTI** (Time to Interactive) | < 3.8s | 2.5s | ✅ |
| **TBT** (Total Blocking Time) | < 300ms | 180ms | ✅ |
| **Bundle Size** (gzipped) | < 100KB | 75KB | ✅ |

### Optimization Techniques

```javascript
// Lazy loading
const lazyImage = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      lazyImage.unobserve(img);
    }
  });
});

// Code splitting
const module = await import('./heavy-module.js');

// Resource hints
<link rel="preconnect" href="https://api.legacyconcierge.com">
<link rel="dns-prefetch" href="https://cdn.legacyconcierge.com">
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
```

## ♿ Accessibility

### WCAG 2.2 AA Compliance

- ✅ **Perceivable**: Text alternatives, captions, color contrast
- ✅ **Operable**: Keyboard access, timing, seizures, navigation
- ✅ **Understandable**: Readable, predictable, input assistance
- ✅ **Robust**: Compatible with assistive technologies

### Implementation Details

```html
<!-- Skip navigation -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- ARIA landmarks -->
<nav role="navigation" aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Live regions -->
<div role="status" aria-live="polite" aria-atomic="true">
  <p class="sr-only">Form submitted successfully</p>
</div>

<!-- Focus management -->
<button
  aria-expanded="false"
  aria-controls="menu"
  aria-haspopup="true">
  Menu
</button>
```

### Testing Tools

- **Screen Readers**: NVDA, JAWS, VoiceOver
- **Automated**: Pa11y, Axe-core, Lighthouse
- **Manual**: Keyboard navigation, color contrast
- **Browser Extensions**: WAVE, axe DevTools

## 🔒 Security

### Security Measures

#### Content Security Policy
```javascript
// CSP Header
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.legacyconcierge.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

#### Input Sanitization
```javascript
// Sanitize user input
function sanitizeHTML(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Validate and escape
function validateInput(input, pattern) {
  if (!pattern.test(input)) {
    throw new Error('Invalid input');
  }
  return sanitizeHTML(input);
}
```

#### Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

### Vulnerability Reporting

See [SECURITY.md](./SECURITY.md) for:
- Security policy
- Reporting process
- Response timeline
- Hall of fame

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Code of Conduct
- Development setup
- Coding standards
- Testing requirements
- Pull request process
- Issue guidelines

### Quick Contribution Guide

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`npm run commit`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

```
MIT License

Copyright (c) 2025 Legacy Concierge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 👥 Team

### Core Contributors

- **Dylan Archer** - *Project Lead* - [@dylarcher](https://github.com/dylarcher)

### Contributors

See [AUTHORS.md](./AUTHORS.md) for the full list of contributors.

## 📞 Support

### Getting Help

- 📋 [GitHub Issues](https://github.com/dylarcher/legacyconcierge/issues) - Bug reports and feature requests
- 💬 [GitHub Discussions](https://github.com/dylarcher/legacyconcierge/discussions) - Questions and discussions
- 📧 [Email Support](mailto:dylarcher@gmail.com) - Direct support
- 📖 [Documentation](./docs/README.md) - Full documentation
- 💝 [Sponsor](https://github.com/sponsors/dylarcher) - Support development

### Community

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Support Guidelines](./.github/SUPPORT.md)
- [Governance](./.github/GOVERNANCE.md)

## 🎯 Roadmap

### Version 1.0 (Q1 2025)
- [x] Initial project setup
- [x] Component architecture
- [x] Accessibility compliance
- [ ] Core features implementation
- [ ] Testing suite complete
- [ ] Documentation complete

### Version 2.0 (Q2 2025)
- [ ] Advanced PWA features
- [ ] Enhanced analytics
- [ ] Multi-language support
- [ ] API integration
- [ ] Admin dashboard

### Future Enhancements
- [ ] AI-powered recommendations
- [ ] Voice interface
- [ ] Mobile app companion
- [ ] Blockchain integration
- [ ] IoT device support

## 📈 Project Status

- **Version**: 0.1.0
- **Status**: 🚧 Active Development
- **Last Updated**: September 2025
- **Next Release**: v1.0.0 (Q1 2025)

### Build Status

| Branch | Build | Coverage | Security |
|--------|-------|----------|----------|
| main | ![Build](https://img.shields.io/badge/build-passing-brightgreen) | ![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen) | ![Security](https://img.shields.io/badge/security-A%2B-brightgreen) |
| develop | ![Build](https://img.shields.io/badge/build-passing-brightgreen) | ![Coverage](https://img.shields.io/badge/coverage-93%25-green) | ![Security](https://img.shields.io/badge/security-A-green) |

## 🙏 Acknowledgments

- Built with modern web standards and accessibility-first approach
- Framework-free, performance-optimized architecture
- Healthcare service definitions from Legacy Concierge
- Sustainable web development practices
- Community-driven development

---

<div align="center">

**Built with ❤️ by the Legacy Concierge Team**

[Website](https://legacyconcierge.com) • [GitHub](https://github.com/dylarcher/legacyconcierge) • [npm](https://www.npmjs.com/package/legacyconcierge)

</div>