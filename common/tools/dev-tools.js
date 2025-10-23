// @ts-nocheck
/**
 * Development Tools Loader
 *
 * Conditionally loads development-only tools based on environment detection.
 * Currently loads:
 * - Web Vitals performance monitoring
 *
 * Detection methods:
 * - Checks if running on localhost or 127.0.0.1
 * - Checks for development port numbers (8000, 3000, 5000, etc.)
 * - Can be forced via localStorage flag
 *
 * Usage:
 * - Automatically loads on development environments
 * - Set localStorage.setItem('force-dev-tools', 'true') to force enable
 * - Set localStorage.setItem('force-dev-tools', 'false') to force disable
 */

/**
 * Detect if we're in development mode
 * @returns {boolean} - True if in development mode
 */
function isDevMode() {
	// Check localStorage override
	const forceDevTools = localStorage.getItem("force-dev-tools");
	if (forceDevTools === "true") return true;
	if (forceDevTools === "false") return false;

	// Check hostname
	const hostname = window.location.hostname;
	const devHostnames = ["localhost", "127.0.0.1", "0.0.0.0"];

	if (devHostnames.includes(hostname)) {
		return true;
	}

	// Check for common development ports
	const port = window.location.port;
	const devPorts = ["8000", "3000", "5000", "8080", "4200", "5173"];

	if (devPorts.includes(port)) {
		return true;
	}

	// Default to production mode
	return false;
}

/**
 * Load Web Vitals monitoring
 */
async function loadWebVitals() {
	try {
		await import("/common/libs/web-vitals.js");
		console.log("✓ Web Vitals monitoring loaded");
	} catch (error) {
		console.error("✗ Failed to load Web Vitals. Please verify that '/common/libs/web-vitals.js' exists and the path is correct.", error);
	}
}

/**
 * Initialize development tools
 */
async function initDevTools() {
	if (!isDevMode()) {
		console.log("Production mode - dev tools disabled");
		return;
	}

	console.log(
		"%c🛠️ Development Mode Active",
		"font-weight: bold; font-size: 14px; color: #0cce6b;",
	);
	console.log("Loading development tools...");

	// Load Web Vitals
	await loadWebVitals();

	// Add dev tools status to window for debugging
	window.devToolsEnabled = true;

	console.log(
		"%c✓ Development tools ready",
		"font-weight: bold; color: #0cce6b;",
	);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initDevTools);
} else {
	initDevTools();
}

// Expose utility functions globally for console use
window.toggleDevTools = () => {
	const current = localStorage.getItem("force-dev-tools");
	const newValue = current === "true" ? "false" : "true";
	localStorage.setItem("force-dev-tools", newValue);
	console.log(
		`Dev tools ${newValue === "true" ? "enabled" : "disabled"}. Reload the page to apply.`,
	);
};

window.showWebVitalsHelp = () => {
	console.log(
		"%cWeb Vitals Keyboard Shortcuts:",
		"font-weight: bold; font-size: 14px;",
	);
	console.log("  Ctrl+Shift+V - Toggle metrics overlay");
	console.log("\nMetric Thresholds:");
	console.log("  LCP: <2.5s (good), <4s (needs improvement), >4s (poor)");
	console.log(
		"  FID: <100ms (good), <300ms (needs improvement), >300ms (poor)",
	);
	console.log(
		"  INP: <200ms (good), <500ms (needs improvement), >500ms (poor)",
	);
	console.log("  CLS: <0.1 (good), <0.25 (needs improvement), >0.25 (poor)");
	console.log("  FCP: <1.8s (good), <3s (needs improvement), >3s (poor)");
	console.log("  TTFB: <800ms (good), <1.8s (needs improvement), >1.8s (poor)");
};
