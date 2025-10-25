# STORY-2.3: Extract Utility Components

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Estimated Time:** 30-45 minutes
**Priority:** Medium
**Status:** Not Started

## Description

Extract small utility components that are used across multiple pages: `LoadingState`, `EmptyState`, and `BreadcrumbNavigation`. These components provide consistent UI patterns and reduce duplication for common interface elements.

## Goals

1. Create reusable `LoadingState` component for loading indicators
2. Create reusable `EmptyState` component for empty data displays
3. Create reusable `BreadcrumbNavigation` component
4. Update all pages to use new utility components
5. Ensure consistent appearance across all pages

## Expected Code Reduction

- **Before:** ~10 lines × multiple locations = 30-40 lines
- **After:** ~15 lines shared components + ~3 lines usage per location = 25-30 lines
- **Reduction:** 10-15 lines (small but improves consistency)

## Tasks

10. **TASK-2.3.1:** Create LoadingState component (10 min)
    - Skeleton loader UI
    - Customizable loading message
    - Consistent styling

11. **TASK-2.3.2:** Create EmptyState component (10 min)
    - Empty state icon and message
    - Customizable content
    - Consistent styling

12. **TASK-2.3.3:** Create BreadcrumbNavigation component (10 min)
    - Breadcrumb structure
    - Navigation events
    - Responsive styling

13. **TASK-2.3.4:** Update all page imports (5 min)
    - Replace inline components with imports
    - Verify consistency across pages

## Acceptance Criteria

### Component Quality
- LoadingState component displays consistent loading indicator
- EmptyState component accepts customizable icon and message
- BreadcrumbNavigation component handles navigation events
- All components use scoped CSS

### Functionality
- Loading state displays during data fetching
- Empty state displays when no data available
- Breadcrumbs show correct navigation hierarchy
- Breadcrumb clicks navigate correctly
- All components support theming (dark/light)

### Code Quality
- Components accept minimal required props
- Default values provided for optional props
- CSS uses variables for theming
- Consistent visual appearance

### Testing
- All existing tests pass
- No visual regressions
- Components work in all contexts

## Dependencies

**Requires:**
- Phase 2 Vite migration complete ✅

**Can Run in Parallel With:**
- Story 2.1 (Card components)
- Story 2.2 (Sidebar component)

**Blocks:**
- Story 2.4 (Testing & Documentation) - depends on all component extraction

## Files to Create

- `/home/claude/manager/src/components/common/LoadingState.vue` - Loading indicator component
- `/home/claude/manager/src/components/common/EmptyState.vue` - Empty state component
- `/home/claude/manager/src/components/common/BreadcrumbNavigation.vue` - Breadcrumb component

## Files to Modify

- `/home/claude/manager/src/components/Dashboard.vue` - Use utility components
- `/home/claude/manager/src/components/ProjectDetail.vue` - Use utility components
- `/home/claude/manager/src/components/UserGlobal.vue` - Use utility components

## Success Indicators

1. All utility components render consistently across pages
2. Loading states uniform across application
3. Empty states uniform across application
4. Breadcrumbs work consistently
5. Code duplication eliminated for these patterns
6. All existing tests pass

## Testing Checklist

### Manual Testing

**LoadingState:**
- [ ] Displays during project list loading
- [ ] Displays during config data loading
- [ ] Shows spinner icon
- [ ] Shows loading message
- [ ] Styled correctly in dark mode
- [ ] Styled correctly in light mode

**EmptyState:**
- [ ] Displays when no agents found
- [ ] Displays when no commands found
- [ ] Displays when no hooks found
- [ ] Displays when no MCP servers found
- [ ] Shows appropriate icon
- [ ] Shows appropriate message
- [ ] Styled correctly in dark mode
- [ ] Styled correctly in light mode

**BreadcrumbNavigation:**
- [ ] Displays on ProjectDetail page
- [ ] Displays on UserGlobal page
- [ ] Shows correct hierarchy
- [ ] Dashboard link works
- [ ] Current page not clickable
- [ ] Styled correctly in dark mode
- [ ] Styled correctly in light mode
- [ ] Responsive on mobile

### Automated Testing
- [ ] All existing Playwright tests pass
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

## Related Tickets

**Part of Epic:**
- EPIC-4: Phase 2 Extension - Component Refactoring

**Can Run in Parallel:**
- STORY-2.1: Extract Core Card Components
- STORY-2.2: Extract Sidebar Component

**Related Stories:**
- STORY-2.4: Testing & Documentation

**Task Details:**
- See individual TASK-2.3.X.md files for implementation details

## Notes

### Component Interface Designs

**LoadingState Props:**
```javascript
{
  message: String,  // Optional custom loading message
  size: String      // Optional size: 'small' | 'medium' | 'large'
}
```

**EmptyState Props:**
```javascript
{
  icon: String,     // PrimeIcons class (default: 'pi pi-inbox')
  message: String,  // Empty state message
  subtitle: String  // Optional additional context
}
```

**BreadcrumbNavigation Props:**
```javascript
{
  items: Array,     // Breadcrumb items
  // Example: [
  //   { label: 'Dashboard', icon: 'pi pi-home', link: '/' },
  //   { label: 'Project Name', icon: 'pi pi-folder', active: true }
  // ]
}
```

**BreadcrumbNavigation Events:**
```javascript
@navigate  // Emitted when breadcrumb clicked (item)
```

### Design Principles

1. **Minimal Props:** Only essential customization options
2. **Smart Defaults:** Sensible defaults for common use cases
3. **Theme Support:** All components use CSS variables
4. **Accessibility:** Proper ARIA labels and roles
5. **Responsive:** Work on all screen sizes

### Usage Examples

**LoadingState:**
```vue
<LoadingState message="Loading projects..." />
```

**EmptyState:**
```vue
<EmptyState
  icon="pi pi-users"
  message="No subagents found"
  subtitle="Create your first subagent to get started"
/>
```

**BreadcrumbNavigation:**
```vue
<BreadcrumbNavigation
  :items="breadcrumbs"
  @navigate="handleNavigate"
/>
```

### Migration Strategy

1. Create all 3 utility components
2. Test components in isolation
3. Replace inline loading states in all pages
4. Replace inline empty states in all pages
5. Replace inline breadcrumbs in all pages
6. Verify consistency across all pages
7. Run full test suite

### Rollback Plan

If issues arise:
1. Git feature branch allows easy revert
2. Small components = low risk
3. Can revert individual components if needed
4. No complex state management = simple rollback
