// @ts-nocheck
/**
 * I18n HTML Updater Utility
 * This script helps update HTML files to use i18n data attributes
 */

class I18nUpdater {
	constructor() {
		this.commonElements = {
			navigation: {
				'a[href="../index.html"]:contains("Home")': "navigation.home",
				'a[href="../about.html"]:contains("About")': "navigation.about",
				'a[href="../treatments.html"]:contains("Services")':
					"navigation.services",
				'a[href="../team.html"]:contains("Team")': "navigation.team",
				'a[href="../contact.html"]:contains("Contact")': "navigation.contact",
			},
			footer: {
				'p:contains("Legacy Concierge. All Rights Reserved")':
					"footer.copyright",
			},
		};
	}

	/**
	 * Generate i18n attributes for treatment detail pages
	 */
	generateTreatmentPageAttributes(treatmentKey) {
		return {
			title: `${treatmentKey}.title`,
			subtitle: `${treatmentKey}.subtitle`,
			h2: `${treatmentKey}.h2`,
			text: `${treatmentKey}.text`,
			features: `${treatmentKey}.features`,
			alt: `${treatmentKey}.alt`,
		};
	}

	/**
	 * Generate i18n attributes for expertise detail pages
	 */
	generateExpertisePageAttributes(expertiseKey) {
		return {
			title: `${expertiseKey}.title`,
			subtitle: `${expertiseKey}.subtitle`,
			h2: `${expertiseKey}.h2`,
			text: `${expertiseKey}.text`,
			features: `${expertiseKey}.features`,
			alt: `${expertiseKey}.alt`,
		};
	}

	/**
	 * Get the treatment/expertise keys from the JSON files
	 */
	async loadAvailableKeys() {
		try {
			const treatmentResponse = await fetch(
				"../_locale/en/treatments-detail.json",
			);
			const expertiseResponse = await fetch(
				"../_locale/en/expertise-detail.json",
			);

			const treatments = await treatmentResponse.json();
			const expertise = await expertiseResponse.json();

			return {
				treatments: Object.keys(treatments),
				expertise: Object.keys(expertise),
			};
		} catch (error) {
			console.error("Error loading translation keys:", error);
			return { treatments: [], expertise: [] };
		}
	}

	/**
	 * Instructions for manual HTML updates
	 */
	getUpdateInstructions() {
		return `
## I18n Integration Instructions

### For Treatment Pages (treatments/*.html):

1. **Header Navigation**: Add data-i18n attributes to navigation links:
   <li><a href="../index.html" data-i18n="navigation.home">Home</a></li>
   <li><a href="../about.html" data-i18n="navigation.about">About</a></li>
   <li><a href="../treatments.html" data-i18n="navigation.services">Services</a></li>
   <li><a href="../team.html" data-i18n="navigation.team">Team</a></li>
   <li><a href="../contact.html" data-i18n="navigation.contact">Contact</a></li>

2. **Main Content**: For a treatment page like "post-op-recovery.html":
   <p class="page-subtitle" data-i18n="post-op-recovery.subtitle">Subtitle will be replaced</p>
   <h1 data-i18n="post-op-recovery.title">Title will be replaced</h1>
   <img data-i18n-attr="alt:post-op-recovery.alt" alt="Current alt text">
   <h2 data-i18n="post-op-recovery.h2">Heading will be replaced</h2>
   <p data-i18n="post-op-recovery.text">Text will be replaced</p>
   <ul data-i18n="post-op-recovery.features">Features list will be replaced</ul>

3. **Footer**: Add data-i18n to footer:
   <p data-i18n="footer.copyright">&copy; 2025 Legacy Concierge. All Rights Reserved.</p>

4. **Scripts**: Add i18n script before closing body tag:
   <script src="../js/app.js"></script>
   <script src="../js/i18n.js"></script>

### For Expertise Pages (expertise/*.html):
Follow the same pattern but use the expertise key (e.g., "als", "dementia", etc.)

### For Main Pages (*.html in root):
Use the page-specific JSON file keys (e.g., "home", "about", "contact", etc.)

### Available Translation Keys:
Check the _locale/en/ directory for available JSON files and their structure.
        `;
	}
}

// Export for use in browser console or other scripts
if (typeof window !== "undefined") {
	window.I18nUpdater = I18nUpdater;
}

// For Node.js environments
if (typeof module !== "undefined" && module.exports) {
	module.exports = I18nUpdater;
}
