// @ts-nocheck
/**
 * Legacy Concierge Helper Utilities
 * Common utility functions used across components
 */

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
	let inThrottle;
	return function executedFunction(...args) {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

/**
 * Calculate relative path based on current page depth
 * @param {string} targetPath - Target path from root
 * @returns {string} Relative path
 */
function getRelativePath(targetPath) {
	const pathname = window.location.pathname;
	const pathParts = pathname
		.replace(/\/$/, "")
		.split("/")
		.filter((p) => p && p !== "index.html");
	const depth = pathParts.length;

	if (depth === 0) {
		return targetPath.startsWith("/") ? targetPath.substring(1) : targetPath;
	}

	const prefix = "../".repeat(depth);
	const cleanTarget = targetPath.startsWith("/")
		? targetPath.substring(1)
		: targetPath;
	return prefix + cleanTarget;
}

/**
 * Get attribute with fallback
 * @param {HTMLElement} element - Element to get attribute from
 * @param {string} attr - Attribute name
 * @param {*} defaultValue - Default value if attribute doesn't exist
 * @returns {*} Attribute value or default
 */
function getAttributeOr(element, attr, defaultValue = null) {
	return element.hasAttribute(attr) ? element.getAttribute(attr) : defaultValue;
}

/**
 * Parse boolean attribute
 * @param {HTMLElement} element - Element to get attribute from
 * @param {string} attr - Attribute name
 * @returns {boolean} True if attribute exists and is not "false"
 */
function getBooleanAttribute(element, attr) {
	if (!element.hasAttribute(attr)) return false;
	const value = element.getAttribute(attr);
	return value !== "false" && value !== "0";
}

/**
 * Safely parse JSON
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
function safeJSONParse(jsonString, defaultValue = null) {
	try {
		return JSON.parse(jsonString);
	} catch (e) {
		console.warn("Failed to parse JSON:", e);
		return defaultValue;
	}
}

/**
 * Dispatch custom event
 * @param {HTMLElement} element - Element to dispatch from
 * @param {string} eventName - Event name
 * @param {*} detail - Event detail data
 * @param {boolean} bubbles - Whether event bubbles
 * @param {boolean} cancelable - Whether event is cancelable
 */
function dispatchEvent(
	element,
	eventName,
	detail = {},
	bubbles = true,
	cancelable = true,
) {
	const event = new CustomEvent(eventName, {
		detail,
		bubbles,
		cancelable,
	});
	element.dispatchEvent(event);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset in pixels
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, offset = 0) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= -offset &&
		rect.left >= -offset &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) + offset &&
		rect.right <=
			(window.innerWidth || document.documentElement.clientWidth) + offset
	);
}

/**
 * Sanitize HTML string (basic - for enhanced security use DOMPurify)
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
	const div = document.createElement("div");
	div.textContent = html;
	return div.innerHTML;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default from document lang)
 * @returns {string} Formatted date string
 */
function formatDate(date, locale = null) {
	const dateObj = date instanceof Date ? date : new Date(date);
	const lang = locale || document.documentElement.lang || "en";

	return new Intl.DateTimeFormat(lang, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(dateObj);
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID
 * @returns {string} Unique ID
 */
function generateId(prefix = "lc") {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if prefers reduced motion
 */
function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get current theme
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
	return document.documentElement.getAttribute("data-theme") || "light";
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

// Export functions
export {
	debounce,
	throttle,
	getRelativePath,
	getAttributeOr,
	getBooleanAttribute,
	safeJSONParse,
	dispatchEvent,
	isInViewport,
	sanitizeHTML,
	formatDate,
	generateId,
	prefersReducedMotion,
	getCurrentTheme,
	deepClone,
};

// Also expose globally
if (typeof window !== "undefined") {
	window.LCHelpers = {
		debounce,
		throttle,
		getRelativePath,
		getAttributeOr,
		getBooleanAttribute,
		safeJSONParse,
		dispatchEvent,
		isInViewport,
		sanitizeHTML,
		formatDate,
		generateId,
		prefersReducedMotion,
		getCurrentTheme,
		deepClone,
	};
}
