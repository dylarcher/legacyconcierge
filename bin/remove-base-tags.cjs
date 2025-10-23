#!/usr/bin/env node
/**
 * Remove <base> tags from all HTML files
 * The path-resolver system handles base paths dynamically,
 * so static <base> tags cause conflicts
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

async function removeBaseTags() {
  const htmlFiles = await glob('**/*.html', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.tmp/**']
  });

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  let modified = 0;
  let skipped = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remove <base> tag and surrounding comments/whitespace
    // Match various formats:
    // - <!-- Comment -->\n    <base href="..." />
    // - <base href="..." />
    // - <base href="...">
    content = content.replace(
      /\s*<!--\s*GitHub Pages Base Path[^>]*-->\s*\n?\s*<base\s+href="[^"]*"\s*\/?>\s*\n?/gi,
      ''
    );
    content = content.replace(
      /\s*<base\s+href="[^"]*"\s*\/?>\s*\n?/gi,
      ''
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${file} - Removed <base> tag`);
      modified++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Modified: ${modified}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${htmlFiles.length}`);
}

removeBaseTags().catch(console.error);
