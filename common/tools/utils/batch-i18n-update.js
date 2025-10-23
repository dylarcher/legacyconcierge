#!/usr/bin/env node
// @ts-nocheck

/**
 * Batch I18n HTML Update Script
 * This script helps apply i18n attributes to multiple HTML files
 */

const fs = require("node:fs");
const path = require("node:path");

class BatchI18nUpdater {
	constructor(baseDir) {
		this.baseDir = baseDir;
		this.navigationPattern = /<li><a href="([^"]*)"[^>]*>([^<]*)<\/a><\/li>/g;
		this.footerPattern =
			/<p[^>]*>&copy; 2025 Legacy Concierge\. All Rights Reserved\.<\/p>/g;
	}

	/**
	 * Update navigation links in HTML content
	 */
	updateNavigation(content) {
		const navMap = {
			"index.html": "navigation.home",
			"../index.html": "navigation.home",
			"about.html": "navigation.about",
			"../about.html": "navigation.about",
			"treatments.html": "navigation.services",
			"../treatments.html": "navigation.services",
			"team.html": "navigation.team",
			"../team.html": "navigation.team",
			"contact.html": "navigation.contact",
			"../contact.html": "navigation.contact",
		};

		return content.replace(this.navigationPattern, (match, href, text) => {
			const i18nKey = navMap[href];
			if (i18nKey) {
				return `<li><a href="${href}" data-i18n="${i18nKey}">${text}</a></li>`;
			}
			return match;
		});
	}

	/**
	 * Update footer copyright
	 */
	updateFooter(content) {
		return content.replace(
			this.footerPattern,
			'<p data-i18n="footer.copyright">&copy; 2025 Legacy Concierge. All Rights Reserved.</p>',
		);
	}

	/**
	 * Add i18n script if not present
	 */
	addI18nScript(content, isSubDirectory = false) {
		const scriptPath = isSubDirectory ? "../js/i18n.js" : "js/i18n.js";
		const i18nScript = `<script src="${scriptPath}"></script>`;

		// Check if i18n script already exists
		if (content.includes(scriptPath)) {
			return content;
		}

		// Add before closing body tag
		return content.replace("</body>", `    ${i18nScript}\n</body>`);
	}

	/**
	 * Process a single HTML file
	 */
	processFile(filePath) {
		try {
			let content = fs.readFileSync(filePath, "utf8");
			const isSubDirectory =
				filePath.includes("/treatments/") || filePath.includes("/expertise/");

			console.log(`Processing: ${filePath}`);

			// Apply updates
			content = this.updateNavigation(content);
			content = this.updateFooter(content);
			content = this.addI18nScript(content, isSubDirectory);

			// Write back to file
			fs.writeFileSync(filePath, content, "utf8");
			console.log(`✅ Updated: ${filePath}`);
		} catch (error) {
			console.error(`❌ Error processing ${filePath}:`, error.message);
		}
	}

	/**
	 * Find all HTML files in directory
	 */
	findHtmlFiles(dir, files = []) {
		const items = fs.readdirSync(dir);

		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (
				stat.isDirectory() &&
				!item.startsWith(".") &&
				item !== "node_modules"
			) {
				this.findHtmlFiles(fullPath, files);
			} else if (item.endsWith(".html")) {
				files.push(fullPath);
			}
		}

		return files;
	}

	/**
	 * Process all HTML files
	 */
	processAllFiles() {
		console.log("🔍 Finding HTML files...");
		const htmlFiles = this.findHtmlFiles(this.baseDir);

		console.log(`📄 Found ${htmlFiles.length} HTML files`);

		htmlFiles.forEach((file) => {
			// Skip already processed files
			const content = fs.readFileSync(file, "utf8");
			if (content.includes('data-i18n="navigation.home"')) {
				console.log(`⏭️  Skipping (already processed): ${file}`);
				return;
			}

			this.processFile(file);
		});

		console.log("🎉 Batch processing complete!");
	}

	/**
	 * Generate content mapping for specific pages
	 */
	generateContentMapping(filePath) {
		const fileName = path.basename(filePath, ".html");
		const isSubDirectory =
			filePath.includes("/treatments/") || filePath.includes("/expertise/");

		if (isSubDirectory) {
			const _type = filePath.includes("/treatments/")
				? "treatments"
				: "expertise";
			return {
				title: `${fileName}.title`,
				subtitle: `${fileName}.subtitle`,
				h2: `${fileName}.h2`,
				text: `${fileName}.text`,
				features: `${fileName}.features`,
				alt: `${fileName}.alt`,
			};
		}

		// Main pages use their own JSON files
		const pageKey = fileName === "index" ? "home" : fileName;
		return {
			title: `${pageKey}.title`,
			subtitle: `${pageKey}.subtitle`,
		};
	}
}

// Usage instructions
function _printUsage() {
	console.log(`
🌐 Legacy Concierge I18n Batch Updater

Usage:
  node js/batch-i18n-update.js [directory]

Examples:
  node js/batch-i18n-update.js .                    # Process all HTML files
  node js/batch-i18n-update.js treatments/         # Process only treatment pages
  node js/batch-i18n-update.js expertise/          # Process only expertise pages

This script will:
✅ Add data-i18n attributes to navigation links
✅ Add data-i18n attributes to footer copyright
✅ Include i18n.js script in HTML files
⚠️  Skip files that already have i18n attributes

Manual steps still needed:
📝 Add data-i18n attributes to page-specific content (titles, descriptions, etc.)
📝 Update image alt attributes with data-i18n-attr
📝 Test and verify all translations work correctly
    `);
}

// Main execution
if (require.main === module) {
	const targetDir = process.argv[2] || ".";
	const fullPath = path.resolve(__dirname, "..", targetDir);

	if (!fs.existsSync(fullPath)) {
		console.error(`❌ Directory not found: ${fullPath}`);
		process.exit(1);
	}

	console.log(`🚀 Starting batch i18n update for: ${fullPath}`);

	const updater = new BatchI18nUpdater(fullPath);
	updater.processAllFiles();
}

module.exports = BatchI18nUpdater;
