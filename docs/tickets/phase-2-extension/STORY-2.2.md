# STORY-2.2: Extract Sidebar Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Estimated Time:** 45-60 minutes
**Priority:** Critical
**Status:** Not Started

## Description

Extract the configuration detail sidebar from `ProjectDetail.vue` and `UserGlobal.vue` into a reusable `ConfigDetailSidebar` component. This component will display detailed metadata for selected configuration items with type-aware rendering for agents, commands, hooks, and MCP servers.

## Goals

1. Create reusable `ConfigDetailSidebar` component with type-aware metadata display
2. Extract metadata display logic into centralized patterns
3. Refactor `ProjectDetail.vue` to use new sidebar component
4. Refactor `UserGlobal.vue` to use new sidebar component
5. Validate all metadata displays correctly

## Expected Code Reduction

- **Before:** ~79 lines (ProjectDetail) + ~70 lines (UserGlobal) = 149 lines
- **After:** ~75 lines shared component + ~10 lines usage per page = 95 lines
- **Reduction:** 54 lines (36% reduction)

## Tasks

6. **TASK-2.2.1:** Create ConfigDetailSidebar component (25 min)
   - Template with metadata sections
   - Type-aware rendering logic
   - Navigation buttons (prev/next)
   - Content preview section

7. **TASK-2.2.2:** Extract MetadataDisplay logic (15 min)
   - Conditional rendering per type (agents/commands/hooks/MCP)
   - Graceful null handling
   - Field display patterns

8. **TASK-2.2.3:** Refactor ProjectDetail sidebar (10 min)
   - Replace inline sidebar with component
   - Verify all metadata displays

9. **TASK-2.2.4:** Refactor UserGlobal sidebar (10 min)
   - Reuse ConfigDetailSidebar
   - Quick verification

## Acceptance Criteria

### Component Quality
- ConfigDetailSidebar component accepts all required props (item, type, currentItems, currentIndex)
- Type-aware metadata rendering handles all 4 config types correctly
- Navigation (prev/next) works seamlessly
- Component emits proper events for parent communication

### Functionality
- **Agent Metadata:** Name, description, model, color, tools
- **Command Metadata:** Name, description, usage
- **Hook Metadata:** Event type, script, conditions
- **MCP Server Metadata:** Name, command, args, environment variables
- Previous/Next buttons navigate through items
- Close button closes sidebar
- Content preview displays correctly
- Sidebar animations smooth

### Code Quality
- Metadata fields gracefully handle null/undefined values
- Type checking for conditional rendering
- CSS uses variables for theming
- Sidebar width consistent (75vw)

### Testing
- All existing sidebar tests pass
- No regression in metadata display
- Navigation works correctly
- Cross-browser compatibility maintained

## Dependencies

**Requires:**
- Story 2.1 (Card components) complete (recommended, not blocking)
- Phase 2 Vite migration complete ✅

**Blocks:**
- Story 2.4 (Testing & Documentation) - depends on all component extraction

## Files to Create

- `/home/claude/manager/src/components/sidebar/ConfigDetailSidebar.vue` - Main sidebar component

## Files to Modify

- `/home/claude/manager/src/components/ProjectDetail.vue` - Refactor to use ConfigDetailSidebar
- `/home/claude/manager/src/components/UserGlobal.vue` - Refactor to use ConfigDetailSidebar

## Success Indicators

1. ConfigDetailSidebar renders all 4 config types correctly
2. All metadata fields display with proper formatting
3. Navigation between items works smoothly
4. Code duplication reduced by 30%+
5. All existing sidebar tests pass
6. No visual regressions

## Testing Checklist

### Manual Testing
- [ ] Sidebar opens when item clicked
- [ ] Sidebar closes on close button click
- [ ] Sidebar closes on outside click
- [ ] Previous button navigates to previous item
- [ ] Next button navigates to next item
- [ ] Previous button disabled on first item
- [ ] Next button disabled on last item
- [ ] Agent metadata displays correctly (model, color, tools)
- [ ] Command metadata displays correctly
- [ ] Hook metadata displays correctly (event, script, conditions)
- [ ] MCP metadata displays correctly (command, args, env vars)
- [ ] Content preview renders markdown
- [ ] Code blocks have syntax highlighting
- [ ] Sidebar width is 75vw
- [ ] Sidebar animations smooth
- [ ] Theme toggle works (dark/light)
- [ ] Responsive design maintained

### Automated Testing
- [ ] All existing Playwright sidebar tests pass
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

## Related Tickets

**Part of Epic:**
- EPIC-4: Phase 2 Extension - Component Refactoring

**Depends On:**
- STORY-2.1: Extract Core Card Components (recommended)

**Related Stories:**
- STORY-2.3: Extract Utility Components
- STORY-2.4: Testing & Documentation

**Task Details:**
- See individual TASK-2.2.X.md files for implementation details

## Notes

### Component Interface Design

**ConfigDetailSidebar Props:**
```javascript
{
  item: Object,         // Selected configuration item
  type: String,         // 'agents' | 'commands' | 'hooks' | 'mcp'
  currentItems: Array,  // Full list for navigation
  currentIndex: Number  // Current item index
}
```

**ConfigDetailSidebar Events:**
```javascript
@close        // Emitted when sidebar should close
@navigate     // Emitted when prev/next clicked (direction: 'prev' | 'next')
```

### Type-Aware Metadata Fields

**Agents:**
- Name (item.name)
- Description (item.description)
- Model (item.model) - BUG-028 fix included
- Color (item.color) - BUG-027 fix included
- Tools (item.tools) - BUG-029 fix included

**Commands:**
- Name (item.name)
- Description (item.description)
- Usage (item.usage)

**Hooks:**
- Event Type (item.event)
- Script (item.script)
- Conditions (item.when)

**MCP Servers:**
- Name (item.name)
- Command (item.command)
- Arguments (item.args)
- Environment Variables (item.env)

### Migration Strategy

1. Create ConfigDetailSidebar component with all metadata logic
2. Test component in isolation with mock data
3. Refactor ProjectDetail.vue to use component
4. Verify all 4 config types display correctly
5. Refactor UserGlobal.vue to use component
6. Run full test suite
7. Visual verification across browsers

### Critical Fixes Included

This story includes the fixes for BUG-027, BUG-028, and BUG-029:
- Agent model field displays in sidebar
- Agent color field displays in sidebar
- Agent tools field displays in sidebar

These fixes are incorporated into the type-aware metadata rendering logic.

### Rollback Plan

If issues arise:
1. Git feature branch allows easy revert
2. Keep old sidebar code commented until verification complete
3. Test one page at a time before moving to next
4. Incremental commits allow partial rollback if needed
