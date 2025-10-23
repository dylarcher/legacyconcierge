#!/usr/bin/env bash
###############################################################################
# Path Fix Script
# Converts all relative paths to absolute paths for consistency
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

calculate_depth() {
    local file_path="$1"
    local relative_path="${file_path#$PROJECT_ROOT/}"
    local dir_path="$(dirname "$relative_path")"
    
    # Count directory levels (excluding filename)
    if [[ "$dir_path" == "." ]]; then
        echo 0
    else
        echo "$dir_path" | tr -cd '/' | wc -c
    fi
}

fix_paths_in_file() {
    local file_path="$1"
    local relative_path="${file_path#$PROJECT_ROOT/}"
    local depth=$(calculate_depth "$file_path")
    local changed=false
    
    echo -e "${BLUE}Processing${NC} $relative_path ${YELLOW}(depth: $depth)${NC}"
    
    # Create backup if it doesn't exist
    if [[ ! -f "${file_path}.pathbackup" ]]; then
        cp "$file_path" "${file_path}.pathbackup"
    fi
    
    # Create temp file for changes
    local temp_file=$(mktemp)
    cp "$file_path" "$temp_file"
    
    # Fix CSS paths: href="../*/theme/style.css" -> href="/theme/style.css"
    if sed -E 's|href="(\.\./)+theme/style\.css"|href="/theme/style.css"|g' "$temp_file" > "$temp_file.tmp"; then
        if ! diff -q "$temp_file" "$temp_file.tmp" > /dev/null 2>&1; then
            changed=true
        fi
        mv "$temp_file.tmp" "$temp_file"
    fi
    
    # Fix script paths for theme, app, i18n: src="../*/tools/*.js" -> src="/tools/*.js"
    if sed -E 's|src="(\.\./)+tools/(theme\|app\|i18n)\.js"|src="/tools/\2.js"|g' "$temp_file" > "$temp_file.tmp"; then
        if ! diff -q "$temp_file" "$temp_file.tmp" > /dev/null 2>&1; then
            changed=true
        fi
        mv "$temp_file.tmp" "$temp_file"
    fi
    
    # Fix broken link in pages: contact.html -> /pages/contact/
    if basename "$file_path" | grep -q "index.html" && grep -q 'contact.html' "$temp_file"; then
        if sed 's|href="contact\.html"|href="/pages/contact/"|g' "$temp_file" > "$temp_file.tmp"; then
            if ! diff -q "$temp_file" "$temp_file.tmp" > /dev/null 2>&1; then
                echo "  ${GREEN}✓${NC} Fixed contact.html link"
                changed=true
            fi
            mv "$temp_file.tmp" "$temp_file"
        fi
    fi
    
    # Check if any changes were made
    if [[ "$changed" == true ]]; then
        mv "$temp_file" "$file_path"
        echo "  ${GREEN}✓${NC} Paths fixed"
        return 0
    else
        rm "$temp_file"
        echo "  ${YELLOW}ℹ${NC} No changes needed"
        return 1
    fi
}

###############################################################################
# Main
###############################################################################

main() {
    echo "======================================================================"
    echo "FIXING PATHS IN ALL PAGES"
    echo "======================================================================"
    echo ""
    
    local fixed_count=0
    local total_count=0
    
    # Process index.html at root
    if [[ -f "$PROJECT_ROOT/index.html" ]]; then
        ((total_count++))
        if fix_paths_in_file "$PROJECT_ROOT/index.html"; then
            ((fixed_count++))
        fi
        echo ""
    fi
    
    # Process all index.html files in pages directory
    while IFS= read -r -d '' file; do
        ((total_count++))
        if fix_paths_in_file "$file"; then
            ((fixed_count++))
        fi
        echo ""
    done < <(find "$PROJECT_ROOT/pages" -name "index.html" -type f -print0 | sort -z)
    
    echo "======================================================================"
    echo "Summary: Fixed $fixed_count out of $total_count files"
    echo "======================================================================"
}

# Run main function
main "$@"
