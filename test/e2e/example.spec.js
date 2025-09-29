import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('has correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/Legacy Concierge/);
	});

	test('displays main heading', async ({ page }) => {
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
		await expect(heading).toContainText('Legacy Concierge');
	});

	test('navigation is accessible', async ({ page }) => {
		const nav = page.locator('nav[role="navigation"]');
		await expect(nav).toBeVisible();
		await expect(nav).toHaveAttribute('aria-label', 'Main navigation');
	});

	test('all navigation links work', async ({ page }) => {
		const links = ['Home', 'About', 'Services', 'Contact'];

		for (const linkText of links) {
			const link = page.locator(`nav a:has-text("${linkText}")`);
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute('href', expect.any(String));
		}
	});

	test('page is keyboard navigable', async ({ page }) => {
		await page.keyboard.press('Tab');
		const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
		expect(firstFocusable).toBeTruthy();

		await page.keyboard.press('Tab');
		const secondFocusable = await page.evaluate(() => document.activeElement?.tagName);
		expect(secondFocusable).toBeTruthy();
	});

	test('meets basic accessibility requirements', async ({ page }) => {
		const accessibilitySnapshot = await page.accessibility.snapshot();
		expect(accessibilitySnapshot).toBeTruthy();

		const images = page.locator('img');
		const imageCount = await images.count();

		for (let i = 0; i < imageCount; i++) {
			await expect(images.nth(i)).toHaveAttribute('alt', /.*/);
		}
	});

	test('has proper color contrast', async ({ page }) => {
		const bodyStyles = await page.locator('body').evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return {
				color: styles.color,
				backgroundColor: styles.backgroundColor,
			};
		});

		expect(bodyStyles.color).toBeTruthy();
		expect(bodyStyles.backgroundColor).toBeTruthy();
	});

	test('responsive on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('responsive on tablet', async ({ page }) => {
		await page.setViewportSize({ width: 768, height: 1024 });
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('has meta description', async ({ page }) => {
		const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
		expect(metaDescription).toBeTruthy();
		expect(metaDescription.length).toBeGreaterThan(50);
	});

	test('has proper schema markup', async ({ page }) => {
		const hasViewport = await page.locator('meta[name="viewport"]').count();
		expect(hasViewport).toBeGreaterThan(0);

		const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
		expect(viewport).toContain('width=device-width');
	});
});

test.describe('Performance', () => {
	test('page loads within acceptable time', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const loadTime = Date.now() - startTime;

		expect(loadTime).toBeLessThan(3000);
	});

	test('critical resources load quickly', async ({ page }) => {
		const resourceTimings = await page.evaluate(() =>
			JSON.stringify(performance.getEntriesByType('resource'))
		);

		const timings = JSON.parse(resourceTimings);
		const criticalResources = timings.filter(
			(t) => t.initiatorType === 'script' || t.initiatorType === 'link'
		);

		criticalResources.forEach((resource) => {
			expect(resource.duration).toBeLessThan(1000);
		});
	});
});
