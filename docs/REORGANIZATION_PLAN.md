# Documentation Reorganization Plan

## Overview
This document outlines the strategy for reorganizing the Legacy Concierge documentation to improve discoverability, reduce redundancy, and better serve different audiences.

## Goals
1. **Simplify README.md** - Reduce from 929 lines to ~200-300 lines
2. **Create clear documentation categories** - Separate user, developer, and architectural docs
3. **Improve discoverability** - Logical structure that's easy to navigate
4. **Follow standards** - Align with GitHub and open source best practices
5. **Reduce redundancy** - Single source of truth for each topic

## Target Audiences
- **New Users**: Need quick start and basic usage
- **Developers**: Need setup, coding standards, and API docs
- **Contributors**: Need contribution guidelines and project structure
- **Maintainers**: Need architecture decisions and deployment docs

## Implementation Steps

### Phase 1: Create New Directory Structure
```bash
# Create new documentation directories
mkdir -p docs/getting-started
mkdir -p docs/architecture
mkdir -p docs/development
mkdir -p docs/api
mkdir -p docs/deployment
mkdir -p docs/legacy/wordpress-migration
mkdir -p docs/decisions
```

### Phase 2: Extract and Reorganize Content

#### From README.md → Multiple Files:
- **Getting Started section** → `docs/getting-started/quick-start.md`
- **Installation details** → `docs/getting-started/installation.md`
- **Architecture section** → `docs/architecture/overview.md`
- **Development section** → `docs/development/setup.md`
- **Testing section** → `docs/development/testing.md`
- **Deployment section** → `docs/deployment/environments.md`
- **Performance section** → `docs/architecture/performance.md`
- **Security section** → Keep summary in README, details in SECURITY.md

#### Move Existing Files:
- `docs/website-architecture-analysis.md` → `docs/architecture/overview.md`
- `docs/asset-mapping.md` → `docs/architecture/asset-mapping.md`
- `docs/wp-familiarization/*` → `docs/legacy/wordpress-migration/*`

### Phase 3: Create New Documentation

#### Architecture Decision Records (ADRs):
1. **001-vanilla-javascript.md** - Why no frameworks
2. **002-accessibility-first.md** - WCAG 2.2 AA commitment
3. **003-zero-dependencies.md** - No runtime dependencies
4. **004-progressive-enhancement.md** - Browser support strategy

#### Development Guides:
1. **coding-standards.md** - Extract from CLAUDE.md
2. **component-development.md** - Component patterns and examples
3. **state-management.md** - State management patterns
4. **performance-guide.md** - Performance optimization techniques

### Phase 4: Update Cross-References
- Update all internal links in documentation
- Update README.md to reference new documentation structure
- Update CONTRIBUTING.md to reference development docs
- Update package.json scripts documentation

### Phase 5: Create Navigation
- Update `docs/README.md` as documentation hub
- Add navigation breadcrumbs to each doc
- Create category index files

## Simplified README.md Structure

```markdown
# Legacy Concierge

[Badges]

## 🏥 About
Brief project description (2-3 paragraphs)

## ✨ Features
- Key feature list (bullet points)

## 🚀 Quick Start
```bash
npm install
npm run dev
```

## 📚 Documentation
- [Getting Started](./docs/getting-started/)
- [Architecture](./docs/architecture/)
- [Development](./docs/development/)
- [API Reference](./docs/api/)
- [Deployment](./docs/deployment/)

## 🤝 Contributing
Brief intro → Link to CONTRIBUTING.md

## 📄 License
MIT → Link to LICENSE

## 🙏 Acknowledgments
Credits and thanks
```

## Benefits

### For New Users
- Clear, concise README
- Dedicated getting started guide
- Step-by-step installation

### For Developers
- Organized development docs
- Clear API documentation
- Testing and debugging guides

### For Contributors
- Easy to find contribution guidelines
- Architecture decision records
- Clear project structure

### For Maintainers
- Deployment documentation
- Performance monitoring guides
- Security procedures

## Timeline
1. **Phase 1-2**: Immediate - Create structure and move files
2. **Phase 3**: Next sprint - Create new documentation
3. **Phase 4-5**: Following sprint - Update references and navigation

## Success Metrics
- README.md reduced to <300 lines
- All documentation categories have index files
- No broken internal links
- Improved documentation discoverability
- Positive contributor feedback