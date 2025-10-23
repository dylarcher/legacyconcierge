// @ts-nocheck
/**
 * Universal Path Resolver - Initialization Script
 * This runs immediately when loaded (no DOMContentLoaded needed)
 * Small, cacheable script that MUST load before any modules
 *
 * @file Initializes global path resolution for GitHub Pages, localhost, and production
 */

(() => {

	// Detect environment and set base path
	const hostname = window.location.hostname;
	const pathname = window.location.pathname;
	let basePath = '';

	// GitHub Pages detection
	if (hostname === 'github.io' || hostname.endsWith('.github.io')) {
		const parts = pathname.split('/').filter(p => p && p !== 'index.html');
		if (parts.length > 0 && parts[0] !== 'pages') {
			basePath = `/${parts[0]}`;
		}
	}

	/**
	 * @global
	 * @type {string}
	 * @description Base path for the current environment (e.g., '/legacyconcierge' for GitHub Pages)
	 */
	window.BASE_PATH = basePath;

	console.log(`[Path Resolver] Environment detected: ${hostname}, Base path: "${basePath || '/'}"`);

	/**
	 * Injects the import map with correct base paths
	 * Import maps MUST be injected before any module scripts run
	 * @private
	 */
	const injectImportMap = () => {
		// Check if import map already exists (shouldn't if HTML was updated correctly)
		const existingMap = document.querySelector('script[type="importmap"]');
		if (existingMap) {
			console.warn('[Path Resolver] Import map already exists, removing it');
			existingMap.remove();
		}

		// Create import map with correct base paths
		const importMap = {
			imports: basePath ? {
				'@/': `${basePath}/common/`,
				'#/': `${basePath}/shared/`,
				'$/': `${basePath}/pages/`
			} : {
				'@/': '/common/',
				'#/': '/shared/',
				'$/': '/pages/'
			}
		};

		// Inject import map into the document head
		const script = document.createElement('script');
		script.type = 'importmap';
		script.textContent = JSON.stringify(importMap, null, 2);

		// Insert as first child of head to ensure it's before any module scripts
		const head = document.head || document.getElementsByTagName('head')[0];
		if (head.firstChild) {
			head.insertBefore(script, head.firstChild);
		} else {
			head.appendChild(script);
		}

		console.log('[Path Resolver] Import map injected:', importMap.imports);
	};

	// Inject import map immediately - must happen before any modules load
	injectImportMap();

	/**
	 * Resolves a path relative to the project root
	 * @global
	 * @function resolvePath
	 * @param {string} p - Path to resolve (e.g., 'common/services/i18n.js')
	 * @returns {string} Resolved absolute path with base path prefix
	 * @example
	 * // On GitHub Pages (basePath = '/legacyconcierge')
	 * resolvePath('common/core/helpers.js') // Returns '/legacyconcierge/common/core/helpers.js'
	 *
	 * // On localhost (basePath = '')
	 * resolvePath('common/core/helpers.js') // Returns '/common/core/helpers.js'
	 */
	window.resolvePath = (p) => {
		const cleanPath = p.startsWith('/') ? p.slice(1) : p;
		return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
	};

	/**
	 * Resolves a relative path based on current page depth
	 * Calculates how many '../' are needed to reach root
	 * @global
	 * @function resolveRelativePath
	 * @param {string} p - Target path from root
	 * @returns {string} Relative path with appropriate '../' prefixes
	 * @example
	 * // On page at /pages/about/index.html (depth 2)
	 * resolveRelativePath('common/services/i18n.js') // Returns '../../common/services/i18n.js'
	 *
	 * // On root page
	 * resolveRelativePath('common/services/i18n.js') // Returns './common/services/i18n.js'
	 */
	window.resolveRelativePath = (p) => {
		const cleanPath = p.startsWith('/') ? p.slice(1) : p;
		const currentPath = window.location.pathname.replace(basePath, '');
		const depth = currentPath.split('/').filter(s => s && s !== 'index.html').length;

		if (depth === 0) return `./${cleanPath}`;
		return `${'../'.repeat(depth)}${cleanPath}`;
	};
})();
