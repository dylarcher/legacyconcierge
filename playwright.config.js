/**
 * Playwright Test Configuration
 *
 * @see https://playwright.dev/docs/test-configuration
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	// Test directory
	testDir: './tests/e2e',

	// Run tests in files in parallel
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,

	// Retry on CI only
	retries: process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI
	workers: process.env.CI ? 1 : undefined,

	// Reporter to use
	reporter: process.env.CI ? 'github' : 'html',

	// Shared settings for all projects
	use: {
		// Base URL for tests
		baseURL: process.env.BASE_URL || 'http://localhost:8000',

		// Collect trace when retrying the failed test
		trace: 'on-first-retry',

		// Screenshot on failure
		screenshot: 'only-on-failure',

		// Video on failure
		video: 'retain-on-failure',
	},

	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},

		// Mobile viewports
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
		},

		// Tablet viewports
		{
			name: 'iPad',
			use: { ...devices['iPad Pro'] },
		},
	],

	// Run local dev server before starting tests
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:8000',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
