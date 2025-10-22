---
id: BUG-004
title: Add breadcrumbs below the header
severity: medium
category: ui/navigation
status: open
created: 2025-10-21
---

## Problem Statement
Breadcrumb navigation should be displayed below the header to help users understand their current location in the application hierarchy.

## Acceptance Criteria
- [ ] Breadcrumbs displayed below header
- [ ] Breadcrumbs show current navigation path (e.g., Home > Project > Agent)
- [ ] Breadcrumbs are clickable and functional
- [ ] Breadcrumbs update correctly when navigating
- [ ] Breadcrumbs responsive on all screen sizes
- [ ] Visual test confirms breadcrumb display
- [ ] No console errors or warnings

## Technical Details
**Component:** Header.vue or new Breadcrumb.vue component
**Files to Check:**
- `src/components/Header.vue`
- `src/router/index.js`
- `src/stores/` (for current page state)

**Routes to Show in Breadcrumbs:**
- Dashboard: "Dashboard"
- Project Detail: "Dashboard > [Project Name]"
- User Config: "User Configuration"

**Current Behavior:** No breadcrumbs present
**Expected Behavior:** Breadcrumbs displayed showing current location

## Implementation Notes
- Use Vue Router to get current route
- Dynamically generate breadcrumb path
- Style breadcrumbs to match header
- Consider using a Breadcrumb component for reusability

## Testing Requirements
**Test File:** `tests/frontend/04-breadcrumbs.spec.js`
**Test Cases:**
1. Breadcrumbs displayed on dashboard
2. Breadcrumbs displayed on project detail page
3. Breadcrumbs shown for user configuration page
4. Breadcrumbs are clickable and navigate correctly
5. Breadcrumbs update on navigation
6. Breadcrumbs responsive on mobile

## Deployment Notes
Ensure breadcrumb links don't conflict with existing navigation.
