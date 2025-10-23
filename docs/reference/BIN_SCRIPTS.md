# Utility Scripts

This directory contains utility scripts for maintaining and automating tasks across the Legacy Concierge project.

## Scripts

### Shell Scripts

#### `add-lazy-loading.sh`
**Purpose:** Adds lazy loading attributes to images  
**Usage:**
```bash
./bin/add-lazy-loading.sh
```

#### `lighthouse-audit.sh`
**Purpose:** Runs Lighthouse performance audits  
**Usage:**
```bash
./bin/lighthouse-audit.sh
```
Alternatively, use npm scripts:
```bash
npm run lighthouse         # Desktop audit
npm run lighthouse:mobile  # Mobile audit
```

#### `update-image-paths.sh`
**Purpose:** Updates image paths across HTML files  
**Usage:**
```bash
./bin/update-image-paths.sh
```

#### `fix-paths.sh`
**Purpose:** Converts relative paths to absolute paths for consistency  
**Features:**
- Fixes CSS stylesheet paths
- Fixes JavaScript script paths (theme.js, app.js, i18n.js)
- Corrects broken internal links
- Creates backups before modifying files

**Usage:**
```bash
./bin/fix-paths.sh
```

#### `fix-theme-toggle.sh`
**Purpose:** Adds theme toggle setup to component loading scripts  
**Features:**
- Inserts theme toggle initialization code
- Ensures proper component rendering order
- Batch updates all pages
- Creates backups before modifying files

**Usage:**
```bash
./bin/fix-theme-toggle.sh
```

#### `integrate-components.sh`
**Purpose:** Automates Web Component integration into HTML pages  
**Features:**
- Replaces static headers with `<lc-header>` component
- Replaces static footers with `<lc-footer>` component
- Adds component loading scripts
- Supports dry-run mode for testing
- Creates backups before modifying files

**Usage:**
```bash
./bin/integrate-components.sh           # Apply changes
./bin/integrate-components.sh --dry-run # Preview changes
```

### Python Scripts

#### `audit-pages.py`
**Purpose:** Comprehensive HTML page auditing  
**Features:**
- Finds all links, images, and scripts
- Checks for broken references
- Detects common path issues
- Generates detailed JSON report

**Usage:**
```bash
python3 bin/audit-pages.py
```

**Output:** Creates `audit-report.json` with detailed findings

**Why Python?** This script requires complex HTML parsing, regex operations, and JSON output generation that would be difficult and error-prone to implement in shell script.

## Guidelines

### When to Use Each Script

- **fix-paths.sh** - After moving files or reorganizing directory structure
- **fix-theme-toggle.sh** - When updating theme system implementation
- **integrate-components.sh** - When converting static HTML to use Web Components
- **audit-pages.py** - Before deploying, to check for broken links or missing resources
- **add-lazy-loading.sh** - For optimizing image loading performance
- **update-image-paths.sh** - When image locations change

### Script Conventions

All shell scripts follow these conventions:
- Shebang: `#!/usr/bin/env bash`
- Strict mode: `set -euo pipefail`
- Color-coded output (green = success, yellow = warning, red = error)
- Automatic backup creation before making changes
- Progress reporting and summary statistics
- Relative paths displayed to user for clarity

### Backup Files

Scripts create backup files with specific extensions:
- `.backup` - General backup (integrate-components.sh)
- `.pathbackup` - Path fix backup (fix-paths.sh)
- `.themebackup` - Theme fix backup (fix-theme-toggle.sh)

These backups are automatically excluded from git via `.gitignore`.

## Migration Notes

The following Python scripts were converted to shell scripts for better performance and fewer dependencies:

- `fix-paths.py` → `fix-paths.sh` ✓
- `fix-theme-toggle.py` → `fix-theme-toggle.sh` ✓
- `integrate-components.py` → `integrate-components.sh` ✓

The `audit-pages.py` script remains in Python due to its complexity and the need for advanced HTML parsing.

## Dependencies

### Shell Scripts
- bash (v4.0+)
- sed (GNU or BSD)
- awk (gawk or mawk)
- perl (for multi-line regex in integrate-components.sh)
- find, grep, diff (standard Unix utilities)

### Python Scripts
- Python 3.7+
- Standard library only (no external packages required)

## Troubleshooting

### Permission Denied
If you get "Permission denied" errors, make scripts executable:
```bash
chmod +x bin/*.sh
```

### sed: RE error
If using macOS, some sed commands may differ from GNU sed. Scripts are written to be compatible with both BSD (macOS) and GNU (Linux) sed.

### Backup Files Not Created
Backups are only created if they don't already exist. To force new backups, remove existing backup files first:
```bash
# Be careful! Only do this if you're sure
find . -name "*.backup" -delete
find . -name "*.pathbackup" -delete
find . -name "*.themebackup" -delete
```

## Contributing

When adding new scripts:
1. Follow the existing conventions (shebang, strict mode, colors)
2. Add comprehensive comments
3. Include usage examples in this README
4. Create backups before modifying files
5. Provide clear output and progress reporting
6. Use absolute paths internally, display relative paths to users
