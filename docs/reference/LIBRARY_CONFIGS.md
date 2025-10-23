# Configuration Files

This directory contains all configuration files for the Legacy Concierge project.

## Files

### `biome.json`
**Purpose:** Configuration for Biome linter and formatter  
**Used by:** npm scripts (`biome`, `lint`, `check`, `tidy`)  
**Reference:** `--config-path=configs/biome.json` in `package.json`

**Key Settings:**
- 2-space indentation
- 80-character line width
- LF line endings
- Enabled rules: a11y, complexity, correctness, performance, security, style, suspicious

**Usage:**
```bash
npm run lint      # Run linter
npm run check     # Run both linter and formatter checks
npm run tidy      # Format code
```

### `lighthouserc.js`
**Purpose:** Lighthouse CI configuration for desktop audits  
**Used by:** npm scripts (`lighthouse`, `lighthouse:report`)  
**Reference:** `--config=configs/lighthouserc.js` in `package.json`

**Key Settings:**
- Desktop screen emulation (1350x940)
- Performance threshold: ≥75%
- Accessibility threshold: ≥90%
- Tests 5 URLs with 3 runs each
- Strict Core Web Vitals requirements

**Usage:**
```bash
npm run lighthouse         # Run desktop audit
npm run lighthouse:report  # Generate report files
```

### `lighthouserc.mobile.js`
**Purpose:** Lighthouse CI configuration for mobile audits  
**Used by:** npm script (`lighthouse:mobile`)  
**Reference:** `--config=configs/lighthouserc.mobile.js` in `package.json`

**Key Settings:**
- Mobile screen emulation (375x667, iPhone)
- 4G network throttling
- More lenient performance threshold: ≥65%
- Mobile-specific audits (viewport, tap targets, font size)

**Usage:**
```bash
npm run lighthouse:mobile  # Run mobile audit
```

### `tsconfig.json`
**Purpose:** TypeScript configuration for IDE support and type checking  
**Used by:** VS Code, TypeScript Language Server  
**Auto-discovered:** TypeScript tools automatically find this file

**Key Settings:**
- Target: ES2022
- Module: ES2022
- Allows JavaScript files
- Path alias: `~/` maps to project root
- Includes: `utils/`, `_locale/`

**Note:** This is used for IDE type hints and IntelliSense, not for compilation (project uses vanilla JavaScript).

## Files That Must Stay at Root

Some configuration files cannot be moved and must remain in the project root:

- **`package.json`** - Required by npm/node at root
- **`_config.yml`** - Required by Jekyll/GitHub Pages at root
- **`manifest.json`** - Web app manifest, must be at root or referenced from HTML
- **`.gitignore`, `.gitattributes`** - Git requires these at root
- **`.nvmrc`** - nvm requires this at root

## Adding New Configuration Files

When adding new configuration files:

1. If the tool supports custom config paths, place the file here and update references
2. If the tool requires root placement, document it in the "Files That Must Stay at Root" section above
3. Update this README with the new configuration details
4. Update `package.json` scripts with proper `--config` flags if needed

## Documentation

For more details on configurations:
- Biome: See `CONTRIBUTING.md` for code style guidelines
- Lighthouse CI: See `../docs/how-to/PHASE_2_LIGHTHOUSE_CI.md` for audit details
- TypeScript: See inline comments in `tsconfig.json`
