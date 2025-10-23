#!/usr/bin/env node

/**
 * Comprehensive path audit script for Legacy Concierge website
 * Checks CSS paths, JS paths, image paths, and navigation links
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/darcher/Dev/legacy-concierge';

// Expected pages based on navigation structure
const EXPECTED_PAGES = [
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

const issues = {
  missingPages: [],
  cssPathIssues: [],
  jsPathIssues: [],
  imagePathIssues: [],
  linkIssues: [],
  extraPages: []
};

// Check if a page exists
function pageExists(pagePath) {
  const filePath = pagePath === '/'
    ? path.join(BASE_DIR, 'index.html')
    : path.join(BASE_DIR, pagePath, 'index.html');
  return fs.existsSync(filePath);
}

// Check all expected pages
function checkPageExistence() {
  console.log('Checking page existence...');
  for (const page of EXPECTED_PAGES) {
    if (!pageExists(page)) {
      issues.missingPages.push(page);
    }
  }
}

// Analyze a single HTML file
function analyzeFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check CSS paths - should be absolute
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
      } else if (cssPath !== '/shared/theme/style.css') {
        issues.cssPathIssues.push({
          file: relativePath,
          line: lineNum,
          found: cssPath,
          expected: '/shared/theme/style.css'
        });
      }
    }

    // Check JS script paths - should be absolute
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

    // Check image paths - should be absolute
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

    // Check navigation links (href in <a> tags)
    const linkMatch = line.match(/<a[^>]+href=["']([^"']+)["']/);
    if (linkMatch) {
      const href = linkMatch[1];
      // Skip external links, anchors, and special links
      if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        if (!href.startsWith('/')) {
          issues.linkIssues.push({
            file: relativePath,
            line: lineNum,
            found: href,
            expected: 'Absolute path starting with /'
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
      analyzeFile(filePath, relativePath);
    }
  }
}

// Generate report
function generateReport() {
  let report = '# Legacy Concierge Website Path Audit Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  // Summary
  report += '## Summary\n\n';
  report += `- Total expected pages: ${EXPECTED_PAGES.length}\n`;
  report += `- Missing pages: ${issues.missingPages.length}\n`;
  report += `- CSS path issues: ${issues.cssPathIssues.length}\n`;
  report += `- JS path issues: ${issues.jsPathIssues.length}\n`;
  report += `- Image path issues: ${issues.imagePathIssues.length}\n`;
  report += `- Link issues: ${issues.linkIssues.length}\n\n`;

  // Missing Pages
  if (issues.missingPages.length > 0) {
    report += '## Missing Pages\n\n';
    report += 'These pages are referenced in the navigation but do not exist:\n\n';
    for (const page of issues.missingPages) {
      report += `- ${page}\n`;
    }
    report += '\n';
  }

  // CSS Path Issues
  if (issues.cssPathIssues.length > 0) {
    report += '## CSS Path Issues\n\n';
    report += 'Pages with incorrect CSS paths (should use `/shared/theme/style.css`):\n\n';
    for (const issue of issues.cssPathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // JS Path Issues
  if (issues.jsPathIssues.length > 0) {
    report += '## JavaScript Path Issues\n\n';
    report += 'Pages with relative JavaScript paths (should use absolute paths):\n\n';
    for (const issue of issues.jsPathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // Image Path Issues
  if (issues.imagePathIssues.length > 0) {
    report += '## Image Path Issues\n\n';
    report += 'Pages with relative image paths (should use absolute paths):\n\n';
    for (const issue of issues.imagePathIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // Link Issues
  if (issues.linkIssues.length > 0) {
    report += '## Navigation Link Issues\n\n';
    report += 'Pages with relative navigation links (should use absolute paths):\n\n';
    for (const issue of issues.linkIssues) {
      report += `### ${issue.file}:${issue.line}\n`;
      report += `- **Found:** \`${issue.found}\`\n`;
      report += `- **Expected:** \`${issue.expected}\`\n\n`;
    }
  }

  // All Clear
  if (Object.values(issues).every(arr => arr.length === 0)) {
    report += '## ✓ All Checks Passed\n\n';
    report += 'No issues found! All pages exist and use correct absolute paths.\n';
  }

  return report;
}

// Main execution
console.log('Starting Legacy Concierge path audit...\n');

checkPageExistence();
walkDirectory(BASE_DIR);

const report = generateReport();
console.log(report);

// Write to file
fs.writeFileSync(path.join(BASE_DIR, 'audit-report.md'), report);
console.log('\nReport saved to: audit-report.md');
