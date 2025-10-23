# NPM Scripts Guide

Complete guide to all npm scripts in the Legacy Concierge project, including how to run tests, view reports, and interact with Lighthouse.

## Table of Contents

- [Development](#development)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Performance & Lighthouse](#performance--lighthouse)
- [Validation & CI](#validation--ci)
- [Reports & Output](#reports--output)

---

## Development

### `npm run dev` / `npm start`

Start a local development server on port 8000.

```bash
npm run dev
# or
npm start
```

**What it does:**
- Starts Python's built-in HTTP server
- Serves the site at `http://localhost:8000`
- No live reload (refresh browser manually)

**Usage:**
```bash
npm run dev
# Open http://localhost:8000 in your browser
```

---

## Testing

All tests use Playwright for end-to-end testing across different browsers and devices.

### `npm test`

Run all tests in headless mode (default).

```bash
npm test
```

**What it does:**
- Runs all tests in `tests/e2e/` directory
- Uses headless browsers (no visible window)
- Generates HTML report in `playwright-report/`
- Runs in parallel by default

**Configuration:**
- Test directory: `./tests/e2e`
- Base URL: `http://localhost:8000`
- Reporters: HTML (local), GitHub Actions (CI)

### `npm run test:ui`

Run tests with Playwright's interactive UI.

```bash
npm run test:ui
```

**What it does:**
- Opens Playwright UI in your browser
- Allows you to run/debug tests interactively
- View test execution in real-time
- Inspect test steps and assertions

**Best for:**
- Writing new tests
- Debugging failing tests
- Exploring test coverage

### `npm run test:debug`

Run tests in debug mode with step-through debugging.

```bash
npm run test:debug
```

**What it does:**
- Opens Playwright Inspector
- Pauses before each action
- Allows step-by-step execution
- View console logs and network requests

**Best for:**
- Debugging specific test failures
- Understanding test behavior
- Inspecting element selectors

### `npm run test:headed`

Run tests with visible browser windows.

```bash
npm run test:headed
```

**What it does:**
- Opens actual browser windows
- Watch tests run in real-time
- Useful for visual verification
- Slower than headless mode

**Best for:**
- Visual regression testing
- Verifying UI behavior
- Demonstrating test coverage

### Browser-Specific Tests

Run tests on specific browsers:

```bash
# Chromium (Chrome/Edge)
npm run test:chromium

# Firefox
npm run test:firefox

# WebKit (Safari)
npm run test:webkit
```

**What it does:**
- Runs tests on a single browser engine
- Faster than running all browsers
- Useful for browser-specific debugging

### `npm run test:mobile`

Run tests on mobile device emulators.

```bash
npm run test:mobile
```

**What it does:**
- Tests on Mobile Chrome and Mobile Safari
- Emulates touch interactions
- Tests responsive design
- Validates mobile-specific features

**Device configurations:**
- Mobile Chrome: 375x667, 2x scale
- Mobile Safari: iPhone viewport

### `npm run test:report`

View the last test report in your browser.

```bash
npm run test:report
```

**What it does:**
- Opens `playwright-report/index.html`
- Shows test results, screenshots, videos
- Displays test duration and failures
- Includes trace files for failed tests

**Report location:**
```
playwright-report/
├── index.html          # Main report
├── data/
│   ├── screenshots/    # Failure screenshots
│   ├── videos/         # Failure videos
│   └── traces/         # Playwright traces
```

---

## Code Quality

### Formatting

#### `npm run format`

Auto-format all code using Biome.

```bash
npm run format
```

**What it does:**
- Formats JavaScript, JSON, HTML files
- Fixes indentation, spacing, quotes
- Enforces consistent style
- Modifies files in place

#### `npm run format:check`

Check if code is properly formatted (doesn't modify files).

```bash
npm run format:check
```

**What it does:**
- Checks formatting without changes
- Exits with error if formatting needed
- Used in CI/CD pipeline
- Shows which files need formatting

### Linting

#### `npm run lint`

Check code for errors and style issues.

```bash
npm run lint
```

**What it does:**
- Lints JavaScript files with Biome
- Checks for syntax errors
- Enforces coding standards
- Reports but doesn't fix issues

#### `npm run lint:fix`

Auto-fix linting issues.

```bash
npm run lint:fix
```

**What it does:**
- Fixes auto-fixable linting issues
- Updates files in place
- Reports unfixable issues

#### `npm run lint:md`

Lint Markdown files.

```bash
npm run lint:md
```

**What it does:**
- Checks Markdown files for style issues
- Validates heading structure
- Checks link formatting
- Enforces consistent MD style

#### `npm run lint:md:fix`

Auto-fix Markdown linting issues.

```bash
npm run lint:md:fix
```

### Combined Checks

#### `npm run check`

Run both format check and lint.

```bash
npm run check
```

**What it does:**
- Runs `format:check` + `lint`
- Comprehensive code quality check
- Used before committing

#### `npm run check:fix`

Auto-fix both formatting and linting.

```bash
npm run check:fix
```

**What it does:**
- Runs `format` + `lint:fix`
- Fixes all auto-fixable issues
- Quick cleanup before commit

### Type Checking

#### `npm run type-check`

Check TypeScript types without emitting files.

```bash
npm run type-check
```

**What it does:**
- Validates TypeScript/JSDoc types
- Checks type safety
- No output files generated
- Catches type errors early

#### `npm run types:generate`

Generate TypeScript declaration files.

```bash
npm run types:generate
```

**What it does:**
- Creates `.d.ts` files for JavaScript
- Outputs to `types/` directory
- Useful for IDE autocompletion
- Helps with type documentation

**Output:**
```
types/
├── common/
│   ├── components/
│   ├── core/
│   └── services/
└── shared/
```

### Path Validation

#### `npm run paths:check`

Validate all file paths in the project.

```bash
npm run paths:check
```

**What it does:**
- Checks HTML `src` and `href` attributes
- Validates import statements
- Ensures files exist
- Catches broken links early

**Checks:**
- Image sources exist
- Script imports are valid
- CSS files are present
- Link destinations exist

---

## Performance & Lighthouse

Lighthouse audits measure performance, accessibility, best practices, and SEO.

### `npm run lighthouse`

Run comprehensive Lighthouse audits (desktop).

```bash
npm run lighthouse
```

**What it does:**
- Starts local server automatically
- Audits 5 key pages (home, treatments, expertise, about, contact)
- Runs 3 times per page (takes median score)
- Tests performance, accessibility, best practices, SEO
- Desktop throttling (simulates fast 4G)

**Configuration:**
- Config file: `lighthouserc.js`
- Device: Desktop (1350x940)
- Network: 10 Mbps download
- CPU: 1x slowdown

**Thresholds (fail if not met):**
- Performance: ≥75%
- Accessibility: ≥90%
- Best Practices: ≥85% (warning)
- SEO: ≥85% (warning)

**Core Web Vitals:**
- First Contentful Paint: <2s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Total Blocking Time: <300ms

**Resource Budgets:**
- JavaScript: <300KB
- Images: <500KB
- Stylesheets: <100KB
- Fonts: <150KB
- Total: <1.5MB

### `npm run lighthouse:quick`

Quick Lighthouse audit with browser preview.

```bash
npm run lighthouse:quick
```

**What it does:**
- Audits homepage only
- Opens report in browser immediately
- Desktop preset
- Single run (not median of 3)

**Best for:**
- Quick performance checks
- Testing specific optimizations
- Visual report inspection

### Mobile Lighthouse Audits

For mobile audits, use the mobile configuration:

```bash
# Run mobile audit
npx lhci autorun --config=lighthouserc.mobile.js
```

**Mobile configuration:**
- Device: iPhone (375x667)
- Network: 4G (slower throttling)
- CPU: 4x slowdown
- More lenient thresholds

**Mobile thresholds:**
- Performance: ≥65%
- First Contentful Paint: <3s
- Largest Contentful Paint: <4s

### Lighthouse Report Locations

**HTML reports:**
```
.lighthouseci/
├── lhci-runs-*.json        # Raw data
└── index.html              # Combined report
```

**Viewing reports:**
1. After running Lighthouse, reports are in `.lighthouseci/`
2. Open the HTML report in your browser
3. Reports show:
   - Overall scores (0-100)
   - Performance metrics
   - Accessibility violations
   - Opportunities for improvement
   - Diagnostic information

**Understanding Lighthouse Scores:**
- 0-49 (Red): Poor - needs immediate attention
- 50-89 (Orange): Needs improvement
- 90-100 (Green): Good performance

### Lighthouse CI Integration

Reports are uploaded to temporary public storage by default:

```javascript
upload: {
  target: 'temporary-public-storage'
}
```

**To enable permanent storage:**
1. Set up a Lighthouse CI server
2. Update `lighthouserc.js`:
```javascript
upload: {
  target: 'lhci',
  serverBaseUrl: 'https://your-lhci-server.com',
  token: process.env.LHCI_TOKEN,
}
```

---

## Validation & CI

### `npm run validate`

Run all validation checks without fixing.

```bash
npm run validate
```

**What it does:**
- `npm run format:check`
- `npm run lint`
- `npm run type-check`
- `npm run paths:check`

**Best for:**
- Pre-commit validation
- CI/CD pipelines
- Ensuring code quality

### `npm run validate:fix`

Run validation and auto-fix all issues.

```bash
npm run validate:fix
```

**What it does:**
- `npm run format`
- `npm run lint:fix`
- `npm run check:fix`

**Best for:**
- Quick cleanup
- Preparing for commit
- Batch fixing issues

### `npm run ci`

Full CI pipeline (validate + test).

```bash
npm run ci
```

**What it does:**
- Runs all validation checks
- Runs all tests
- Generates reports
- Exits with error if anything fails

**Used in:**
- GitHub Actions workflow
- Pre-merge checks
- Release verification

---

## Reports & Output

### Test Reports

**Playwright HTML Report:**
- Location: `playwright-report/index.html`
- View: `npm run test:report`
- Contains:
  - Test results summary
  - Screenshots of failures
  - Videos of test runs
  - Trace files for debugging

**Reading Playwright Reports:**
1. Green checkmarks: Passed tests
2. Red X: Failed tests (click to see details)
3. Screenshots: Visible on failure
4. Traces: Click to open Playwright Trace Viewer
   - Timeline of test execution
   - Network requests
   - Console logs
   - DOM snapshots

### Lighthouse Reports

**HTML Report:**
- Location: `.lighthouseci/index.html`
- Auto-opens after `lighthouse:quick`
- Contains:
  - Performance score breakdown
  - Accessibility violations
  - SEO recommendations
  - Best practices audit

**Reading Lighthouse Reports:**
1. **Overall Scores:** Top of report (0-100)
2. **Metrics:**
   - FCP, LCP, TBT, CLS (Core Web Vitals)
   - Time to Interactive
   - Speed Index
3. **Opportunities:** Ways to improve performance
4. **Diagnostics:** Additional information
5. **Passed Audits:** What's working well

**Key Metrics Explained:**
- **FCP** (First Contentful Paint): Time until first content renders
- **LCP** (Largest Contentful Paint): Time until main content loads
- **TBT** (Total Blocking Time): How long page is unresponsive
- **CLS** (Cumulative Layout Shift): Visual stability score
- **SI** (Speed Index): How quickly content populates

### Code Quality Reports

**Biome Output:**
- Terminal output only
- Shows:
  - Files with errors
  - Line numbers
  - Rule violations
  - Fix suggestions

**TypeScript Errors:**
- Terminal output
- Shows:
  - Type mismatches
  - Missing properties
  - Incorrect types
  - File locations

---

## Common Workflows

### Before Committing

```bash
# Check everything
npm run validate

# Or fix automatically
npm run validate:fix

# Then verify tests pass
npm test
```

### Debugging Failed Tests

```bash
# Option 1: Interactive UI
npm run test:ui

# Option 2: Debug mode
npm run test:debug

# Option 3: View last report
npm run test:report
```

### Performance Optimization

```bash
# 1. Run quick check
npm run lighthouse:quick

# 2. Identify issues in report
# 3. Make changes
# 4. Run full audit
npm run lighthouse
```

### Mobile Testing

```bash
# Test mobile browsers
npm run test:mobile

# Audit mobile performance
npx lhci autorun --config=lighthouserc.mobile.js
```

### CI/CD Pipeline

```bash
# What GitHub Actions runs:
npm run ci

# Equivalent to:
npm run validate && npm test
```

---

## Troubleshooting

### Tests Failing Locally

1. **Ensure dev server is NOT running:**
   ```bash
   # Playwright starts its own server
   # Kill any process on port 8000
   ```

2. **Clear test cache:**
   ```bash
   rm -rf playwright-report
   rm -rf test-results
   ```

3. **Update browsers:**
   ```bash
   npx playwright install
   ```

### Lighthouse Not Working

1. **Check port 8000 is free:**
   ```bash
   lsof -ti:8000 | xargs kill -9
   ```

2. **Clear Lighthouse cache:**
   ```bash
   rm -rf .lighthouseci
   ```

3. **Verify server starts:**
   ```bash
   python3 -m http.server 8000
   ```

### Format/Lint Errors

1. **Auto-fix first:**
   ```bash
   npm run check:fix
   ```

2. **Review remaining errors:**
   ```bash
   npm run check
   ```

3. **Fix manually if needed**

---

## Environment Variables

### Playwright

```bash
# Change base URL
BASE_URL=https://staging.example.com npm test

# Enable CI mode
CI=1 npm test
```

### Lighthouse

```bash
# Upload token (if using LHCI server)
LHCI_TOKEN=your-token npm run lighthouse
```

---

## Quick Reference

| Command | Description | Output |
|---------|-------------|--------|
| `npm start` | Start dev server | Terminal |
| `npm test` | Run all tests | HTML report |
| `npm run test:ui` | Interactive test UI | Browser UI |
| `npm run test:report` | View last report | Browser |
| `npm run format` | Format code | File changes |
| `npm run lint` | Check code quality | Terminal |
| `npm run type-check` | Verify types | Terminal |
| `npm run lighthouse` | Full audit | HTML report |
| `npm run lighthouse:quick` | Quick audit | Browser |
| `npm run validate` | Check everything | Terminal |
| `npm run ci` | Full CI pipeline | Terminal + Reports |

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md)
- [Biome Documentation](https://biomejs.dev/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
