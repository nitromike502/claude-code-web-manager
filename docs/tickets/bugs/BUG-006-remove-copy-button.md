---
id: BUG-006
title: Remove Copy button in sidebar
severity: low
category: ui/refinement
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
The "Copy" button in the sidebar detail view is unnecessary and should be removed.

## Acceptance Criteria
- [ ] Copy button removed from sidebar
- [ ] Sidebar layout remains intact
- [ ] No broken functionality
- [ ] Other sidebar buttons/actions still work
- [ ] Visual test confirms button removal
- [ ] No console errors or warnings

## Technical Details
**Component:** DetailSidebar.vue
**Files to Check:**
- `src/components/DetailSidebar.vue`
- Look for copy button action handler

**Current Behavior:** Copy button displayed in sidebar
**Expected Behavior:** Copy button not displayed

## Implementation Notes
- Find copy button in template
- Remove from DOM
- Remove any associated event handlers
- Remove any CSS styling specific to copy button

## Testing Requirements
**Test File:** `tests/frontend/04-sidebar-copy-button-removal.spec.js`
**Test Cases:**
1. Copy button is not visible in sidebar
2. Other sidebar buttons still present and functional
3. Sidebar layout unchanged

## Deployment Notes
Simple removal, no breaking changes.
