#!/bin/bash

# Script to add lazy loading and async decoding to all images
# This improves page load performance by deferring offscreen images

echo "Adding lazy loading attributes to images..."

# Find all HTML files and add loading="lazy" and decoding="async" to img tags
find pages components index.html -name "*.html" -type f 2>/dev/null | while read -r file; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue

  # Check if file has img tags without loading attribute
  if grep -q '<img' "$file" && ! grep -q 'loading="lazy"' "$file"; then
    echo "Processing: $file"

    # Add loading="lazy" and decoding="async" to img tags that don't have them
    # This handles both single-line and multi-line img tags
    sed -i '' 's/<img\([^>]*\)>/<img\1 loading="lazy" decoding="async">/g' "$file"

    # Clean up duplicate attributes if they exist
    sed -i '' 's/loading="lazy"[[:space:]]*loading="lazy"/loading="lazy"/g' "$file"
    sed -i '' 's/decoding="async"[[:space:]]*decoding="async"/decoding="async"/g' "$file"

    # Remove trailing spaces before closing >
    sed -i '' 's/[[:space:]]*>/>/g' "$file"
  fi
done

echo ""
echo "Lazy loading attributes added successfully!"
echo ""
echo "Verifying changes..."
echo "Images with lazy loading: $(grep -r 'loading="lazy"' --include="*.html" pages/ components/ index.html 2>/dev/null | wc -l)"
echo "Total img tags: $(grep -r '<img' --include="*.html" pages/ components/ index.html 2>/dev/null | wc -l)"
