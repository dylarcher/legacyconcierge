#!/usr/bin/env python3
"""
Fix Theme Toggle in All Pages
Adds theme toggle setup to component loading script
"""

import re
from pathlib import Path

def fix_theme_toggle(file_path: Path) -> bool:
    """Fix theme toggle in a single file"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        # Check if file has the old pattern (without theme toggle setup)
        old_pattern = re.compile(
            r'(// Re-apply i18n translations to components\s+if \(window\.applyTranslations\) \{.*?\}\s+)\n\s+// Setup language toggle',
            re.DOTALL
        )

        # New pattern with theme toggle
        new_text = r'''\1
                    // Setup theme toggle (now that component has rendered)
                    if (window.setupThemeToggle) {
                        window.setupThemeToggle();
                    }

                    // Setup language toggle'''

        # Replace the pattern
        content = old_pattern.sub(new_text, content)

        if content != original_content:
            # Backup
            backup_path = file_path.with_suffix(file_path.suffix + '.themebackup')
            if not backup_path.exists():
                backup_path.write_text(original_content, encoding='utf-8')

            file_path.write_text(content, encoding='utf-8')
            print(f"  ✓ Fixed theme toggle in {file_path.relative_to(file_path.parent.parent.parent)}")
            return True
        else:
            print(f"  ℹ No changes needed in {file_path.relative_to(file_path.parent.parent.parent)}")
            return False

    except Exception as e:
        print(f"  ❌ Error in {file_path}: {e}")
        return False

def main():
    """Main execution"""
    root = Path(__file__).parent.parent

    # Get all HTML files
    html_files = sorted((root / 'pages').glob('**/index.html'))

    print("=" * 70)
    print("FIXING THEME TOGGLE IN ALL PAGES")
    print("=" * 70)
    print()

    fixed_count = 0
    for file_path in html_files:
        if fix_theme_toggle(file_path):
            fixed_count += 1

    print()
    print("=" * 70)
    print(f"Summary: Fixed {fixed_count} out of {len(html_files)} files")
    print("=" * 70)

if __name__ == '__main__':
    main()
