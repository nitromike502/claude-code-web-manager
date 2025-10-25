# TASK-2.1.1: Create ConfigCard Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.1 - Extract Core Card Components
**Estimated Time:** 30 minutes
**Priority:** Critical
**Status:** Not Started

## Description

Create a reusable Vue component `ConfigCard.vue` that serves as a wrapper for configuration item sections. This component will replace the duplicated card markup in both `ProjectDetail.vue` and `UserGlobal.vue`, providing consistent display states (loading/empty/items) and interaction patterns.

## Prerequisites

- ✅ Phase 2 Vite migration complete
- ✅ Current ProjectDetail.vue and UserGlobal.vue functional
- ✅ Existing card styling patterns identified

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/components/cards/ConfigCard.vue` file
   - [ ] Use Vue 3 Single File Component (SFC) format
   - [ ] Include template, script, and scoped style sections

2. **Props Interface**
   - [ ] `title` (String, required) - Card title (e.g., "Subagents")
   - [ ] `count` (Number, required) - Item count
   - [ ] `icon` (String, required) - PrimeIcons class
   - [ ] `color` (String, required) - CSS variable for theme color
   - [ ] `loading` (Boolean, default: false) - Loading state
   - [ ] `items` (Array, required) - Configuration items
   - [ ] `showingAll` (Boolean, default: false) - Expand/collapse state
   - [ ] `initialDisplayCount` (Number, default: 5) - Items to show initially

3. **Display States**
   - [ ] **Loading State:** Show skeleton loader when `loading = true`
   - [ ] **Empty State:** Show empty message when `items.length === 0`
   - [ ] **Items State:** Show item list when items exist
   - [ ] **Collapsed State:** Show only `initialDisplayCount` items when `showingAll = false`
   - [ ] **Expanded State:** Show all items when `showingAll = true`

4. **Events**
   - [ ] `@toggle-show-all` - Emitted when "Show more/less" button clicked
   - [ ] `@item-selected` - Emitted when item clicked (payload: item object)

5. **Styling**
   - [ ] Card border with theme color
   - [ ] Card header with icon, title, and count badge
   - [ ] Scoped CSS prevents style bleeding
   - [ ] Uses CSS variables for theming
   - [ ] Responsive layout

## Implementation Notes

### Component Template Structure

```vue
<template>
  <div class="config-card" :style="{ borderColor: color }">
    <!-- Header -->
    <div class="card-header">
      <div class="header-left">
        <i :class="icon"></i>
        <h3>{{ title }}</h3>
        <span class="count-badge" :style="{ backgroundColor: color }">
          {{ count }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card-body loading">
      <LoadingState message="Loading..." />
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="card-body empty">
      <EmptyState
        :icon="icon"
        :message="`No ${title.toLowerCase()} found`"
      />
    </div>

    <!-- Items List -->
    <div v-else class="card-body">
      <ConfigItemList
        :items="displayedItems"
        :type="getTypeFromTitle()"
        @item-click="$emit('item-selected', $event)"
      />

      <!-- Show More/Less Button -->
      <button
        v-if="items.length > initialDisplayCount"
        class="toggle-button"
        @click="$emit('toggle-show-all')"
      >
        {{ showingAll ? 'Show Less' : `Show More (${items.length - initialDisplayCount} hidden)` }}
      </button>
    </div>
  </div>
</template>
```

### Component Script

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
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    showingAll: {
      type: Boolean,
      default: false
    },
    initialDisplayCount: {
      type: Number,
      default: 5
    }
  },
  emits: ['toggle-show-all', 'item-selected'],
  computed: {
    displayedItems() {
      if (this.showingAll) {
        return this.items;
      }
      return this.items.slice(0, this.initialDisplayCount);
    }
  },
  methods: {
    getTypeFromTitle() {
      // Convert title to type string
      const titleMap = {
        'Subagents': 'agents',
        'Slash Commands': 'commands',
        'Hooks': 'hooks',
        'MCP Servers': 'mcp'
      };
      return titleMap[this.title] || 'agents';
    }
  }
};
</script>
```

### Component Styles

```vue
<style scoped>
.config-card {
  background: var(--surface-ground);
  border: 2px solid;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.config-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--surface-section);
  border-bottom: 1px solid var(--surface-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-left i {
  font-size: 1.5rem;
  color: var(--text-color);
}

.header-left h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.card-body {
  padding: 1rem;
}

.card-body.loading,
.card-body.empty {
  padding: 2rem;
  text-align: center;
}

.toggle-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: var(--surface-section);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background: var(--surface-hover);
}

.toggle-button:active {
  transform: scale(0.98);
}
</style>
```

## Testing Checklist

### Manual Testing
- [ ] Component renders without errors
- [ ] Loading state displays skeleton loader
- [ ] Empty state displays when items array is empty
- [ ] Items display when data is loaded
- [ ] Only `initialDisplayCount` items shown when collapsed
- [ ] All items shown when expanded
- [ ] "Show more" button appears when items > initialDisplayCount
- [ ] "Show more" button shows correct count
- [ ] "Show less" button appears when expanded
- [ ] toggle-show-all event emitted on button click
- [ ] item-selected event emitted on item click
- [ ] Card border color matches `color` prop
- [ ] Count badge background matches `color` prop
- [ ] Component works for all 4 config types
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Dark mode styling correct
- [ ] Light mode styling correct

### Component Testing (Playwright)

Create test file: `tests/frontend/components/ConfigCard.spec.js`

```javascript
import { test, expect } from '@playwright/test';
import { mount } from '@playwright/experimental-ct-vue';
import ConfigCard from '../../../src/components/cards/ConfigCard.vue';

test.describe('ConfigCard Component', () => {
  test('renders with required props', async ({ mount }) => {
    const component = await mount(ConfigCard, {
      props: {
        title: 'Subagents',
        count: 3,
        icon: 'pi pi-users',
        color: 'var(--color-agents)',
        items: [
          { name: 'Agent 1', description: 'Test agent 1' },
          { name: 'Agent 2', description: 'Test agent 2' },
          { name: 'Agent 3', description: 'Test agent 3' }
        ]
      }
    });

    await expect(component).toContainText('Subagents');
    await expect(component.locator('.count-badge')).toContainText('3');
  });

  test('displays loading state', async ({ mount }) => {
    const component = await mount(ConfigCard, {
      props: {
        title: 'Subagents',
        count: 0,
        icon: 'pi pi-users',
        color: 'var(--color-agents)',
        items: [],
        loading: true
      }
    });

    await expect(component.locator('.loading')).toBeVisible();
  });

  test('displays empty state', async ({ mount }) => {
    const component = await mount(ConfigCard, {
      props: {
        title: 'Subagents',
        count: 0,
        icon: 'pi pi-users',
        color: 'var(--color-agents)',
        items: []
      }
    });

    await expect(component.locator('.empty')).toBeVisible();
  });

  test('toggles show more/less', async ({ mount }) => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      name: `Item ${i + 1}`,
      description: `Description ${i + 1}`
    }));

    const component = await mount(ConfigCard, {
      props: {
        title: 'Subagents',
        count: 10,
        icon: 'pi pi-users',
        color: 'var(--color-agents)',
        items,
        initialDisplayCount: 5
      }
    });

    // Initially shows "Show More" button
    await expect(component.locator('.toggle-button')).toContainText('Show More');

    // Click to expand
    await component.locator('.toggle-button').click();

    // After click, parent should receive toggle-show-all event
    // Note: Event testing requires parent component or listener setup
  });
});
```

## Files to Create

- `/home/claude/manager/src/components/cards/ConfigCard.vue` - Main component file

## Files to Reference

- `/home/claude/manager/src/components/ProjectDetail.vue` - Existing card implementation
- `/home/claude/manager/src/components/UserGlobal.vue` - Existing card implementation
- `/home/claude/manager/src/styles/variables.css` - CSS variables

## Dependencies

**Requires:**
- LoadingState component (create in TASK-2.3.1 or stub for now)
- EmptyState component (create in TASK-2.3.2 or stub for now)
- ConfigItemList component (create in TASK-2.1.2 next)

**Note:** You can create stubs for LoadingState and EmptyState initially and replace them when those components are complete, or implement them first.

## Success Indicators

1. Component file created and compiles without errors
2. All props properly typed and validated
3. All display states render correctly
4. Events emitted with correct payloads
5. Styling uses CSS variables
6. Component is reusable for all 4 config types

## Related Tickets

**Part of Story:** STORY-2.1 (Extract Core Card Components)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

**Blocks:**
- TASK-2.1.2 - Create ConfigItemList component (can work in parallel)
- TASK-2.1.3 - Refactor ProjectDetail to use ConfigCard
- TASK-2.1.4 - Refactor UserGlobal to use ConfigCard

## Notes

### Design Decisions

**Props over Configuration:**
- Component is fully controlled by parent via props
- No internal state for data management
- Parent handles all state changes

**Event-Driven Interactions:**
- Component emits events, parent handles logic
- Keeps component generic and reusable
- Easier to test in isolation

**CSS Variables for Theming:**
- Uses existing CSS variable system
- Supports dark/light themes automatically
- Color customization via props

**Accessibility:**
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
