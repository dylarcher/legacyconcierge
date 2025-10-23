// @ts-nocheck
/**
 * Simple HTML sanitizer - only allows safe tags and removes dangerous attributes
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html) {
	if (typeof html !== "string") return "";

	// Create a temporary div to parse HTML
	const temp = document.createElement("div");
	temp.textContent = html; // First set as text to escape everything

	// If the original contained HTML tags, we need to allow specific safe ones
	const allowedTags = [
		"b",
		"i",
		"em",
		"strong",
		"br",
		"p",
		"span",
		"ul",
		"li",
		"ol",
	];
	const tagRegex = /<(\/?)([\w]+)([^>]*)>/g;

	// Check if HTML contains any tags
	if (!tagRegex.test(html)) {
		// No HTML tags, return as-is
		return html;
	}

	// Filter out dangerous tags and attributes
	const sanitized = html.replace(
		/<(\/?)([\w]+)([^>]*)>/g,
		(_match, slash, tag, _attrs) => {
			const lowerTag = tag.toLowerCase();

			if (!allowedTags.includes(lowerTag)) {
				return ""; // Remove disallowed tags
			}

			// Remove all attributes for security (they could contain event handlers)
			return `<${slash}${lowerTag}>`;
		},
	);

	return sanitized;
}

/**
 * Supported languages list
 * @constant {string[]}
 */
const SUPPORTED_LANGUAGES = ["en", "es"];

/**
 * Default language
 * @constant {string}
 */
const DEFAULT_LANGUAGE = "en";

/**
 * Validate language code
 * @param {string} lang - Language code to validate
 * @returns {boolean} True if language is supported
 */
function isValidLanguage(lang) {
	return SUPPORTED_LANGUAGES.includes(lang);
}

/**
 * Fetch translation files for a given language and page
 * @param {string} lang - Language code ('en', 'es')
 * @param {string} page - Page identifier or full path for detail pages
 * @returns {Promise<Object>} Combined translations object
 */
async function fetchTranslations(lang, page) {
	// Validate language
	if (!isValidLanguage(lang)) {
		console.warn(
			`Invalid language code: ${lang}, falling back to ${DEFAULT_LANGUAGE}`,
		);
		lang = DEFAULT_LANGUAGE;
	}
	try {
		// Determine the base path for locale files based on directory depth
		const pathname = window.location.pathname;

		// Detect GitHub Pages base path (e.g., /legacy-concierge/)
		// by checking if the first path segment doesn't look like a page
		const pathParts = pathname
			.replace(/\/$/, "")
			.split("/")
			.filter((p) => p);

		let githubPagesBase = "";
		let adjustedPathParts = pathParts;

		// If first segment is not 'pages' and not 'index.html', it might be a GitHub Pages base
		if (
			pathParts.length > 0 &&
			pathParts[0] !== "pages" &&
			pathParts[0] !== "index.html" &&
			!pathParts[0].includes(".html")
		) {
			// This is likely a GitHub Pages repository base path
			githubPagesBase = `/${pathParts[0]}`;
			adjustedPathParts = pathParts.slice(1);
		}

		// Remove 'index.html' if present to get the actual directory depth
		const cleanParts = adjustedPathParts.filter(
			(part) => part !== "index.html",
		);

		// Calculate depth based on directory structure
		// Root: [] → 0, pages/about: ['pages', 'about'] → 2, pages/treatments/views/post-op: ['pages', 'treatments', 'views', 'post-op'] → 4
		const depth = cleanParts.length;

		// Build the correct path to _locale based on depth
		let localeBasePath;
		if (githubPagesBase) {
			// GitHub Pages deployment - always use absolute path
			localeBasePath = `${githubPagesBase}/shared/content/_locale`;
		} else if (depth === 0) {
			// Local development at root
			localeBasePath = "./shared/content/_locale";
		} else {
			// Local development in subdirectory - go up to root, then into shared/content/_locale
			localeBasePath = `${"../".repeat(depth)}shared/content/_locale`;
		}

		console.log(
			"i18n: pathname:",
			pathname,
			"| depth:",
			depth,
			"| localeBasePath:",
			localeBasePath,
		);

		const commonPromise = fetch(`${localeBasePath}/${lang}/common.json`)
			.then((res) => {
				if (!res.ok)
					throw new Error(`Failed to load common.json: ${res.status}`);
				return res.json();
			})
			.catch((err) => {
				console.warn("Failed to load common.json:", err);
				return {};
			});

		// Determine which JSON file to load based on the page
		let pageFile;

		if (page.includes("/")) {
			// It's a full path (detail page)
			const pathParts = page.split("/");
			const fileName = pathParts[pathParts.length - 1];

			// Check if it's a treatment or expertise detail page
			if (pathParts.includes("treatments") && pathParts.includes("views")) {
				pageFile = "treatments-detail";
			} else if (
				pathParts.includes("expertise") &&
				pathParts.includes("views")
			) {
				pageFile = "expertise-detail";
			} else if (pathParts.includes("blog") && pathParts.includes("posts")) {
				// Blog post pages use blog.json
				pageFile = "blog";
			} else {
				pageFile = fileName;
			}
		} else {
			// Simple page name - map 'index' to 'home', everything else stays as-is
			pageFile = page === "index" ? "home" : page;
		}

		console.log("i18n: loading page file:", pageFile);

		const pagePromise = fetch(`${localeBasePath}/${lang}/${pageFile}.json`)
			.then((res) => {
				if (!res.ok)
					throw new Error(`Failed to load ${pageFile}.json: ${res.status}`);
				return res.json();
			})
			.catch((err) => {
				console.warn(`Failed to load ${pageFile}.json:`, err);
				return {};
			});
		const [common, pageContent] = await Promise.all([
			commonPromise,
			pagePromise,
		]);

		return { ...common, ...pageContent };
	} catch (error) {
		console.error("Error fetching translation files:", error);
		return {};
	}
}

/**
 * Get a nested translation value using dot notation and array bracket notation
 * @param {Object} obj - Translation object
 * @param {string} key - Key in dot notation (e.g., 'navigation.home' or 'items[0].title')
 * @returns {*} Translation value or undefined
 */
function getNestedTranslation(obj, key) {
	if (!key) return;
	return key.split(".").reduce((acc, part) => {
		if (!acc) return acc;

		// Handle array bracket notation: columns[0]
		const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
		if (arrayMatch) {
			const [, prop, index] = arrayMatch;
			return acc[prop]?.[parseInt(index, 10)];
		}

		return acc[part];
	}, obj);
}

/**
 * Update page meta tags (title, description, Open Graph) with translations
 * @param {Object} translations - Translation object
 * @param {string} pageKey - Key for the page-specific translations
 * @returns {void}
 */
function updateMetaTags(translations, pageKey) {
	if (!translations[pageKey]) return;

	const pageData = translations[pageKey];

	// Update title
	if (pageData.title) {
		document.title = `${pageData.title} - Legacy Concierge`;
	}

	// Update meta description
	if (pageData.subtitle) {
		const metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc) {
			metaDesc.setAttribute("content", pageData.subtitle);
		}
	}

	// Update Open Graph tags
	if (pageData.title) {
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) {
			ogTitle.setAttribute("content", `${pageData.title} - Legacy Concierge`);
		}

		const twitterTitle = document.querySelector(
			'meta[property="twitter:title"]',
		);
		if (twitterTitle) {
			twitterTitle.setAttribute(
				"content",
				`${pageData.title} - Legacy Concierge`,
			);
		}
	}

	if (pageData.subtitle) {
		const ogDesc = document.querySelector('meta[property="og:description"]');
		if (ogDesc) {
			ogDesc.setAttribute("content", pageData.subtitle);
		}

		const twitterDesc = document.querySelector(
			'meta[property="twitter:description"]',
		);
		if (twitterDesc) {
			twitterDesc.setAttribute("content", pageData.subtitle);
		}
	}

	// Update Open Graph and Twitter image tags
	if (pageData.image) {
		const baseUrl = "https://www.legacyconcierge.com/";
		const fullImageUrl = pageData.image.startsWith("http")
			? pageData.image
			: baseUrl + pageData.image;

		const ogImage = document.querySelector('meta[property="og:image"]');
		if (ogImage) {
			ogImage.setAttribute("content", fullImageUrl);
		}

		const twitterImage = document.querySelector(
			'meta[property="twitter:image"]',
		);
		if (twitterImage) {
			twitterImage.setAttribute("content", fullImageUrl);
		}
	}
}

/**
 * Apply translations to all elements with data-i18n attributes on the current page
 * @returns {Promise<void>}
 */
async function applyTranslations() {
	const lang = document.documentElement.lang || "en";
	let path = window.location.pathname;

	// Detect and strip GitHub Pages base path if present
	const pathSegments = path
		.replace(/\/$/, "")
		.split("/")
		.filter((p) => p);

	let githubPagesBase = "";

	// Check if first segment is a GitHub Pages base (not 'pages' or an HTML file)
	if (
		pathSegments.length > 0 &&
		pathSegments[0] !== "pages" &&
		!pathSegments[0].includes(".html")
	) {
		// This is likely a GitHub Pages repository base path
		githubPagesBase = `/${pathSegments[0]}`;
		// Strip the base path for page detection
		path = `/${pathSegments.slice(1).join("/")}`;
	}

	const pathParts = path
		.replace(/\/$/, "")
		.split("/")
		.filter((p) => p);

	// Determine the page identifier for fetching translations
	let page;

	// If it's the root index.html or just /
	if (
		pathParts.length === 0 ||
		(pathParts.length === 1 && pathParts[0] === "index.html")
	) {
		page = "index";
	}
	// If it's a detail page in treatments or expertise
	else if (
		path.includes("/treatments/views/") ||
		path.includes("/expertise/views/")
	) {
		page = path; // Pass full path for detail pages
	}
	// For other pages, use the directory name (e.g., /pages/about/ → 'about')
	else {
		// Get the last meaningful directory name (not 'index.html')
		const lastPart = pathParts[pathParts.length - 1];
		page =
			lastPart === "index.html"
				? pathParts[pathParts.length - 2]
				: lastPart.replace(".html", "");
	}

	console.log("applyTranslations: path:", path, "| page:", page);

	const translations = await fetchTranslations(lang, page);

	// Extract fileName for detail pages (e.g., 'post-op-recovery' from '$/treatments/views/post-op-recovery/')
	let fileName;
	if (
		path.includes("/treatments/views/") ||
		path.includes("/expertise/views/")
	) {
		const cleanParts = pathParts.filter((part) => part !== "index.html");
		fileName = cleanParts[cleanParts.length - 1];
	}

	// Update meta tags for detail pages
	if (path.includes("/treatments/") && fileName && translations[fileName]) {
		updateMetaTags(translations, fileName);
	} else if (
		path.includes("/expertise/") &&
		fileName &&
		translations[fileName]
	) {
		updateMetaTags(translations, fileName);
	}

	// Apply translations to elements with data-i18n attributes
	for (const element of document.querySelectorAll("[data-i18n]")) {
		const key = element.getAttribute("data-i18n");
		const translation = getNestedTranslation(translations, key);
		if (translation) {
			if (Array.isArray(translation)) {
				// Handle arrays (like features lists)
				if (element.tagName === "UL") {
					// Sanitize each item before inserting
					element.innerHTML = translation
						.map((item) => `<li>${sanitizeHTML(item)}</li>`)
						.join("");
				} else {
					element.innerHTML = translation
						.map((item) => sanitizeHTML(item))
						.join("<br>");
				}
			} else {
				// Prefer textContent for simple strings (no HTML tags)
				if (!translation.includes("<")) {
					element.textContent = translation;
				} else {
					// Sanitize HTML before inserting
					element.innerHTML = sanitizeHTML(translation);
				}
			}
		}
	}

	// Handle special attributes (aria-label, title, alt, etc.)
	for (const element of document.querySelectorAll("[data-i18n-attr]")) {
		const attrData = element.getAttribute("data-i18n-attr");
		const pairs = attrData.split("|");

		for (const pair of pairs) {
			const [attr, key] = pair.split(":");
			let translation = getNestedTranslation(translations, key);

			if (translation) {
				// Fix relative paths for src, href attributes when on GitHub Pages
				if ((attr === "src" || attr === "href") && githubPagesBase) {
					// Only rewrite if the path is not already absolute (doesn't start with http(s):// or /)
					if (!/^https?:\/\//.test(translation) && !translation.startsWith("/")) {
						// Remove leading ./ or ../ segments
						const cleanPath = translation.replace(/^(\.\.?\/)+/, "");
						translation = `${githubPagesBase}/${cleanPath}`;
					}
				}

				element.setAttribute(attr, translation);
			}
		}
	}
}

/**
 * Switch the current language and reload translations
 * @param {string} lang - Language code to switch to ('en', 'es')
 * @returns {void}
 */
function switchLanguage(lang) {
	// Validate language before switching
	if (!isValidLanguage(lang)) {
		console.error(`Invalid language code: ${lang}`);
		return;
	}

	document.documentElement.lang = lang;

	// Store language preference
	try {
		localStorage.setItem("preferred-language", lang);
	} catch (e) {
		console.warn("Could not save language preference:", e);
	}

	// Reload translations
	applyTranslations();
}

/**
 * Initialize the language from localStorage or browser preference
 * Falls back to 'en' if no valid language is found
 * @returns {void}
 */
function initializeLanguage() {
	let savedLang;
	try {
		savedLang = localStorage.getItem("preferred-language");
	} catch (e) {
		console.warn("localStorage not available:", e);
		savedLang = null;
	}

	const browserLang = navigator.language.split("-")[0];

	let lang = DEFAULT_LANGUAGE;
	if (savedLang && isValidLanguage(savedLang)) {
		lang = savedLang;
	} else if (isValidLanguage(browserLang)) {
		lang = browserLang;
	}

	document.documentElement.lang = lang;
}

document.addEventListener("DOMContentLoaded", () => {
	initializeLanguage();
	applyTranslations();

	// Language toggle functionality
	const languageToggle = document.querySelector(".language-toggle");
	if (languageToggle) {
		languageToggle.addEventListener("click", () => {
			const currentLang = document.documentElement.lang;
			const newLang = currentLang === "en" ? "es" : "en";
			switchLanguage(newLang);
		});
	}
});

// Expose applyTranslations globally for component integration
if (typeof window !== "undefined") {
	window.applyTranslations = applyTranslations;
	window.switchLanguage = switchLanguage;
}
