# TASK-2.1.4: Refactor UserGlobal to use ConfigCard

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.1 - Extract Core Card Components
**Estimated Time:** 10 minutes
**Priority:** High
**Status:** Not Started

## Description

Refactor `UserGlobal.vue` to use the new `ConfigCard` component, following the same pattern as `ProjectDetail.vue`. This should be quick since the pattern is already established.

## Prerequisites

- ✅ TASK-2.1.1 complete (ConfigCard component created)
- ✅ TASK-2.1.2 complete (ConfigItemList component created)
- ✅ TASK-2.1.3 complete (ProjectDetail refactored - pattern established)

## Acceptance Criteria

1. **Import New Components**
   - [ ] Import ConfigCard component
   - [ ] Remove old card-related markup

2. **Replace Card Markup**
   - [ ] Replace Agents card with `<ConfigCard>`
   - [ ] Replace Commands card with `<ConfigCard>`
   - [ ] Replace Hooks card with `<ConfigCard>`
   - [ ] Replace MCP card with `<ConfigCard>`

3. **Functionality Preserved**
   - [ ] All cards display correctly
   - [ ] Loading states work
   - [ ] Empty states work
   - [ ] "Show more/less" works
   - [ ] Item selection works

4. **Code Reduction**
   - [ ] Remove ~192 lines of duplicate markup
   - [ ] Replace with ~40 lines of ConfigCard usage

## Implementation Notes

Follow the exact same pattern as TASK-2.1.3 (ProjectDetail refactoring).

### Updated Template

```vue
<template>
  <div class="user-global">
    <!-- Breadcrumbs - unchanged -->
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-link">
        <i class="pi pi-home"></i>
        Dashboard
      </router-link>
      <i class="pi pi-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">
        <i class="pi pi-globe"></i>
        User Configuration
      </span>
    </div>

    <!-- Page title - unchanged -->
    <div class="page-header">
      <h2>User Configuration</h2>
      <p>Global settings that apply to all projects</p>
    </div>

    <!-- Configuration Cards - REFACTORED -->
    <div class="config-cards">
      <!-- Agents Card -->
      <ConfigCard
        title="Subagents"
        :count="agents.length"
        icon="pi pi-users"
        color="var(--color-agents)"
        :loading="loadingAgents"
        :items="agents"
        :showing-all="showingAllAgents"
        :initial-display-count="initialDisplayCount"
        @toggle-show-all="toggleShowAll('agents')"
        @item-selected="showDetail($event, 'agents', agents)"
      />

      <!-- Commands Card -->
      <ConfigCard
        title="Slash Commands"
        :count="commands.length"
        icon="pi pi-bolt"
        color="var(--color-commands)"
        :loading="loadingCommands"
        :items="commands"
        :showing-all="showingAllCommands"
        :initial-display-count="initialDisplayCount"
        @toggle-show-all="toggleShowAll('commands')"
        @item-selected="showDetail($event, 'commands', commands)"
      />

      <!-- Hooks Card -->
      <ConfigCard
        title="Hooks"
        :count="hooks.length"
        icon="pi pi-link"
        color="var(--color-hooks)"
        :loading="loadingHooks"
        :items="hooks"
        :showing-all="showingAllHooks"
        :initial-display-count="initialDisplayCount"
        @toggle-show-all="toggleShowAll('hooks')"
        @item-selected="showDetail($event, 'hooks', hooks)"
      />

      <!-- MCP Servers Card -->
      <ConfigCard
        title="MCP Servers"
        :count="mcp.length"
        icon="pi pi-server"
        color="var(--color-mcp)"
        :loading="loadingMCP"
        :items="mcp"
        :showing-all="showingAllMCP"
        :initial-display-count="initialDisplayCount"
        @toggle-show-all="toggleShowAll('mcp')"
        @item-selected="showDetail($event, 'mcp', mcp)"
      />
    </div>

    <!-- Sidebar - unchanged for now (refactored in Story 2.2) -->
    <div v-if="sidebarVisible" class="detail-sidebar">
      <!-- Existing sidebar code -->
    </div>
  </div>
</template>
```

### Updated Script

```vue
<script>
import { useNotificationsStore } from '../stores/notifications';
import ConfigCard from './cards/ConfigCard.vue';

export default {
  name: 'UserGlobal',
  components: {
    ConfigCard
  },

  // ... rest stays the same
};
</script>
```

### CSS Cleanup

Remove the same card-related CSS as in ProjectDetail.

## Testing Checklist

### Manual Testing
- [ ] Page loads without errors
- [ ] All 4 cards display correctly
- [ ] Loading states work
- [ ] Empty states work
- [ ] "Show more/less" works
- [ ] Item click opens sidebar
- [ ] Card colors correct
- [ ] Responsive layout maintained
- [ ] Dark/light mode works

### Automated Testing
- [ ] All existing tests pass
- [ ] No console errors
- [ ] No visual regressions

## Files to Modify

- `/home/claude/manager/src/components/UserGlobal.vue`

## Dependencies

**Requires:**
- TASK-2.1.1 - ConfigCard created ✅
- TASK-2.1.2 - ConfigItemList created ✅
- TASK-2.1.3 - ProjectDetail refactored ✅ (pattern established)

**Enables:**
- TASK-2.1.5 - Testing & validation

## Success Indicators

1. All 4 cards use ConfigCard component
2. All functionality preserved
3. ~192 lines removed
4. All tests pass
5. No visual differences

## Related Tickets

**Part of Story:** STORY-2.1 (Extract Core Card Components)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

## Notes

This should be quick since we're following the exact same pattern as ProjectDetail. Copy-paste the ConfigCard usage and adjust the component name references.
