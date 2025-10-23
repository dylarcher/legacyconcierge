#!/usr/bin/env bash
###############################################################################
# Component Integration Script
# Automates the integration of Web Components into HTML pages
###############################################################################

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Dry run mode
DRY_RUN=false

###############################################################################
# Functions
###############################################################################

backup_file() {
    local file_path="$1"
    local backup_path="${file_path}.backup"
    
    if [[ ! -f "$backup_path" ]]; then
        cp "$file_path" "$backup_path"
        echo "  ${GREEN}✓${NC} Backup created: $(basename "$backup_path")"
    fi
}

replace_header() {
    local file_path="$1"
    local temp_file=$(mktemp)
    
    # Replace <header>...</header> with component
    # Use perl for multi-line regex
    perl -0777 -pe 's|<header[^>]*>.*?</header>|<!-- Header Component -->\n        <lc-header></lc-header>|gs' \
        "$file_path" > "$temp_file"
    
    if ! diff -q "$file_path" "$temp_file" > /dev/null 2>&1; then
        mv "$temp_file" "$file_path"
        return 0  # Changed
    else
        rm "$temp_file"
        return 1  # No change
    fi
}

replace_footer() {
    local file_path="$1"
    local temp_file=$(mktemp)
    
    # Replace <footer>...</footer> with component
    perl -0777 -pe 's|<footer[^>]*>.*?</footer>|<!-- Footer Component -->\n        <lc-footer></lc-footer>|gs' \
        "$file_path" > "$temp_file"
    
    if ! diff -q "$file_path" "$temp_file" > /dev/null 2>&1; then
        mv "$temp_file" "$file_path"
        return 0  # Changed
    else
        rm "$temp_file"
        return 1  # No change
    fi
}

add_component_scripts() {
    local file_path="$1"
    
    # Check if scripts already added
    if grep -q "Component System" "$file_path" || grep -q "lc-header.js" "$file_path"; then
        return 1  # Already exists
    fi
    
    # Create the component script block
    local component_script='
        <!-- Component System -->
        <script type="module">
            import { loadTemplates } from '"'"'/tools/core/component-loader.js'"'"';

            // Load templates and initialize components
            (async () => {
                try {
                    // Load all required templates first
                    await loadTemplates(['"'"'navigation'"'"', '"'"'cards'"'"']);
                    console.log('"'"'✓ Component templates loaded successfully'"'"');

                    // Import component scripts
                    await Promise.all([
                        import('"'"'/components/tools/lc-header.js'"'"'),
                        import('"'"'/components/tools/lc-footer.js'"'"'),
                        import('"'"'/components/tools/lc-card.js'"'"')
                    ]);
                    console.log('"'"'✓ Component scripts loaded successfully'"'"');

                    // Wait a tick for components to render
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Re-apply i18n translations to components
                    if (window.applyTranslations) {
                        await window.applyTranslations();
                        console.log('"'"'✓ i18n translations applied to components'"'"');
                    }

                    // Setup language toggle (now that component has rendered)
                    const languageToggle = document.querySelector('"'"'.language-toggle'"'"');
                    if (languageToggle && window.switchLanguage) {
                        languageToggle.addEventListener('"'"'click'"'"', () => {
                            const currentLang = document.documentElement.lang;
                            const newLang = currentLang === '"'"'en'"'"' ? '"'"'es'"'"' : '"'"'en'"'"';
                            window.switchLanguage(newLang);
                        });
                        console.log('"'"'✓ Language toggle initialized'"'"');
                    }
                } catch (error) {
                    console.error('"'"'Failed to initialize components:'"'"', error);
                }
            })();
        </script>'
    
    # Insert before </body>
    local temp_file=$(mktemp)
    sed "s|</body>|${component_script}\n    </body>|" "$file_path" > "$temp_file"
    
    if ! diff -q "$file_path" "$temp_file" > /dev/null 2>&1; then
        mv "$temp_file" "$file_path"
        return 0  # Changed
    else
        rm "$temp_file"
        return 1  # No change
    fi
}

integrate_components() {
    local file_path="$1"
    local relative_path="${file_path#$PROJECT_ROOT/}"
    local changes_made=false
    
    echo ""
    echo -e "${BLUE}Processing:${NC} $relative_path"
    
    # Calculate depth
    local dir_path="$(dirname "$relative_path")"
    local depth=0
    if [[ "$dir_path" != "." ]]; then
        depth=$(echo "$dir_path" | tr -cd '/' | wc -c)
    fi
    echo "  Depth: $depth"
    
    # Create a working copy for dry run
    local work_file="$file_path"
    if [[ "$DRY_RUN" == true ]]; then
        work_file=$(mktemp)
        cp "$file_path" "$work_file"
    fi
    
    # 1. Replace header
    if replace_header "$work_file"; then
        echo "  ${GREEN}✓${NC} Header replaced with <lc-header>"
        changes_made=true
    else
        echo "  ${YELLOW}⚠${NC} No header found or already replaced"
    fi
    
    # 2. Replace footer
    if replace_footer "$work_file"; then
        echo "  ${GREEN}✓${NC} Footer replaced with <lc-footer>"
        changes_made=true
    else
        echo "  ${YELLOW}⚠${NC} No footer found or already replaced"
    fi
    
    # 3. Add component scripts
    if add_component_scripts "$work_file"; then
        echo "  ${GREEN}✓${NC} Component loading scripts added"
        changes_made=true
    else
        echo "  ${YELLOW}⚠${NC} Scripts already present or not added"
    fi
    
    if [[ "$changes_made" == true ]]; then
        if [[ "$DRY_RUN" == true ]]; then
            echo "  ${YELLOW}[DRY RUN]${NC} Would update file"
            rm "$work_file"
        else
            backup_file "$file_path"
            echo "  ${GREEN}✅ File updated successfully${NC}"
        fi
        return 0
    else
        if [[ "$DRY_RUN" == true ]]; then
            rm "$work_file"
        fi
        echo "  ${YELLOW}ℹ${NC} No changes needed"
        return 1
    fi
}

###############################################################################
# Main
###############################################################################

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                echo "Usage: $0 [--dry-run]"
                exit 1
                ;;
        esac
    done
    
    # Find all HTML files in pages directory
    local -a html_files
    mapfile -t html_files < <(find "$PROJECT_ROOT/pages" -name "index.html" -type f | sort)
    
    echo "Found ${#html_files[@]} HTML files to process"
    echo "============================================================"
    
    local success_count=0
    for file_path in "${html_files[@]}"; do
        if integrate_components "$file_path"; then
            ((success_count++))
        fi
    done
    
    echo ""
    echo "============================================================"
    echo ""
    echo "${GREEN}✅ Integration complete!${NC}"
    echo "   Processed: ${#html_files[@]} files"
    echo "   Updated: $success_count files"
    echo "   Skipped: $((${#html_files[@]} - success_count)) files"
}

# Run main function
main "$@"
