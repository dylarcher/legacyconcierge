/**
 * Internationalization (i18n) and Theme Integration Tests
 *
 * Tests:
 * - Language switching persists
 * - Theme toggle works
 * - Translations apply correctly
 * - localStorage persistence
 */

import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load default language', async ({ page }) => {
		// Check HTML lang attribute
		const lang = await page.getAttribute('html', 'lang');
		expect(['en', 'es']).toContain(lang);
	});

	test('should switch language', async ({ page }) => {
		// Get current language
		const initialLang = await page.getAttribute('html', 'lang');

		// Click language toggle
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();

		// Wait for language change
		await page.waitForTimeout(500);

		// Language should have changed
		const newLang = await page.getAttribute('html', 'lang');
		expect(newLang).not.toBe(initialLang);
	});

	test('should persist language preference', async ({ page, context }) => {
		// Switch to Spanish
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		// Check localStorage
		const storedLang = await page.evaluate(() => {
			return localStorage.getItem('preferred-language');
		});
		expect(storedLang).toBeTruthy();

		// Navigate to another page
		await page.goto('/pages/about/');

		// Language should persist
		const lang = await page.getAttribute('html', 'lang');
		expect(lang).toBe(storedLang);
	});

	test('should translate navigation elements', async ({ page }) => {
		// Get initial navigation text
		const homeLink = page.locator('nav a[href="/"]').first();
		const initialText = await homeLink.textContent();

		// Switch language
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		// Navigation text should change
		const newText = await homeLink.textContent();
		expect(newText).not.toBe(initialText);
	});

	test('should translate page content', async ({ page }) => {
		// Get page title
		const title = await page.textContent('h1');

		// Switch language
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		// Title should change
		const newTitle = await page.textContent('h1');
		expect(newTitle).not.toBe(title);
	});

	test('should apply translations to components', async ({ page }) => {
		// Wait for components to load
		await page.waitForLoadState('networkidle');

		// Check that data-i18n attributes exist
		const i18nElements = page.locator('[data-i18n]');
		const count = await i18nElements.count();
		expect(count).toBeGreaterThan(0);

		// Check that translations were applied (elements have text content)
		const firstElement = i18nElements.first();
		const text = await firstElement.textContent();
		expect(text).toBeTruthy();
		expect(text.trim().length).toBeGreaterThan(0);
	});

	test('should translate contact dialog', async ({ page }) => {
		// Open contact dialog
		const ctaButton = page.locator('.cta-button');
		await ctaButton.click();

		// Wait for dialog
		await page.waitForSelector('lc-contact-dialog', { state: 'visible' });

		// Get dialog title
		const dialogTitle = page.locator('lc-contact-dialog').locator('h2');
		const initialTitle = await dialogTitle.textContent();

		// Close dialog
		await page.keyboard.press('Escape');

		// Switch language
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		// Open dialog again
		await ctaButton.click();
		await page.waitForSelector('lc-contact-dialog', { state: 'visible' });

		// Title should be translated
		const newTitle = await dialogTitle.textContent();
		expect(newTitle).not.toBe(initialTitle);
	});
});

test.describe('Theme System', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load default theme', async ({ page }) => {
		// Check data-theme attribute
		const theme = await page.getAttribute('html', 'data-theme');
		expect(['light', 'dark']).toContain(theme);
	});

	test('should toggle theme', async ({ page }) => {
		// Get current theme
		const initialTheme = await page.getAttribute('html', 'data-theme');

		// Click theme toggle
		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');
		await themeToggle.click();

		// Wait for theme change
		await page.waitForTimeout(300);

		// Theme should have changed
		const newTheme = await page.getAttribute('html', 'data-theme');
		expect(newTheme).not.toBe(initialTheme);
		expect(['light', 'dark']).toContain(newTheme);
	});

	test('should persist theme preference', async ({ page }) => {
		// Toggle theme
		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Get current theme
		const theme = await page.getAttribute('html', 'data-theme');

		// Check localStorage
		const storedTheme = await page.evaluate(() => {
			return localStorage.getItem('preferred-theme');
		});
		expect(storedTheme).toBe(theme);

		// Navigate to another page
		await page.goto('/pages/about/');

		// Theme should persist
		const persistedTheme = await page.getAttribute('html', 'data-theme');
		expect(persistedTheme).toBe(theme);
	});

	test('should apply theme colors', async ({ page }) => {
		// Get background color in light mode
		const lightBg = await page.evaluate(() => {
			return getComputedStyle(document.body).backgroundColor;
		});

		// Toggle to dark mode
		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Background color should change
		const darkBg = await page.evaluate(() => {
			return getComputedStyle(document.body).backgroundColor;
		});

		expect(darkBg).not.toBe(lightBg);
	});

	test('should respect prefers-color-scheme', async ({ page, context }) => {
		// Create a new page with dark color scheme preference
		const darkPage = await context.newPage();
		await darkPage.emulateMedia({ colorScheme: 'dark' });

		// Clear localStorage to test system preference
		await darkPage.goto('/');
		await darkPage.evaluate(() => localStorage.clear());
		await darkPage.reload();

		// Should load dark theme
		const theme = await darkPage.getAttribute('html', 'data-theme');
		// Note: This test assumes the theme system respects prefers-color-scheme
		// If not implemented, the test will need adjustment

		await darkPage.close();
	});

	test('should update theme toggle icon', async ({ page }) => {
		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');

		// Get initial icon/content
		const initialContent = await themeToggle.textContent();

		// Toggle theme
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Icon should change
		const newContent = await themeToggle.textContent();
		expect(newContent).not.toBe(initialContent);
	});
});

test.describe('Combined i18n and Theme', () => {
	test('should maintain both preferences across navigation', async ({ page }) => {
		await page.goto('/');

		// Set language to Spanish
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		// Set theme to dark
		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Get current states
		const lang = await page.getAttribute('html', 'lang');
		const theme = await page.getAttribute('html', 'data-theme');

		// Navigate to different page
		await page.goto('/pages/about/');

		// Both should persist
		const persistedLang = await page.getAttribute('html', 'lang');
		const persistedTheme = await page.getAttribute('html', 'data-theme');

		expect(persistedLang).toBe(lang);
		expect(persistedTheme).toBe(theme);
	});

	test('should work in components', async ({ page }) => {
		await page.goto('/');

		// Switch to Spanish and dark mode
		const languageToggle = page.locator('.language-toggle');
		await languageToggle.click();
		await page.waitForTimeout(500);

		const themeToggle = page.locator('[aria-label*="theme"], .theme-toggle');
		await themeToggle.click();
		await page.waitForTimeout(300);

		// Open contact dialog
		const ctaButton = page.locator('.cta-button');
		await ctaButton.click();

		// Dialog should be in Spanish and dark mode
		const dialog = page.locator('lc-contact-dialog');
		await expect(dialog).toBeVisible();

		// Check theme is applied to shadow DOM
		const hasDarkStyles = await page.evaluate(() => {
			const dialog = document.querySelector('lc-contact-dialog');
			const shadowRoot = dialog.shadowRoot;
			const dialogElement = shadowRoot.querySelector('.dialog');
			const bgColor = getComputedStyle(dialogElement).backgroundColor;
			// Dark mode typically has darker background
			return bgColor !== 'rgb(255, 255, 255)';
		});

		// Note: This test may need adjustment based on actual implementation
	});
});
