#!/bin/bash

# Documentation Cleanup Script
# Purpose: Archive obsolete E2E analysis and duplicate documentation files
# Date: 2025-10-20
# Reference: docs/DOCUMENTATION-AUDIT-2025-10-20.md

set -e  # Exit on error

echo "========================================="
echo "Documentation Cleanup Script"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Project root: $PROJECT_ROOT"
echo ""

# Create archive directories
echo "${YELLOW}Creating archive directories...${NC}"
mkdir -p "$PROJECT_ROOT/docs/testing/archive/e2e-analysis-2025-10-19"
mkdir -p "$PROJECT_ROOT/docs/archive/documentation-reviews"
echo "${GREEN}✓ Archive directories created${NC}"
echo ""

# Archive E2E analysis documents (10 files + 2 manifests)
echo "${YELLOW}Archiving E2E analysis documents...${NC}"

E2E_FILES=(
  "E2E_DOCUMENTATION_INDEX.md"
  "E2E_EXECUTION_PLAN.md"
  "E2E_FIXES_IMPLEMENTATION_GUIDE.md"
  "E2E_SESSION_COMPLETE.md"
  "E2E_TEST_ANALYSIS.md"
  "E2E_TEST_FIXES_REPORT.md"
  "E2E_TEST_FIX_COMPLETION_STATUS.md"
  "E2E_TEST_FIX_SESSION_SUMMARY.md"
  "E2E_TEST_RECOMMENDATIONS_SUMMARY.md"
  "START_HERE_E2E_EXECUTION.md"
  "E2E_DOCUMENTS_MANIFEST.txt"
)

# Check if E2E_ANALYSIS_FINAL_SUMMARY.txt exists
if [ -f "$PROJECT_ROOT/E2E_ANALYSIS_FINAL_SUMMARY.txt" ]; then
  E2E_FILES+=("E2E_ANALYSIS_FINAL_SUMMARY.txt")
fi

for file in "${E2E_FILES[@]}"; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    mv "$PROJECT_ROOT/$file" "$PROJECT_ROOT/docs/testing/archive/e2e-analysis-2025-10-19/"
    echo "  ✓ Archived: $file"
  else
    echo "  ⚠ Not found: $file (skipping)"
  fi
done

echo "${GREEN}✓ E2E analysis documents archived${NC}"
echo ""

# Archive older documentation reviews
echo "${YELLOW}Archiving older documentation reviews...${NC}"

DOC_REVIEW_FILES=(
  "docs/DOCUMENTATION-REVIEW.md"
  "docs/DOCUMENTATION-UPDATE-2025-10-11.md"
  "docs/DOCUMENTATION-AUDIT-2025-10-17.md"
)

for file in "${DOC_REVIEW_FILES[@]}"; do
  if [ -f "$PROJECT_ROOT/$file" ]; then
    mv "$PROJECT_ROOT/$file" "$PROJECT_ROOT/docs/archive/documentation-reviews/"
    echo "  ✓ Archived: $file"
  else
    echo "  ⚠ Not found: $file (skipping)"
  fi
done

echo "${GREEN}✓ Documentation reviews archived${NC}"
echo ""

# Create README in archive directories
echo "${YELLOW}Creating archive README files...${NC}"

cat > "$PROJECT_ROOT/docs/testing/archive/e2e-analysis-2025-10-19/README.md" << 'EOF'
# E2E Test Analysis Archive - October 19, 2025

This directory contains the E2E test analysis and planning documents created during the Phase 2 E2E test fix session.

## Purpose

These documents were created to analyze failing E2E tests and plan the implementation of fixes. All recommendations have been successfully implemented and all E2E tests (Tests 100, 101, 102, 105) are now passing.

## Status: ✅ COMPLETE

All analysis and recommendations in these documents have been implemented:
- Test 100: 24/24 passing ✅
- Test 101: 18/18 passing ✅
- Test 102: 27/27 passing ✅
- Test 105: 21/21 passing ✅

## Documents Included

### Planning Documents
1. `START_HERE_E2E_EXECUTION.md` - Quick start guide
2. `E2E_EXECUTION_PLAN.md` - Step-by-step implementation roadmap
3. `E2E_FIXES_IMPLEMENTATION_GUIDE.md` - Technical reference with code examples

### Analysis Documents
4. `E2E_TEST_ANALYSIS.md` - Detailed professional analysis
5. `E2E_TEST_RECOMMENDATIONS_SUMMARY.md` - Quick reference tables
6. `E2E_ANALYSIS_FINAL_SUMMARY.txt` - Executive summary

### Status Documents
7. `E2E_SESSION_COMPLETE.md` - Session completion summary
8. `E2E_TEST_FIXES_REPORT.md` - Initial findings report
9. `E2E_TEST_FIX_COMPLETION_STATUS.md` - Completion status tracking
10. `E2E_TEST_FIX_SESSION_SUMMARY.md` - Session summary

### Navigation
11. `E2E_DOCUMENTATION_INDEX.md` - Index of all E2E documents
12. `E2E_DOCUMENTS_MANIFEST.txt` - File manifest and reading guide

## Archived Date

October 20, 2025

## Reason for Archival

These documents served their purpose during the E2E test analysis and fix implementation phase. All tests are now passing and the analysis is complete. They are archived for historical reference and to document the decision-making process.

## Current Documentation

For current E2E test documentation, see:
- `/home/claude/manager/docs/testing/TESTING-README.md`
- `/home/claude/manager/docs/FRONTEND_TEST_INFRASTRUCTURE.md`
- Test files in `/home/claude/manager/tests/e2e/`
EOF

cat > "$PROJECT_ROOT/docs/archive/documentation-reviews/README.md" << 'EOF'
# Documentation Reviews Archive

This directory contains historical documentation review and update reports.

## Purpose

These documents track the evolution of project documentation through various review and update sessions.

## Status

Archived - superseded by more recent documentation audits and updates.

## Current Documentation

For the most recent documentation audit, see:
- `/home/claude/manager/docs/DOCUMENTATION-AUDIT-2025-10-20.md`

## Documents Included

1. `DOCUMENTATION-REVIEW.md` - Earlier comprehensive review
2. `DOCUMENTATION-UPDATE-2025-10-11.md` - October 11 update session
3. `DOCUMENTATION-AUDIT-2025-10-17.md` - October 17 audit

## Archived Date

October 20, 2025

## Reason for Archival

These documents are historical records of documentation review sessions. They are preserved for reference but superseded by more recent audits.
EOF

echo "${GREEN}✓ Archive README files created${NC}"
echo ""

# Summary
echo "========================================="
echo "Cleanup Complete!"
echo "========================================="
echo ""
echo "Files archived:"
echo "  - ${#E2E_FILES[@]} E2E analysis documents → docs/testing/archive/e2e-analysis-2025-10-19/"
echo "  - ${#DOC_REVIEW_FILES[@]} documentation reviews → docs/archive/documentation-reviews/"
echo ""
echo "Archive locations:"
echo "  - $PROJECT_ROOT/docs/testing/archive/e2e-analysis-2025-10-19/"
echo "  - $PROJECT_ROOT/docs/archive/documentation-reviews/"
echo ""
echo "${GREEN}All obsolete documentation has been archived.${NC}"
echo ""
echo "Note: Archived files are still in git history if needed."
echo "To commit these changes:"
echo "  git add -A"
echo "  git commit -m 'docs: archive obsolete E2E analysis and review documents'"
echo ""
