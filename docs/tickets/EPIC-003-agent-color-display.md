---
id: EPIC-003
title: Fix Agent Color Display in Sidebar
status: open
priority: high
category: Epic
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-23
---

## Description
Agent configuration sidebar detail view is missing the `color` field from agent YAML frontmatter. This field is parsed by the backend but not displayed in the frontend sidebar.

## Scope
This epic tracks the fix for:
- [BUG-027](./bugs/BUG-027-agent-color-display.md) - Agent details missing color from YAML

## Related Bugs
- [BUG-027](./bugs/BUG-027-agent-color-display.md) - Agent Color Display

## Impact

### User Impact
- Users cannot see what color the agent is configured to use
- Missing visual information about agent configuration

### Technical Impact
- Backend is correctly parsing and returning color field
- Frontend is not displaying the color field in sidebar metadata
- Data mismatch between backend capabilities and frontend display

## Root Causes (Analysis)

The agent color field is:
1. ✅ Defined in YAML frontmatter (e.g., `color: blue`)
2. ✅ Parsed by backend subagent parser (subagentParser.js:65)
3. ✅ Returned via API endpoint
4. ❌ NOT displayed in ProjectDetail.vue sidebar
5. ❌ NOT displayed in UserGlobal.vue sidebar

The frontend was supposed to display color but currently does not show it in the sidebar metadata section.

## Implementation Strategy

### Phase 1: Verify Data Flow
- [ ] Check that backend is returning color field in API response
- [ ] Verify selectedItem.color is available in component
- [ ] Confirm color value exists in test agents

### Phase 2: Update Sidebar Display
- [ ] Add color field to ProjectDetail.vue agent metadata section
- [ ] Add conditional rendering for missing color
- [ ] Add color field to UserGlobal.vue agent metadata section
- [ ] Test both components display color correctly

### Phase 3: Testing & Validation
- [ ] Run E2E tests to verify display
- [ ] Test with multiple agents (with and without color)
- [ ] Verify no console errors
- [ ] Update visual regression snapshots if needed
- [ ] Manual testing with actual agent configurations

## Success Criteria

- [ ] Agent sidebar displays color field when present
- [ ] Color field is clearly labeled
- [ ] Color value is displayed in readable format
- [ ] Handles missing color gracefully (shows nothing)
- [ ] Works in both ProjectDetail.vue and UserGlobal.vue
- [ ] All E2E tests passing
- [ ] No console errors
- [ ] Visual regression tests passing (if screenshots updated)

## Blockers
None currently identified.

## Dependencies
- Phase 2 (Vite Migration) must be complete
- EPIC-002 (Data Display Bugs) bugs must be investigated

## Notes
- Color field is already parsed by backend (subagentParser.js:65)
- Field is returned in API response
- Only frontend display needs to be fixed
- Should follow existing metadata display pattern in sidebar
