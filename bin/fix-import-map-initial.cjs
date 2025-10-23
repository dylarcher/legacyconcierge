#!/usr/bin/env node
/**
 * Fix initial import map values to use absolute paths
 * The path-resolver-init.js will update these dynamically, but they should
 * start with correct absolute paths for localhost/production
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const DRY_RUN = process.argv.includes('--dry-run');

async function fixImportMaps() {
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

		// Fix relative paths in import maps to absolute
		content = content.replace(
			/"@\/": "\.\/(common|shared|pages)\/"/g,
			'"@/": "/$1/"'
		);
		content = content.replace(
			/"#\/": "\.\/(common|shared|pages)\/"/g,
			'"#/": "/$1/"'
		);
		content = content.replace(
			/"\$\/": "\.\/(common|shared|pages)\/"/g,
			'"$/": "/$1/"'
		);

		// More specific replacements
		content = content.replace('"@/": "./common/"', '"@/": "/common/"');
		content = content.replace('"#/": "./shared/"', '"#/": "/shared/"');
		content = content.replace('"$/": "./pages/"', '"$/": "/pages/"');

		if (content !== originalContent) {
			if (!DRY_RUN) {
				fs.writeFileSync(filePath, content, 'utf8');
			}

			console.log(`✅ ${file} - Fixed import map`);
			modified++;
		} else {
			// Check if already correct
			if (content.includes('"@/": "/common/"')) {
				skipped++;
			} else {
				console.log(`⏭️  ${file} - No import map found or already correct`);
				skipped++;
			}
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
		console.log(`\n✅ Import maps now use absolute paths`);
		console.log(`   @/ → /common/`);
		console.log(`   #/ → /shared/`);
		console.log(`   $/ → /pages/`);
	}
}

fixImportMaps().catch(console.error);
