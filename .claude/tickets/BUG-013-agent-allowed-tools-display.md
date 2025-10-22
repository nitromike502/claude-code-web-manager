---
id: BUG-013
title: Allowed Tools not shown in sidebar for Agents
severity: medium
category: data-display
status: open
created: 2025-10-21
---

## Problem Statement
Agent definitions can specify allowed tools/MCP servers, but this information is not being displayed in the sidebar when viewing agent details.

## Acceptance Criteria
- [ ] Allowed Tools section displays in agent sidebar view
- [ ] All allowed tools listed with names
- [ ] Allowed tools formatted clearly
- [ ] Works for agents with multiple allowed tools
- [ ] Works for agents with no allowed tools (shows "None" or empty state)
- [ ] Visual test confirms display
- [ ] No console errors or warnings

## Technical Details
**Backend:** src/backend/parsers/agents-parser.js
**Frontend:** src/components/DetailSidebar.vue, agent detail display
**Files to Check:**
- `src/backend/parsers/agents-parser.js` (extract allowed_tools from YAML)
- `src/components/DetailSidebar.vue` (display section)
- Agent markdown files (check frontmatter for allowed_tools field)

**Data Source:** Agent frontmatter field: `allowed_tools` or `tools`

**Current Behavior:** Allowed Tools not displayed in sidebar
**Expected Behavior:** Allowed Tools displayed as list in sidebar

## Implementation Steps
1. Verify backend extracts allowed_tools from agent YAML
2. Verify API returns allowed_tools in response
3. Add display section in sidebar for allowed_tools
4. Format as bullet list or tags
5. Handle empty/null values

## Testing Requirements
**Test File:** `tests/frontend/04-agent-allowed-tools-display.spec.js`
**Test Cases:**
1. Agent with allowed tools displays tools in sidebar
2. Agent with multiple tools shows all tools
3. Agent without allowed tools shows empty state
4. Allowed tools formatted as list/tags
5. Tools clickable/linked if applicable

## Deployment Notes
Display enhancement, no breaking changes.
