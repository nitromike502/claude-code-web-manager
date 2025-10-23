---
id: BUG-003
title: Remove navigation that shouldn't exist
severity: medium
category: ui/structure
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
There is navigation UI that should not be present in the application. This needs to be identified and removed.

## Acceptance Criteria
- [ ] Unnecessary navigation identified and removed from UI
- [ ] Application layout remains intact after removal
- [ ] No broken links or navigation issues
- [ ] Existing tests still pass
- [ ] Visual test confirms navigation removal
- [ ] No console errors or warnings

## Technical Details
**Component:** Unknown - requires investigation
**Files to Check:**
- `src/App.vue`
- `src/components/Header.vue`
- `src/components/Navigation.vue` (if exists)
- `src/router/index.js`

**Current Behavior:** Unwanted navigation UI is displayed
**Expected Behavior:** Navigation removed, clean layout

## Implementation Notes
- First, identify which navigation is unwanted
- Remove from template/component
- Check for any dependent functionality
- Update routing if needed

## Testing Requirements
**Test File:** `tests/frontend/04-navigation-removal.spec.js`
**Test Cases:**
1. Unwanted navigation is not displayed
2. Application layout is intact
3. Core navigation (dashboard, project links) still works
4. No broken links in remaining navigation

## Deployment Notes
Verify that removing this navigation doesn't break user workflows.
