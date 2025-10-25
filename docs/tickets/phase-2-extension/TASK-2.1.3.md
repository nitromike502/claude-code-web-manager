# TASK-2.1.3: Refactor ProjectDetail to use ConfigCard

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.1 - Extract Core Card Components
**Estimated Time:** 15 minutes
**Priority:** High
**Status:** Not Started

## Description

Refactor `ProjectDetail.vue` to use the new `ConfigCard` component instead of inline card markup. Remove duplicate code for all 4 configuration types (Agents, Commands, Hooks, MCP) and replace with the reusable component.

## Prerequisites

- ✅ TASK-2.1.1 complete (ConfigCard component created)
- ✅ TASK-2.1.2 complete (ConfigItemList component created)
- ✅ Current ProjectDetail.vue functional

## Acceptance Criteria

1. **Import New Components**
   - [ ] Import ConfigCard component
   - [ ] Remove old card-related markup

2. **Replace Card Markup**
   - [ ] Replace Agents card section with `<ConfigCard>`
   - [ ] Replace Commands card section with `<ConfigCard>`
   - [ ] Replace Hooks card section with `<ConfigCard>`
   - [ ] Replace MCP card section with `<ConfigCard>`

3. **State Management**
   - [ ] Keep existing data properties (agents, commands, hooks, mcp)
   - [ ] Keep existing loading states
   - [ ] Keep existing showingAll states
   - [ ] Update event handlers to work with ConfigCard events

4. **Functionality Preserved**
   - [ ] All cards display correctly
   - [ ] Loading states work
   - [ ] Empty states work
   - [ ] "Show more/less" works
   - [ ] Item selection works (opens sidebar)

5. **Code Reduction**
   - [ ] Remove ~180 lines of duplicate card markup
   - [ ] Replace with ~40 lines of ConfigCard usage

## Implementation Notes

### Before: Inline Card Markup (Example for Agents)

```vue
<!-- OLD CODE - TO BE REMOVED -->
<div class="config-card agents-card">
  <div class="card-header">
    <div class="header-left">
      <i class="pi pi-users"></i>
      <h3>Subagents</h3>
      <span class="count-badge">{{ agents.length }}</span>
    </div>
  </div>

  <div v-if="loadingAgents" class="card-body loading">
    <i class="pi pi-spinner pi-spin"></i>
    <p>Loading agents...</p>
  </div>

  <div v-else-if="agents.length === 0" class="card-body empty">
    <i class="pi pi-users"></i>
    <p>No subagents found</p>
  </div>

  <div v-else class="card-body">
    <!-- Item list rendering -->
    <div
      v-for="agent in displayedAgents"
      :key="agent.name"
      class="config-item"
      @click="showDetail(agent, 'agents', agents)"
    >
      <div class="item-content">
        <div class="item-title">{{ agent.name }}</div>
        <div class="item-description">{{ agent.description }}</div>
      </div>
      <button class="view-details-btn">
        <i class="pi pi-eye"></i>
        View Details
      </button>
    </div>

    <button
      v-if="agents.length > initialDisplayCount"
      class="toggle-button"
      @click="toggleShowAll('agents')"
    >
      {{ showingAllAgents ? 'Show Less' : `Show More (${agents.length - initialDisplayCount} hidden)` }}
    </button>
  </div>
</div>
```

### After: ConfigCard Component

```vue
<!-- NEW CODE - CLEAN AND SIMPLE -->
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
```

### Updated Script Section

```vue
<script>
import { useProjectsStore } from '../stores/projects';
import { useNotificationsStore } from '../stores/notifications';
import ConfigCard from './cards/ConfigCard.vue';
import ConfigDetailSidebar from './sidebar/ConfigDetailSidebar.vue'; // Added in Story 2.2

export default {
  name: 'ProjectDetail',
  components: {
    ConfigCard,
    ConfigDetailSidebar  // Added in Story 2.2
  },

  // ... rest of the component stays the same

  // Keep existing data(), methods, computed, etc.
  // Only the template changes!
};
</script>
```

### Complete Template Update

```vue
<template>
  <div class="project-detail">
    <!-- Breadcrumbs - unchanged -->
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-link">
        <i class="pi pi-home"></i>
        Dashboard
      </router-link>
      <i class="pi pi-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">
        <i class="pi pi-folder"></i>
        {{ project?.name || 'Project' }}
      </span>
    </div>

    <!-- Project info - unchanged -->
    <div v-if="project" class="project-info">
      <h2>{{ project.name }}</h2>
      <p class="project-path">{{ project.path }}</p>
    </div>

    <!-- Loading state - unchanged -->
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spinner pi-spin"></i>
      <p>Loading project...</p>
    </div>

    <!-- Error state - unchanged -->
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>

    <!-- Configuration Cards - REFACTORED -->
    <div v-else class="config-cards">
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

### CSS Cleanup

Remove old card-related CSS:

```vue
<style scoped>
/* REMOVE these classes - now in ConfigCard component:
  .config-card
  .agents-card
  .commands-card
  .hooks-card
  .mcp-card
  .card-header
  .header-left
  .count-badge
  .card-body
  .loading
  .empty
  .config-item
  .item-content
  .item-title
  .item-description
  .view-details-btn
  .toggle-button
*/

/* Keep only page-level styles */
.project-detail {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumbs {
  /* existing breadcrumb styles */
}

.project-info {
  /* existing project info styles */
}

.config-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

/* Keep sidebar styles - will be refactored in Story 2.2 */
.detail-sidebar {
  /* existing sidebar styles */
}
</style>
```

## Testing Checklist

### Manual Testing
- [ ] Page loads without errors
- [ ] All 4 cards display correctly
- [ ] Agents card shows correct data
- [ ] Commands card shows correct data
- [ ] Hooks card shows correct data
- [ ] MCP card shows correct data
- [ ] Loading states work for all cards
- [ ] Empty states work for all cards
- [ ] "Show more" works for all cards
- [ ] "Show less" works for all cards
- [ ] Item click opens sidebar (existing functionality)
- [ ] Card colors correct (green/blue/orange/purple)
- [ ] Responsive layout maintained
- [ ] Dark mode works
- [ ] Light mode works

### Automated Testing
- [ ] All existing Playwright tests pass
- [ ] No console errors or warnings
- [ ] No visual regressions

## Files to Modify

- `/home/claude/manager/src/components/ProjectDetail.vue` - Main refactoring

## Files to Reference

- `/home/claude/manager/src/components/cards/ConfigCard.vue` - New component to use
- `/home/claude/manager/src/components/cards/ConfigItemList.vue` - Used by ConfigCard

## Dependencies

**Requires:**
- TASK-2.1.1 - ConfigCard component created ✅
- TASK-2.1.2 - ConfigItemList component created ✅

**Enables:**
- TASK-2.1.4 - Refactor UserGlobal (can follow same pattern)
- TASK-2.1.5 - Testing & validation

## Success Indicators

1. All 4 cards render using ConfigCard component
2. All functionality preserved (no regressions)
3. ~180 lines of code removed
4. All existing tests pass
5. No visual differences from original

## Related Tickets

**Part of Story:** STORY-2.1 (Extract Core Card Components)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

**Depends On:**
- TASK-2.1.1 - Create ConfigCard component
- TASK-2.1.2 - Create ConfigItemList component

**Enables:**
- TASK-2.1.4 - Refactor UserGlobal to use ConfigCard

## Notes

### Refactoring Strategy

1. **Import new components** at the top of the script
2. **Replace one card at a time** (Agents first, then Commands, etc.)
3. **Test after each replacement** to catch issues early
4. **Remove old CSS** only after all cards working
5. **Keep sidebar code** unchanged (refactored in Story 2.2)

### Data Properties to Keep

All existing data properties stay the same:
- `agents`, `commands`, `hooks`, `mcp` - data arrays
- `loadingAgents`, `loadingCommands`, etc. - loading states
- `showingAllAgents`, `showingAllCommands`, etc. - expand states
- `initialDisplayCount` - display limit

### Methods to Keep

All existing methods stay the same:
- `loadProject()` - data fetching
- `toggleShowAll()` - expand/collapse handler
- `showDetail()` - sidebar display handler
- All other utility methods

### What Actually Changes

**Only the template changes!**
- Old: Inline card markup (180 lines)
- New: ConfigCard components (40 lines)

Everything else stays exactly the same.

### Rollback Plan

If issues arise:
1. Git can revert the template changes easily
2. Old card CSS is still in git history
3. Component is prop-driven, so easy to debug
4. Can revert one card at a time if needed
