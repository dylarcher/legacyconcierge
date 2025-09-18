# Legacy Concierge WordPress Project

**Status**: Critical Issues Identified - Immediate Action Required  
**Last Updated**: September 2, 2025  
**Version**: 2.0

## 🚨 Critical Alerts

> **IMMEDIATE ACTION REQUIRED**: This project has critical security vulnerabilities that must be addressed within 24 hours.

### Critical Security Issues

1. **Misplaced WordPress Core Files** - Files in wrong locations creating security vulnerabilities
2. **Missing Child Theme** - All customizations at risk of being lost during updates
3. **Performance Issues** - Dual page builders causing significant slowdowns

## Project Overview

Legacy Concierge is a professional WordPress website for a premium home healthcare service provider based in Los Angeles, California. The company offers vetted concierge nursing and caregiver services, transforming homes into "havens of healing and dignity" through meticulously curated, personalized care plans.

**Website**: <https://legacyconcierge.com>  
**Platform**: WordPress with Bridge theme by Qode Interactive  
**Technology Stack**: Dockerized WordPress installation with MariaDB

For detailed business context, services, and company information, see **[BUSINESS-CONTEXT.md](./BUSINESS-CONTEXT.md)**.

### Current Technical Status

This project currently faces several critical issues that require immediate attention before any further development:

## Quick Start

### Prerequisites

* Docker and Docker Compose installed
* Git for version control
* Basic knowledge of WordPress administration

### Emergency Setup

```bash
# 1. Clone and navigate to project
cd /path/to/legacyConcierge

# 2. Environment configuration
cp .env.example .env
# Edit .env with secure credentials
nano .env

# 3. Start development environment
docker-compose up -d

# 4. Check status
docker-compose ps
```

### Access Points

* **Frontend**: <http://localhost:8000/>
* **WordPress Admin**: <http://localhost:8000/wp-admin>
* **Database**: localhost:3306 (from host machine)

## Project Structure

```
legacy-concierge/
├── docs/                    # 📚 This documentation
│   ├── README.md           # Project overview (this file)
│   ├── SECURITY.md         # Security analysis and fixes
│   ├── IMPLEMENTATION.md   # Implementation timeline and guide
│   ├── MAINTENANCE.md      # Maintenance procedures and history
│   ├── MIGRATION-STRATEGY.md # Third-party replacement strategy
│   ├── PROJECT-STATUS.md   # Current status and critical issues
│   └── PLUGINS-AND-TOOLS.md # Plugin recommendations
├── wp-content/             # WordPress content directory
│   ├── themes/             # WordPress themes
│   ├── plugins/            # WordPress plugins
│   └── uploads/            # Media files
├── bin/                    # Utility scripts
├── mysql/                  # Database configuration
├── docker-compose.yml      # Container orchestration
├── wp-config.php          # WordPress configuration
└── .htaccess              # Apache security & rewrite rules
```

## Current Technology Stack

### Core Technologies

* **CMS**: WordPress 6.4+ with PHP 8.2
* **Theme**: Bridge by Qode Interactive (30.8.8.3)
* **Database**: MariaDB 10.11
* **Containerization**: Docker with Docker Compose

### Key Plugins

* **Page Builders**: Elementor Pro (primary), Visual Composer (⚠️ needs removal)
* **E-Commerce**: WooCommerce with various extensions
* **SEO**: Yoast SEO
* **Security**: Various security plugins
* **Performance**: LiteSpeed Cache, EWWW Image Optimizer

## Documentation Navigation

| Document | Purpose | Priority |
|----------|---------|----------|
| [SECURITY.md](./SECURITY.md) | Security analysis, vulnerabilities, and fixes | 🚨 Critical |
| [PROJECT-STATUS.md](./PROJECT-STATUS.md) | Current project status and critical issues | 🚨 Critical |
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Implementation timeline and technical guide | 📋 High |
| [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) | Third-party replacement strategy | 📋 High |
| [MAINTENANCE.md](./MAINTENANCE.md) | Maintenance procedures and history | 📝 Medium |
| [PLUGINS-AND-TOOLS.md](./PLUGINS-AND-TOOLS.md) | Plugin recommendations and guidelines | 📝 Medium |

## Critical Action Items

### Immediate (Within 24 hours)

* [ ] Remove misplaced WordPress core files
* [ ] Run comprehensive security scan
* [ ] Verify WordPress core integrity

### High Priority (Within 1 week)

* [ ] Implement child theme protection
* [ ] Audit and clean up plugins
* [ ] Address performance issues

### Medium Priority (Within 1 month)

* [ ] Plan migration from Visual Composer to Elementor
* [ ] Database optimization
* [ ] Security hardening implementation

## Getting Help

### For Developers

* Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for technical implementation details
* Review [SECURITY.md](./SECURITY.md) for security requirements
* See [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) for modernization approach

### For System Administrators

* Review [PROJECT-STATUS.md](./PROJECT-STATUS.md) for current critical issues
* Check [MAINTENANCE.md](./MAINTENANCE.md) for maintenance procedures
* See [PLUGINS-AND-TOOLS.md](./PLUGINS-AND-TOOLS.md) for plugin management

### For Business Stakeholders

* See [PROJECT-STATUS.md](./PROJECT-STATUS.md) for business impact summary
* Review timeline in [IMPLEMENTATION.md](./IMPLEMENTATION.md)
* Check [MIGRATION-STRATEGY.md](./MIGRATION-STRATEGY.md) for long-term strategy

## License and Contact

This project documentation is maintained by the development team. For questions or issues, please refer to the appropriate documentation section above or contact the project maintainers.

---
**⚠️ Remember**: Address critical security issues immediately before proceeding with any development work.
