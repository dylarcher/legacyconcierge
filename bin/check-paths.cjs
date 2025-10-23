#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

const SKIP_DIRS = new Set([
	".git",
	"node_modules",
	".tmp",
	".DS_Store",
	".github",
	".vscode",
]);
const EXTS = new Set([
	".html",
	".md",
	".markdown",
	".js",
	".mjs",
	".cjs",
	".json",
]);

const SKIP_FILES = new Set(["package-lock.json"]);

function walk(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else if (entry.isFile() && EXTS.has(path.extname(entry.name)))
			out.push(full);
	}
	return out;
}

function* extractLinks(filePath, content) {
	const ext = path.extname(filePath).toLowerCase();
	const rel = path.relative(repoRoot, filePath);
	// Markdown links [text](target)
	if (ext === ".md" || ext === ".markdown") {
		let inFence = false;
		const lines = content.split(/\r?\n/);
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			// Check for code fence markers
			if (/^```/.test(line)) {
				inFence = !inFence;
				continue;
			}
			// Skip lines inside code blocks
			if (inFence) continue;
			// Skip inline code blocks that might contain path-like strings
			// Extract markdown links [text](target)
			const re = /\]\(([^)]+)\)/g;
			let m = re.exec(line);
			while (m) {
				const target = m[1].trim();
				// Only process if it's not inside inline code backticks
				const beforeLink = line.substring(0, m.index);
				const backticksBefore = (beforeLink.match(/`/g) || []).length;
				// If odd number of backticks before, we're inside inline code
				if (backticksBefore % 2 === 0) {
					yield { file: rel, line: i + 1, target };
				}
				m = re.exec(line);
			}
		}
	}
	// HTML src|href|srcset
	if (ext === ".html") {
		const attrs = ["src", "href"];
		for (const attr of attrs) {
			const re = new RegExp(`${attr}=["']([^"']+)["']`, "gi");
			let m = re.exec(content);
			while (m) {
				yield { file: rel, line: 0, target: m[1] };
				m = re.exec(content);
			}
		}
		// Very simple srcset parser (comma separated urls)
		const srcsetRe = /srcset=["']([^"']+)["']/gi;
		let sm = srcsetRe.exec(content);
		while (sm) {
			const parts = sm[1].split(",");
			for (const p of parts) {
				const url = p.trim().split(" ")[0];
				if (url) yield { file: rel, line: 0, target: url };
			}
			sm = srcsetRe.exec(content);
		}
	}
	// JS import/export and dynamic import
	if (ext === ".js" || ext === ".mjs" || ext === ".cjs") {
		// Remove comments (both single-line and multi-line) to avoid parsing them
		let cleaned = content
			.replace(/\/\*[\s\S]*?\*\//g, "") // Remove /* */ comments
			.replace(/\/\/.*$/gm, ""); // Remove // comments

		const re =
			/(import\s+[^'";]+['"]([^'"]+)['"])|(from\s+['"]([^'"]+)['"])|(import\(['"]([^'"]+)['"]\))/g;
		let m = re.exec(cleaned);
		while (m) {
			const target = m[2] || m[4] || m[6];
			// Skip import map aliases (@/, #/, $/) - these are resolved at runtime
			// Also skip if target contains common non-path characters that indicate it's code
			if (
				target &&
				!target.startsWith("@/") &&
				!target.startsWith("#/") &&
				!target.startsWith("$/") &&
				!target.includes("(") &&
				!target.includes(")") &&
				!target.includes("{") &&
				!target.includes("}") &&
				!target.includes("===")
			) {
				yield { file: rel, line: 0, target };
			}
			m = re.exec(cleaned);
		}
	}
	// JSON: scan for values that look like relative or root paths
	if (ext === ".json") {
		const re = /:[\s]*["']([^"']+)["']/g;
		let m = re.exec(content);
		while (m) {
			const raw = m[1];
			const val = raw.trim();
			// Heuristic: consider it a path only if it is explicitly path-like
			// - starts with '/', './', or '../'
			// - OR ends with a known extension (common web formats)
			// Avoid false positives like natural language with '24/7'
			const startsLikePath =
				val.startsWith("/") || val.startsWith("./") || val.startsWith("../");
			const hasKnownExt =
				/\.(md|markdown|html|css|js|mjs|cjs|png|jpg|jpeg|svg|webm|mp4|json)$/i.test(
					val,
				);
			const hasWhitespace = /\s/.test(val);
			// If it has whitespace and isn't an explicit path, it's probably a sentence/command => ignore
			if (
				(startsLikePath || hasKnownExt) &&
				!(hasWhitespace && !startsLikePath)
			) {
				yield { file: rel, line: 0, target: val };
			}
			m = re.exec(content);
		}
	}
}

function isLocal(target) {
	if (!target) return false;
	if (
		target.startsWith("http://") ||
		target.startsWith("https://") ||
		target.startsWith("mailto:") ||
		target.startsWith("tel:")
	)
		return false;
	if (target.startsWith("#")) return false;
	if (!target.includes("/") && target.includes("@")) return false;
	if (!target.includes("/") && /^[0-9]+(\.[0-9]+)*$/.test(target)) return false;
	return true;
}

function resolveTarget(fromFile, target) {
	// strip anchors/query
	const clean = target.split("#")[0].split("?")[0];
	if (!clean) return null;
	if (clean.startsWith("/"))
		return path.join(repoRoot, clean.replace(/^\//, ""));
	return path.resolve(path.dirname(path.join(repoRoot, fromFile)), clean);
}

const files = walk(repoRoot);
const missing = [];
for (const file of files) {
	const content = fs.readFileSync(file, "utf8");
	const base = path.basename(file);
	if (SKIP_FILES.has(base)) continue;
	for (const ref of extractLinks(file, content)) {
		const t = ref.target;
		if (!isLocal(t)) continue;
		const abs = resolveTarget(ref.file, t);
		if (!abs) continue;
		// ignore hashes-only or in-page
		if (!path.extname(abs) && !fs.existsSync(abs)) continue; // can't verify folders without index
		if (!fs.existsSync(abs)) {
			// ignore missing media under shared/assets/media for now (content ingestion pending)
			const relAbs = path.relative(repoRoot, abs).replace(/\\/g, "/");
			if (relAbs.startsWith("shared/assets/media/")) continue;
			missing.push({ ...ref, resolved: path.relative(repoRoot, abs) });
		}
	}
}

if (missing.length) {
	console.log("Missing references:", missing.length);
	for (const m of missing) {
		console.log(
			`- ${m.file}:${m.line} -> ${m.target} (resolved: ${m.resolved})`,
		);
	}
	process.exitCode = 1;
} else {
	console.log("No missing local references found.");
}
