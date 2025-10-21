#!/usr/bin/env python3
"""
Component Integration Script
Automates the integration of Web Components into HTML pages
"""

import re
import sys
from pathlib import Path
from typing import Tuple

def calculate_depth(file_path: Path, root: Path) -> int:
    """Calculate directory depth from root"""
    relative = file_path.relative_to(root)
    # Don't count the filename itself
    parts = list(relative.parent.parts)
    return len(parts)

def get_relative_prefix(depth: int) -> str:
    """Get the ../ prefix for the given depth"""
    if depth == 0:
        return ""
    return "../" * depth

def backup_file(file_path: Path) -> None:
    """Create a backup of the file"""
    backup_path = file_path.with_suffix(file_path.suffix + '.backup')
    if not backup_path.exists():
        backup_path.write_text(file_path.read_text(encoding='utf-8'), encoding='utf-8')
        print(f"  ✓ Backup created: {backup_path.name}")

def replace_header(content: str) -> Tuple[str, bool]:
    """Replace header section with lc-header component"""
    # Pattern to match header opening through closing tag
    header_pattern = r'<header[^>]*>.*?</header>'

    if re.search(header_pattern, content, re.DOTALL):
        # Keep skip link, replace header
        new_content = re.sub(
            header_pattern,
            '<!-- Header Component -->\n        <lc-header></lc-header>',
            content,
            flags=re.DOTALL
        )
        return new_content, True
    return content, False

def replace_footer(content: str) -> Tuple[str, bool]:
    """Replace footer section with lc-footer component"""
    footer_pattern = r'<footer[^>]*>.*?</footer>'

    if re.search(footer_pattern, content, re.DOTALL):
        new_content = re.sub(
            footer_pattern,
            '<!-- Footer Component -->\n        <lc-footer></lc-footer>',
            content,
            flags=re.DOTALL
        )
        return new_content, True
    return content, False

def add_component_scripts(content: str, depth: int) -> Tuple[str, bool]:
    """Add component loading scripts before </body>"""
    # Check if scripts already added
    if 'Component System' in content or 'lc-header.js' in content:
        return content, False

    # Component loading script
    component_script = '''
        <!-- Component System -->
        <script type="module">
            import { loadTemplates } from '/scripts/core/component-loader.js';

            // Load templates and initialize components
            (async () => {
                try {
                    // Load all required templates first
                    await loadTemplates(['navigation', 'cards']);
                    console.log('✓ Component templates loaded successfully');

                    // Import component scripts
                    await Promise.all([
                        import('/components/scripts/lc-header.js'),
                        import('/components/scripts/lc-footer.js'),
                        import('/components/scripts/lc-card.js')
                    ]);
                    console.log('✓ Component scripts loaded successfully');

                    // Wait a tick for components to render
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Re-apply i18n translations to components
                    if (window.applyTranslations) {
                        await window.applyTranslations();
                        console.log('✓ i18n translations applied to components');
                    }

                    // Setup language toggle (now that component has rendered)
                    const languageToggle = document.querySelector('.language-toggle');
                    if (languageToggle && window.switchLanguage) {
                        languageToggle.addEventListener('click', () => {
                            const currentLang = document.documentElement.lang;
                            const newLang = currentLang === 'en' ? 'es' : 'en';
                            window.switchLanguage(newLang);
                        });
                        console.log('✓ Language toggle initialized');
                    }
                } catch (error) {
                    console.error('Failed to initialize components:', error);
                }
            })();
        </script>'''

    # Insert before </body>
    new_content = content.replace('</body>', f'{component_script}\n    </body>')
    return new_content, True

def integrate_components(file_path: Path, root: Path, dry_run: bool = False) -> bool:
    """Integrate components into a single HTML file"""
    print(f"\nProcessing: {file_path.relative_to(root)}")

    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        changes_made = False

        # Calculate depth for relative paths
        depth = calculate_depth(file_path, root)
        print(f"  Depth: {depth}")

        # 1. Replace header
        content, header_replaced = replace_header(content)
        if header_replaced:
            print("  ✓ Header replaced with <lc-header>")
            changes_made = True
        else:
            print("  ⚠ No header found or already replaced")

        # 2. Replace footer
        content, footer_replaced = replace_footer(content)
        if footer_replaced:
            print("  ✓ Footer replaced with <lc-footer>")
            changes_made = True
        else:
            print("  ⚠ No footer found or already replaced")

        # 3. Add component scripts
        content, scripts_added = add_component_scripts(content, depth)
        if scripts_added:
            print("  ✓ Component loading scripts added")
            changes_made = True
        else:
            print("  ⚠ Scripts already present or not added")

        if changes_made and not dry_run:
            # Create backup
            backup_file(file_path)

            # Write modified content
            file_path.write_text(content, encoding='utf-8')
            print(f"  ✅ File updated successfully")
            return True
        elif changes_made and dry_run:
            print(f"  [DRY RUN] Would update file")
            return True
        else:
            print(f"  ℹ No changes needed")
            return False

    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Main execution"""
    root = Path(__file__).parent.parent  # Project root

    # Get all HTML files in pages directory
    pages_dir = root / 'pages'
    html_files = sorted(pages_dir.glob('**/index.html'))

    print(f"Found {len(html_files)} HTML files to process\n")
    print("=" * 60)

    # Process each file
    success_count = 0
    for file_path in html_files:
        if integrate_components(file_path, root, dry_run=False):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"\n✅ Integration complete!")
    print(f"   Processed: {len(html_files)} files")
    print(f"   Updated: {success_count} files")
    print(f"   Skipped: {len(html_files) - success_count} files")

if __name__ == '__main__':
    main()
