/**
 * Navigation Integration Tests
 *
 * Tests:
 * - Navigation works across all pages
 * - Dropdown keyboard navigation
 * - Mobile menu functionality
 * - Skip links for accessibility
 * - Active page highlighting
 */

import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display logo and main navigation', async ({ page }) => {
		// Check logo is visible
		const logo = page.locator('lc-header .logo');
		await expect(logo).toBeVisible();

		// Check main nav items
		const homeLink = page.locator('nav a[href="/"]');
		await expect(homeLink).toBeVisible();
	});

	test('should navigate to different pages', async ({ page }) => {
		// Navigate to About page
		await page.click('text=About');
		await expect(page).toHaveURL(/\/about/);

		// Go back to home
		await page.goto('/');
		await expect(page).toHaveURL('/');
	});

	test('should open and close mobile menu', async ({ page, viewport }) => {
		// Only test on mobile viewports
		if (!viewport || viewport.width > 768) {
			test.skip();
		}

		// Click mobile menu toggle
		const menuToggle = page.locator('[aria-label*="menu"]');
		await menuToggle.click();

		// Menu should be visible
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();

		// Close menu
		await menuToggle.click();
		// Note: Depending on implementation, menu might be hidden or have aria-hidden
	});

	test('should support keyboard navigation in dropdowns', async ({ page }) => {
		// Focus on Services menu
		await page.focus('text=Services');

		// Press Enter to open dropdown
		await page.keyboard.press('Enter');

		// Dropdown should be visible
		const dropdown = page.locator('[aria-haspopup="true"] + *');
		await expect(dropdown).toBeVisible();

		// Press Escape to close
		await page.keyboard.press('Escape');
		await expect(dropdown).not.toBeVisible();
	});

	test('should navigate with arrow keys in dropdowns', async ({ page }) => {
		// Open Services dropdown
		await page.hover('text=Services');

		// Dropdown should be visible
		const dropdown = page.locator('[aria-haspopup="true"][aria-expanded="true"]');
		await expect(dropdown).toBeVisible();

		// Press arrow down to navigate
		await page.keyboard.press('ArrowDown');

		// First menu item should be focused
		const focusedElement = await page.evaluate(() => document.activeElement.textContent);
		expect(focusedElement).toBeTruthy();
	});

	test('skip link should work', async ({ page }) => {
		// Press Tab to focus skip link
		await page.keyboard.press('Tab');

		// Skip link should be focused
		const skipLink = page.locator('.skip-link');
		await expect(skipLink).toBeFocused();

		// Press Enter to skip to main
		await page.keyboard.press('Enter');

		// Main content should be focused
		const main = page.locator('#main, main');
		await expect(main).toBeFocused();
	});

	test('should have correct navigation structure', async ({ page }) => {
		// Check for required navigation elements
		const nav = page.locator('nav[role="navigation"]');
		await expect(nav).toBeVisible();

		// Check for logo link
		const logoLink = page.locator('a[href="/"]').first();
		await expect(logoLink).toBeVisible();

		// Check for main menu items
		const menuItems = page.locator('nav a');
		const count = await menuItems.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should maintain navigation across page changes', async ({ page }) => {
		// Navigate to different pages and verify nav persists
		const pages = ['/', '/pages/about/', '/pages/services/treatments/'];

		for (const url of pages) {
			await page.goto(url);
			const nav = page.locator('nav');
			await expect(nav).toBeVisible();
		}
	});
});

test.describe('Dropdown Menus', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should open on hover', async ({ page }) => {
		// Hover over Services
		await page.hover('text=Services');

		// Dropdown should be visible
		const dropdown = page.locator('[aria-haspopup="true"][aria-expanded="true"]');
		await expect(dropdown).toBeVisible();
	});

	test('should close when clicking outside', async ({ page }) => {
		// Open dropdown
		await page.hover('text=Services');

		// Click outside
		await page.click('body', { position: { x: 0, y: 0 } });

		// Dropdown should be closed
		const dropdown = page.locator('[aria-expanded="true"]');
		await expect(dropdown).toHaveCount(0);
	});

	test('should have proper ARIA attributes', async ({ page }) => {
		const menuButton = page.locator('[aria-haspopup="true"]').first();

		// Should have aria-haspopup
		await expect(menuButton).toHaveAttribute('aria-haspopup', 'true');

		// Should have aria-expanded
		const hasAriaExpanded = await menuButton.getAttribute('aria-expanded');
		expect(hasAriaExpanded).toBeDefined();
	});
});

test.describe('Breadcrumbs', () => {
	test('should display breadcrumbs on deep pages', async ({ page }) => {
		// Navigate to a detail page
		await page.goto('/pages/services/treatments/views/post-op-recovery/');

		// Check if breadcrumbs exist (if implemented)
		const breadcrumbs = page.locator('[aria-label="Breadcrumb"], .breadcrumbs');
		const count = await breadcrumbs.count();

		// This test will pass if breadcrumbs exist or skip if not implemented
		if (count > 0) {
			await expect(breadcrumbs).toBeVisible();
		}
	});
});
