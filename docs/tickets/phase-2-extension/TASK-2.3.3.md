# TASK-2.3.3: Create BreadcrumbNavigation Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.3 - Extract Utility Components
**Estimated Time:** 10 minutes
**Priority:** Low
**Status:** Not Started

## Description

Create a reusable `BreadcrumbNavigation.vue` component for consistent breadcrumb navigation across pages.

## Prerequisites

- ✅ Phase 2 Vite migration complete

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/components/common/BreadcrumbNavigation.vue`
   - [ ] Accept items array prop
   - [ ] Emit navigate events

2. **Display**
   - [ ] Show breadcrumb items
   - [ ] Show separators
   - [ ] Active item not clickable
   - [ ] Clickable items emit events

## Implementation

```vue
<template>
  <div class="breadcrumb-navigation">
    <template v-for="(item, index) in items" :key="index">
      <a
        v-if="!item.active"
        class="breadcrumb-item clickable"
        @click="$emit('navigate', item)"
      >
        <i v-if="item.icon" :class="item.icon"></i>
        {{ item.label }}
      </a>

      <span v-else class="breadcrumb-item active">
        <i v-if="item.icon" :class="item.icon"></i>
        {{ item.label }}
      </span>

      <i
        v-if="index < items.length - 1"
        class="pi pi-chevron-right breadcrumb-separator"
      ></i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BreadcrumbNavigation',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) => items.every(item =>
        item.label && (item.active !== undefined)
      )
    }
  },
  emits: ['navigate']
};
</script>

<style scoped>
.breadcrumb-navigation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item.clickable {
  cursor: pointer;
  color: var(--primary-color);
}

.breadcrumb-item.clickable:hover {
  color: var(--primary-color-hover);
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: var(--text-color-secondary);
  font-weight: 600;
}

.breadcrumb-separator {
  color: var(--text-color-secondary);
  font-size: 0.75rem;
}
</style>
```

## Usage Example

```vue
<BreadcrumbNavigation
  :items="[
    { label: 'Dashboard', icon: 'pi pi-home', link: '/', active: false },
    { label: 'Project Name', icon: 'pi pi-folder', active: true }
  ]"
  @navigate="handleNavigate"
/>
```

## Testing Checklist

- [ ] Component renders
- [ ] Items display
- [ ] Separators display
- [ ] Click emits navigate event
- [ ] Active item not clickable
- [ ] Icons display

## Files to Create

- `/home/claude/manager/src/components/common/BreadcrumbNavigation.vue`

## Success Indicators

1. Component works in pages
2. Can be reused
3. Consistent appearance

## Related Tickets

**Part of Story:** STORY-2.3
