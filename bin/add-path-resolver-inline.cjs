#!/usr/bin/env node
/**
 * Add inline path resolver script to all HTML files
 * This MUST be the first script in <head> to fix import map before module loading
 */

const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');

const PATH_RESOLVER_SCRIPT = `    <!-- Universal Path Resolver - MUST BE FIRST -->
    <script>
      (function() {
        // Detect environment and set base path
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        let basePath = '';

        // GitHub Pages detection
        if (hostname.includes('github.io')) {
          const parts = pathname.split('/').filter(p => p && p !== 'index.html');
          if (parts.length > 0 && parts[0] !== 'pages') {
            basePath = '/' + parts[0];
          }
        }

        // Store globally for use by other scripts
        window.BASE_PATH = basePath;

        // Update import map if it exists
        document.addEventListener('DOMContentLoaded', function() {
          const importMapScript = document.querySelector('script[type="importmap"]');
          if (importMapScript) {
            try {
              const importMap = JSON.parse(importMapScript.textContent);
              if (basePath) {
                importMap.imports = {
                  '@/': basePath + '/common/',
                  '#/': basePath + '/shared/',
                  '$/': basePath + '/pages/'
                };
              } else {
                importMap.imports = {
                  '@/': './common/',
                  '#/': './shared/',
                  '$/': './pages/'
                };
              }
              importMapScript.textContent = JSON.stringify(importMap, null, 2);
            } catch(e) {
              console.error('Failed to update import map:', e);
            }
          }
        });

        // Helper function for resolving paths
        window.resolvePath = function(p) {
          const cleanPath = p.startsWith('/') ? p.slice(1) : p;
          return basePath ? basePath + '/' + cleanPath : '/' + cleanPath;
        };
      })();
    </script>
`;

const DRY_RUN = process.argv.includes('--dry-run');

async function addPathResolver() {
	const htmlFiles = await glob('**/*.html', {
		cwd: process.cwd(),
		ignore: [
			'**/node_modules/**',
			'**/.git/**',
			'**/dist/**',
			'**/.tmp/**',
			'**/shared/partials/templates/**' // Skip template fragments
		]
	});

	console.log(`Found ${htmlFiles.length} HTML files\n`);

	let modified = 0;
	let skipped = 0;

	for (const file of htmlFiles) {
		const filePath = path.join(process.cwd(), file);
		let content = fs.readFileSync(filePath, 'utf8');

		// Check if path resolver already exists
		if (content.includes('Universal Path Resolver')) {
			console.log(`⏭️  ${file} - Already has path resolver`);
			skipped++;
			continue;
		}

		// Check if file has a <head> tag
		if (!content.includes('<head>')) {
			console.log(`⚠️  ${file} - No <head> tag found`);
			skipped++;
			continue;
		}

		// Insert path resolver as FIRST script in <head>
		const headRegex = /(<head[^>]*>\s*)/;

		if (headRegex.test(content)) {
			content = content.replace(headRegex, `$1\n${PATH_RESOLVER_SCRIPT}\n`);

			if (!DRY_RUN) {
				fs.writeFileSync(filePath, content, 'utf8');
			}

			console.log(`✅ ${file} - Added path resolver`);
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

addPathResolver().catch(console.error);
