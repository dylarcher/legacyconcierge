#!/usr/bin/env python3
"""
Path Fix Script
Converts all relative paths to absolute paths for consistency
"""

import re
from pathlib import Path

def calculate_depth(file_path: Path, root: Path) -> int:
    """Calculate directory depth from root"""
    relative = file_path.relative_to(root)
    parts = list(relative.parent.parts)
    return len(parts)

def fix_paths_in_file(file_path: Path, root: Path) -> bool:
    """Fix all paths in a single HTML file"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        depth = calculate_depth(file_path, root)
        prefix = "../" * depth if depth > 0 else ""

        print(f"Processing {file_path.relative_to(root)} (depth: {depth})")

        # Fix CSS paths
        content = re.sub(
            r'href=["\'](\.\./)+styles/style\.css["\']',
            'href="/styles/style.css"',
            content
        )

        # Fix script paths for theme, app, i18n
        content = re.sub(
            r'src=["\'](\.\./)+scripts/(theme|app|i18n)\.js["\']',
            r'src="/scripts/\2.js"',
            content
        )

        # Fix broken link in partners page (contact.html -> /pages/contact/)
        if 'contact.html' in content and file_path.name == 'index.html':
            content = content.replace('href="contact.html"', 'href="/pages/contact/"')
            print("  ✓ Fixed contact.html link")

        if content != original_content:
            # Backup if not already done
            backup_path = file_path.with_suffix(file_path.suffix + '.pathbackup')
            if not backup_path.exists():
                backup_path.write_text(original_content, encoding='utf-8')

            file_path.write_text(content, encoding='utf-8')
            print("  ✓ Paths fixed")
            return True
        else:
            print("  ℹ No changes needed")
            return False

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Main execution"""
    root = Path(__file__).parent.parent

    # Get all HTML files
    html_files = [root / 'index.html']
    html_files.extend(sorted((root / 'pages').glob('**/index.html')))

    print("=" * 70)
    print("FIXING PATHS IN ALL PAGES")
    print("=" * 70)
    print()

    fixed_count = 0
    for file_path in html_files:
        if fix_paths_in_file(file_path, root):
            fixed_count += 1
        print()

    print("=" * 70)
    print(f"Summary: Fixed {fixed_count} out of {len(html_files)} files")
    print("=" * 70)

if __name__ == '__main__':
    main()
