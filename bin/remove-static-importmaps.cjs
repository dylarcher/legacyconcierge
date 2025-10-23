#!/usr/bin/env node
// @ts-check
/**
 * Remove static import maps from HTML files
 * The import map is now injected dynamically by path-resolver-init.js
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

async function removeImportMaps() {
	console.log('Removing static import maps from HTML files...\n');

	// Find all HTML files
	const htmlFiles = await glob('**/*.html', {
		cwd: __dirname + '/..',
		ignore: ['node_modules/**', 'dist/**', '.git/**'],
		absolute: true,
	});

	let modifiedCount = 0;

	for (const filePath of htmlFiles) {
		try {
			let content = await fs.readFile(filePath, 'utf-8');
			const originalContent = content;

			// Remove the import map script tag and its contents
			// Match the entire script tag with type="importmap"
			const importMapRegex = /\s*<!-- Import map for module path aliases -->\s*\n\s*<script type="importmap">\s*\n\s*{[\s\S]*?"imports":\s*{[\s\S]*?}\s*\n\s*}\s*\n\s*<\/script>\s*\n/g;

			content = content.replace(importMapRegex, '\n');

			// Also try a simpler pattern in case the comment is missing
			const simpleRegex = /\s*<script type="importmap">\s*\n\s*{[\s\S]*?"imports":\s*{[\s\S]*?}\s*\n\s*}\s*\n\s*<\/script>\s*\n/g;

			content = content.replace(simpleRegex, '\n');

			if (content !== originalContent) {
				await fs.writeFile(filePath, content, 'utf-8');
				console.log(`✓ Removed import map from: ${path.relative(process.cwd(), filePath)}`);
				modifiedCount++;
			}
		} catch (error) {
			console.error(`✗ Error processing ${filePath}:`, error.message);
		}
	}

	console.log(`\nDone! Modified ${modifiedCount} files.`);
}

removeImportMaps().catch(console.error);
