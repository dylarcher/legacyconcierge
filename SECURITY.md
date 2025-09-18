# Security Policy

## Supported Versions

We actively support the following versions of Legacy Concierge:

| Version | Supported          | Node.js  | Notes                |
| ------- | ------------------ | -------- | -------------------- |
| 0.1.x   | :white_check_mark: | >=18.0.0 | Current development  |
| < 0.1   | :x:                | N/A      | Pre-release versions |

### System Requirements

- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **Supported OS**: macOS, Linux, Windows
- **Supported CPU**: x64, arm64

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security
vulnerability, please follow these steps:

1. **Do not open a public issue** - Security vulnerabilities should be reported
   privately
2. **Email us** at dylarcher@gmail.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

3. **Response timeline**:
   - We'll acknowledge receipt within 48 hours
   - We'll provide a detailed response within 7 days
   - We'll work on a fix and coordinate disclosure

## Security Best Practices

Legacy Concierge follows comprehensive security best practices:

### Code Security

- **Automated dependency scanning** with npm audit
- **ESLint security rules** for static code analysis
- **Regular dependency updates** via automated workflows
- **Vulnerability disclosure** coordination

### Runtime Security

- **Content Security Policy** implementation
- **Input validation and sanitization** for all user inputs
- **Secure coding guidelines** enforcement
- **XSS and CSRF protection** measures

### Build & Deployment Security

- **Signed releases** with npm provenance
- **Secure CI/CD pipelines** with minimal permissions
- **Dependency integrity** verification
- **Automated security testing** in CI/CD

### Accessibility Security

- **WCAG compliance** to prevent accessibility-based attacks
- **Screen reader compatibility** testing
- **Keyboard navigation** security validation

## Disclosure Policy

- We request that you give us reasonable time to fix issues before public
  disclosure
- We'll credit you in our security advisories (unless you prefer to remain
  anonymous)
- We'll coordinate with you on the disclosure timeline
