#!/bin/bash
# Build script for Unit Testing Skill
# This script packages the skill into a .skill file (ZIP)

set -e

echo "🏗️  Building Unit Testing Skill..."

# Change to unit-testing directory
cd unit-testing

# Clean old build if exists
echo "📦 Creating skill package..."

# Create the .skill file (ZIP of unit-testing directory)
zip -r ../unit-testing.skill . \
  -x "*.DS_Store" \
  -x "**/__pycache__/*" \
  -x "**/.pytest_cache/*"

cd ..

echo "✅ Build complete: unit-testing.skill"
echo "📊 Package size: $(du -h unit-testing.skill | cut -f1)"
echo ""
echo "To install: cp unit-testing.skill ~/.claude/skills/"
