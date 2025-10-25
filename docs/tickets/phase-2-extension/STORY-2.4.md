# STORY-2.4: Testing & Documentation

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Estimated Time:** 30-45 minutes
**Priority:** High
**Status:** Not Started

## Description

Create comprehensive tests for all new reusable components, update integration tests to verify pages work correctly with the refactored components, and document the new architecture for future developers.

## Goals

1. Create unit tests for all new components (ConfigCard, ConfigItemList, ConfigDetailSidebar, etc.)
2. Update integration tests to verify refactored pages work correctly
3. Document component props, events, and usage patterns
4. Update CLAUDE.md with new component architecture
5. Ensure 100% test pass rate

## Expected Outcomes

- 8-12 new component unit tests added
- All existing 313+ tests continue to pass
- Complete component documentation
- Updated architecture documentation
- No functional regressions

## Tasks

14. **TASK-2.4.1:** Create component unit tests (20 min)
    - ConfigCard states and events
    - ConfigItemList rendering
    - Sidebar navigation and display
    - Utility components (LoadingState, EmptyState, BreadcrumbNavigation)

15. **TASK-2.4.2:** Update integration tests (15 min)
    - Verify ProjectDetail works with new components
    - Verify UserGlobal works with new components
    - Cross-browser testing
    - Responsive design verification

16. **TASK-2.4.3:** Documentation & code cleanup (10 min)
    - Document component props/events
    - Create usage examples
    - Update CLAUDE.md
    - Remove old commented code

## Acceptance Criteria

### Testing
- All new component tests pass (8-12 tests)
- All existing tests still pass (313+ tests)
- Test coverage for all component states
- Test coverage for all component events
- Cross-browser tests pass (Chrome, Firefox, Safari)
- Responsive design tests pass

### Documentation
- Each component has prop documentation
- Each component has event documentation
- Usage examples provided for each component
- CLAUDE.md updated with new architecture
- Component hierarchy documented
- Migration guide available

### Code Quality
- No commented-out code remaining
- Consistent code style across components
- All console warnings addressed
- No deprecated patterns used

## Dependencies

**Requires:**
- Story 2.1 (Card components) complete ✅
- Story 2.2 (Sidebar component) complete ✅
- Story 2.3 (Utility components) complete ✅

**Completes:**
- EPIC-4: Phase 2 Extension - Component Refactoring

## Files to Create

- `/home/claude/manager/tests/frontend/components/ConfigCard.spec.js` - ConfigCard tests
- `/home/claude/manager/tests/frontend/components/ConfigItemList.spec.js` - ConfigItemList tests
- `/home/claude/manager/tests/frontend/components/ConfigDetailSidebar.spec.js` - Sidebar tests
- `/home/claude/manager/tests/frontend/components/Utilities.spec.js` - Utility component tests
- `/home/claude/manager/docs/components/COMPONENT-LIBRARY.md` - Component documentation

## Files to Modify

- `/home/claude/manager/tests/e2e/100-user-flow-navigation.spec.js` - Update integration tests
- `/home/claude/manager/tests/e2e/101-project-detail-page.spec.js` - Update page tests
- `/home/claude/manager/CLAUDE.md` - Update architecture documentation

## Success Indicators

1. 100% test pass rate maintained (313+ existing + 8-12 new = 321-325 total)
2. All components fully documented
3. CLAUDE.md reflects new architecture
4. No functional regressions detected
5. Code cleanup complete

## Testing Checklist

### Component Unit Tests

**ConfigCard Tests:**
- [ ] Renders with all required props
- [ ] Displays loading state correctly
- [ ] Displays empty state correctly
- [ ] Displays items list correctly
- [ ] "Show more" button works
- [ ] "Show less" button works
- [ ] Emits toggle-show-all event
- [ ] Emits item-selected event
- [ ] Applies correct color theme
- [ ] Works for all 4 config types

**ConfigItemList Tests:**
- [ ] Renders items correctly
- [ ] Formats agent descriptions
- [ ] Formats command descriptions
- [ ] Formats hook descriptions
- [ ] Formats MCP descriptions
- [ ] Click event emitted

**ConfigDetailSidebar Tests:**
- [ ] Renders with all required props
- [ ] Displays agent metadata correctly
- [ ] Displays command metadata correctly
- [ ] Displays hook metadata correctly
- [ ] Displays MCP metadata correctly
- [ ] Previous button works
- [ ] Next button works
- [ ] Previous disabled on first item
- [ ] Next disabled on last item
- [ ] Close button emits close event
- [ ] Navigate event emitted correctly

**Utility Component Tests:**
- [ ] LoadingState displays correctly
- [ ] EmptyState displays correctly
- [ ] BreadcrumbNavigation renders
- [ ] Breadcrumb navigation works

### Integration Tests
- [ ] ProjectDetail page loads with new components
- [ ] UserGlobal page loads with new components
- [ ] All 4 config types display on ProjectDetail
- [ ] All 4 config types display on UserGlobal
- [ ] Sidebar works on ProjectDetail
- [ ] Sidebar works on UserGlobal
- [ ] Navigation works correctly
- [ ] Theme toggle works
- [ ] Responsive design maintained

### Cross-Browser Tests
- [ ] Chrome (Chromium) - All tests pass
- [ ] Firefox - All tests pass
- [ ] Safari (WebKit) - All tests pass

### Responsive Tests
- [ ] Mobile viewport (375px)
- [ ] Tablet viewport (768px)
- [ ] Desktop viewport (1920px)

## Related Tickets

**Part of Epic:**
- EPIC-4: Phase 2 Extension - Component Refactoring

**Depends On:**
- STORY-2.1: Extract Core Card Components ✅
- STORY-2.2: Extract Sidebar Component ✅
- STORY-2.3: Extract Utility Components ✅

**Completes Epic:**
- Final story in EPIC-4

**Task Details:**
- See individual TASK-2.4.X.md files for implementation details

## Notes

### Test File Organization

```
tests/
├── frontend/
│   ├── components/          # New component tests
│   │   ├── ConfigCard.spec.js
│   │   ├── ConfigItemList.spec.js
│   │   ├── ConfigDetailSidebar.spec.js
│   │   └── Utilities.spec.js
│   └── ...existing tests...
├── e2e/
│   ├── 100-user-flow-navigation.spec.js  # Updated
│   ├── 101-project-detail-page.spec.js   # Updated
│   └── ...existing tests...
└── ...
```

### Documentation Structure

**Component Documentation Template:**
```markdown
# ComponentName

## Description
Brief description of component purpose.

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | String | Yes | - | Description |
| prop2 | Number | No | 10 | Description |

## Events
| Event | Payload | Description |
|-------|---------|-------------|
| event-name | Object | Description |

## Usage Example
```vue
<ComponentName
  :prop1="value1"
  :prop2="value2"
  @event-name="handler"
/>
```

## Slots
None / Description of available slots

## Styling
CSS classes and theming variables used.
```

### CLAUDE.md Updates

Add new section documenting component architecture:

```markdown
## Component Architecture (Phase 2.1)

### Reusable Components

**Configuration Display:**
- `ConfigCard` - Configuration section wrapper
- `ConfigItemList` - Item list rendering
- `ConfigDetailSidebar` - Detail view sidebar

**Utilities:**
- `LoadingState` - Loading indicators
- `EmptyState` - Empty state displays
- `BreadcrumbNavigation` - Breadcrumb navigation

**Component Hierarchy:**
```
src/components/
├── cards/
│   ├── ConfigCard.vue
│   └── ConfigItemList.vue
├── sidebar/
│   └── ConfigDetailSidebar.vue
├── common/
│   ├── LoadingState.vue
│   ├── EmptyState.vue
│   └── BreadcrumbNavigation.vue
├── Dashboard.vue
├── ProjectDetail.vue (refactored)
└── UserGlobal.vue (refactored)
```
```

### Test Coverage Goals

- **Unit Tests:** 100% of component states and events
- **Integration Tests:** 100% of page functionality
- **Visual Tests:** No regressions in appearance
- **Cross-Browser:** All major browsers supported
- **Responsive:** All viewport sizes verified

### Code Cleanup Checklist

- [ ] Remove all commented-out old code
- [ ] Consolidate duplicate CSS
- [ ] Remove unused imports
- [ ] Update component imports
- [ ] Fix any ESLint warnings
- [ ] Verify no console.log statements
- [ ] Check for TODO comments

### Rollback Plan

If critical issues found:
1. Full test suite serves as safety net
2. Git feature branch allows easy revert
3. Documentation helps future troubleshooting
4. Component isolation limits blast radius
5. Can revert individual components if needed
