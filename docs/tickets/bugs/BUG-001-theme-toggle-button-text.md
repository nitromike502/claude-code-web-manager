---
id: BUG-001
title: Theme toggle button text remains dark in dark mode
severity: high
category: ui/styling
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
In dark mode, the theme toggle button text remains dark-colored, making it difficult to read against the dark background. The text should be light-colored for proper contrast and readability.

## Acceptance Criteria
- [ ] Theme toggle button text is light-colored when in dark mode
- [ ] Theme toggle button text is dark-colored when in light mode
- [ ] Text contrast meets WCAG AA standards (minimum 4.5:1)
- [ ] Visual test confirms button readability in both themes
- [ ] No console errors or warnings

## Technical Details
**Component:** Header.vue or theme toggle component
**Files to Check:**
- `src/components/Header.vue`
- `src/styles/variables.css`
- `src/styles/components.css`

**Current Behavior:** Theme toggle button text color doesn't change with theme
**Expected Behavior:** Button text color adapts to current theme for readability

## Implementation Notes
- Use CSS variables for theme-aware colors
- Ensure proper contrast ratio calculation
- Test at different viewport sizes

## Testing Requirements
**Test File:** `tests/frontend/04-theme-toggle-contrast.spec.js`
**Test Cases:**
1. Theme toggle button text is visible in light mode
2. Theme toggle button text is visible in dark mode
3. Text contrast ratio meets WCAG AA standards

## Deployment Notes
No breaking changes expected. CSS-only modification.
