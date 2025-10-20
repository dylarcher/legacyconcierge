# Documentation

This directory contains comprehensive documentation for the Legacy Concierge website project, including project roadmaps, implementation guides, and technical specifications.

## 📚 Documentation Files

### 🗺️ Project Planning & Timeline

**[ROADMAP_TIMELINE.md](ROADMAP_TIMELINE.md)** - Complete project timeline and progress tracking
- 5-phase development plan (2,128 total hours)
- Detailed task breakdowns for each phase
- Current status tracking (~25% complete)
- Completed milestones and deliverables
- GitHub issue links for all tasks
- Effort estimates and time tracking

**Status:** Actively maintained, updated with latest progress

---

### 🚀 Getting Started

**[QUICK_START.md](QUICK_START.md)** - Quick reference guide for developers
- Local development setup
- Common tasks and workflows
- Directory structure overview
- Code quality tools usage
- Translation management basics
- Component usage examples

**Status:** Active reference guide

---

### 🧩 Web Components

**[WEB_COMPONENTS_SUMMARY.md](WEB_COMPONENTS_SUMMARY.md)** - Web Components implementation notes
- Component architecture overview
- Available components (`<lc-header>`, `<lc-footer>`, `<lc-card>`, etc.)
- Implementation patterns
- Light DOM vs Shadow DOM decisions
- Component API documentation
- Usage examples

**Status:** Active technical documentation

---

### 🌐 Internationalization

**[I18N_INTEGRATION_SUMMARY.md](I18N_INTEGRATION_SUMMARY.md)** - i18n system documentation
- Translation system architecture
- Implementation details
- Language support (EN, ES)
- Translation file structure
- Usage patterns and examples

**Status:** Placeholder (to be expanded)

**Note:** For comprehensive i18n documentation, see `_locale/README.md`

---

### 🖼️ Asset Management

**[IMAGE_RENAME_OUTLINE.md](IMAGE_RENAME_OUTLINE.md)** - Image organization guidelines
- Image naming conventions
- Asset organization structure
- Optimization guidelines
- Usage recommendations

**Status:** Reference document

---

## 📖 Additional Documentation

### Project Root Documentation

Located in the root directory:

**[../.claude/CLAUDE.md](../.claude/CLAUDE.md)** - AI assistant instructions and project guidelines
- Project overview and architecture
- Technology stack and standards
- Development workflows
- i18n system details
- Common pitfalls and solutions
- Design requirements

**Status:** Authoritative project reference

---

### Directory-Specific Documentation

Each major directory contains its own README with detailed information:

| Directory | README | Description |
|-----------|--------|-------------|
| **_locale/** | [_locale/README.md](../_locale/README.md) | Translation files and i18n system |
| **assets/** | [assets/README.md](../assets/README.md) | Images, media, icons, and asset management |
| **components/** | [components/README.md](../components/README.md) | Web Components documentation |
| **layouts/** | [layouts/README.md](../layouts/README.md) | Page layout templates |
| **pages/** | [pages/README.md](../pages/README.md) | Site pages structure |
| **scripts/** | [scripts/README.md](../scripts/README.md) | JavaScript modules |
| **styles/** | [styles/README.md](../styles/README.md) | CSS stylesheets |

---

## 🔍 Finding Documentation

### By Topic

| Topic | Primary Document |
|-------|------------------|
| **Getting Started** | QUICK_START.md, Root README.md |
| **Project Status** | ROADMAP_TIMELINE.md |
| **Web Components** | WEB_COMPONENTS_SUMMARY.md, components/README.md |
| **Internationalization** | _locale/README.md, .claude/CLAUDE.md |
| **Asset Management** | assets/README.md, IMAGE_RENAME_OUTLINE.md |
| **JavaScript** | scripts/README.md |
| **CSS/Styling** | styles/README.md |
| **Page Templates** | layouts/README.md, pages/README.md |
| **Architecture** | .claude/CLAUDE.md |

### By Development Phase

| Phase | Status | Documentation |
|-------|--------|---------------|
| **Phase 1: Planning** | ✅ Complete | ROADMAP_TIMELINE.md (Section 1) |
| **Phase 2: Foundation** | ✅ Mostly Complete | ROADMAP_TIMELINE.md (Section 2), _locale/README.md |
| **Phase 3: Components** | 🚧 In Progress | WEB_COMPONENTS_SUMMARY.md, components/README.md |
| **Phase 4: Testing** | ⏳ Pending | ROADMAP_TIMELINE.md (Section 4) |
| **Phase 5: Deployment** | ⏳ Pending | ROADMAP_TIMELINE.md (Section 5) |

---

## 📝 Documentation Standards

### File Naming

- Use UPPER_CASE_SNAKE_CASE for major docs (e.g., `ROADMAP_TIMELINE.md`)
- Use lowercase-with-hyphens for subdirectory READMEs (e.g., `README.md`)
- Use descriptive names that indicate content

### Markdown Formatting

Follow GitHub Flavored Markdown:
- Use `#` for headings (h1), `##` for h2, etc.
- Use `**bold**` for emphasis
- Use ` ```language ` for code blocks
- Use `>` for blockquotes
- Use `- [ ]` for task lists
- Include table of contents for long documents

### Updating Documentation

When making significant changes:
1. **Update relevant documentation** - Don't let docs become stale
2. **Keep ROADMAP_TIMELINE.md current** - Mark tasks complete, update status
3. **Add examples** - Show, don't just tell
4. **Test code examples** - Ensure all code samples work
5. **Update directory READMEs** - Reflect changes in structure or usage

---

## 🚧 Planned Documentation

Future documentation to be added:

### Technical Documentation

- [ ] **API_REFERENCE.md** - Complete API documentation for all JavaScript modules
- [ ] **TESTING_GUIDE.md** - Unit, integration, and e2e testing documentation
- [ ] **DEPLOYMENT_GUIDE.md** - Step-by-step deployment instructions
- [ ] **ACCESSIBILITY_AUDIT.md** - WCAG 2.2 AA compliance audit results
- [ ] **PERFORMANCE_OPTIMIZATION.md** - Lighthouse optimization strategies

### Contributor Guides

- [ ] **CONTRIBUTING.md** - Contribution guidelines for new developers
- [ ] **CODE_OF_CONDUCT.md** - Community code of conduct
- [ ] **STYLE_GUIDE.md** - Code style and formatting guidelines
- [ ] **TRANSLATION_GUIDE.md** - Guide for translators adding new languages

### User Documentation

- [ ] **USER_GUIDE.md** - End-user documentation for site features
- [ ] **CONTENT_MANAGEMENT.md** - Guide for content updates (non-developers)
- [ ] **TROUBLESHOOTING.md** - Common issues and solutions

---

## 🔗 External Resources

### Technology Documentation

- [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JavaScript reference
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - Custom Elements, Templates
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) - Accessibility guidelines
- [Schema.org](https://schema.org/) - Structured data markup

### Tools Documentation

- [Biome](https://biomejs.dev/) - Linter and formatter
- [Git](https://git-scm.com/doc) - Version control
- [GitHub](https://docs.github.com/) - Repository hosting and project management

### Design Resources

- [W3C Internationalization](https://www.w3.org/International/) - i18n best practices
- [Web Accessibility Initiative](https://www.w3.org/WAI/) - Accessibility resources

---

## 📊 Documentation Status

| Document | Status | Last Updated | Maintainer |
|----------|--------|--------------|------------|
| ROADMAP_TIMELINE.md | ✅ Current | 2025-10-20 | Active |
| QUICK_START.md | ✅ Current | 2024-10-19 | Active |
| WEB_COMPONENTS_SUMMARY.md | ✅ Current | 2024-10-19 | Active |
| I18N_INTEGRATION_SUMMARY.md | 📝 Draft | 2024-10-19 | Needs expansion |
| IMAGE_RENAME_OUTLINE.md | ✅ Current | 2024-10-19 | Stable |

---

## 🤝 Contributing to Documentation

### Reporting Issues

If you find documentation errors or omissions:
1. Check if issue already exists in [GitHub Issues](https://github.com/dylarcher/legacy-concierge/issues)
2. Create new issue with label `documentation`
3. Provide specific details about what's missing or incorrect

### Suggesting Improvements

1. Fork the repository
2. Update documentation in your branch
3. Submit pull request with clear description
4. Request review from project maintainer

### Writing New Documentation

When creating new documentation:
1. Follow existing documentation structure
2. Use clear, concise language
3. Include code examples where helpful
4. Add visual aids (diagrams, screenshots) when appropriate
5. Test all code examples
6. Update this index (docs/README.md) with new document

---

## 📮 Questions?

For documentation questions or suggestions:
- Open an issue: https://github.com/dylarcher/legacy-concierge/issues
- Review `.claude/CLAUDE.md` for project guidelines
- Check relevant directory READMEs for specific topics

---

**Last Updated:** October 20, 2025
**Version:** 1.1
