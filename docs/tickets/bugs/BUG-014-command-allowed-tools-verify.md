---
id: BUG-014
title: Verify Allowed Tools shown in sidebar for Slash Commands
severity: medium
category: data-display
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
Slash commands can specify allowed tools/MCP servers. This task is to verify that allowed tools are correctly displayed in the sidebar for command details. If not displayed, implement the display.

## Acceptance Criteria
- [ ] Allowed Tools section displays in command sidebar view (or verified as working)
- [ ] All allowed tools listed with names
- [ ] Allowed tools formatted clearly
- [ ] Works for commands with multiple allowed tools
- [ ] Works for commands with no allowed tools (shows "None" or empty state)
- [ ] Visual test confirms display
- [ ] No console errors or warnings

## Technical Details
**Backend:** src/backend/parsers/commands-parser.js
**Frontend:** src/components/DetailSidebar.vue, command detail display
**Files to Check:**
- `src/backend/parsers/commands-parser.js`
- `src/components/DetailSidebar.vue`
- Command markdown files (check frontmatter)

**Data Source:** Command frontmatter field: `allowed_tools` or `tools`

**Current Behavior:** Unknown - requires verification
**Expected Behavior:** Allowed Tools displayed in sidebar if available

## Investigation Steps
1. Check if backend extracts allowed_tools from command YAML
2. Verify API returns allowed_tools in response
3. Check if sidebar displays allowed_tools
4. If missing, implement display

## Testing Requirements
**Test File:** `tests/frontend/04-command-allowed-tools-verify.spec.js`
**Test Cases:**
1. Command with allowed tools displays tools in sidebar (if applicable)
2. Command with multiple tools shows all tools
3. Command without allowed tools shows empty state or nothing
4. Allowed tools formatted consistently
5. Verify against agent implementation (BUG-013)

## Deployment Notes
Verification task, may or may not require changes.
