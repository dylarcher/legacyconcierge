#!/usr/bin/env node
/**
 * Rewrite Markdown links to moved docs using mapping and per-file relative paths.
 * - Skips replacements inside fenced code blocks (```)
 * - Updates any markdown link target that ends with a known moved basename
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const mappingPath = path.join(repoRoot, 'docs', '.moved-mapping.json');
if (!fs.existsSync(mappingPath)) {
  console.error('Mapping file not found:', mappingPath);
  process.exit(1);
}
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const movedBasenames = Object.keys(mapping);

/** Collect all markdown files in repo */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.tmp') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) out.push(full);
  }
  return out;
}

function normalizeLinkTarget(target) {
  // strip anchors and queries
  const noAnchor = target.split('#')[0].split('?')[0];
  return noAnchor;
}

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);
  let inFence = false;
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // toggle code fence when encountering ```
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    // Replace markdown links: [text](target)
    lines[i] = line.replace(/\]\(([^)]+)\)/g, (m, target) => {
      const clean = normalizeLinkTarget(target.trim());
      const base = path.basename(clean);
      if (!movedBasenames.includes(base)) return m; // not a moved doc
      const newAbs = path.join(repoRoot, mapping[base]);
      // compute relative path from current file directory
      const fromDir = path.dirname(filePath);
      let rel = path.relative(fromDir, newAbs).replace(/\\/g, '/');
      if (!rel || !rel.startsWith('.')) rel = './' + rel; // keep it relative
      changed = true;
      const anchor = target.includes('#') ? '#' + target.split('#').slice(1).join('#') : '';
      const suffix = target.includes('?') && !target.includes('#') ? '?' + target.split('?')[1] : '';
      return `](${rel}${anchor || ''}${suffix || ''})`;
    });
  }
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Updated links in', path.relative(repoRoot, filePath));
  }
}

const files = walk(repoRoot);
files.forEach(rewriteFile);
console.log('Done. Scanned', files.length, 'markdown files.');
