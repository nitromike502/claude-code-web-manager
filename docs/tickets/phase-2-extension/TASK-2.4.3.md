# TASK-2.4.3: Documentation & Code Cleanup

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.4 - Testing & Documentation
**Estimated Time:** 10 minutes
**Priority:** High
**Status:** Not Started

## Description

Document all new components with prop/event documentation, create usage examples, update CLAUDE.md with the new architecture, and clean up any remaining code comments or unused imports.

## Prerequisites

- ✅ All refactoring complete (Stories 2.1, 2.2, 2.3)
- ✅ All tests passing (TASK-2.4.1, TASK-2.4.2)

## Acceptance Criteria

1. **Component Documentation**
   - [ ] Each component has JSDoc comments
   - [ ] Props documented with types
   - [ ] Events documented with payloads
   - [ ] Usage examples provided

2. **Architecture Documentation**
   - [ ] CLAUDE.md updated with component hierarchy
   - [ ] Component library documented
   - [ ] Migration notes added

3. **Code Cleanup**
   - [ ] Remove all commented-out code
   - [ ] Remove unused imports
   - [ ] Remove unused CSS
   - [ ] Fix any ESLint warnings

4. **Create Component Library Doc**
   - [ ] Create COMPONENT-LIBRARY.md
   - [ ] Document all 6 components
   - [ ] Provide usage examples

## Implementation Notes

### Component JSDoc Comments

Add to each component:

```vue
<script>
/**
 * ConfigCard - Reusable configuration section wrapper
 *
 * Displays configuration items (agents, commands, hooks, MCP servers)
 * with loading, empty, and expanded states.
 *
 * @component
 * @example
 * <ConfigCard
 *   title="Subagents"
 *   :count="agents.length"
 *   icon="pi pi-users"
 *   color="var(--color-agents)"
 *   :loading="loading"
 *   :items="agents"
 *   :showing-all="showingAll"
 *   @toggle-show-all="toggleShowAll('agents')"
 *   @item-selected="showDetail($event, 'agents', agents)"
 * />
 */
export default {
  name: 'ConfigCard',

  /**
   * Component props
   * @property {String} title - Card title (e.g., "Subagents")
   * @property {Number} count - Number of items
   * @property {String} icon - PrimeIcons class
   * @property {String} color - CSS variable for theme color
   * @property {Boolean} loading - Loading state
   * @property {Array} items - Configuration items
   * @property {Boolean} showingAll - Expand/collapse state
   * @property {Number} initialDisplayCount - Items to show initially
   */
  props: { /* ... */ },

  /**
   * Component events
   * @event toggle-show-all - Emitted when show more/less clicked
   * @event item-selected - Emitted when item clicked
   */
  emits: ['toggle-show-all', 'item-selected']
};
</script>
```

### Update CLAUDE.md

Add section after "## Component Architecture (Phase 2.1)":

```markdown
## Component Architecture (Phase 2.1 - Refactoring Complete)

### Reusable Component Library

Phase 2.1 extracted reusable components to eliminate 70%+ code duplication and establish patterns for future development.

**Configuration Display Components:**
- **ConfigCard** (`src/components/cards/ConfigCard.vue`) - Configuration section wrapper with loading/empty/items states
- **ConfigItemList** (`src/components/cards/ConfigItemList.vue`) - Type-aware item rendering for all 4 config types
- **ConfigDetailSidebar** (`src/components/sidebar/ConfigDetailSidebar.vue`) - Detail view with metadata and navigation

**Utility Components:**
- **LoadingState** (`src/components/common/LoadingState.vue`) - Consistent loading indicators
- **EmptyState** (`src/components/common/EmptyState.vue`) - Consistent empty state displays
- **BreadcrumbNavigation** (`src/components/common/BreadcrumbNavigation.vue`) - Reusable breadcrumb navigation

### Component Hierarchy

```
src/components/
├── cards/
│   ├── ConfigCard.vue           # Configuration section wrapper
│   └── ConfigItemList.vue       # Item list rendering
├── sidebar/
│   └── ConfigDetailSidebar.vue  # Detail view sidebar
├── common/
│   ├── LoadingState.vue         # Loading indicators
│   ├── EmptyState.vue           # Empty state displays
│   └── BreadcrumbNavigation.vue # Breadcrumb navigation
├── Dashboard.vue                # Project list (uses common components)
├── ProjectDetail.vue            # Project config (uses all card/sidebar components)
└── UserGlobal.vue               # User config (uses all card/sidebar components)
```

### Code Reduction Metrics

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| ProjectDetail.vue | 1192 LOC | 450 LOC | 742 LOC (62%) |
| UserGlobal.vue | 965 LOC | 380 LOC | 585 LOC (61%) |
| **Total** | **2157 LOC** | **830 LOC** | **1327 LOC (62%)** |

New reusable components: 350 LOC
Net code reduction: 977 LOC (45% overall)

### Usage Patterns

See `/home/claude/manager/docs/components/COMPONENT-LIBRARY.md` for detailed component documentation and usage examples.
```

### Create COMPONENT-LIBRARY.md

```markdown
# Component Library

Reusable Vue components for the Claude Code Manager application.

## Configuration Components

### ConfigCard

Configuration section wrapper with loading, empty, and items states.

**Props:**
- `title` (String, required) - Card title
- `count` (Number, required) - Item count
- `icon` (String, required) - PrimeIcons class
- `color` (String, required) - CSS variable for theme color
- `loading` (Boolean, default: false) - Loading state
- `items` (Array, required) - Configuration items
- `showingAll` (Boolean, default: false) - Expand/collapse state
- `initialDisplayCount` (Number, default: 5) - Items to show initially

**Events:**
- `@toggle-show-all` - Emitted when show more/less clicked
- `@item-selected` - Emitted when item clicked (payload: item object)

**Usage:**
```vue
<ConfigCard
  title="Subagents"
  :count="agents.length"
  icon="pi pi-users"
  color="var(--color-agents)"
  :loading="loadingAgents"
  :items="agents"
  :showing-all="showingAllAgents"
  @toggle-show-all="toggleShowAll('agents')"
  @item-selected="showDetail($event, 'agents', agents)"
/>
```

### ConfigItemList

Type-aware item rendering for configuration lists.

**Props:**
- `items` (Array, required) - Configuration items
- `type` (String, required) - Config type: 'agents' | 'commands' | 'hooks' | 'mcp'

**Events:**
- `@item-click` - Emitted when item clicked (payload: item object)

**Usage:**
```vue
<ConfigItemList
  :items="displayedItems"
  :type="'agents'"
  @item-click="handleItemClick"
/>
```

### ConfigDetailSidebar

Detail view sidebar with type-aware metadata display and navigation.

**Props:**
- `item` (Object, required) - Selected configuration item
- `type` (String, required) - Config type: 'agents' | 'commands' | 'hooks' | 'mcp'
- `currentItems` (Array, required) - Full list for navigation
- `currentIndex` (Number, required) - Current item index

**Events:**
- `@close` - Emitted when close button clicked
- `@navigate` - Emitted when prev/next clicked (payload: 'prev' | 'next')

**Usage:**
```vue
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

## Utility Components

### LoadingState

Consistent loading indicator with customizable message.

**Props:**
- `message` (String, default: 'Loading...') - Loading message
- `size` (String, default: 'medium') - Size: 'small' | 'medium' | 'large'

**Usage:**
```vue
<LoadingState message="Loading projects..." />
<LoadingState size="small" />
```

### EmptyState

Consistent empty state display.

**Props:**
- `icon` (String, default: 'pi pi-inbox') - PrimeIcons class
- `message` (String, required) - Empty state message
- `subtitle` (String, default: '') - Optional subtitle

**Usage:**
```vue
<EmptyState
  icon="pi pi-users"
  message="No subagents found"
  subtitle="Create your first subagent to get started"
/>
```

### BreadcrumbNavigation

Reusable breadcrumb navigation.

**Props:**
- `items` (Array, required) - Breadcrumb items with { label, icon, active }

**Events:**
- `@navigate` - Emitted when breadcrumb clicked (payload: item object)

**Usage:**
```vue
<BreadcrumbNavigation
  :items="[
    { label: 'Dashboard', icon: 'pi pi-home', active: false },
    { label: 'Project Name', icon: 'pi pi-folder', active: true }
  ]"
  @navigate="handleNavigate"
/>
```
```

### Code Cleanup Checklist

- [ ] Remove all `<!-- OLD CODE -->` comments
- [ ] Remove unused imports (check each file)
- [ ] Remove unused CSS classes
- [ ] Remove console.log statements
- [ ] Fix ESLint warnings
- [ ] Remove TODO comments (or convert to issues)
- [ ] Verify no dead code

### ESLint Check

```bash
npm run lint
```

Fix any warnings before completion.

## Files to Create

- `/home/claude/manager/docs/components/COMPONENT-LIBRARY.md`

## Files to Modify

- `/home/claude/manager/CLAUDE.md` - Add component architecture section
- `/home/claude/manager/src/components/cards/ConfigCard.vue` - Add JSDoc comments
- `/home/claude/manager/src/components/cards/ConfigItemList.vue` - Add JSDoc comments
- `/home/claude/manager/src/components/sidebar/ConfigDetailSidebar.vue` - Add JSDoc comments
- `/home/claude/manager/src/components/common/LoadingState.vue` - Add JSDoc comments
- `/home/claude/manager/src/components/common/EmptyState.vue` - Add JSDoc comments
- `/home/claude/manager/src/components/common/BreadcrumbNavigation.vue` - Add JSDoc comments

## Success Indicators

1. All components have JSDoc comments
2. COMPONENT-LIBRARY.md complete
3. CLAUDE.md updated
4. No commented-out code
5. No unused imports
6. No ESLint warnings
7. Clean, professional codebase

## Related Tickets

**Part of Story:** STORY-2.4
**Completes:** EPIC-4 (Phase 2 Extension - Component Refactoring)

## Notes

This is the final task in the epic. After completion:
- EPIC-4 is complete
- Phase 2.1 is complete
- Codebase is ready for Phase 3+ development
- Component patterns established for future work
