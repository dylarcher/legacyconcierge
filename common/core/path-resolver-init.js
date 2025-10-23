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
	 * Updates the import map based on detected environment
	 * Modifies the importmap to use correct base paths
	 * @private
	 */
	const updateImportMap = () => {
		const importMapScript = document.querySelector('script[type="importmap"]');
		if (importMapScript) {
			try {
				const importMap = JSON.parse(importMapScript.textContent);
				if (basePath) {
					importMap.imports = {
						'@/': `${basePath}/common/`,
						'#/': `${basePath}/shared/`,
						'$/': `${basePath}/pages/`
					};
				} else {
					// Use absolute paths for localhost/production (works from any page depth)
					importMap.imports = {
						'@/': '/common/',
						'#/': '/shared/',
						'$/': '/pages/'
					};
				}
				importMapScript.textContent = JSON.stringify(importMap, null, 2);
				console.log('[Path Resolver] Import map updated');
			} catch(e) {
				console.error('[Path Resolver] Failed to update import map:', e);
			}
		}
	};

	// Update immediately if DOM is already ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', updateImportMap);
	} else {
		updateImportMap();
	}

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
