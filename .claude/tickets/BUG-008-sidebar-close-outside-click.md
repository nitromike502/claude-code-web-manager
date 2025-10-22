---
id: BUG-008
title: Sidebar should close when clicking outside
severity: medium
category: ui/behavior
status: open
created: 2025-10-21
---

## Problem Statement
The detail sidebar should close when the user clicks outside of it (on the main content area), providing a common UX pattern for dismissing side panels.

## Acceptance Criteria
- [ ] Sidebar closes when clicking outside sidebar area
- [ ] Sidebar remains open when clicking inside sidebar
- [ ] Close button still works as before
- [ ] Clicking outside doesn't trigger other actions
- [ ] Event propagation handled correctly
- [ ] Works on all screen sizes
- [ ] Visual test confirms outside-click behavior
- [ ] No console errors or warnings

## Technical Details
**Component:** DetailSidebar.vue, ProjectDetail.vue
**Files to Check:**
- `src/components/DetailSidebar.vue`
- `src/components/ProjectDetail.vue`
- Look for event handlers

**Current Behavior:** Sidebar doesn't close on outside click
**Expected Behavior:** Sidebar closes on outside click

## Implementation Notes
- Add click event listener to parent container
- Detect if click is outside sidebar element
- Trigger close action
- Use `event.target` and `contains()` to detect outside clicks
- Prevent event bubbling issues

## Testing Requirements
**Test File:** `tests/frontend/04-sidebar-outside-click-close.spec.js`
**Test Cases:**
1. Sidebar opens when clicking configuration item
2. Sidebar closes when clicking outside
3. Sidebar remains open when clicking inside sidebar
4. Close button still works
5. Content behind sidebar not clickable when sidebar open
6. Works on mobile viewport

## Deployment Notes
Important UX improvement, no breaking changes.
