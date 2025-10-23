#!/usr/bin/env node
/**
 * Fix inline script imports in HTML files to use path aliases
 * Converts import statements inside <script type="module"> tags
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const DRY_RUN = process.argv.includes('--dry-run');

async function fixInlineImports() {
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
		let content = fs.readFileSync(filePath, 'utf8');
		const originalContent = content;

		// Fix inline imports in <script type="module"> tags
		content = content.replace(/import\s+([^"']+)from\s+["']\/common\//g, 'import $1from "@/');
		content = content.replace(/import\s+([^"']+)from\s+["']\/shared\//g, 'import $1from "#/');
		content = content.replace(/import\s+([^"']+)from\s+["']\/pages\//g, 'import $1from "$/');

		if (content !== originalContent) {
			if (!DRY_RUN) {
				fs.writeFileSync(filePath, content, 'utf8');
			}

			console.log(`✅ ${file} - Fixed inline imports`);
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

fixInlineImports().catch(console.error);
