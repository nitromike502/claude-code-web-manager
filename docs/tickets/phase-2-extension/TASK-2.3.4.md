# TASK-2.3.4: Update All Page Imports

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.3 - Extract Utility Components
**Estimated Time:** 5 minutes
**Priority:** Medium
**Status:** Not Started

## Description

Update all pages to import and use the new utility components (LoadingState, EmptyState, BreadcrumbNavigation) where applicable.

## Prerequisites

- ✅ TASK-2.3.1 complete (LoadingState created)
- ✅ TASK-2.3.2 complete (EmptyState created)
- ✅ TASK-2.3.3 complete (BreadcrumbNavigation created)

## Acceptance Criteria

1. **Update ConfigCard**
   - [ ] Import LoadingState
   - [ ] Import EmptyState
   - [ ] Use components instead of inline markup

2. **Update Pages (Optional)**
   - [ ] Consider using BreadcrumbNavigation in ProjectDetail
   - [ ] Consider using BreadcrumbNavigation in UserGlobal

3. **Verify**
   - [ ] All imports correct
   - [ ] All components working
   - [ ] No broken references

## Implementation Notes

### Update ConfigCard.vue

```vue
<script>
import LoadingState from '../common/LoadingState.vue';
import EmptyState from '../common/EmptyState.vue';
import ConfigItemList from './ConfigItemList.vue';

export default {
  name: 'ConfigCard',
  components: {
    LoadingState,
    EmptyState,
    ConfigItemList
  },
  // ... rest unchanged
};
</script>
```

Note: The template in ConfigCard should already reference these components from TASK-2.1.1.

## Testing Checklist

- [ ] All pages load without errors
- [ ] Loading states work
- [ ] Empty states work
- [ ] Breadcrumbs work (if updated)
- [ ] No console warnings

## Files to Modify

- `/home/claude/manager/src/components/cards/ConfigCard.vue` (verify imports)
- `/home/claude/manager/src/components/ProjectDetail.vue` (optional breadcrumbs)
- `/home/claude/manager/src/components/UserGlobal.vue` (optional breadcrumbs)

## Success Indicators

1. All imports clean
2. All components working
3. No broken references
4. All tests pass

## Related Tickets

**Part of Story:** STORY-2.3
**Depends On:** TASK-2.3.1, TASK-2.3.2, TASK-2.3.3
**Completes:** STORY-2.3
