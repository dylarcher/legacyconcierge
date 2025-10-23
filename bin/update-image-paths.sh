#!/bin/bash

# Script to update old image paths to new ones in HTML files
# This fixes the GitHub Pages broken image issue

echo "Updating image paths in HTML files..."

# Treatment pages
find pages/treatments/views -name "index.html" -exec sed -i '' \
  -e 's|assets/media/misc/stock-cardiac-pulmonary\.jpg|assets/media/stock/child-holding-child-hand.jpg|g' \
  -e 's|assets/media/misc/stock-eating-disorders\.jpg|assets/media/stock/pomegranate-and-oranges.jpg|g' \
  -e 's|assets/media/misc/stock-iv-therapy\.jpg|assets/media/stock/nurse-preparing-medication.jpg|g' \
  -e 's|assets/media/misc/stock-mental-health\.jpg|assets/media/stock/pouring-water-over-hot-coals.jpg|g' \
  -e 's|assets/media/misc/stock-pain-management\.jpg|assets/media/stock/scattered-vitamin-pill-capsules.jpg|g' \
  -e 's|assets/media/misc/stock-post-op-recovery\.jpg|assets/media/stock/bedroom-potted-plants-in-corner.jpg|g' \
  -e 's|assets/media/misc/stock-rehab-addiction\.jpg|assets/media/stock/rehab-stretch-yoga-session.jpg|g' \
  {} \;

# Expertise pages
find pages/expertise/views -name "index.html" -exec sed -i '' \
  -e 's|assets/media/misc/stock-als\.jpg|assets/media/stock/doctor-patient-session.jpg|g' \
  -e 's|assets/media/misc/stock-alzheimers\.jpg|assets/media/stock/chair-located-in-room-corner.jpg|g' \
  -e 's|assets/media/misc/stock-dementia\.jpg|assets/media/stock/water-filled-orb-on-beach.jpg|g' \
  -e 's|assets/media/misc/stock-diabetes\.jpg|assets/media/stock/chair-with-books-and-vase.jpg|g' \
  -e 's|assets/media/misc/stock-heart-disease\.jpg|assets/media/stock/close-in-photo-of-microscope.jpg|g' \
  -e 's|assets/media/misc/stock-ms\.jpg|assets/media/stock/elder-shoulder-massage.jpg|g' \
  -e 's|assets/media/misc/stock-oncology\.jpg|assets/media/stock/vase-shadow-silhouette-wall.jpg|g' \
  -e 's|assets/media/misc/stock-ostomy\.jpg|assets/media/stock/pregnant-while-drinking-beverage.jpg|g' \
  -e 's|assets/media/misc/stock-parkinsons\.jpg|assets/media/stock/tulip-flowers-in-clear-vase.jpg|g' \
  -e 's|assets/media/misc/stock-stroke\.jpg|assets/media/stock/brain-mri-cat-scan-results.jpg|g' \
  -e 's|assets/media/misc/stock-tbi\.jpg|assets/media/stock/two-bones-connecting-joint.jpg|g' \
  {} \;

# Blog posts
find pages/blog/posts -name "index.html" -exec sed -i '' \
  -e 's|assets/media/misc/stock-post-op-recovery\.jpg|assets/media/stock/bedroom-potted-plants-in-corner.jpg|g' \
  {} \;

echo "✓ Image paths updated successfully!"
