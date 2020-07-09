#!/usr/bin/env bash
# Verification script to ensure no em dashes exist anywhere in the codebase.
# Scans source files, documentation, markdown files, and scripts.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Scanning repository for prohibited em dashes..."

PROHIBITED_FOUND=0

# Search for Unicode em dash (U+2014) across all tracked files
EM_DASH_HITS=$(git grep -I -n $'\u2014' || true)

if [ -n "$EM_DASH_HITS" ]; then
    echo "ERROR: Found Unicode em dash (U+2014):"
    echo "$EM_DASH_HITS"
    PROHIBITED_FOUND=1
fi

# Search for double-hyphen used as em dash in prose, excluding scripts directory
PROSE_DASH_HITS=$(git grep -I -n -E '[a-zA-Z0-9]--[a-zA-Z0-9]| -- ' -- ':!scripts/*' || true)

if [ -n "$PROSE_DASH_HITS" ]; then
    echo "ERROR: Found double-hyphen used as em dash in prose:"
    echo "$PROSE_DASH_HITS"
    PROHIBITED_FOUND=1
fi

if [ "$PROHIBITED_FOUND" -eq 1 ]; then
    echo "Verification failed: em dashes are prohibited."
    exit 1
else
    echo "Verification passed: zero em dashes found across all scanned files."
    exit 0
fi
