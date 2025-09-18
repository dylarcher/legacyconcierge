# Legacy Concierge - GitHub Configuration

A modern vanilla JavaScript website and CMS with focus on accessibility, performance, and SEO.

| Website | Description |
| :------ | :---------- |
| https://legacy-concierge.com | Production website |
| [GitHub Repository](https://github.com/dylarcher/legacy-concierge) | Source code and documentation |

## GitHub Configuration

This directory contains GitHub-specific configuration files for the Legacy Concierge project.

### Structure

#### Issue Templates
- `ISSUE_TEMPLATE/bug_report.yml` - Bug report template with accessibility and performance considerations
- `ISSUE_TEMPLATE/feature_request.yml` - Feature request template aligned with project goals

#### Pull Request Templates
- `pull_request_template.md` - Comprehensive PR template with quality checks

#### Workflows
- `workflows/ci.yml` - Continuous Integration pipeline
- `workflows/release.yml` - Automated release process
- `workflows/accessibility.yml` - Automated accessibility testing
- `workflows/performance.yml` - Performance monitoring and bundle analysis

#### Community Files
- `CONTRIBUTING.md` - Contributor guidelines and development workflow
- `SECURITY.md` - Security policy and vulnerability reporting
- `FUNDING.md` - Project funding and support information

## Development Workflows

### CI/CD Pipeline
Our CI/CD pipeline ensures code quality through:

1. **Code Quality Checks**
   - ESLint for JavaScript linting
   - Prettier for code formatting
   - Stylelint for CSS validation

2. **Testing**
   - Unit tests with Vitest
   - Coverage reporting
   - Cross-platform testing (Node.js 18, 20, 22)

3. **Accessibility Testing**
   - Pa11y automated accessibility testing
   - axe-core accessibility validation
   - HTML validation

4. **Performance Monitoring**
   - Lighthouse performance audits
   - Bundle size analysis
   - Core Web Vitals tracking

### Release Process
Automated releases are triggered by version tags:

1. Quality gate (tests, linting, building)
2. GitHub release creation
3. npm package publishing with provenance
4. Documentation updates

## Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Development setup
- Code standards
- Testing requirements
- Accessibility guidelines
- Performance considerations

## Security

Security is a top priority. Please review our [SECURITY.md](SECURITY.md) for:

- Supported versions
- Vulnerability reporting process
- Security best practices
- Response timelines

## Support

For questions and support:

- 📋 Check existing [issues](../../issues)
- 💬 Start a [discussion](../../discussions)
- 📧 Email: dylarcher@gmail.com
- 💝 [Sponsor the project](https://github.com/sponsors/dylarcher)
