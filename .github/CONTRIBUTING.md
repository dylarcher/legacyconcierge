# Contributor's Guide

## Development Workflow

### Getting Started
1. Fork and clone the repository
2. Install dependencies: `npm ci`
3. Start development server: `npm run dev`

### Scripts
- `npm run dev` - Start development server with custom build system
- `npm run build` - Build for production using custom build pipeline
- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run lint` - Lint JavaScript files
- `npm run lint:fix` - Lint and auto-fix JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run check` - Run comprehensive quality checks
- `npm run a11y` - Run accessibility tests
- `npm run validate:html` - Validate HTML files
- `npm run perf` - Run performance audits
- `npm run generate` - Generate project assets
- `npm run deploy` - Deploy application
- `npm run preview` - Preview production build

### Code Quality
- All code must pass ESLint checks
- Tests required for new features
- Code must be formatted with Prettier
- JSDoc comments required for public APIs

### Commit Guidelines
- Use conventional commits format
- Run `npm run check` before committing
- Pre-commit hooks will run automatically

### Release Process
1. Update version: `npm version [patch|minor|major]`
2. This automatically runs tests, builds, and pushes tags
3. GitHub Actions will handle the release

## Architecture

Legacy Concierge is a modern vanilla JavaScript website and CMS with focus on:

### Core Technologies
- **Vanilla JavaScript** with ES2025+ features
- **ES Modules** for modular architecture
- **Vite** for development and build tooling
- **Vitest** for testing framework
- **Custom build system** in `./bin/` directory

### Key Features
- **Accessibility (WCAG compliance)** - Built-in a11y testing and validation
- **Performance optimization** - Lighthouse audits and performance monitoring
- **SEO best practices** - Structured data and meta optimization
- **Progressive Web App** features with Workbox
- **Component-based architecture** with reusable modules

### Module Structure
- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions
- `src/hooks/` - Custom hooks and lifecycle management
- `src/services/` - API and data services
- `src/contexts/` - Application state management
- `src/constants/` - Application constants
- `src/types/` - Type definitions

### Development Philosophy
- **Modern JavaScript** without framework dependencies
- **Accessibility-first** design approach
- **Performance-focused** development
- **Comprehensive testing** with unit, integration, and e2e tests
- **Documentation-driven** development with JSDoc
