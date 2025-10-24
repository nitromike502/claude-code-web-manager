# NEXT STEPS: EPIC-003 Sequential Bug Fixes

**Last Updated:** October 24, 2025
**Current Status:** BUG-027 & BUG-029 Complete ✅ | 5 Bugs Remaining
**Commit:** `9dadb52` - "fix: display agent color in sidebar [BUG-027]"

---

## Current Progress

### ✅ Completed
- **BUG-027** - Agent color display in sidebar (COMPLETE)
- **BUG-029** - Agent tools display in sidebar (COMPLETE - fixed as bonus with BUG-027)

### ⏳ Remaining (In Queue)
1. **BUG-028** - Agent model display in sidebar
2. **BUG-030** - Command tools display in sidebar
3. **BUG-031** - Command argument hint display in sidebar
4. **BUG-032** - Hook command display in sidebar
5. **BUG-033** - Hook type display in sidebar

---

## Next Bug to Fix: BUG-028 (Agent Model Display)

### Quick Reference
- **Ticket:** `/home/claude/manager/docs/tickets/bugs/BUG-028-agent-model-display.md`
- **Field:** `model` (e.g., `model: claude-sonnet-4`)
- **Components to Update:**
  - `/home/claude/manager/src/components/ProjectDetail.vue` (line ~272, after color field)
  - `/home/claude/manager/src/components/UserGlobal.vue` (line ~255, after color field)
- **Backend Parser:** `/home/claude/manager/src/backend/parsers/subagentParser.js` (line 64)

### Workflow for BUG-028

**Step 1: Investigate**
- Read BUG-028 ticket to confirm requirements
- Check that backend is returning `model` field in API response
- Verify `selectedItem.model` is available in frontend components

**Step 2: Code Changes** (Minimal, focused)
- Add one line to ProjectDetail.vue agent metadata section:
  ```vue
  <p><strong>Model:</strong> {{ selectedItem.model || 'inherit' }}</p>
  ```
- Add same line to UserGlobal.vue agent metadata section
- Show "inherit" as fallback (default value)

**Step 3: Manual User Testing** (Port 5173)
- Run: `npm run dev` (Vite dev server)
- Navigate to any project or user global config
- Click on an agent to open sidebar
- Verify model field displays with correct value or "inherit" fallback
- Test both with agents that have model defined and without

**Step 4: Create Tests** (After user approval)
- Add to `tests/frontend/04-component-rendering.spec.js`:
  - Test 04.004.005: Agent model displays in ProjectDetail sidebar [BUG-028]
  - Test 04.004.006: Agent model displays in UserGlobal sidebar [BUG-028]
- Run: `npx playwright test tests/frontend/04-component-rendering.spec.js --project=chromium`
- Verify all tests pass

**Step 5: Workflow Before Commit**
1. ✅ Update bug ticket to mark BUG-028 as resolved
2. ✅ Update EPIC-003 to show BUG-028 complete, BUG-030 as next
3. ✅ Update NEXT-STEPS.md with new progress
4. ✅ Get user final approval
5. ✅ Amend commit and force push

---

## Pattern for All Remaining Bugs

All 5 remaining bugs follow the SAME pattern as BUG-027:

| Bug | Field | Component | Fallback |
|-----|-------|-----------|----------|
| BUG-028 | `model` | Agent sidebar | `inherit` |
| BUG-030 | `tools` | Command sidebar | empty array |
| BUG-031 | `argumentHint` | Command sidebar | none |
| BUG-032 | `command` | Hook sidebar | none |
| BUG-033 | `type` | Hook sidebar | none |

**Process for each bug:**
1. Add field display line(s) to ProjectDetail.vue
2. Add field display line(s) to UserGlobal.vue
3. Test manually on port 5173
4. Get user approval
5. Create Playwright tests
6. Update documentation
7. Commit with reference to bug ticket

---

## Key Insights from BUG-027

### What Worked Well
- Sequential bug-by-bug approach with user testing between each
- Minimal code changes (usually 1-2 lines per bug)
- Tests created AFTER user approval ensures 100% pass rate
- Documentation updated BEFORE commits keeps record current

### Development Server Tips
- **Always use port 5173** (Vite dev server) for testing, NOT port 8420
- Port 5173 serves live source code with Hot Module Replacement
- Port 8420 serves stale production build (`/dist` directory)
- Only rebuild `/dist` when deploying to production

### Testing Tips
- Run Playwright tests with `--project=chromium` flag only (faster than multi-browser)
- Run single test file only: `npx playwright test tests/frontend/04-component-rendering.spec.js`
- Use flexible CSS selectors: `.sidebar-section p` with `hasText` filter instead of text-based selectors
- Tests should verify field displays AND handle missing values gracefully

### Documentation Tips
- Update all affected documentation BEFORE committing code
- Files to update for each bug:
  1. Bug ticket (mark as resolved)
  2. EPIC-003 (update progress and next bug)
  3. NEXT-STEPS.md (update current progress and next bug details)
- Amend commits to include documentation updates

---

## Session Preparation Checklist

Before starting work on next bug:

- [ ] Pull latest changes: `git pull origin phase-2`
- [ ] Review BUG-028 ticket
- [ ] Verify Vite dev server is running on port 5173
- [ ] Create focused plan for this bug only
- [ ] Make code changes (minimal, single field)
- [ ] Test manually (approve before moving to tests)
- [ ] Create Playwright tests
- [ ] Update documentation
- [ ] Get final approval
- [ ] Commit with amend and force push

---

## Files to Reference

### Bug Tickets
- `docs/tickets/bugs/BUG-028-agent-model-display.md`
- `docs/tickets/bugs/BUG-030-command-tools-display.md`
- `docs/tickets/bugs/BUG-031-command-argument-hint-display.md`
- `docs/tickets/bugs/BUG-032-hook-command-display.md`
- `docs/tickets/bugs/BUG-033-hook-type-display.md`

### Components to Update
- `src/components/ProjectDetail.vue` (agent/command/hook/mcp sidebars)
- `src/components/UserGlobal.vue` (agent/command/hook/mcp sidebars)

### Test Files
- `tests/frontend/04-component-rendering.spec.js` (add tests for each bug)

### Epic Tracking
- `docs/tickets/EPIC-003-agent-color-display.md` (update progress)

### Documentation
- `docs/tickets/NEXT-STEPS.md` (this file - update after each bug)

---

## Quick Commands

```bash
# Start Vite dev server
npm run dev

# Run single test file on Chromium
npx playwright test tests/frontend/04-component-rendering.spec.js --project=chromium

# Check git status
git status

# Review commits
git log --oneline -5

# Amend last commit
git commit --amend --no-edit

# Force push with lease
git push origin phase-2 --force-with-lease
```

---

## Success Criteria for Each Bug

- [ ] Code changes are minimal (1-3 lines per component)
- [ ] Manual testing approved by user
- [ ] Playwright tests all passing
- [ ] No console errors
- [ ] Documentation updated before commit
- [ ] Commit references bug ticket
- [ ] Changes pushed to origin/phase-2

---

**Ready to begin BUG-028 when you give the go-ahead!**
