#!/usr/bin/env node
/**
 * Rewrite legacy paths to new /common and /shared structure across HTML/JSON.
 */
const fs = require("node:fs");
const path = require("node:path");

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
	// CSS main
	{
		re: /href=["'](?:\.\.\/)*styles\/style\.css["']/g,
		rep: 'href="/shared/theme/style.css"',
	},
	{
		re: /href=["']\/styles\/style\.css["']/g,
		rep: 'href="/shared/theme/style.css"',
	},

	// CSS layouts
	{
		re: /href=["'](?:\.\.\/)*styles\/layouts\/([\w-]+\.css)["']/g,
		rep: 'href="/shared/theme/layouts/$1"',
	},
	{
		re: /href=["']\/styles\/layouts\/([\w-]+\.css)["']/g,
		rep: 'href="/shared/theme/layouts/$1"',
	},

	// Scripts (legacy /js -> /common)
	{
		re: /src=["']\/js\/theme\.js["']/g,
		rep: 'src="/common/services/theme.js"',
	},
	{ re: /src=["']\/js\/app\.js["']/g, rep: 'src="/common/utils/app.js"' },
	{ re: /src=["']\/js\/i18n\.js["']/g, rep: 'src="/common/services/i18n.js"' },

	// Core loader imports
	{
		re: /from\s+["']\/js\/core\/([\w-]+\.js)["']/g,
		rep: "from '/common/core/$1'",
	},
	{
		re: /import\((['"])\/js\/core\/([\w-]+\.js)\1\)/g,
		rep: "import('/common/core/$2')",
	},

	// Components imports/src
	{
		re: /import\((['"])\/js\/components\/(.+?)\1\)/g,
		rep: "import('/common/components/$2')",
	},
	{
		re: /import\((['"])\/components\/js\/(.+?)\1\)/g,
		rep: "import('/common/components/$2')",
	},
	{
		re: /src=["']\/components\/js\/(.+?)["']/g,
		rep: 'src="/common/components/$1"',
	},

	// Dev tools
	{
		re: /src=["']\/tools\/dev-tools\.js["']/g,
		rep: 'src="/common/tools/dev-tools.js"',
	},

	// Templates -> shared partials
	{
		re: /\/components\/templates\/contact-form\.html/g,
		rep: "/shared/partials/templates/contact.html",
	},
	{ re: /\/components\/templates\//g, rep: "/shared/partials/templates/" },

	// Assets -> shared/assets
	{
		re: /src=["'](?:\.\.\/)*assets\/(media|images)\//g,
		rep: 'src="/shared/assets/$1/',
	},
	{ re: /src=["']\/assets\/(media|images)\//g, rep: 'src="/shared/assets/$1/' },
	{
		re: /href=["']\/assets\/(media|images)\//g,
		rep: 'href="/shared/assets/$1/',
	},

	// Locale -> shared/content/_locale
	{ re: /\/_locale\//g, rep: "/shared/content/_locale/" },

	// JSON image fields normalization
	{
		re: /"image":\s*"(?:\.\.\/)*assets\/media\/([\w/-]+\.(?:jpg|png|svg|webp))"/g,
		rep: '"image": "/shared/assets/media/$1"',
	},
	{
		re: /"image":\s*"\/assets\/media\/([\w/-]+\.(?:jpg|png|svg|webp))"/g,
		rep: '"image": "/shared/assets/media/$1"',
	},

	// Favicon normalize
	{ re: /href=["']favicon\.svg["']/g, rep: 'href="/favicon.svg"' },
	{ re: /href=["'](?:\.\.\/)+favicon\.svg["']/g, rep: 'href="/favicon.svg"' },
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
	console.log("🔧 Rewriting legacy paths to /common and /shared...");
	if (DRY_RUN) console.log("⚠️  DRY RUN MODE - No files will be modified");

	const files = walk(PROJECT_ROOT, []);
	console.log(`Found ${files.length} files to check`);

	for (const f of files) rewriteFile(f);

	console.log("✅ Done");
}

main();
