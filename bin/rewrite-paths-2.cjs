#!/usr/bin/env node
/**
 * Additional path rewrites (round 2) for relative utils, components src, videos, and images->media correction.
 */
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

const EXCLUDE_DIRS = new Set([
	"node_modules",
	".git",
	"dist",
	"build",
	".lighthouse",
]);
const HTML_EXTENSIONS = new Set([".html"]);
const JSON_EXTENSIONS = new Set([".json"]);
const EXTENSIONS = new Set([...HTML_EXTENSIONS, ...JSON_EXTENSIONS]);

const patterns = [
	// Relative utils -> /common
	{
		re: /src=["'](?:\.\.\/)+utils\/app\.js["']/g,
		rep: 'src="/common/utils/app.js"',
	},
	{
		re: /src=["'](?:\.\.\/)+utils\/theme\.js["']/g,
		rep: 'src="/common/services/theme.js"',
	},
	{
		re: /src=["'](?:\.\.\/)+utils\/i18n\.js["']/g,
		rep: 'src="/common/services/i18n.js"',
	},
	{
		re: /src=["'](?:\.\.\/)+tools\/dev-tools\.js["']/g,
		rep: 'src="/common/tools/dev-tools.js"',
	},
	// Core loader import from relative utils path
	{
		re: /from\s+["'](?:\.\.\/)+utils\/core\/([\w-]+\.js)["']/g,
		rep: "from '/common/core/$1'",
	},

	// Components module src
	{
		re: /src=["']\/js\/components\/(.+?)["']/g,
		rep: 'src="/common/components/$1"',
	},

	// Videos assets -> shared
	{
		re: /src=["'](?:\.\.\/)*assets\/videos\//g,
		rep: 'src="/shared/assets/media/videos/',
	},
	{
		re: /src=["']\/assets\/videos\//g,
		rep: 'src="/shared/assets/media/videos/',
	},
	{
		re: /href=["']\/assets\/videos\//g,
		rep: 'href="/shared/assets/media/videos/',
	},

	// Fix incorrect /shared/assets/images -> /shared/assets/media
	{ re: /\/shared\/assets\/images\//g, rep: "/shared/assets/media/" },
];

function walk(dir, out) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const ent of entries) {
		if (EXCLUDE_DIRS.has(ent.name)) continue;
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			walk(full, out);
		} else {
			const ext = path.extname(ent.name);
			if (EXTENSIONS.has(ext)) out.push(full);
		}
	}
	return out;
}

function rewriteFile(file) {
	const before = fs.readFileSync(file, "utf8");
	let after = before;
	let replacements = 0;
	for (const { re, rep } of patterns) {
		const matches = after.match(re);
		if (matches) {
			replacements += matches.length;
			after = after.replace(re, rep);
		}
	}
	if (after !== before) {
		const rel = path.relative(PROJECT_ROOT, file);
		console.log(`✓ ${rel} (${replacements} replacements)`);
		if (!DRY_RUN) fs.writeFileSync(file, after, "utf8");
	}
}

function main() {
	console.log("🔧 Rewriting additional paths (round 2)...");
	if (DRY_RUN) console.log("⚠️  DRY RUN MODE - No files will be modified");

	const files = walk(PROJECT_ROOT, []);
	console.log(`Found ${files.length} files to check`);

	for (const f of files) rewriteFile(f);

	console.log("✅ Done");
}

main();
