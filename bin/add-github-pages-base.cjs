#!/usr/bin/env node

/**
 * Add GitHub Pages base path detection to all HTML pages
 * This script inserts the base path detection script right after the <head> tag
 */

const fs = require("node:fs");
const path = require("node:path");
const { glob } = require("glob");

const BASE_PATH_SCRIPT = `
    <!-- GitHub Pages Base Path Detection - Must run before any resource loads -->
    <script>
      (function() {
        // Detect if we're on GitHub Pages (not custom domain)
        const hostname = window.location.hostname;
        const isGitHubPages = hostname.includes('github.io');

        if (isGitHubPages) {
          // Extract repo name from path (e.g., /legacyconcierge/)
          const pathParts = window.location.pathname.split('/').filter(p => p);
          if (pathParts.length > 0 && pathParts[0] !== 'index.html') {
            const repoName = pathParts[0];
            // Set base tag dynamically
            const base = document.createElement('base');
            base.href = \`/\${repoName}/\`;
            document.head.appendChild(base);
          }
        }
      })();
    </script>
`;

async function addBasePathToHTML(filePath) {
	try {
		let content = fs.readFileSync(filePath, "utf8");

		// Skip if already has the base path detection
		if (content.includes("GitHub Pages Base Path Detection")) {
			console.log(`⊘ Skipped (already has base path): ${filePath}`);
			return false;
		}

		// Skip template/partial files - they don't need the base path script
		if (
			filePath.includes("/templates/") ||
			filePath.includes("/partials/") ||
			filePath.includes("/layouts/")
		) {
			console.log(`⊘ Skipped (template/partial): ${filePath}`);
			return false;
		}

		// Find the position right after <head>
		const headMatch = content.match(/(<head[^>]*>)\s*(<meta[^>]*>)/i);

		if (!headMatch) {
			console.log(`✗ No <head> tag found: ${filePath}`);
			return false;
		}

		// Insert the script right after the first meta tag (charset)
		const insertPosition = content.indexOf(headMatch[2]) + headMatch[2].length;
		const newContent =
			content.slice(0, insertPosition) +
			"\n" +
			BASE_PATH_SCRIPT +
			"\n" +
			content.slice(insertPosition);

		fs.writeFileSync(filePath, newContent, "utf8");
		console.log(`✓ Updated: ${filePath}`);
		return true;
	} catch (error) {
		console.error(`✗ Error processing ${filePath}:`, error.message);
		return false;
	}
}

async function main() {
	console.log("🔍 Finding HTML pages...\n");

	// Find all HTML files in pages directory and root index.html
	const patterns = ["pages/**/*.html", "index.html"];

	let allFiles = [];
	for (const pattern of patterns) {
		const files = await glob(pattern, {
			ignore: ["node_modules/**", "**/node_modules/**"],
			cwd: process.cwd(),
			absolute: true,
		});
		allFiles = allFiles.concat(files);
	}

	console.log(`Found ${allFiles.length} HTML files\n`);

	let updated = 0;
	let skipped = 0;

	for (const file of allFiles) {
		const result = await addBasePathToHTML(file);
		if (result) {
			updated++;
		} else {
			skipped++;
		}
	}

	console.log(`\n✅ Complete!`);
	console.log(`   Updated: ${updated}`);
	console.log(`   Skipped: ${skipped}`);
	console.log(`   Total: ${allFiles.length}`);
}

main().catch(console.error);
