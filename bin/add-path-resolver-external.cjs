#!/usr/bin/env node
/**
 * Replace inline path resolver with external script reference
 * This reduces HTML file size and improves caching
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Calculate the relative path to path-resolver-init.js from given file
 */
function getRelativePathToResolver(filePath) {
	const relativePath = path.relative(process.cwd(), filePath);
	const depth = relativePath.split(path.sep).length - 1;

	if (depth === 0) return './common/core/path-resolver-init.js';
	return `${'../'.repeat(depth)}common/core/path-resolver-init.js`;
}

/**
 * Create the external script tag
 */
function createScriptTag(relativePath) {
	return `    <!-- Universal Path Resolver - Loads first, cached across pages -->
    <script src="${relativePath}"></script>
`;
}

async function replaceInlineWithExternal() {
	const htmlFiles = await glob('**/*.html', {
		cwd: process.cwd(),
		ignore: [
			'**/node_modules/**',
			'**/.git/**',
			'**/dist/**',
			'**/.tmp/**',
			'**/shared/partials/templates/**' // Skip template fragments
		]
	});

	console.log(`Found ${htmlFiles.length} HTML files\n`);

	let modified = 0;
	let skipped = 0;

	for (const file of htmlFiles) {
		const filePath = path.join(process.cwd(), file);
		let content = fs.readFileSync(filePath, 'utf8');

		// Check if inline path resolver exists
		if (!content.includes('Universal Path Resolver')) {
			console.log(`⏭️  ${file} - No inline path resolver found`);
			skipped++;
			continue;
		}

		// Check if already using external script
		if (content.includes('path-resolver-init.js')) {
			console.log(`⏭️  ${file} - Already using external script`);
			skipped++;
			continue;
		}

		// Remove inline path resolver script
		const inlineScriptRegex = /\s*<!--\s*Universal Path Resolver[^>]*>\s*<script>[\s\S]*?<\/script>\s*/;

		if (inlineScriptRegex.test(content)) {
			const relativePath = getRelativePathToResolver(filePath);
			const externalScriptTag = createScriptTag(relativePath);

			// Replace inline with external reference
			content = content.replace(inlineScriptRegex, `\n${externalScriptTag}\n`);

			if (!DRY_RUN) {
				fs.writeFileSync(filePath, content, 'utf8');
			}

			console.log(`✅ ${file} - Replaced inline with external (${relativePath})`);
			modified++;
		} else {
			console.log(`⚠️  ${file} - Could not find inline script to replace`);
			skipped++;
		}
	}

	console.log(`\n📊 Summary:`);
	console.log(`   Modified: ${modified}`);
	console.log(`   Skipped: ${skipped}`);
	console.log(`   Total: ${htmlFiles.length}`);

	if (DRY_RUN) {
		console.log(`\n⚠️  DRY RUN - No files were actually modified`);
		console.log(`   Run without --dry-run to apply changes`);
	} else {
		console.log(`\n✅ Benefits:`);
		console.log(`   - Each HTML file is ~1.3KB smaller`);
		console.log(`   - path-resolver-init.js cached across all pages`);
		console.log(`   - Easier to update path logic (one file vs ${modified} files)`);
	}
}

replaceInlineWithExternal().catch(console.error);
