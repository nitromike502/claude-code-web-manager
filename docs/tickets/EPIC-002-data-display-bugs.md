---
id: EPIC-002
title: Phase 2 Data Display & Feature Bugs
status: open
priority: high
category: Epic
assigned_to: null
created_at: 2025-10-22
updated_at: 2025-10-22
---

## Description
Critical bugs discovered during Phase 2 (Vite Migration) that affect data display and feature completeness. These issues prevent users from seeing complete information about agents, commands, hooks, and MCP servers.

## Scope
This epic tracks 10 related bugs across 4 configuration types:
- **Agents (2 bugs):** Missing allowed_tools and color display
- **Commands (3 bugs):** Missing allowed_tools, color, and argument_hint display
- **Hooks (3 bugs):** Missing command, matcher, and type display
- **MCP Servers (1 bug):** Not showing at all
- **UI/UX (1 bug):** Sidebar scroll isolation

## Related Bugs

### Agent Display Issues
- [BUG-018](./bugs/BUG-018-agent-allowed-tools-display.md) - Agent allowed_tools not showing
- [BUG-019](./bugs/BUG-019-agent-color-display.md) - Agent color not showing

### Command Display Issues
- [BUG-020](./bugs/BUG-020-command-allowed-tools-display.md) - Command allowed_tools not showing
- [BUG-021](./bugs/BUG-021-command-color-display.md) - Command color not showing
- [BUG-022](./bugs/BUG-022-command-argument-hint-display.md) - Command argument_hint not showing

### Hook Display Issues
- [BUG-023](./bugs/BUG-023-hooks-command-display.md) - Hook command field not showing
- [BUG-024](./bugs/BUG-024-hooks-matcher-display.md) - Hook matcher field not showing
- [BUG-025](./bugs/BUG-025-hooks-type-display.md) - Hook type field not showing

### MCP Server Issues
- [BUG-026](./bugs/BUG-026-mcp-servers-not-showing.md) - MCP servers not loading/displaying

### UI/UX Issues
- [BUG-017](./bugs/BUG-017-sidebar-scroll-isolation.md) - Sidebar scroll affects main page

## Impact

### User Impact
- Users cannot see complete configuration information
- Makes the application less useful for reviewing complex configurations
- MCP servers are completely unavailable
- Sidebar interaction is confusing when scrolling

### Technical Impact
- Data is parsed correctly but not displayed
- API endpoints return correct data but frontend doesn't use it
- Backend/Frontend mismatch in data handling
- Potential routing or state management issues

## Root Causes (Suspected)

1. **Frontend Components:**
   - Agent/Command/Hook card components may not access all parsed fields
   - DetailSidebar may not display all available data
   - Component templates may be missing field bindings

2. **API/Backend:**
   - MCP endpoints may not be parsing files correctly
   - Hook endpoints may not be extracting all required fields
   - Backend may not be properly merging user and project configurations

3. **State Management:**
   - Pinia stores may not be storing all fields
   - Data transformation in API client may be filtering fields

## Implementation Strategy

### Phase 1: Agent & Command Fields
Fix display of allowed_tools, color, and argument_hint across cards and sidebars.

**Tasks:**
- [ ] Review AgentCard.vue component template
- [ ] Review CommandCard.vue component template
- [ ] Update DetailSidebar.vue to display all fields
- [ ] Verify API data is complete
- [ ] Test with sample configurations
- [ ] Update styling/formatting for new fields

### Phase 2: Hook Fields
Fix display of command, matcher, and type in hook configurations.

**Tasks:**
- [ ] Review HookCard.vue component template
- [ ] Verify backend is parsing all hook fields
- [ ] Update DetailSidebar.vue hook display
- [ ] Test with sample hook configurations
- [ ] Handle various hook types and formats

### Phase 3: MCP Servers
Restore MCP server display and debug missing servers.

**Tasks:**
- [ ] Debug backend MCP parsing logic
- [ ] Verify API endpoint returns data
- [ ] Check frontend API integration
- [ ] Implement/fix MCPCard.vue if needed
- [ ] Test with sample MCP configurations
- [ ] Handle error states gracefully

### Phase 4: UI/UX Fixes
Fix sidebar scroll isolation and other UX issues.

**Tasks:**
- [ ] Implement scroll isolation for sidebar
- [ ] Test scroll behavior across browsers
- [ ] Ensure no content is cut off
- [ ] Verify keyboard navigation still works

## Success Criteria

- [ ] All 10 bugs marked as resolved/closed
- [ ] All agent/command/hook/MCP configurations display complete information
- [ ] Sidebar scrolling is isolated from main page
- [ ] No data loss or filtering occurs
- [ ] All tests pass (backend + frontend)
- [ ] Cross-browser verification complete
- [ ] User can view all configuration details via sidebar
- [ ] Empty states handled gracefully

## Blockers
None currently identified.

## Dependencies
- Phase 2 (Vite Migration) must be complete

## Notes
- Data parsing appears to be working correctly in backend
- Focus should be on frontend display and integration
- May require refactoring DetailSidebar to handle all config types uniformly
