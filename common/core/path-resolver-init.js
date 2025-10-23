/**
 * Universal Path Resolver - Initialization Script
 * This runs immediately when loaded (no DOMContentLoaded needed)
 * Small, cacheable script that MUST load before any modules
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
			basePath = '/' + parts[0];
		}
	}

	// Store globally for use by other scripts
	window.BASE_PATH = basePath;

	console.log(`[Path Resolver] Environment detected: ${hostname}, Base path: "${basePath || '/'}"`);

	// Update import map if it exists
	// This runs on DOMContentLoaded to ensure import map script exists
	const updateImportMap = () => {
		const importMapScript = document.querySelector('script[type="importmap"]');
		if (importMapScript) {
			try {
				const importMap = JSON.parse(importMapScript.textContent);
				if (basePath) {
					importMap.imports = {
						'@/': basePath + '/common/',
						'#/': basePath + '/shared/',
						'$/': basePath + '/pages/'
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

	// Helper function for resolving paths in scripts
	window.resolvePath = (p) => {
		const cleanPath = p.startsWith('/') ? p.slice(1) : p;
		return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
	};

	// Helper for resolving relative paths based on current depth
	window.resolveRelativePath = (p) => {
		const cleanPath = p.startsWith('/') ? p.slice(1) : p;
		const currentPath = window.location.pathname.replace(basePath, '');
		const depth = currentPath.split('/').filter(s => s && s !== 'index.html').length;

		if (depth === 0) return `./${cleanPath}`;
		return `${'../'.repeat(depth)}${cleanPath}`;
	};
})();
