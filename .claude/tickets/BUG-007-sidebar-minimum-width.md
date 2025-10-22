---
id: BUG-007
title: Sidebar should be minimum 75% window width
severity: medium
category: ui/layout
status: open
created: 2025-10-21
---

## Problem Statement
The detail sidebar is too narrow. It should occupy at least 75% of the viewport width to provide adequate space for displaying configuration details.

## Acceptance Criteria
- [ ] Sidebar minimum width is 75% of viewport
- [ ] Sidebar width works at all breakpoints
- [ ] Sidebar can still be closed without breaking layout
- [ ] Content inside sidebar is readable
- [ ] No horizontal scrolling inside sidebar
- [ ] Layout responsive on mobile/tablet/desktop
- [ ] Visual test confirms width
- [ ] No console errors or warnings

## Technical Details
**Component:** DetailSidebar.vue
**Files to Check:**
- `src/components/DetailSidebar.vue`
- `src/styles/variables.css`
- `src/styles/components.css`

**Current Behavior:** Sidebar is narrow (less than 75% width)
**Expected Behavior:** Sidebar minimum 75vw width

## Implementation Notes
- Update CSS: `min-width: 75vw` or similar
- Test at different viewport sizes
- Ensure content has proper padding
- Handle edge cases on very small screens

## Testing Requirements
**Test File:** `tests/frontend/04-sidebar-width.spec.js`
**Test Cases:**
1. Sidebar width is at least 75% on desktop
2. Sidebar width is at least 75% on tablet
3. Sidebar responsive on small screens
4. Sidebar content readable at all widths
5. Sidebar open/close works properly

## Deployment Notes
CSS-only change, minimal risk.
