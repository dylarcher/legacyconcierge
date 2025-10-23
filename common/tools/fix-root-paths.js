#!/usr/bin/env node

/**
 * Fix Root-Relative Paths Script
 *
 * This script converts all relative paths (../../) to root-relative paths (/)
 * across HTML and JSON files in the project. This resolves pathing issues
 * when templates are used at different directory depths.
 *
 * Usage:
 *   node tools/fix-root-paths.js [--dry-run]
 *
 * Options:
 *   --dry-run  Show what would be changed without making actual changes
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");

// Patterns to fix
const PATH_PATTERNS = [
	// CSS files (relative paths with ../)
	{
		pattern: /href=["']\.\.\/\.\.\/styles\/style\.css["']/g,
		replacement: 'href="/theme/style.css"',
	},
	{
		pattern: /href=["']\.\.\/(\.\.\/)*styles\/style\.css["']/g,
		replacement: 'href="/theme/style.css"',
	},

	// CSS files (simple relative paths from root)
	{
		pattern: /href=["']styles\/style\.css["']/g,
		replacement: 'href="/theme/style.css"',
	},

	// JavaScript files (relative paths with ../)
	{
		pattern: /src=["']\.\.\/\.\.\/js\/([\w-]+\.js)["']/g,
		replacement: 'src="/js/$1"',
	},
	{
		pattern: /src=["']\.\.\/(\.\.\/)*js\/([\w-]+\.js)["']/g,
		replacement: 'src="/js/$1"',
	},

	// JavaScript files (simple relative paths from root)
	{
		pattern: /src=["']js\/([\w-]+\.js)["']/g,
		replacement: 'src="/js/$1"',
	},

	// Component scripts (relative import paths)
	{
		pattern: /import\(['"]\.\/js\/components\/([\w-]+\.js)['"]\)/g,
		replacement: "import('/js/components/$1')",
	},
	{
		pattern: /import\(['"]\.\.\/\.\.\/js\/components\/([\w-]+\.js)['"]\)/g,
		replacement: "import('/js/components/$1')",
	},
	{
		pattern:
			/import\(['"]\.\.\/\.\.\/(\.\.\/)*js\/components\/([\w-]+\.js)['"]\)/g,
		replacement: "import('/js/components/$1')",
	},

	// Component loader (relative import paths)
	{
		pattern: /from ['"]\.\/js\/core\/([\w-]+\.js)['"]/g,
		replacement: "from '/js/core/$1'",
	},
	{
		pattern: /from ['"]\.\.\/\.\.\/js\/core\/([\w-]+\.js)['"]/g,
		replacement: "from '/js/core/$1'",
	},
	{
		pattern: /from ['"]\.\.\/\.\.\/(\.\.\/)*js\/core\/([\w-]+\.js)['"]/g,
		replacement: "from '/js/core/$1'",
	},

	// Favicon (relative paths)
	{ pattern: /href=["']favicon\.svg["']/g, replacement: 'href="/favicon.svg"' },
	{
		pattern: /href=["']\.\.\/\.\.\/favicon\.svg["']/g,
		replacement: 'href="/favicon.svg"',
	},
	{
		pattern: /href=["']\.\.\/(\.\.\/)*favicon\.svg["']/g,
		replacement: 'href="/favicon.svg"',
	},

	// Images in HTML (general pattern)
	{
		pattern: /src=["']\.\.\/\.\.\/assets\/(media|images)\//g,
		replacement: 'src="/assets/$1/',
	},
	{
		pattern: /src=["']\.\.\/(\.\.\/)*assets\/(media|images)\//g,
		replacement: 'src="/assets/$1/',
	},
	{
		pattern: /src=["']assets\/(media|images)\//g,
		replacement: 'src="/assets/$1/',
	},

	// Image paths in JSON files (locale)
	{
		pattern:
			/"image":\s*"\.\.\/\.\.\/\.\.\/\.\.\/assets\/media\/([\w/-]+\.(?:jpg|png|svg|webp))"/g,
		replacement: '"image": "/assets/media/$1"',
	},
	{
		pattern:
			/"image":\s*"\.\.\/(\.\.\/)*assets\/media\/([\w/-]+\.(?:jpg|png|svg|webp))"/g,
		replacement: '"image": "/assets/media/$1"',
	},
];

// Files to process
const HTML_EXTENSIONS = [".html"];
const JSON_EXTENSIONS = [".json"];
const EXTENSIONS_TO_PROCESS = [...HTML_EXTENSIONS, ...JSON_EXTENSIONS];

// Directories to exclude
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", "build"];

let filesProcessed = 0;
let filesModified = 0;
let totalReplacements = 0;

/**
 * Recursively get all files with specific extensions
 */
function getFiles(dir, fileList = []) {
	const files = readdirSync(dir);

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		if (stat.isDirectory()) {
			if (!EXCLUDE_DIRS.includes(file)) {
				getFiles(filePath, fileList);
			}
		} else {
			const ext = file.substring(file.lastIndexOf("."));
			if (EXTENSIONS_TO_PROCESS.includes(ext)) {
				fileList.push(filePath);
			}
		}
	}

	return fileList;
}

/**
 * Fix paths in a single file
 */
function fixPathsInFile(filePath) {
	filesProcessed++;

	let content = readFileSync(filePath, "utf-8");
	const originalContent = content;
	let fileReplacements = 0;

	// Apply all path patterns
	for (const { pattern, replacement } of PATH_PATTERNS) {
		const matches = content.match(pattern);
		if (matches) {
			fileReplacements += matches.length;
			content = content.replace(pattern, replacement);
		}
	}

	if (content !== originalContent) {
		filesModified++;
		totalReplacements += fileReplacements;

		const relativePath = relative(PROJECT_ROOT, filePath);
		console.log(`✓ ${relativePath} (${fileReplacements} replacements)`);

		if (!DRY_RUN) {
			writeFileSync(filePath, content, "utf-8");
		}
	}

	return fileReplacements;
}

/**
 * Main execution
 */
function main() {
	console.log("🔧 Fixing root-relative paths...\n");

	if (DRY_RUN) {
		console.log("⚠️  DRY RUN MODE - No files will be modified\n");
	}

	const files = getFiles(PROJECT_ROOT);

	console.log(`Found ${files.length} files to process\n`);

	for (const file of files) {
		fixPathsInFile(file);
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log(`\n📊 Summary:`);
	console.log(`   Files processed: ${filesProcessed}`);
	console.log(`   Files modified: ${filesModified}`);
	console.log(`   Total replacements: ${totalReplacements}`);

	if (DRY_RUN) {
		console.log(
			`\n⚠️  This was a dry run. Run without --dry-run to apply changes.`,
		);
	} else {
		console.log(`\n✅ Path fixes applied successfully!`);
	}
}

main();
