#!/usr/bin/env python3
"""
Page Audit Script
Checks for broken links, missing images, and path issues across all pages
"""

import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse
from typing import Set, List, Tuple
import json

def find_all_links(content: str) -> Set[str]:
    """Extract all href links from HTML"""
    links = set()
    # Match href attributes
    for match in re.finditer(r'href=["\']([^"\']+)["\']', content):
        link = match.group(1)
        # Skip external links, anchors, and javascript
        if not link.startswith(('http', '#', 'javascript:', 'mailto:', 'tel:')):
            links.add(link)
    return links

def find_all_images(content: str) -> Set[str]:
    """Extract all image src from HTML"""
    images = set()
    # Match src attributes
    for match in re.finditer(r'src=["\']([^"\']+)["\']', content):
        src = match.group(1)
        # Skip external images and data URIs
        if not src.startswith(('http', 'data:')):
            images.add(src)
    return images

def find_all_scripts(content: str) -> Set[str]:
    """Extract all script src from HTML"""
    scripts = set()
    for match in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\']', content):
        src = match.group(1)
        if not src.startswith('http'):
            scripts.add(src)
    return scripts

def normalize_path(path: str, current_file: Path, root: Path) -> Path:
    """Convert relative path to absolute Path object"""
    if path.startswith('/'):
        # Root-relative path
        return root / path.lstrip('/')
    else:
        # File-relative path
        return (current_file.parent / path).resolve()

def check_file_exists(path: str, current_file: Path, root: Path) -> Tuple[bool, Path]:
    """Check if a file exists and return status and resolved path"""
    try:
        resolved = normalize_path(path, current_file, root)

        # If path ends with /, try index.html
        if path.endswith('/'):
            resolved = resolved / 'index.html'

        # If it's a directory, try index.html
        if resolved.is_dir():
            resolved = resolved / 'index.html'

        exists = resolved.exists()
        return exists, resolved
    except Exception as e:
        return False, Path(path)

def audit_page(file_path: Path, root: Path) -> dict:
    """Audit a single page for issues"""
    issues = {
        'broken_links': [],
        'missing_images': [],
        'missing_scripts': [],
        'path_issues': []
    }

    try:
        content = file_path.read_text(encoding='utf-8')

        # Check links
        links = find_all_links(content)
        for link in links:
            exists, resolved = check_file_exists(link, file_path, root)
            if not exists:
                issues['broken_links'].append({
                    'link': link,
                    'resolved': str(resolved)
                })

        # Check images
        images = find_all_images(content)
        for img in images:
            exists, resolved = check_file_exists(img, file_path, root)
            if not exists:
                issues['missing_images'].append({
                    'src': img,
                    'resolved': str(resolved)
                })

        # Check scripts
        scripts = find_all_scripts(content)
        for script in scripts:
            exists, resolved = check_file_exists(script, file_path, root)
            if not exists:
                issues['missing_scripts'].append({
                    'src': script,
                    'resolved': str(resolved)
                })

        # Check for common path issues
        # Check if using relative paths for components/scripts that should be absolute
        if '../../components/' in content or '../components/' in content:
            issues['path_issues'].append('Using relative paths for components (should be absolute /components/)')

        if '../../tools/' in content or '../tools/' in content:
            issues['path_issues'].append('Using relative paths for scripts (should be absolute /tools/)')

    except Exception as e:
        issues['error'] = str(e)

    return issues

def main():
    """Main execution"""
    root = Path(__file__).parent.parent

    # Get all HTML files
    html_files = [root / 'index.html']
    html_files.extend(sorted((root / 'pages').glob('**/index.html')))

    print("=" * 70)
    print("PAGE AUDIT REPORT")
    print("=" * 70)
    print()

    total_issues = 0
    pages_with_issues = 0

    for file_path in html_files:
        rel_path = file_path.relative_to(root)
        issues = audit_page(file_path, root)

        # Count total issues
        issue_count = (
            len(issues['broken_links']) +
            len(issues['missing_images']) +
            len(issues['missing_scripts']) +
            len(issues['path_issues'])
        )

        if issue_count > 0:
            pages_with_issues += 1
            total_issues += issue_count

            print(f"📄 {rel_path}")
            print("-" * 70)

            if issues['broken_links']:
                print(f"  ❌ Broken Links ({len(issues['broken_links'])})")
                for link in issues['broken_links'][:3]:  # Show first 3
                    print(f"     • {link['link']}")
                if len(issues['broken_links']) > 3:
                    print(f"     ... and {len(issues['broken_links']) - 3} more")

            if issues['missing_images']:
                print(f"  🖼️  Missing Images ({len(issues['missing_images'])})")
                for img in issues['missing_images'][:3]:
                    print(f"     • {img['src']}")
                if len(issues['missing_images']) > 3:
                    print(f"     ... and {len(issues['missing_images']) - 3} more")

            if issues['missing_scripts']:
                print(f"  📜 Missing Scripts ({len(issues['missing_scripts'])})")
                for script in issues['missing_scripts'][:3]:
                    print(f"     • {script['src']}")
                if len(issues['missing_scripts']) > 3:
                    print(f"     ... and {len(issues['missing_scripts']) - 3} more")

            if issues['path_issues']:
                print(f"  ⚠️  Path Issues ({len(issues['path_issues'])})")
                for issue in issues['path_issues']:
                    print(f"     • {issue}")

            print()

    print("=" * 70)
    print(f"Summary: {total_issues} issues found across {pages_with_issues} pages")
    print(f"Audited: {len(html_files)} pages total")
    print("=" * 70)

    # Save detailed report
    report_path = root / 'audit-report.json'
    report = {
        'total_pages': len(html_files),
        'pages_with_issues': pages_with_issues,
        'total_issues': total_issues
    }
    report_path.write_text(json.dumps(report, indent=2))
    print(f"\nDetailed report saved to: audit-report.json")

if __name__ == '__main__':
    main()
