/**
 * Universal Path Resolver for Legacy Concierge
 * Automatically detects and adapts paths for:
 * - localhost:8000 (local dev)
 * - https://dylarcher.github.io/legacyconcierge (GitHub Pages)
 * - https://legacyconcierge.com/ (production)
 */

/**
 * Detect the base path for the current environment
 * @returns {string} Base path (e.g., '', '/legacyconcierge')
 */
function detectBasePath() {
	const { hostname, pathname } = window.location;

	// Production domain
	if (hostname === 'legacyconcierge.com' || hostname === 'www.legacyconcierge.com') {
		return '';
	}

	// Local development
	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return '';
	}

	// GitHub Pages - detect repository name from path
	// Robust check: hostnames ending with '.github.io' (GitHub Pages)
	if (hostname.endsWith('.github.io')) {
		const pathParts = pathname.split('/').filter(p => p);
		// First segment is usually the repository name
		if (pathParts.length > 0 && pathParts[0] !== 'pages') {
			return `/${pathParts[0]}`;
		}
	}

	return '';
}

/**
 * Global base path - computed once on load
 */
const BASE_PATH = detectBasePath();

/**
 * Resolve a path relative to the project root
 * @param {string} path - Path to resolve (e.g., 'common/services/i18n.js' or '/common/services/i18n.js')
 * @returns {string} Resolved absolute path
 */
function resolvePath(path) {
	// Remove leading slash if present
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;

	// For GitHub Pages, prepend base path
	if (BASE_PATH) {
		return `${BASE_PATH}/${cleanPath}`;
	}

	// For localhost and production, use root-relative
	return `/${cleanPath}`;
}

/**
 * Resolve an asset path
 * @param {string} path - Asset path (e.g., 'shared/assets/images/logo.svg')
 * @returns {string} Resolved asset URL
 */
function resolveAsset(path) {
	return resolvePath(path);
}

/**
 * Resolve a page path
 * @param {string} path - Page path (e.g., 'pages/about/index.html')
 * @returns {string} Resolved page URL
 */
function resolvePage(path) {
	return resolvePath(path);
}

/**
 * Get current page's relative depth
 * Used for calculating relative paths from current location
 * @returns {number} Directory depth (0 = root, 1 = /pages/, 2 = /pages/about/)
 */
function getCurrentDepth() {
	const { pathname } = window.location;
	const cleanPath = pathname
		.replace(BASE_PATH, '') // Remove base path
		.replace(/\/index\.html$/, '') // Remove index.html
		.replace(/\/$/, ''); // Remove trailing slash

	if (!cleanPath || cleanPath === '/') return 0;

	const segments = cleanPath.split('/').filter(s => s);
	return segments.length;
}

/**
 * Generate relative path from current page to target
 * @param {string} targetPath - Target path (e.g., 'common/services/i18n.js')
 * @returns {string} Relative path (e.g., '../../common/services/i18n.js')
 */
function getRelativePath(targetPath) {
	const depth = getCurrentDepth();
	const upLevels = '../'.repeat(depth);
	const cleanTarget = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;

	return depth === 0 ? `./${cleanTarget}` : `${upLevels}${cleanTarget}`;
}

/**
 * Update import map dynamically based on environment
 * Should be called on page load to adjust module paths
 */
function updateImportMap() {
	const importMapScript = document.querySelector('script[type="importmap"]');

	if (!importMapScript) {
		console.warn('No import map found in document');
		return;
	}

	try {
		const importMap = JSON.parse(importMapScript.textContent);

		// Update paths based on environment
		if (BASE_PATH) {
			// GitHub Pages - adjust paths
			importMap.imports = {
				'@/': `${BASE_PATH}/common/`,
				'#/': `${BASE_PATH}/shared/`,
				'$/': `${BASE_PATH}/pages/`
			};
		} else {
			// Localhost/Production - use absolute from root
			importMap.imports = {
				'@/': '/common/',
				'#/': '/shared/',
				'$/': '/pages/'
			};
		}

		// Replace import map
		importMapScript.textContent = JSON.stringify(importMap, null, 2);
		console.log('✓ Import map updated for environment:', BASE_PATH || 'root');
	} catch (error) {
		console.error('Failed to update import map:', error);
	}
}

// Auto-update import map on load
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', updateImportMap);
} else {
	updateImportMap();
}

// Export functions
export {
	BASE_PATH,
	detectBasePath,
	resolvePath,
	resolveAsset,
	resolvePage,
	getCurrentDepth,
	getRelativePath,
	updateImportMap
};

// Also expose globally for non-module usage
if (typeof window !== 'undefined') {
	window.PathResolver = {
		BASE_PATH,
		resolvePath,
		resolveAsset,
		resolvePage,
		getCurrentDepth,
		getRelativePath
	};
}
