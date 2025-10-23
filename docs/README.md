# Documentation

Welcome to the Legacy Concierge documentation. This directory contains all project documentation organized for easy navigation.

---

## Quick Navigation

**New to the project?** Start here:

1. **[GETTING_STARTED.md](./tutorials/GETTING_STARTED.md)** - 5-minute quick start guide
2. **[ARCHITECTURE.md](./reference/ARCHITECTURE.md)** - Technical architecture overview
3. **[ROADMAP.md](./explanation/ROADMAP.md)** - Project status and next steps

---

## Documentation Structure

### Core Documentation

**[GETTING_STARTED.md](./tutorials/GETTING_STARTED.md)**

- Quick start in 5 minutes
- Component usage examples
- Testing and troubleshooting
- Migration guide
- Best practices

**[ARCHITECTURE.md](./reference/ARCHITECTURE.md)**

- Technical architecture decisions
- Component architecture
- i18n system design
- Styling patterns
- JavaScript patterns
- Performance targets
- Security considerations

**[ROADMAP.md](./explanation/ROADMAP.md)**

- Honest project status (~15-20% complete)
- What's actually done vs. what needs work
- 30-day action plan
- Success metrics
- Risk assessment

### Implementation Documentation

**[PHASE_1_IMPLEMENTATION.md](./how-to-guides/PHASE_1_IMPLEMENTATION.md)**

- Root-relative path fixes (445 replacements across 50 files)
- Icon system implementation (36 icons integrated)
- Development workflow enhancements
- Automated path-fixing utility
- Status: ✅ Completed (October 22, 2025)

**[PHASE_2_WEB_VITALS.md](./how-to-guides/PHASE_2_WEB_VITALS.md)**

- Web Vitals performance monitoring integration
- Real-time metrics overlay (LCP, FID, INP, CLS, FCP, TTFB)
- Development-only tool loading system
- Console logging and keyboard shortcuts
- Status: ✅ Completed (October 22, 2025)

**[PHASE_2_LIGHTHOUSE_CI.md](./how-to-guides/PHASE_2_LIGHTHOUSE_CI.md)**

- Automated Lighthouse audits for performance and accessibility
- Desktop and mobile configurations with custom thresholds
- Resource budget tracking (scripts, images, fonts, CSS)
- WCAG 2.2 AA accessibility compliance checks
- Helper scripts and npm commands
- Status: ✅ Completed (October 22, 2025)

### Supporting Documentation

- See Reference docs below for media strategy and naming guidance

### Example Implementations

- See `pages/demos/` for example pages and component demos

### Archived Documentation

- Historical docs have been consolidated into the Diátaxis structure

---

## Documentation by Role

### For Developers

**Getting started:**

1. [GETTING_STARTED.md](./tutorials/GETTING_STARTED.md) - Start here
2. [ARCHITECTURE.md](./reference/ARCHITECTURE.md) - Understand the patterns
3. [Components README](./reference/README.md) - Component API reference

**Working on features:**

1. [ROADMAP.md](./explanation/ROADMAP.md) - See what's priority
2. [ARCHITECTURE.md](./reference/ARCHITECTURE.md) - Follow established patterns

**Recent implementations:**

1. [PHASE_1_IMPLEMENTATION.md](./how-to-guides/PHASE_1_IMPLEMENTATION.md) - Path fixes & icon system
2. [PHASE_2_WEB_VITALS.md](./how-to-guides/PHASE_2_WEB_VITALS.md) - Performance monitoring
3. [PHASE_2_LIGHTHOUSE_CI.md](./how-to-guides/PHASE_2_LIGHTHOUSE_CI.md) - Automated audits

### For Project Managers

**Project status:**

1. [ROADMAP.md](./explanation/ROADMAP.md) - Current status and next 30 days
2. [Remaining Tasks](./explanation/REMAINING_TASKS.md) - Detailed task breakdowns

**Understanding the project:**

1. [GETTING_STARTED.md](./tutorials/GETTING_STARTED.md) - What's been built
2. [ARCHITECTURE.md](./reference/ARCHITECTURE.md) - Technical decisions

### For Designers

**Design system:**

1. [ARCHITECTURE.md](./reference/ARCHITECTURE.md) - Design tokens, color system
2. [Components Reference](./reference/README.md) - Component variants
3. [Styles Guide](./reference/README.md) - Styling guidance

---

## Documentation Standards

### File Naming

- Use `UPPERCASE_WITH_UNDERSCORES.md` for major docs
- Use `lowercase-with-dashes.md` for supporting docs
- Use descriptive names (`GETTING_STARTED.md` not `START.md`)

### Content Structure

- Start with brief overview
- Use clear headings (##, ###)
- Include code examples where helpful
- No emojis in headings (removed for accessibility)
- Link to related docs

### Maintenance

- Update Last Updated dates when modifying
- Archive old versions instead of deleting
- Keep docs in sync with code changes
- Review quarterly for accuracy

---

## Related Documentation

### In Other Directories

**Project Root:**

- [../README.md](../README.md) - Main project README

**Components:**

- [Reference Index](./reference/README.md) - Component library docs
- Examples in `pages/demos/components/`

**Scripts:**

- See Reference Index for JS module documentation

**Layouts:**

- [../shared/partials/layouts/README.md](../shared/partials/layouts/README.md) - Page layout templates

**Locale:**

- [../shared/content/_locale/README.md](../shared/content/_locale/README.md) - i18n documentation

---

## Contributing to Documentation

### When to Update Docs

**Always update when:**

- Adding new components or features
- Changing architecture or patterns
- Completing major milestones
- Making breaking changes

**Good to update when:**

- Fixing bugs that exposed unclear docs
- Learning something not obvious from docs
- Seeing common questions from team

### How to Update

1. **Read existing docs** - Understand current structure
2. **Make changes** - Keep formatting consistent
3. **Update dates** - Change "Last Updated" to today
4. **Link appropriately** - Cross-reference related docs
5. **Archive if replacing** - Don't delete, move to archive/

### Documentation Checklist

- [ ] Clear, concise writing
- [ ] Code examples where helpful
- [ ] Links to related docs
- [ ] Updated "Last Updated" date
- [ ] No spelling/grammar errors
- [ ] Follows existing format

---

## Documentation Todo

Current gaps in documentation:

- [ ] Component testing guide
- [ ] Deployment procedures
- [ ] Troubleshooting guide (expanded)
- [ ] API reference (if backend added)
- [ ] Performance optimization guide
- [ ] Accessibility testing guide
- [ ] i18n contribution guide

---

## Questions?

- Check [GETTING_STARTED.md](./tutorials/GETTING_STARTED.md) first
- Review [ARCHITECTURE.md](./reference/ARCHITECTURE.md) for technical details
- See [ROADMAP.md](./explanation/ROADMAP.md) for project direction
- Browse [archive/](./archive/) for detailed historical docs

---

**Last Updated:** October 22, 2025
**Maintained By:** Development Team
