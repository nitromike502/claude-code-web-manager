# TASK-2.1.2: Create ConfigItemList Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.1 - Extract Core Card Components
**Estimated Time:** 20 minutes
**Priority:** Critical
**Status:** Not Started

## Description

Create a reusable Vue component `ConfigItemList.vue` that renders configuration item rows with consistent styling and type-specific formatting. This component will handle the display of agents, commands, hooks, and MCP servers with appropriate formatting for each type.

## Prerequisites

- ✅ Phase 2 Vite migration complete
- ✅ Understanding of current item rendering patterns in ProjectDetail.vue and UserGlobal.vue

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/components/cards/ConfigItemList.vue` file
   - [ ] Use Vue 3 Single File Component (SFC) format
   - [ ] Include template, script, and scoped style sections

2. **Props Interface**
   - [ ] `items` (Array, required) - List of configuration items
   - [ ] `type` (String, required) - Config type: 'agents' | 'commands' | 'hooks' | 'mcp'

3. **Item Rendering**
   - [ ] Display item name/title prominently
   - [ ] Display type-specific description/details
   - [ ] Show "View Details" button on hover
   - [ ] Handle missing/null fields gracefully

4. **Type-Specific Formatting**
   - [ ] **Agents:** Show name + description
   - [ ] **Commands:** Show name + usage/description
   - [ ] **Hooks:** Show event type + description
   - [ ] **MCP Servers:** Show name + command

5. **Events**
   - [ ] `@item-click` - Emitted when item clicked (payload: item object)

6. **Styling**
   - [ ] Hover state with background change
   - [ ] Smooth transitions
   - [ ] Consistent spacing and alignment
   - [ ] Responsive design

## Implementation Notes

### Component Template Structure

```vue
<template>
  <div class="config-item-list">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="config-item"
      @click="$emit('item-click', item)"
    >
      <div class="item-content">
        <div class="item-title">{{ getItemTitle(item) }}</div>
        <div class="item-description">{{ getItemDescription(item) }}</div>
      </div>
      <button class="view-details-btn">
        <i class="pi pi-eye"></i>
        View Details
      </button>
    </div>
  </div>
</template>
```

### Component Script

```vue
<script>
export default {
  name: 'ConfigItemList',
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['agents', 'commands', 'hooks', 'mcp'].includes(value)
    }
  },
  emits: ['item-click'],
  methods: {
    getItemTitle(item) {
      // All types have 'name' or similar field
      return item.name || item.title || 'Untitled';
    },

    getItemDescription(item) {
      switch (this.type) {
        case 'agents':
          return item.description || 'No description available';

        case 'commands':
          return item.usage || item.description || 'No usage information';

        case 'hooks':
          return `${item.event || 'Unknown event'}: ${item.description || 'No description'}`;

        case 'mcp':
          return `Command: ${item.command || 'Not specified'}`;

        default:
          return item.description || '';
      }
    }
  }
};
</script>
```

### Component Styles

```vue
<style scoped>
.config-item-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.config-item:hover {
  background: var(--surface-hover);
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.item-content {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-details-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.config-item:hover .view-details-btn {
  opacity: 1;
}

.view-details-btn:hover {
  background: var(--primary-color-hover);
}

.view-details-btn i {
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .view-details-btn {
    opacity: 1; /* Always show on mobile */
    padding: 0.5rem;
    font-size: 0;
  }

  .view-details-btn i {
    margin: 0;
  }
}
</style>
```

## Testing Checklist

### Manual Testing
- [ ] Component renders without errors
- [ ] Item list displays correctly
- [ ] Item titles display correctly
- [ ] Agent descriptions format correctly
- [ ] Command usage/description formats correctly
- [ ] Hook event + description formats correctly
- [ ] MCP command formats correctly
- [ ] Hover state applies background change
- [ ] Hover state shows "View Details" button
- [ ] Click event emitted with correct item data
- [ ] Missing fields handled gracefully (no errors)
- [ ] Null/undefined descriptions show fallback text
- [ ] Responsive layout on mobile (button always visible)
- [ ] Dark mode styling correct
- [ ] Light mode styling correct

### Component Testing (Playwright)

Add to test file: `tests/frontend/components/ConfigItemList.spec.js`

```javascript
import { test, expect } from '@playwright/test';
import { mount } from '@playwright/experimental-ct-vue';
import ConfigItemList from '../../../src/components/cards/ConfigItemList.vue';

test.describe('ConfigItemList Component', () => {
  test('renders agent items correctly', async ({ mount }) => {
    const items = [
      { name: 'Test Agent', description: 'Test description' },
      { name: 'Another Agent', description: 'Another description' }
    ];

    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'agents'
      }
    });

    await expect(component.locator('.config-item')).toHaveCount(2);
    await expect(component.locator('.item-title').first()).toContainText('Test Agent');
    await expect(component.locator('.item-description').first()).toContainText('Test description');
  });

  test('renders command items with usage', async ({ mount }) => {
    const items = [
      { name: '/test', usage: '/test [options]' }
    ];

    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'commands'
      }
    });

    await expect(component.locator('.item-description')).toContainText('/test [options]');
  });

  test('renders hook items with event type', async ({ mount }) => {
    const items = [
      { name: 'On Save', event: 'pre-commit', description: 'Run before commit' }
    ];

    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'hooks'
      }
    });

    await expect(component.locator('.item-description')).toContainText('pre-commit');
    await expect(component.locator('.item-description')).toContainText('Run before commit');
  });

  test('renders MCP items with command', async ({ mount }) => {
    const items = [
      { name: 'Test Server', command: 'node server.js' }
    ];

    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'mcp'
      }
    });

    await expect(component.locator('.item-description')).toContainText('Command: node server.js');
  });

  test('emits item-click event on item click', async ({ mount }) => {
    const items = [
      { name: 'Test Item', description: 'Test' }
    ];

    let clickedItem = null;
    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'agents'
      },
      on: {
        'item-click': (item) => {
          clickedItem = item;
        }
      }
    });

    await component.locator('.config-item').first().click();
    expect(clickedItem).toEqual(items[0]);
  });

  test('handles missing description gracefully', async ({ mount }) => {
    const items = [
      { name: 'Test Agent' }  // No description
    ];

    const component = await mount(ConfigItemList, {
      props: {
        items,
        type: 'agents'
      }
    });

    await expect(component.locator('.item-description')).toContainText('No description available');
  });
});
```

## Files to Create

- `/home/claude/manager/src/components/cards/ConfigItemList.vue` - Main component file

## Files to Reference

- `/home/claude/manager/src/components/ProjectDetail.vue` - Existing item rendering
- `/home/claude/manager/src/components/UserGlobal.vue` - Existing item rendering

## Dependencies

**Used By:**
- TASK-2.1.1 - ConfigCard component

**Enables:**
- TASK-2.1.3 - Refactor ProjectDetail to use ConfigCard
- TASK-2.1.4 - Refactor UserGlobal to use ConfigCard

## Success Indicators

1. Component file created and compiles without errors
2. All props properly typed and validated
3. Type-specific formatting works for all 4 types
4. Events emitted with correct payloads
5. Styling uses CSS variables
6. Responsive design works on mobile

## Related Tickets

**Part of Story:** STORY-2.1 (Extract Core Card Components)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

**Works With:**
- TASK-2.1.1 - Create ConfigCard component

**Blocks:**
- TASK-2.1.3 - Refactor ProjectDetail to use ConfigCard
- TASK-2.1.4 - Refactor UserGlobal to use ConfigCard

## Notes

### Type-Specific Formatting Logic

Each config type has different data structures:

**Agents:**
- Primary: `name`
- Secondary: `description`

**Commands:**
- Primary: `name`
- Secondary: `usage` (fallback to `description`)

**Hooks:**
- Primary: `name` or `event`
- Secondary: `event + description` combination

**MCP Servers:**
- Primary: `name`
- Secondary: `command` information

### Graceful Degradation

The component handles missing data gracefully:
- Missing title → "Untitled"
- Missing description → "No description available"
- Missing usage → "No usage information"
- Missing event → "Unknown event"
- Missing command → "Not specified"

### Accessibility

- Proper semantic HTML (clickable divs have role="button")
- Keyboard navigation support (tab/enter)
- Screen reader friendly descriptions
- ARIA labels where needed
