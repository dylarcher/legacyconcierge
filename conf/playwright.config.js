import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	testDir: './test/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['html', { outputFolder: 'reports/playwright', open: 'never' }],
		['json', { outputFile: 'reports/playwright/results.json' }],
		['list'],
	],
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		actionTimeout: 10000,
		navigationTimeout: 30000,
		viewport: { width: 1280, height: 720 },
		ignoreHTTPSErrors: true,
		acceptDownloads: true,
		locale: 'en-US',
		timezoneId: 'America/New_York',
		permissions: ['geolocation', 'notifications'],
		geolocation: { latitude: 40.7128, longitude: -74.0060 },
		colorScheme: 'light',
		reducedMotion: 'no-preference',
		forcedColors: 'none',
		extraHTTPHeaders: {
			'Accept-Language': 'en-US,en;q=0.9',
		},
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1920, height: 1080 },
				launchOptions: {
					args: [
						'--disable-dev-shm-usage',
						'--no-sandbox',
						'--disable-setuid-sandbox',
						'--disable-gpu',
					],
				},
			},
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				viewport: { width: 1920, height: 1080 },
			},
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
				viewport: { width: 1920, height: 1080 },
			},
		},
		{
			name: 'mobile-chrome',
			use: {
				...devices['Pixel 5'],
				viewport: { width: 393, height: 851 },
			},
		},
		{
			name: 'mobile-safari',
			use: {
				...devices['iPhone 13'],
				viewport: { width: 390, height: 844 },
			},
		},
		{
			name: 'tablet-ipad',
			use: {
				...devices['iPad (gen 7)'],
				viewport: { width: 810, height: 1080 },
			},
		},
		{
			name: 'a11y',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 720 },
				colorScheme: 'dark',
				forcedColors: 'active',
				reducedMotion: 'reduce',
			},
		},
	],
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		stdout: 'pipe',
		stderr: 'pipe',
		timeout: 120 * 1000,
	},
	outputDir: 'test-results',
	snapshotDir: 'test/e2e/snapshots',
	snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
	globalSetup: './test/e2e/global-setup.js',
	globalTeardown: './test/e2e/global-teardown.js',
	timeout: 30000,
	expect: {
		timeout: 5000,
		toHaveScreenshot: {
			maxDiffPixels: 100,
			threshold: 0.2,
			animations: 'disabled',
		},
	},
});