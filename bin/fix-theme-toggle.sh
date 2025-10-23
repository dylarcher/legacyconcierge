#!/usr/bin/env bash
###############################################################################
# Fix Theme Toggle in All Pages
# Adds theme toggle setup to component loading script
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

###############################################################################
# Functions
###############################################################################

fix_theme_toggle() {
    local file_path="$1"
    local relative_path="${file_path#$PROJECT_ROOT/}"
    
    # Create backup if it doesn't exist
    if [[ ! -f "${file_path}.themebackup" ]]; then
        cp "$file_path" "${file_path}.themebackup"
    fi
    
    # Check if file has the old pattern (without theme toggle setup)
    # Old pattern: "applyTranslations..." followed immediately by "Setup language toggle"
    # New pattern: Add theme toggle setup between them
    
    if grep -q "// Re-apply i18n translations to components" "$file_path" && \
       grep -q "// Setup language toggle" "$file_path" && \
       ! grep -q "// Setup theme toggle" "$file_path"; then
        
        # Create temp file
        local temp_file=$(mktemp)
        
        # Use awk to insert the theme toggle block
        awk '
        /\/\/ Re-apply i18n translations to components/ {
            # Print current line
            print
            # Set flag to look for the closing brace
            in_apply_translations = 1
            next
        }
        in_apply_translations && /}/ {
            # Print the closing brace
            print
            # Check if next section is language toggle
            getline next_line
            if (next_line ~ /\/\/ Setup language toggle/) {
                # Insert theme toggle block before language toggle
                print ""
                print "                    // Setup theme toggle (now that component has rendered)"
                print "                    if (window.setupThemeToggle) {"
                print "                        window.setupThemeToggle();"
                print "                    }"
                print ""
            }
            # Print the language toggle line
            print next_line
            in_apply_translations = 0
            next
        }
        { print }
        ' "$file_path" > "$temp_file"
        
        # Check if changes were made
        if ! diff -q "$file_path" "$temp_file" > /dev/null 2>&1; then
            mv "$temp_file" "$file_path"
            echo "  ${GREEN}✓${NC} Fixed theme toggle in $relative_path"
            return 0
        else
            rm "$temp_file"
            echo "  ${YELLOW}ℹ${NC} No changes needed in $relative_path"
            return 1
        fi
    else
        echo "  ${YELLOW}ℹ${NC} No changes needed in $relative_path"
        return 1
    fi
}

###############################################################################
# Main
###############################################################################

main() {
    echo "======================================================================"
    echo "FIXING THEME TOGGLE IN ALL PAGES"
    echo "======================================================================"
    echo ""
    
    local fixed_count=0
    local total_count=0
    
    # Process all index.html files in pages directory
    while IFS= read -r -d '' file; do
        ((total_count++))
        if fix_theme_toggle "$file"; then
            ((fixed_count++))
        fi
    done < <(find "$PROJECT_ROOT/pages" -name "index.html" -type f -print0 | sort -z)
    
    echo ""
    echo "======================================================================"
    echo "Summary: Fixed $fixed_count out of $total_count files"
    echo "======================================================================"
}

# Run main function
main "$@"
