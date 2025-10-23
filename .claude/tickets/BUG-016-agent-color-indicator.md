---
id: BUG-016
title: Defined color for agents not shown in sidebar
severity: medium
category: data-display
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
Agent definitions can specify a color/accent color in their configuration, but this defined color is not being displayed as an indicator in the sidebar when viewing agent details.

## Acceptance Criteria
- [ ] Agent color indicator displays in sidebar
- [ ] Color indicator matches agent configuration
- [ ] Color indicator visible in agent list
- [ ] Color indicator consistent with design system
- [ ] Works for agents with color defined
- [ ] Gracefully handles agents without color
- [ ] Visual test confirms display
- [ ] No console errors or warnings

## Technical Details
**Backend:** src/backend/parsers/agents-parser.js
**Frontend:** src/components/DetailSidebar.vue, AgentCard.vue
**Files to Check:**
- `src/backend/parsers/agents-parser.js` (extract color from YAML)
- `src/components/cards/AgentCard.vue` (display color)
- `src/components/DetailSidebar.vue` (sidebar display)
- Agent markdown files (check frontmatter for color field)

**Data Source:** Agent frontmatter field: `color` or `accent_color`

**Current Behavior:** Agent color not displayed in sidebar
**Expected Behavior:** Color indicator visible in agent list/sidebar

## Implementation Steps
1. Verify backend extracts color from agent YAML
2. Verify API returns color in response
3. Add color indicator to AgentCard (if not present)
4. Add color indicator to sidebar detail view
5. Format as colored badge/dot or similar
6. Handle missing color gracefully

## Design Notes
- Could be a colored dot/circle
- Could be a colored border
- Could be a colored tag
- Should maintain design consistency
- Consider colorblind accessibility

## Testing Requirements
**Test File:** `tests/frontend/04-agent-color-indicator.spec.js`
**Test Cases:**
1. Agent with color displays color indicator
2. Color indicator matches agent definition
3. Color indicator visible in agent card
4. Color indicator visible in sidebar
5. Multiple agents with different colors
6. Agent without color handled gracefully
7. Color contrast meets accessibility standards

## Deployment Notes
Display enhancement, improves visual organization.
