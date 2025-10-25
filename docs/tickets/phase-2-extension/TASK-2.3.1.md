# TASK-2.3.1: Create LoadingState Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.3 - Extract Utility Components
**Estimated Time:** 10 minutes
**Priority:** Medium
**Status:** Not Started

## Description

Create a reusable `LoadingState.vue` component for consistent loading indicators across the application.

## Prerequisites

- ✅ Phase 2 Vite migration complete

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/components/common/LoadingState.vue`
   - [ ] Accept optional message prop
   - [ ] Accept optional size prop

2. **Display**
   - [ ] Show spinning icon
   - [ ] Show customizable message
   - [ ] Support small/medium/large sizes

## Implementation

```vue
<template>
  <div class="loading-state" :class="sizeClass">
    <i class="pi pi-spinner pi-spin"></i>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    message: {
      type: String,
      default: 'Loading...'
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    sizeClass() {
      return `size-${this.size}`;
    }
  }
};
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.loading-state i {
  font-size: 2rem;
  color: var(--primary-color);
}

.loading-state p {
  margin: 0;
  font-size: 0.875rem;
}

.loading-state.size-small i {
  font-size: 1.5rem;
}

.loading-state.size-large i {
  font-size: 3rem;
}
</style>
```

## Usage Example

```vue
<LoadingState message="Loading projects..." />
<LoadingState size="small" />
```

## Testing Checklist

- [ ] Component renders
- [ ] Message displays
- [ ] Size variants work
- [ ] Spinner animates

## Files to Create

- `/home/claude/manager/src/components/common/LoadingState.vue`

## Success Indicators

1. Component works in ConfigCard
2. Can be reused elsewhere
3. Consistent appearance

## Related Tickets

**Part of Story:** STORY-2.3
**Used By:** ConfigCard (TASK-2.1.1)
