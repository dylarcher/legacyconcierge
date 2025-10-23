#!/usr/bin/env node

/**
 * Fix GitHub Pages base path in all HTML files
 * Replaces the dynamic base path detection script with a static base tag
 */

const fs = require("node:fs");
const { glob } = require("glob");

const DYNAMIC_SCRIPT_PATTERN = /\s*<!--\s*GitHub Pages Base Path Detection[^>]*-->\s*<script>[\s\S]*?\(\s*function\s*\(\s*\)\s*\{[\s\S]*?\}\s*\)\s*\(\s*\)\s*;\s*<\/script>\s*/g;

const STATIC_BASE_TAG = `
    <!-- GitHub Pages Base Path - Must be set before any resource loads -->
    <base href="/legacyconcierge/" />

    `;

async function fixHTMLFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, "utf8");

		// Check if file has the dynamic script
		if (!content.includes("GitHub Pages Base Path Detection")) {
			console.log(`⊘ Skipped (no dynamic script): ${filePath}`);
			return false;
		}

		// Skip template/partial files
		if (
			filePath.includes("/templates/") ||
			filePath.includes("/partials/") ||
			filePath.includes("/layouts/")
		) {
			console.log(`⊘ Skipped (template/partial): ${filePath}`);
			return false;
		}

		// Replace dynamic script with static base tag
		const newContent = content.replace(DYNAMIC_SCRIPT_PATTERN, STATIC_BASE_TAG);

		if (newContent === content) {
			console.log(`⚠ Warning: Pattern not matched in ${filePath}`);
			return false;
		}

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

	// Find all HTML files excluding templates and partials
	const files = await glob("**/*.html", {
		ignore: [
			"node_modules/**",
			"**/node_modules/**",
			"**/templates/**",
			"**/partials/**",
			"**/layouts/**",
		],
		cwd: process.cwd(),
		absolute: true,
	});

	console.log(`Found ${files.length} HTML files\n`);

	let updated = 0;
	let skipped = 0;

	for (const file of files) {
		const result = await fixHTMLFile(file);
		if (result) {
			updated++;
		} else {
			skipped++;
		}
	}

	console.log(`\n✅ Complete!`);
	console.log(`   Updated: ${updated}`);
	console.log(`   Skipped: ${skipped}`);
	console.log(`   Total: ${files.length}`);
}

main().catch(console.error);
