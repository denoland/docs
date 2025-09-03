#!/bin/bash

# Install pre-commit hook for link checking
# This script copies the pre-commit hook and makes it executable

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_SOURCE="$SCRIPT_DIR/pre-commit"
HOOK_DEST="$REPO_ROOT/.git/hooks/pre-commit"

echo "🚀 Installing pre-commit hook for link checking..."

if [ ! -f "$HOOK_SOURCE" ]; then
    echo "❌ Pre-commit hook source not found at $HOOK_SOURCE"
    exit 1
fi

if [ ! -d "$REPO_ROOT/.git/hooks" ]; then
    echo "❌ Git hooks directory not found. Are you in a git repository?"
    exit 1
fi

# Backup existing pre-commit hook if it exists
if [ -f "$HOOK_DEST" ]; then
    echo "📁 Backing up existing pre-commit hook..."
    cp "$HOOK_DEST" "$HOOK_DEST.backup.$(date +%s)"
fi

# Copy and make executable
cp "$HOOK_SOURCE" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "✅ Pre-commit hook installed successfully!"
echo "   The hook will check links whenever you commit markdown files."
echo "   To disable temporarily, use: git commit --no-verify"
echo "   To uninstall, delete: $HOOK_DEST"
