#!/usr/bin/env node

/**
 * Comprehensive audit script for Legacy Concierge website
 * Checks CSS paths, JS paths, image paths, navigation links, and broken links
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/darcher/Dev/legacy-concierge';

const issues = {
  missingPages: [],
  cssPathIssues: [],
  jsPathIssues: [],
  imagePathIssues: [],
  linkIssues: [],
  brokenLinks: [],
  navMismatches: []
};

const foundPages = new Set();

// Navigation links from nav.html
const NAV_LINKS = [
  '/',
  '/pages/about',
  '/pages/about/contact',
  '/pages/about/contact/locations',
  '/pages/about/jobs',
  '/pages/about/legal/privacy',
  '/pages/about/legal/terms',
  '/pages/about/partners',
  '/pages/about/team',
  '/pages/blog',
  '/pages/blog/post/post-op-care',
  '/pages/demos',
  '/pages/demos/blog',
  '/pages/demos/blog/post',
  '/pages/demos/components',
  '/pages/demos/entry',
  '/pages/demos/entry/landing',
  '/pages/demos/hero',
  '/pages/demos/subpage/contact',
  '/pages/demos/subpage/gallery',
  '/pages/demos/subpage/sidebar',
  '/pages/services/expertise',
  '/pages/services/expertise/views/als',
  '/pages/services/expertise/views/alzheimers',
  '/pages/services/expertise/views/dementia',
  '/pages/services/expertise/views/diabetes-management',
  '/pages/services/expertise/views/heart-disease',
  '/pages/services/expertise/views/ms',
  '/pages/services/expertise/views/oncology',
  '/pages/services/expertise/views/ostomy-management',
  '/pages/services/expertise/views/parkinsons',
  '/pages/services/expertise/views/stroke-recovery',
  '/pages/services/expertise/views/tbi',
  '/pages/services/treatments',
  '/pages/services/treatments/views/cardiac-pulmonary',
  '/pages/services/treatments/views/eating-disorders',
  '/pages/services/treatments/views/iv-therapy',
  '/pages/services/treatments/views/mental-health',
  '/pages/services/treatments/views/pain-management',
  '/pages/services/treatments/views/post-op-recovery',
  '/pages/services/treatments/views/rehab-addiction',
];

// Convert URL path to file path
function urlToFilePath(url) {
  if (url === '/') {
    return path.join(BASE_DIR, 'index.html');
  }
  return path.join(BASE_DIR, url, 'index.html');
}

// Check if a URL exists
function urlExists(url) {
  const filePath = urlToFilePath(url);
  return fs.existsSync(filePath);
}

// Resolve relative URL from a page
function resolveUrl(basePagePath, href) {
  // Handle absolute paths
  if (href.startsWith('/')) {
    return href;
  }

  // Get directory of current page
  const pageDir = path.dirname(basePagePath);

  // Resolve relative path
  const resolved = path.join(pageDir, href);

  // Convert to URL format
  return resolved.replace(BASE_DIR, '').replace(/\/index\.html$/, '');
}

// Analyze a single HTML file
function analyzeFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Calculate URL path for this page
  const urlPath = relativePath === 'index.html'
    ? '/'
    : '/' + relativePath.replace('/index.html', '');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check CSS paths
    const cssMatch = line.match(/href=["']([^"']+\.css)["']/);
    if (cssMatch) {
      const cssPath = cssMatch[1];
      if (!cssPath.startsWith('/')) {
        issues.cssPathIssues.push({
          file: relativePath,
          line: lineNum,
          found: cssPath,
          expected: 'Absolute path starting with /'
        });
      } else if (!cssPath.startsWith('/shared/theme/')) {
        issues.cssPathIssues.push({
          file: relativePath,
          line: lineNum,
          found: cssPath,
          expected: '/shared/theme/style.css or /shared/theme/layouts/*.css',
          note: 'Using layout-specific CSS file'
        });
      }
    }

    // Check JS script paths
    const jsMatch = line.match(/src=["']([^"']+\.js)["']/);
    if (jsMatch) {
      const jsPath = jsMatch[1];
      if (!jsPath.startsWith('/') && !jsPath.startsWith('http')) {
        issues.jsPathIssues.push({
          file: relativePath,
          line: lineNum,
          found: jsPath,
          expected: 'Absolute path starting with /'
        });
      }
    }

    // Check image paths
    const imgMatch = line.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) {
      const imgPath = imgMatch[1];
      if (!imgPath.startsWith('/') && !imgPath.startsWith('http') && !imgPath.startsWith('data:')) {
        issues.imagePathIssues.push({
          file: relativePath,
          line: lineNum,
          found: imgPath,
          expected: 'Absolute path starting with /'
        });
      }
    }

    // Check navigation links
    const linkMatches = line.matchAll(/<a[^>]+href=["']([^"']+)["']/g);
    for (const match of linkMatches) {
      const href = match[1];

      // Skip external links, anchors, and special links
      if (href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }

      // Check if it's a relative path
      if (!href.startsWith('/')) {
        issues.linkIssues.push({
          file: relativePath,
          line: lineNum,
          found: href,
          expected: 'Absolute path starting with /',
          context: line.trim().substring(0, 100)
        });

        // Try to resolve and check if target exists
        const resolvedUrl = resolveUrl(filePath, href);
        if (!urlExists(resolvedUrl)) {
          issues.brokenLinks.push({
            file: relativePath,
            line: lineNum,
            href: href,
            resolvedTo: resolvedUrl,
            exists: false
          });
        }
      } else {
        // Check if absolute link target exists
        const targetUrl = href.replace(/\/$/, ''); // Remove trailing slash
        if (!urlExists(targetUrl)) {
          issues.brokenLinks.push({
            file: relativePath,
            line: lineNum,
            href: href,
            resolvedTo: targetUrl,
            exists: false
          });
        }
      }
    }
  });
}

// Walk directory tree and analyze all HTML files
function walkDirectory(dir, baseDir = BASE_DIR) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip node_modules and hidden directories
    if (file.startsWith('.') || file === 'node_modules') {
      continue;
    }

    if (stat.isDirectory()) {
      walkDirectory(filePath, baseDir);
    } else if (file === 'index.html') {
      const relativePath = path.relative(baseDir, filePath);

      // Track found pages
      const urlPath = relativePath === 'index.html'
        ? '/'
        : '/' + relativePath.replace('/index.html', '');
      foundPages.add(urlPath);

      analyzeFile(filePath, relativePath);
    }
  }
}

// Check navigation consistency
function checkNavConsistency() {
  console.log('\nChecking navigation consistency...');

  for (const navLink of NAV_LINKS) {
    if (!foundPages.has(navLink)) {
      issues.missingPages.push({
        url: navLink,
        inNav: true,
        exists: false
      });
    }
  }

  // Check for pages not in navigation
  for (const page of foundPages) {
    if (!NAV_LINKS.includes(page) && !page.startsWith('/pages/demos/')) {
      issues.navMismatches.push({
        url: page,
        inNav: false,
        exists: true,
        note: 'Page exists but not in navigation'
      });
    }
  }
}

// Generate report
function generateReport() {
  let report = '# Legacy Concierge Website - Comprehensive Path Audit Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  // Summary
  report += '## Executive Summary\n\n';
  report += `- **Total pages found:** ${foundPages.size}\n`;
  report += `- **Expected navigation links:** ${NAV_LINKS.length}\n`;
  report += `- **Missing pages:** ${issues.missingPages.length}\n`;
  report += `- **CSS path issues:** ${issues.cssPathIssues.length}\n`;
  report += `- **JS path issues:** ${issues.jsPathIssues.length}\n`;
  report += `- **Image path issues:** ${issues.imagePathIssues.length}\n`;
  report += `- **Relative link issues:** ${issues.linkIssues.length}\n`;
  report += `- **Broken links:** ${issues.brokenLinks.length}\n`;
  report += `- **Navigation mismatches:** ${issues.navMismatches.length}\n\n`;

  // Missing Pages
  if (issues.missingPages.length > 0) {
    report += '## 🔴 Missing Pages\n\n';
    report += 'These pages are referenced in the navigation but do not exist:\n\n';
    for (const page of issues.missingPages) {
      report += `- **${page.url}**\n`;
      report += `  - Expected file: \`${urlToFilePath(page.url).replace(BASE_DIR, '')}\`\n\n`;
    }
  }

  // Broken Links
  if (issues.brokenLinks.length > 0) {
    report += '## 🔴 Broken Internal Links\n\n';
    report += 'These links point to pages that do not exist:\n\n';
    const grouped = {};
    for (const link of issues.brokenLinks) {
      if (!grouped[link.file]) grouped[link.file] = [];
      grouped[link.file].push(link);
    }

    for (const [file, links] of Object.entries(grouped)) {
      report += `### ${file}\n\n`;
      for (const link of links) {
        report += `- **Line ${link.line}:** \`${link.href}\`\n`;
        report += `  - Resolved to: \`${link.resolvedTo}\`\n`;
        report += `  - Status: ❌ Does not exist\n\n`;
      }
    }
  }

  // CSS Path Issues
  if (issues.cssPathIssues.length > 0) {
    report += '## ⚠️ CSS Path Issues\n\n';
    report += 'Pages with CSS path issues:\n\n';
    for (const issue of issues.cssPathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n`;
      if (issue.note) {
        report += `- **Note:** ${issue.note}\n`;
      }
      report += '\n';
    }
  }

  // JS Path Issues
  if (issues.jsPathIssues.length > 0) {
    report += '## ⚠️ JavaScript Path Issues\n\n';
    report += 'Pages with relative JavaScript paths (should use absolute paths):\n\n';
    for (const issue of issues.jsPathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // Image Path Issues
  if (issues.imagePathIssues.length > 0) {
    report += '## ⚠️ Image Path Issues\n\n';
    report += 'Pages with relative image paths (should use absolute paths):\n\n';
    for (const issue of issues.imagePathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // Link Issues
  if (issues.linkIssues.length > 0) {
    report += '## ⚠️ Relative Navigation Link Issues\n\n';
    report += 'Pages with relative navigation links (should use absolute paths):\n\n';
    const grouped = {};
    for (const issue of issues.linkIssues) {
      if (!grouped[issue.file]) grouped[issue.file] = [];
      grouped[issue.file].push(issue);
    }

    for (const [file, links] of Object.entries(grouped)) {
      report += `### ${file}\n\n`;
      for (const issue of links) {
        report += `- **Line ${issue.line}:** \`${issue.found}\`\n`;
        report += `  - Should be: Absolute path starting with \`/\`\n\n`;
      }
    }
  }

  // Navigation Mismatches
  if (issues.navMismatches.length > 0) {
    report += '## ℹ️ Navigation Mismatches\n\n';
    report += 'Pages that exist but are not referenced in navigation:\n\n';
    for (const page of issues.navMismatches) {
      report += `- **${page.url}**\n`;
      report += `  - ${page.note}\n\n`;
    }
  }

  // All Clear
  const totalIssues = issues.missingPages.length + issues.brokenLinks.length +
                      issues.cssPathIssues.length + issues.jsPathIssues.length +
                      issues.imagePathIssues.length + issues.linkIssues.length;

  if (totalIssues === 0) {
    report += '## ✅ All Critical Checks Passed\n\n';
    report += 'No critical issues found! All pages exist and use correct absolute paths.\n\n';
    if (issues.navMismatches.length > 0) {
      report += '(Note: Some pages exist but are not in navigation - this may be intentional)\n';
    }
  }

  // Pages List
  report += '## 📄 All Pages Found\n\n';
  report += `Total: ${foundPages.size} pages\n\n`;
  const sortedPages = Array.from(foundPages).sort();
  for (const page of sortedPages) {
    const inNav = NAV_LINKS.includes(page) ? '✓' : ' ';
    report += `- [${inNav}] ${page}\n`;
  }
  report += '\n(✓ = included in navigation)\n';

  return report;
}

// Main execution
console.log('Starting comprehensive Legacy Concierge audit...\n');

walkDirectory(BASE_DIR);
checkNavConsistency();

const report = generateReport();
console.log(report);

// Write to file
const reportPath = path.join(BASE_DIR, 'audit-report-comprehensive.md');
fs.writeFileSync(reportPath, report);
console.log(`\nReport saved to: ${reportPath}`);
