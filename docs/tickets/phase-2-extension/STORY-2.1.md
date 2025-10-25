# STORY-2.1: Extract Core Card Components

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Estimated Time:** 60-90 minutes
**Priority:** Critical
**Status:** Not Started

## Description

Extract the core configuration card components (`ConfigCard` and `ConfigItemList`) from the duplicated code in `ProjectDetail.vue` and `UserGlobal.vue`. These components will provide reusable wrappers for displaying configuration sections (Agents, Commands, Hooks, MCP Servers) with consistent styling and behavior.

## Goals

1. Create reusable `ConfigCard` component with all display states (loading/empty/items)
2. Create reusable `ConfigItemList` component for uniform item rendering
3. Refactor `ProjectDetail.vue` to use new components
4. Refactor `UserGlobal.vue` to use new components
5. Validate all functionality still works

## Expected Code Reduction

- **Before:** ~186 lines per page × 2 pages = 372 lines
- **After:** ~60 lines shared component + ~30 lines usage per page = 120 lines
- **Reduction:** 252 lines (67% reduction)

## Tasks

1. **TASK-2.1.1:** Create ConfigCard component (30 min)
   - Wrapper template with all states
   - Props for customization
   - Event emissions for parent communication
   - Styling with scoped CSS

2. **TASK-2.1.2:** Create ConfigItemList component (20 min)
   - Item row rendering
   - Type-specific description formatting
   - Hover and interaction styles

3. **TASK-2.1.3:** Refactor ProjectDetail to use ConfigCard (15 min)
   - Remove duplicate card markup
   - Update state management
   - Verify all 4 card types work

4. **TASK-2.1.4:** Refactor UserGlobal to use ConfigCard (10 min)
   - Reuse ProjectDetail patterns
   - Quick verification

5. **TASK-2.1.5:** Testing & validation (15 min)
   - All cards render correctly
   - All states work (loading/empty/items)
   - Expand/collapse functionality
   - Item click events

## Acceptance Criteria

### Component Quality
- ConfigCard component accepts all required props (title, count, icon, color, loading, items, etc.)
- ConfigItemList renders items consistently for all 4 config types
- Components emit proper events for parent communication
- Scoped CSS prevents style bleeding

### Functionality
- All 4 configuration types display correctly (agents/commands/hooks/MCP)
- Loading skeleton displays while fetching data
- Empty state displays when no items found
- "Show more" / "Show less" toggle works
- Item click triggers detail sidebar

### Code Quality
- Props properly typed with validation
- Events documented with clear names
- CSS uses variables for theming
- Code is DRY (Don't Repeat Yourself)

### Testing
- Existing tests still pass
- Manual verification of all card states
- Cross-browser compatibility maintained

## Dependencies

**Requires:**
- Phase 2 Vite migration complete ✅
- Current ProjectDetail.vue and UserGlobal.vue functional ✅

**Blocks:**
- Story 2.2 (Sidebar extraction) - depends on card refactoring completion
- Story 2.3 (Utility components) - can proceed in parallel

## Files to Create

- `/home/claude/manager/src/components/cards/ConfigCard.vue` - Main card wrapper component
- `/home/claude/manager/src/components/cards/ConfigItemList.vue` - Item list rendering component

## Files to Modify

- `/home/claude/manager/src/components/ProjectDetail.vue` - Refactor to use ConfigCard
- `/home/claude/manager/src/components/UserGlobal.vue` - Refactor to use ConfigCard

## Success Indicators

1. ConfigCard component renders all 4 config types identically
2. Code duplication in pages reduced by 60%+
3. All existing functionality maintained
4. No visual regressions
5. All existing tests pass

## Testing Checklist

### Manual Testing
- [ ] All 4 card types render on ProjectDetail page
- [ ] All 4 card types render on UserGlobal page
- [ ] Loading state displays correctly
- [ ] Empty state displays correctly
- [ ] Items list displays correctly
- [ ] "Show more" button works
- [ ] "Show less" button works
- [ ] Item click opens detail sidebar
- [ ] Card colors match design (green/blue/orange/purple)
- [ ] Responsive layout maintained
- [ ] Theme toggle works (dark/light)

### Automated Testing
- [ ] All existing Playwright tests pass
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

## Related Tickets

**Part of Epic:**
- EPIC-4: Phase 2 Extension - Component Refactoring

**Related Stories:**
- STORY-2.2: Extract Sidebar Component
- STORY-2.3: Extract Utility Components
- STORY-2.4: Testing & Documentation

**Task Details:**
- See individual TASK-2.1.X.md files for implementation details

## Notes

### Component Interface Design

**ConfigCard Props:**
```javascript
{
  title: String,        // "Subagents", "Commands", etc.
  count: Number,        // Item count
  icon: String,         // PrimeIcons class
  color: String,        // CSS variable name
  loading: Boolean,     // Loading state
  items: Array,         // Configuration items
  showingAll: Boolean,  // Expand/collapse state
  initialDisplayCount: Number  // How many to show initially
}
```

**ConfigCard Events:**
```javascript
@toggle-show-all  // Emitted when "Show more/less" clicked
@item-selected    // Emitted when item clicked
```

### Design Principles

1. **Type-Agnostic:** Components work for any config type
2. **Prop-Driven:** All customization via props
3. **Event-Driven:** Parent controls state via events
4. **Scoped Styles:** No global CSS pollution
5. **Theme Support:** Uses CSS variables for colors

### Migration Strategy

1. Create components in isolation
2. Test components independently
3. Refactor one page at a time
4. Verify functionality after each refactor
5. Run full test suite before completion

### Rollback Plan

If issues arise:
1. Git feature branch allows easy revert
2. Keep old code commented until verification complete
3. Incremental commits allow partial rollback if needed
