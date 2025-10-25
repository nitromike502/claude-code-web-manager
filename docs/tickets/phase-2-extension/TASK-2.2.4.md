# TASK-2.2.4: Refactor UserGlobal Sidebar

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.2 - Extract Sidebar Component
**Estimated Time:** 10 minutes
**Priority:** High
**Status:** Not Started

## Description

Replace the inline sidebar implementation in `UserGlobal.vue` with the new `ConfigDetailSidebar` component. This follows the exact same pattern as TASK-2.2.3.

## Prerequisites

- ✅ TASK-2.2.1 complete (ConfigDetailSidebar created)
- ✅ TASK-2.2.3 complete (ProjectDetail refactored - pattern established)

## Acceptance Criteria

1. **Import Component**
   - [ ] Import ConfigDetailSidebar
   - [ ] Remove old sidebar markup

2. **Replace Sidebar**
   - [ ] Use `<ConfigDetailSidebar>` component
   - [ ] Pass required props
   - [ ] Wire up events

3. **Functionality Preserved**
   - [ ] Sidebar works identically to before
   - [ ] All metadata displays correctly
   - [ ] Navigation works
   - [ ] No regressions

## Implementation Notes

Follow the exact same pattern as TASK-2.2.3 (ProjectDetail sidebar refactoring).

```vue
<template>
  <!-- ... page content ... -->

  <!-- Refactored Sidebar -->
  <ConfigDetailSidebar
    v-if="sidebarVisible"
    :item="selectedItem"
    :type="selectedType"
    :current-items="currentItems"
    :current-index="currentIndex"
    @close="closeSidebar"
    @navigate="navigateItem"
  />
</template>

<script>
import ConfigCard from './cards/ConfigCard.vue';
import ConfigDetailSidebar from './sidebar/ConfigDetailSidebar.vue';

export default {
  name: 'UserGlobal',
  components: {
    ConfigCard,
    ConfigDetailSidebar
  },
  // ... rest unchanged
};
</script>
```

## Testing Checklist

- [ ] Sidebar opens correctly
- [ ] All metadata displays
- [ ] Navigation works
- [ ] Close button works
- [ ] All 4 config types work
- [ ] No visual regressions
- [ ] All tests pass

## Files to Modify

- `/home/claude/manager/src/components/UserGlobal.vue`

## Success Indicators

1. Sidebar works identically
2. ~70 lines removed
3. All tests pass
4. No visual changes

## Related Tickets

**Part of Story:** STORY-2.2
**Depends On:** TASK-2.2.1, TASK-2.2.3
