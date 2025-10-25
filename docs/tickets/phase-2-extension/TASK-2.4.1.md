# TASK-2.4.1: Create Component Unit Tests

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.4 - Testing & Documentation
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Create comprehensive unit tests for all new reusable components (ConfigCard, ConfigItemList, ConfigDetailSidebar, LoadingState, EmptyState, BreadcrumbNavigation).

## Prerequisites

- ✅ All component creation tasks complete (Stories 2.1, 2.2, 2.3)

## Acceptance Criteria

1. **ConfigCard Tests**
   - [ ] Test all props
   - [ ] Test loading state
   - [ ] Test empty state
   - [ ] Test items display
   - [ ] Test toggle events
   - [ ] Test item-selected events

2. **ConfigItemList Tests**
   - [ ] Test rendering for all 4 types
   - [ ] Test item click events
   - [ ] Test type-specific formatting

3. **ConfigDetailSidebar Tests**
   - [ ] Test metadata display for all 4 types
   - [ ] Test navigation controls
   - [ ] Test close event
   - [ ] Test prev/next disabled states

4. **Utility Component Tests**
   - [ ] Test LoadingState variants
   - [ ] Test EmptyState display
   - [ ] Test BreadcrumbNavigation

5. **All Tests Pass**
   - [ ] 100% test pass rate
   - [ ] 8-12 new tests added

## Implementation Notes

### Test File Structure

```
tests/frontend/components/
├── ConfigCard.spec.js
├── ConfigItemList.spec.js
├── ConfigDetailSidebar.spec.js
└── Utilities.spec.js
```

### ConfigCard.spec.js Example

```javascript
import { test, expect } from '@playwright/test';

test.describe('ConfigCard Component', () => {
  test('renders with all props', async ({ page }) => {
    // Mount component with props
    // Verify rendering
  });

  test('displays loading state', async ({ page }) => {
    // Mount with loading=true
    // Verify LoadingState visible
  });

  test('displays empty state', async ({ page }) => {
    // Mount with empty items
    // Verify EmptyState visible
  });

  test('displays items list', async ({ page }) => {
    // Mount with items
    // Verify ConfigItemList visible
  });

  test('emits toggle-show-all event', async ({ page }) => {
    // Click toggle button
    // Verify event emitted
  });

  test('emits item-selected event', async ({ page }) => {
    // Click item
    // Verify event emitted with correct payload
  });

  test('works for all config types', async ({ page }) => {
    // Test agents, commands, hooks, mcp
  });
});
```

### ConfigItemList.spec.js Example

```javascript
test.describe('ConfigItemList Component', () => {
  test('renders agent items correctly', async ({ page }) => {
    // Mount with agent items
    // Verify description formatting
  });

  test('renders command items correctly', async ({ page }) => {
    // Mount with command items
    // Verify usage formatting
  });

  test('renders hook items correctly', async ({ page }) => {
    // Mount with hook items
    // Verify event formatting
  });

  test('renders MCP items correctly', async ({ page }) => {
    // Mount with MCP items
    // Verify command formatting
  });

  test('emits item-click event', async ({ page }) => {
    // Click item
    // Verify event emitted
  });
});
```

### ConfigDetailSidebar.spec.js Example

```javascript
test.describe('ConfigDetailSidebar Component', () => {
  test('displays agent metadata correctly', async ({ page }) => {
    // Mount with agent item
    // Verify all fields display
  });

  test('displays command metadata correctly', async ({ page }) => {
    // Mount with command item
    // Verify fields
  });

  test('previous button disabled on first item', async ({ page }) => {
    // Mount with currentIndex=0
    // Verify prev button disabled
  });

  test('next button disabled on last item', async ({ page }) => {
    // Mount with currentIndex=lastIndex
    // Verify next button disabled
  });

  test('emits navigate event', async ({ page }) => {
    // Click next/prev
    // Verify event emitted
  });

  test('emits close event', async ({ page }) => {
    // Click close button
    // Verify event emitted
  });
});
```

### Utilities.spec.js Example

```javascript
test.describe('Utility Components', () => {
  test('LoadingState displays correctly', async ({ page }) => {
    // Mount LoadingState
    // Verify spinner and message
  });

  test('EmptyState displays correctly', async ({ page }) => {
    // Mount EmptyState
    // Verify icon and message
  });

  test('BreadcrumbNavigation displays correctly', async ({ page }) => {
    // Mount BreadcrumbNavigation
    // Verify items and separators
  });
});
```

## Testing Checklist

### ConfigCard
- [ ] All props render correctly
- [ ] Loading state works
- [ ] Empty state works
- [ ] Items display works
- [ ] Toggle event works
- [ ] Item-selected event works

### ConfigItemList
- [ ] Agent formatting correct
- [ ] Command formatting correct
- [ ] Hook formatting correct
- [ ] MCP formatting correct
- [ ] Click event works

### ConfigDetailSidebar
- [ ] Agent metadata displays
- [ ] Command metadata displays
- [ ] Hook metadata displays
- [ ] MCP metadata displays
- [ ] Navigation works
- [ ] Close works
- [ ] Disabled states correct

### Utilities
- [ ] LoadingState works
- [ ] EmptyState works
- [ ] BreadcrumbNavigation works

## Files to Create

- `/home/claude/manager/tests/frontend/components/ConfigCard.spec.js`
- `/home/claude/manager/tests/frontend/components/ConfigItemList.spec.js`
- `/home/claude/manager/tests/frontend/components/ConfigDetailSidebar.spec.js`
- `/home/claude/manager/tests/frontend/components/Utilities.spec.js`

## Success Indicators

1. All new tests pass
2. 8-12 tests added
3. Component coverage complete
4. No regressions

## Related Tickets

**Part of Story:** STORY-2.4
**Depends On:** Stories 2.1, 2.2, 2.3
