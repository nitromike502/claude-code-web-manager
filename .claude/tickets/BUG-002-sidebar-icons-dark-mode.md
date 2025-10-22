---
id: BUG-002
title: Navigation and close icons in sidebar are black in dark mode
severity: high
category: ui/styling
status: open
created: 2025-10-21
---

## Problem Statement
In dark mode, the navigation arrows and close button (X) icons in the sidebar are black, making them invisible against the dark sidebar background. These icons should be light-colored in dark mode.

## Acceptance Criteria
- [ ] Close button icon is light-colored in dark mode
- [ ] Navigation icons are light-colored in dark mode
- [ ] Icons are dark-colored in light mode
- [ ] Icons have sufficient contrast with background (4.5:1 minimum)
- [ ] Visual test confirms icon visibility in both themes
- [ ] No console errors or warnings

## Technical Details
**Component:** DetailSidebar.vue
**Files to Check:**
- `src/components/DetailSidebar.vue`
- `src/styles/variables.css`
- `src/styles/components.css`

**Current Behavior:** Icons are black regardless of theme
**Expected Behavior:** Icons adapt color based on active theme

## Implementation Notes
- Identify all icons in sidebar (close, navigation, etc.)
- Update CSS to use theme-aware variables
- Verify SVG icons inherit color correctly
- Test with different icon types

## Testing Requirements
**Test File:** `tests/frontend/04-sidebar-icons-visibility.spec.js`
**Test Cases:**
1. Close button icon is visible in light mode
2. Close button icon is visible in dark mode
3. Navigation icons are visible in light mode
4. Navigation icons are visible in dark mode
5. Icon contrast meets WCAG standards

## Deployment Notes
CSS-only change, no breaking changes.
