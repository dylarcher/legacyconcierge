/**
 * Lighthouse CI Configuration - Mobile
 *
 * Mobile-optimized configuration for Lighthouse audits.
 * Simulates a mobile device with network throttling.
 *
 * Usage:
 *   npm run lighthouse:mobile
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

export default {
  ci: {
    collect: {
      startServerCommand: "python3 -m http.server 8000",
      startServerReadyPattern: "Serving HTTP",
      startServerReadyTimeout: 10000,

      url: [
        "http://localhost:8000/",
        "http://localhost:8000/pages/treatments/",
        "http://localhost:8000/pages/expertise/",
        "http://localhost:8000/pages/about/",
        "http://localhost:8000/pages/contact/",
      ],

      numberOfRuns: 3,

      settings: {
        // Mobile throttling (slower network to simulate 4G)
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
        preset: "mobile",
        // Mobile screen emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        // Mobile user agent
        emulatedUserAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
      },
    },

    assert: {
      assertions: {
        // More lenient performance thresholds for mobile
        "categories:performance": ["error", { minScore: 0.65, aggregationMethod: "median-run" }],
        "categories:accessibility": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "categories:best-practices": ["warn", { minScore: 0.85, aggregationMethod: "median-run" }],
        "categories:seo": ["warn", { minScore: 0.85, aggregationMethod: "median-run" }],

        // Mobile Core Web Vitals (adjusted for slower connection)
        "first-contentful-paint": ["warn", { maxNumericValue: 3000, aggregationMethod: "median-run" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 4000, aggregationMethod: "median-run" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median-run" }],
        "total-blocking-time": ["warn", { maxNumericValue: 600, aggregationMethod: "median-run" }],

        // Mobile-specific audits
        viewport: ["error", { minScore: 1 }],
        "tap-targets": ["warn", { minScore: 0.9 }],
        "font-size": ["warn", { minScore: 1 }],

        // Accessibility (same as desktop)
        "color-contrast": ["error", { minScore: 1 }],
        "image-alt": ["error", { minScore: 1 }],
        label: ["error", { minScore: 1 }],
      },

      preset: "lighthouse:no-pwa",
    },

    upload: {
      target: "temporary-public-storage",
    },
  },
};
