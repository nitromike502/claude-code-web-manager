# TASK-2.2.3: Refactor ProjectDetail Sidebar

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.2 - Extract Sidebar Component
**Estimated Time:** 10 minutes
**Priority:** High
**Status:** Not Started

## Description

Replace the inline sidebar implementation in `ProjectDetail.vue` with the new `ConfigDetailSidebar` component.

## Prerequisites

- ✅ TASK-2.2.1 complete (ConfigDetailSidebar created)
- ✅ TASK-2.2.2 complete (MetadataDisplay logic refined) - optional

## Acceptance Criteria

1. **Import Component**
   - [ ] Import ConfigDetailSidebar
   - [ ] Remove old sidebar markup

2. **Replace Sidebar**
   - [ ] Use `<ConfigDetailSidebar>` component
   - [ ] Pass required props
   - [ ] Wire up events

3. **Functionality Preserved**
   - [ ] Sidebar opens on item click
   - [ ] Sidebar displays correct metadata
   - [ ] Navigation works (prev/next)
   - [ ] Close button works
   - [ ] Backdrop click closes sidebar

## Implementation Notes

### Before: Inline Sidebar (To Remove)

```vue
<!-- OLD CODE - REMOVE -->
<div v-if="sidebarVisible" class="detail-sidebar">
  <div class="sidebar-header">
    <!-- ... header code ... -->
  </div>
  <div class="sidebar-content">
    <!-- ... 70+ lines of metadata rendering ... -->
  </div>
  <div class="sidebar-footer">
    <!-- ... navigation code ... -->
  </div>
</div>
```

### After: ConfigDetailSidebar Component

```vue
<!-- NEW CODE - CLEAN -->
<ConfigDetailSidebar
  v-if="sidebarVisible"
  :item="selectedItem"
  :type="selectedType"
  :current-items="currentItems"
  :current-index="currentIndex"
  @close="closeSidebar"
  @navigate="navigateItem"
/>
```

### Updated Script

```vue
<script>
import ConfigCard from './cards/ConfigCard.vue';
import ConfigDetailSidebar from './sidebar/ConfigDetailSidebar.vue';

export default {
  name: 'ProjectDetail',
  components: {
    ConfigCard,
    ConfigDetailSidebar
  },

  // ... existing data, methods, etc. ...
  // No changes needed to methods - they already exist!
};
</script>
```

### CSS Cleanup

Remove all sidebar-related CSS (now in component):

```vue
<style scoped>
/* REMOVE:
  .detail-sidebar
  .sidebar-backdrop
  .sidebar-header
  .sidebar-content
  .sidebar-footer
  .metadata-field
  .field-label
  .field-value
  .nav-controls
  .nav-btn
  ... all sidebar styles
*/

/* KEEP only page-level styles:
  .project-detail
  .breadcrumbs
  .project-info
  .config-cards
*/
</style>
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

- `/home/claude/manager/src/components/ProjectDetail.vue`

## Success Indicators

1. Sidebar works identically to before
2. ~80 lines of code removed
3. All tests pass
4. No visual changes

## Related Tickets

**Part of Story:** STORY-2.2
**Depends On:** TASK-2.2.1
**Enables:** TASK-2.2.4
