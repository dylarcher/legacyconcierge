#!/usr/bin/env node
/**
 * Update all JavaScript imports to use path aliases
 * Converts /common/ -> @/, /shared/ -> #/, /pages/ -> $/
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const DRY_RUN = process.argv.includes('--dry-run');

const replacements = [
  { from: /from\s+["']\/common\//g, to: 'from "@/' },
  { from: /from\s+["']\/shared\//g, to: 'from "#/' },
  { from: /from\s+["']\/pages\//g, to: 'from "$/' },
  { from: /import\s+["']\/common\//g, to: 'import "@/' },
  { from: /import\s+["']\/shared\//g, to: 'import "#/' },
  { from: /import\s+["']\/pages\//g, to: 'import "$/' },
];

async function updateImports() {
  const jsFiles = await glob('**/*.js', {
    cwd: process.cwd(),
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/.tmp/**',
      '**/bin/**'
    ]
  });

  console.log(`Found ${jsFiles.length} JavaScript files\n`);

  let modified = 0;
  let skipped = 0;

  for (const file of jsFiles) {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;

    // Apply all replacements
    for (const { from, to } of replacements) {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        changes += matches.length;
      }
    }

    if (content !== originalContent) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, 'utf8');
      }

      console.log(`✅ ${file} - Updated ${changes} import(s)`);
      modified++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Modified: ${modified}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${jsFiles.length}`);

  if (DRY_RUN) {
    console.log(`\n⚠️  DRY RUN - No files were actually modified`);
    console.log(`   Run without --dry-run to apply changes`);
  }
}

updateImports().catch(console.error);
