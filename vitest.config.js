/**
 * Vitest Configuration
 * @see https://vitest.dev/config/
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test environment - happy-dom is faster than jsdom
    environment: "happy-dom",

    // Global test utilities (available in all test files without import)
    globals: true,

    // Setup files to run before each test file
    setupFiles: ["./tests/setup.js"],

    // Test file patterns
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/cypress/**", "**/e2e/**", "**/.{idea,git,cache,output,temp}/**"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.js"],
      exclude: ["**/node_modules/**", "**/tests/**", "**/*.test.js", "**/*.spec.js", "**/dist/**", "**/build/**"],
      // Coverage thresholds
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },

    // Test timeout
    testTimeout: 10000,

    // Execution pool
    pool: "threads",

    // Retry failed tests
    retry: 0,

    // Silent console output
    silent: false,

    // Reporter
    reporters: process.env.CI ? ["verbose", "json"] : ["verbose"],

    // Mock options
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },

  // Resolve configuration for module imports
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@tests": "/tests",
    },
  },
});
