export default {
	defaults: {
		standard: 'WCAG2AA',
		level: 'error',
		timeout: 30000,
		wait: 1000,
		includeNotices: false,
		includeWarnings: true,
		rootElement: null,
		hideElements: '.visually-hidden, [aria-hidden="true"]',
		ignore: [],
		verifyPage: null,
		threshold: 0,
		chromeLaunchConfig: {
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--disable-software-rasterizer',
				'--force-device-scale-factor=1',
			],
		},
		viewport: {
			width: 1280,
			height: 1024,
			deviceScaleFactor: 1,
			isMobile: false,
			hasTouch: false,
			isLandscape: true,
		},
		runners: ['axe', 'htmlcs'],
		actions: [],
		headers: {},
		cookies: [],
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
	},
	urls: [
		{
			url: 'http://localhost:5173',
			name: 'Home Page',
		},
		{
			url: 'http://localhost:5173/about',
			name: 'About Page',
		},
		{
			url: 'http://localhost:5173/services',
			name: 'Services Page',
		},
		{
			url: 'http://localhost:5173/contact',
			name: 'Contact Page',
		},
	],
	viewport: [
		{
			width: 320,
			height: 568,
			name: 'Mobile - Small',
		},
		{
			width: 768,
			height: 1024,
			name: 'Tablet - Portrait',
		},
		{
			width: 1024,
			height: 768,
			name: 'Tablet - Landscape',
		},
		{
			width: 1280,
			height: 800,
			name: 'Desktop - Small',
		},
		{
			width: 1920,
			height: 1080,
			name: 'Desktop - Large',
		},
	],
	reporter: 'cli',
	reporterConfig: {
		includeZeroIssues: false,
	},
};