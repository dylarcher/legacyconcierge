/**
 * Lighthouse CI Configuration
 *
 * This configuration file defines how Lighthouse audits should be run
 * and what thresholds must be met for the build to pass.
 *
 * Usage:
 *   npm run lighthouse          - Run full audit
 *   npm run lighthouse:mobile   - Mobile audit only
 *   npm run lighthouse:desktop  - Desktop audit only
 *
 * Categories:
 *   - performance: Loading speed and runtime performance
 *   - accessibility: WCAG compliance and usability
 *   - best-practices: Code quality and security
 *   - seo: Search engine optimization
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

export default {
  ci: {
    collect: {
      // Start a temporary web server for testing
      startServerCommand: "python3 -m http.server 8000",
      startServerReadyPattern: "Serving HTTP",
      startServerReadyTimeout: 10000,

      // URLs to audit (add more as needed)
      url: [
        "http://localhost:8000/", // Homepage
        "http://localhost:8000/pages/treatments/", // Treatments page
        "http://localhost:8000/pages/expertise/", // Expertise page
        "http://localhost:8000/pages/about/", // About page
        "http://localhost:8000/pages/contact/", // Contact page
      ],

      // Number of runs per URL (median of 3 is recommended)
      numberOfRuns: 3,

      // Device settings
      settings: {
        // Throttling to simulate real-world conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Audit with both mobile and desktop
        preset: "desktop",
        // Screen emulation
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },

    assert: {
      // Assertion levels for each category
      // Score ranges: 0-49 (poor), 50-89 (needs improvement), 90-100 (good)

      assertions: {
        // Performance thresholds
        "categories:performance": ["error", { minScore: 0.75, aggregationMethod: "median-run" }],

        // Accessibility thresholds (WCAG 2.2 AA compliance)
        "categories:accessibility": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],

        // Best practices thresholds
        "categories:best-practices": ["warn", { minScore: 0.85, aggregationMethod: "median-run" }],

        // SEO thresholds
        "categories:seo": ["warn", { minScore: 0.85, aggregationMethod: "median-run" }],

        // Core Web Vitals (stricter thresholds)
        "first-contentful-paint": ["warn", { maxNumericValue: 2000, aggregationMethod: "median-run" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median-run" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median-run" }],
        "total-blocking-time": ["warn", { maxNumericValue: 300, aggregationMethod: "median-run" }],
        "speed-index": ["warn", { maxNumericValue: 3400, aggregationMethod: "median-run" }],

        // Resource budgets
        "resource-summary:script:size": ["warn", { maxNumericValue: 300000, aggregationMethod: "median-run" }], // 300KB
        "resource-summary:image:size": ["warn", { maxNumericValue: 500000, aggregationMethod: "median-run" }], // 500KB
        "resource-summary:stylesheet:size": ["warn", { maxNumericValue: 100000, aggregationMethod: "median-run" }], // 100KB
        "resource-summary:font:size": ["warn", { maxNumericValue: 150000, aggregationMethod: "median-run" }], // 150KB
        "resource-summary:total:size": ["warn", { maxNumericValue: 1500000, aggregationMethod: "median-run" }], // 1.5MB

        // Accessibility requirements
        "color-contrast": ["error", { minScore: 1 }],
        "image-alt": ["error", { minScore: 1 }],
        label: ["error", { minScore: 1 }],
        "aria-allowed-attr": ["error", { minScore: 1 }],
        "aria-required-attr": ["error", { minScore: 1 }],
        "aria-valid-attr": ["error", { minScore: 1 }],
        "aria-valid-attr-value": ["error", { minScore: 1 }],
        "button-name": ["error", { minScore: 1 }],
        "link-name": ["error", { minScore: 1 }],
        "meta-viewport": ["error", { minScore: 1 }],
      },

      // Preset configurations
      preset: "lighthouse:no-pwa",
    },

    upload: {
      // Disable upload to LHCI server (can be enabled later)
      target: "temporary-public-storage",
      // Optionally configure upload to Lighthouse CI server:
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,
    },
  },
};
