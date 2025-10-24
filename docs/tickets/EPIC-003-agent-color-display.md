---
id: EPIC-003
title: Fix Agent/Command/Hook Field Display in Sidebar (Sequential Bug Fixes)
status: in_progress
priority: high
category: Epic
assigned_to: null
created_at: 2025-10-23
updated_at: 2025-10-24
---

## Description
Multiple sidebar metadata fields are missing from the frontend display, even though the backend correctly parses and returns them. This epic tracks the sequential fix for all 7 identified bugs (BUG-027 through BUG-033). Following a sequential approach with manual user testing between each fix.

## Scope
This epic encompasses fixing display of all missing fields in agent, command, and hook sidebars across both ProjectDetail.vue and UserGlobal.vue components.

## Related Bugs (All 7)
- [BUG-027](./bugs/BUG-027-agent-color-display.md) - Agent Color Display ✅ COMPLETE
- [BUG-028](./bugs/BUG-028-agent-model-display.md) - Agent Model Display (Pending)
- [BUG-029](./bugs/BUG-029-agent-tools-display.md) - Agent Tools Display ✅ FIXED (bonus with BUG-027)
- [BUG-030](./bugs/BUG-030-command-tools-display.md) - Command Tools Display (Pending)
- [BUG-031](./bugs/BUG-031-command-argument-hint-display.md) - Command Argument Hint Display (Pending)
- [BUG-032](./bugs/BUG-032-hook-command-display.md) - Hook Command Display (Pending)
- [BUG-033](./bugs/BUG-033-hook-type-display.md) - Hook Type Display (Pending)

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
- [x] Check that backend is returning color field in API response
- [x] Verify selectedItem.color is available in component
- [x] Confirm color value exists in test agents

### Phase 2: Update Sidebar Display
- [x] Add color field to ProjectDetail.vue agent metadata section
- [x] Add conditional rendering for missing color
- [x] Add color field to UserGlobal.vue agent metadata section
- [x] Test both components display color correctly

### Phase 3: Testing & Validation
- [x] Run E2E tests to verify display
- [x] Test with multiple agents (with and without color)
- [x] Verify no console errors
- [x] Update visual regression snapshots if needed
- [x] Manual testing with actual agent configurations

## Success Criteria

- [x] Agent sidebar displays color field when present
- [x] Color field is clearly labeled
- [x] Color value is displayed in readable format
- [x] Handles missing color gracefully (shows "Not specified")
- [x] Works in both ProjectDetail.vue and UserGlobal.vue
- [x] All E2E tests passing (17/17 in file 04)
- [x] No console errors
- [x] Visual regression tests passing (if screenshots updated)

## Completion Summary

**Commit:** `253461c` - "fix: display agent color in sidebar [BUG-027]"

**Resolution Date:** October 24, 2025

### Key Findings & Improvements
1. **Root Cause Analysis:** Identified that stale `/dist` directory (5 days old) was causing bugs to "reappear"
2. **Bonus Fix:** While fixing color display, also fixed agent tools display (BUG-029)
3. **Comprehensive Testing:** All 17 tests in 04-component-rendering.spec.js passing on Chromium
4. **Sequential Approach:** Validates decision to use sequential bug fixes with user approval between each fix

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
