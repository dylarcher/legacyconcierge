#!/bin/bash
# Migrate critical images from Git LFS to regular git storage for GitHub Pages compatibility

set -e

echo "Migrating critical images from Git LFS to regular git..."

# List of critical image paths that GitHub Pages needs to serve
CRITICAL_IMAGES=(
  "shared/assets/media/images/hero/img-shorebreak-1920x1080.jpg"
  "shared/assets/media/images/hero/img-shorebreak-1280x720.jpg"
  "shared/assets/media/images/hero/img-shorebreak-1080x1920.jpg"
)

# Remove from LFS tracking
for img in "${CRITICAL_IMAGES[@]}"; do
  if [ -f "$img" ]; then
    echo "  Untracking $img from LFS..."
    git lfs untrack "$img"
  fi
done

# Update .gitattributes to exclude these specific paths from LFS
echo ""
echo "Updating .gitattributes..."
cat >> .gitattributes << 'EOF'

# Exclude critical GitHub Pages images from LFS (Pages doesn't support LFS)
shared/assets/media/images/hero/*.jpg !filter !diff !merge text=auto
EOF

echo ""
echo "Re-adding files to git as regular files..."
for img in "${CRITICAL_IMAGES[@]}"; do
  if [ -f "$img" ]; then
    echo "  Adding $img..."
    git add "$img"
  fi
done

# Add updated .gitattributes
git add .gitattributes

echo ""
echo "✓ Migration complete!"
echo ""
echo "Next steps:"
echo "  1. Commit these changes:"
echo "     git commit -m 'fix: migrate critical images from LFS for GitHub Pages compatibility'"
echo "  2. Push to remote:"
echo "     git push"
echo ""
echo "Note: Video files will remain in LFS as they're larger and less critical for initial page load."
