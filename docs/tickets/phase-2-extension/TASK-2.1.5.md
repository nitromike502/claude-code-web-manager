# TASK-2.1.5: Testing & Validation (Story 2.1)

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.1 - Extract Core Card Components
**Estimated Time:** 15 minutes
**Priority:** High
**Status:** Not Started

## Description

Validate that all configuration cards render correctly across both pages (ProjectDetail and UserGlobal) after refactoring to use the ConfigCard component. Verify all states, interactions, and functionality work as expected.

## Prerequisites

- ✅ TASK-2.1.1 complete (ConfigCard created)
- ✅ TASK-2.1.2 complete (ConfigItemList created)
- ✅ TASK-2.1.3 complete (ProjectDetail refactored)
- ✅ TASK-2.1.4 complete (UserGlobal refactored)

## Acceptance Criteria

### Functional Testing
- [ ] All cards render on ProjectDetail
- [ ] All cards render on UserGlobal
- [ ] Loading states display correctly
- [ ] Empty states display correctly
- [ ] Items lists display correctly
- [ ] Expand/collapse works
- [ ] Item selection works

### Cross-Component Testing
- [ ] ConfigCard works for agents
- [ ] ConfigCard works for commands
- [ ] ConfigCard works for hooks
- [ ] ConfigCard works for MCP servers

### Integration Testing
- [ ] All existing Playwright tests pass (313+ tests)
- [ ] No console errors
- [ ] No visual regressions

### Code Quality
- [ ] No dead code remaining
- [ ] Old CSS removed
- [ ] Imports clean

## Testing Checklist

### ProjectDetail Page Testing

**Navigate to a project:**
```
http://localhost:5173/project/{projectId}
```

**Agents Card:**
- [ ] Card displays with green accent
- [ ] Loading state shows while fetching
- [ ] Agent count badge correct
- [ ] Agent items display correctly
- [ ] "Show more" appears if > 5 agents
- [ ] "Show more" expands to show all agents
- [ ] "Show less" collapses back to 5
- [ ] Click agent item opens sidebar

**Commands Card:**
- [ ] Card displays with blue accent
- [ ] Command items display correctly
- [ ] Command usage/description shows
- [ ] Expand/collapse works
- [ ] Click command opens sidebar

**Hooks Card:**
- [ ] Card displays with orange accent
- [ ] Hook items display correctly
- [ ] Event type shows in description
- [ ] Expand/collapse works
- [ ] Click hook opens sidebar

**MCP Servers Card:**
- [ ] Card displays with purple accent
- [ ] MCP items display correctly
- [ ] Command info shows in description
- [ ] Expand/collapse works
- [ ] Click MCP item opens sidebar

### UserGlobal Page Testing

**Navigate to user config:**
```
http://localhost:5173/user
```

Repeat all card tests from above for the UserGlobal page.

### State Testing

**Loading State:**
- [ ] Go to a slow-loading project
- [ ] Verify skeleton loaders display
- [ ] Verify spinners show

**Empty State:**
- [ ] Go to a project with no agents
- [ ] Verify empty state displays
- [ ] Verify appropriate message shows
- [ ] Repeat for commands/hooks/MCP

### Automated Testing

Run full test suite:
```bash
# Backend tests
npm run test:backend

# Frontend component tests
npm run test:frontend

# E2E tests
npm run test:e2e

# All tests
npm test
```

**Expected Results:**
- [ ] All 270 backend tests pass
- [ ] All 122 frontend component tests pass
- [ ] All 90 E2E tests pass
- [ ] All 44 responsive tests pass
- [ ] All 57 visual tests pass
- [ ] **Total: 583/583 tests passing**

### Visual Regression Testing

Compare screenshots before and after refactoring:

- [ ] Dashboard page looks identical
- [ ] ProjectDetail page looks identical
- [ ] UserGlobal page looks identical
- [ ] Dark mode looks correct
- [ ] Light mode looks correct
- [ ] Responsive layouts look correct

### Cross-Browser Testing

Test in all supported browsers:

**Chrome/Chromium:**
- [ ] Cards render correctly
- [ ] All interactions work
- [ ] No console errors

**Firefox:**
- [ ] Cards render correctly
- [ ] All interactions work
- [ ] No console errors

**Safari/WebKit:**
- [ ] Cards render correctly
- [ ] All interactions work
- [ ] No console errors

### Performance Testing

- [ ] Page load time similar to before
- [ ] No performance degradation
- [ ] Smooth animations
- [ ] Fast interactions

## Validation Commands

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm run test:frontend -- ConfigCard
npm run test:frontend -- ConfigItemList
npm run test:e2e -- 101-project-detail
npm run test:e2e -- 105-user-global

# Full test suite
npm test
```

## Files to Validate

- `/home/claude/manager/src/components/cards/ConfigCard.vue`
- `/home/claude/manager/src/components/cards/ConfigItemList.vue`
- `/home/claude/manager/src/components/ProjectDetail.vue`
- `/home/claude/manager/src/components/UserGlobal.vue`

## Success Indicators

1. ✅ All 583 tests passing
2. ✅ Zero console errors
3. ✅ Zero visual regressions
4. ✅ All card states working
5. ✅ All interactions working
6. ✅ Cross-browser compatibility maintained

## Related Tickets

**Part of Story:** STORY-2.1 (Extract Core Card Components)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

**Completes Story:** STORY-2.1

**Depends On:**
- TASK-2.1.1 - ConfigCard created ✅
- TASK-2.1.2 - ConfigItemList created ✅
- TASK-2.1.3 - ProjectDetail refactored ✅
- TASK-2.1.4 - UserGlobal refactored ✅

**Enables:**
- STORY-2.2 - Extract Sidebar Component (can proceed)

## Notes

### What to Look For

**Regressions to Watch:**
- Card colors incorrect
- Count badges missing
- Icons not displaying
- Loading states not showing
- Empty states not showing
- Click events not firing
- Sidebar not opening

**Common Issues:**
- Missing component imports
- Incorrect prop names
- Event name mismatches
- CSS variable issues
- Theme toggle problems

### Quick Smoke Test

Fastest way to validate:

1. Open ProjectDetail page
2. Verify all 4 cards visible
3. Click "Show more" on agents
4. Click an agent item
5. Verify sidebar opens
6. Repeat for commands/hooks/MCP
7. Navigate to UserGlobal
8. Repeat steps 2-6

If all of the above works, refactoring is successful!

### Rollback Criteria

If any of the following occur, consider rollback:

- ❌ More than 5 tests failing
- ❌ Critical functionality broken (sidebar, navigation)
- ❌ Major visual regressions
- ❌ Performance significantly degraded

Otherwise, fix issues and continue.

### Documentation Updates

After successful validation, update:

- [ ] Add comments to ConfigCard component
- [ ] Add comments to ConfigItemList component
- [ ] Update any inline documentation
- [ ] Note completion in STORY-2.1.md
