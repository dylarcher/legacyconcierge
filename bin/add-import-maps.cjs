#!/usr/bin/env node
/**
 * Add import map to all HTML files for path alias support
 * Adds <script type="importmap"> right after the <head> opening tag
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const IMPORT_MAP = `    <!-- Import map for module path aliases -->
    <script type="importmap">
      {
        "imports": {
          "@/": "./common/",
          "#/": "./shared/",
          "$/": "./pages/"
        }
      }
    </script>
`;

const DRY_RUN = process.argv.includes('--dry-run');

async function addImportMaps() {
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

    // Check if import map already exists
    if (content.includes('type="importmap"')) {
      console.log(`⏭️  ${file} - Already has import map`);
      skipped++;
      continue;
    }

    // Check if file has a <head> tag
    if (!content.includes('<head>')) {
      console.log(`⚠️  ${file} - No <head> tag found`);
      skipped++;
      continue;
    }

    // Insert import map after <head> opening tag
    // Look for patterns like <head> or <head ...>
    const headRegex = /(<head[^>]*>\s*)/;

    if (headRegex.test(content)) {
      content = content.replace(headRegex, `$1\n${IMPORT_MAP}\n`);

      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, 'utf8');
      }

      console.log(`✅ ${file} - Added import map`);
      modified++;
    } else {
      console.log(`⚠️  ${file} - Could not find suitable insertion point`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Modified: ${modified}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${htmlFiles.length}`);

  if (DRY_RUN) {
    console.log(`\n⚠️  DRY RUN - No files were actually modified`);
    console.log(`   Run without --dry-run to apply changes`);
  }
}

addImportMaps().catch(console.error);
