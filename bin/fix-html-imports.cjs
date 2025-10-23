#!/usr/bin/env node

/**
 * Fix absolute imports in HTML files to use import map syntax
 *
 * Converts:
 * - import("/common/...") → import("@/...")
 * - import("/shared/...") → import("#/...")
 * - import("/pages/...") → import("$/...")
 * - fetch("/shared/...") → fetch(resolvePath("shared/..."))
 * - fetch("/common/...") → fetch(resolvePath("common/..."))
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixHtmlImports() {
	console.log('🔍 Finding HTML files with absolute imports...\n');

	const htmlFiles = await glob('**/*.html', {
		ignore: ['node_modules/**', 'dist/**', 'build/**'],
		absolute: true
	});

	let totalFiles = 0;
	let totalReplacements = 0;

	for (const file of htmlFiles) {
		let content = fs.readFileSync(file, 'utf8');
		const originalContent = content;
		let fileReplacements = 0;

		// Replace import("/common/...") with import("@/...")
		content = content.replace(/import\("\/common\//g, (match) => {
			fileReplacements++;
			return 'import("@/';
		});

		// Replace import("/shared/...") with import("#/...")
		content = content.replace(/import\("\/shared\//g, (match) => {
			fileReplacements++;
			return 'import("#/';
		});

		// Replace import("/pages/...") with import("$/...")
		content = content.replace(/import\("\/pages\//g, (match) => {
			fileReplacements++;
			return 'import("$/';
		});

		// Replace fetch("/shared/...") with fetch(resolvePath("shared/..."))
		content = content.replace(/fetch\("\/shared\/([^"]+)"\)/g, (match, path) => {
			fileReplacements++;
			return `fetch(resolvePath("shared/${path}"))`;
		});

		// Replace fetch("/common/...") with fetch(resolvePath("common/..."))
		content = content.replace(/fetch\("\/common\/([^"]+)"\)/g, (match, path) => {
			fileReplacements++;
			return `fetch(resolvePath("common/${path}"))`;
		});

		// Replace fetch("/pages/...") with fetch(resolvePath("pages/..."))
		content = content.replace(/fetch\("\/pages\/([^"]+)"\)/g, (match, path) => {
			fileReplacements++;
			return `fetch(resolvePath("pages/${path}"))`;
		});

		if (content !== originalContent) {
			fs.writeFileSync(file, content, 'utf8');
			const relativePath = path.relative(process.cwd(), file);
			console.log(`✓ ${relativePath} (${fileReplacements} replacements)`);
			totalFiles++;
			totalReplacements += fileReplacements;
		}
	}

	console.log(`\n✨ Fixed ${totalReplacements} absolute paths in ${totalFiles} files\n`);
}

fixHtmlImports().catch(err => {
	console.error('Error:', err);
	process.exit(1);
});
