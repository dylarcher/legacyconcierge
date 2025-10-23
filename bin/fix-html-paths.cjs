#!/usr/bin/env node
/**
 * Fix all absolute paths in HTML files to use relative paths
 * This prevents path issues across different environments
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Calculate the relative path prefix based on file depth
 */
function getPathPrefix(filePath) {
	const relativePath = path.relative(process.cwd(), filePath);
	const depth = relativePath.split(path.sep).length - 1;

	if (depth === 0) return './';
	return '../'.repeat(depth);
}

/**
 * Fix absolute paths in HTML content
 */
function fixPaths(content, pathPrefix) {
	let modified = content;

	// Fix script src attributes
	modified = modified.replace(/src=["']\/common\//g, `src="${pathPrefix}common/`);
	modified = modified.replace(/src=["']\/shared\//g, `src="${pathPrefix}shared/`);
	modified = modified.replace(/src=["']\/pages\//g, `src="${pathPrefix}pages/`);

	// Fix link href attributes (CSS, icons, etc.)
	modified = modified.replace(/href=["']\/shared\//g, `href="${pathPrefix}shared/`);
	modified = modified.replace(/href=["']\/common\//g, `href="${pathPrefix}common/`);
	modified = modified.replace(/href=["']\/pages\//g, `href="${pathPrefix}pages/`);

	// Fix favicon and icon paths
	modified = modified.replace(/href=["']\/favicon\./g, `href="${pathPrefix}favicon.`);
	modified = modified.replace(/href=["']\/mask-icon\./g, `href="${pathPrefix}mask-icon.`);
	modified = modified.replace(/href=["']\/apple-touch-icon\./g, `href="${pathPrefix}apple-touch-icon.`);

	// Fix canonical and og:url (these should remain absolute with full domain)
	// Don't modify these - they need full URLs

	return modified;
}

async function processFiles() {
	const htmlFiles = await glob('**/*.html', {
		cwd: process.cwd(),
		ignore: [
			'**/node_modules/**',
			'**/.git/**',
			'**/dist/**',
			'**/.tmp/**'
		]
	});

	console.log(`Found ${htmlFiles.length} HTML files\n`);

	let modified = 0;
	let skipped = 0;

	for (const file of htmlFiles) {
		const filePath = path.join(process.cwd(), file);
		const originalContent = fs.readFileSync(filePath, 'utf8');

		const pathPrefix = getPathPrefix(filePath);
		const newContent = fixPaths(originalContent, pathPrefix);

		if (newContent !== originalContent) {
			if (!DRY_RUN) {
				fs.writeFileSync(filePath, newContent, 'utf8');
			}

			console.log(`✅ ${file} - Fixed paths (prefix: ${pathPrefix})`);
			modified++;
		} else {
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
	}
}

processFiles().catch(console.error);
