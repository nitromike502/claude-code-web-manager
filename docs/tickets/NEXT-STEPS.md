# NEXT STEPS: Phase 3+ Development Roadmap

**Last Updated:** October 24, 2025
**Current Status:** All Agent Metadata Bugs Fixed ✅ | Phase 2 Complete
**Latest Commits:**
- `060954b` - "docs: update documentation with recent bug fixes and current status"
- `04a2c6f` - "fix: display agent model in sidebars and fix user config card display [BUG-028, BUG-035]"

---

## Phase 2 Completion Status

### ✅ All Critical Bugs Resolved (October 24, 2025)
- **BUG-027** - Agent color display in sidebar ✅ FIXED
- **BUG-028** - Agent model display in sidebar ✅ FIXED
- **BUG-029** - Agent tools display in sidebar ✅ FIXED
- **BUG-035** - User configuration card persistence after navigation ✅ FIXED

### ✅ Additional Improvements
- Agent metadata now complete with color, model, and tools
- User configuration card persists correctly across navigation
- Sidebar width consistency (75vw) across all components
- Test coverage increased from 311 to 313 tests (100% pass rate)

### ⏳ Remaining Bugs (Lower Priority - Optional)
1. **BUG-030** - Command tools display in sidebar
2. **BUG-031** - Command argument hint display in sidebar
3. **BUG-032** - Hook command display in sidebar
4. **BUG-033** - Hook type display in sidebar

**Note:** These bugs are cosmetic improvements to command and hook sidebars. Agent metadata is now complete.

---

## Phase 3: Subagent CRUD Operations (Planned Next)

**Status:** PROPOSED | Ready for planning
**Estimated Scope:** Medium (3-4 weeks)

### Phase 3 Goals
1. **Create New Subagents** - UI form to create `.claude/agents/*.md` files
2. **Edit Existing Subagents** - In-place editing with live preview
3. **Delete Subagents** - With confirmation and safety checks
4. **YAML Validation** - Frontmatter validation with helpful error messages
5. **Live Preview** - Show rendered agent content while editing

### Phase 3 Architecture
- **Frontend:** Modal forms for create/edit, confirmation dialogs for delete
- **Backend:** File write operations with validation and error handling
- **API Endpoints:** POST/PUT/DELETE operations on `/api/projects/:projectId/agents`
- **Testing:** New tests for CRUD operations with validation

### Phase 3 Implementation Order
1. Create agent form (UI)
2. POST endpoint to create agent files
3. Edit agent form (UI)
4. PUT endpoint to update agent files
5. Delete confirmation dialog (UI)
6. DELETE endpoint with safety checks
7. YAML frontmatter validation
8. Live preview functionality
9. Comprehensive testing
10. Documentation and release

### Phase 3 Success Criteria
- [ ] Create new agents with YAML validation
- [ ] Edit existing agents with live preview
- [ ] Delete agents with confirmation
- [ ] Error handling for malformed YAML
- [ ] All CRUD tests passing (50+ new tests)
- [ ] Cross-browser compatibility verified
- [ ] Zero console errors during CRUD operations

---

## Optional Remaining Bugs (Post Phase-2)

The following bugs represent cosmetic improvements to command and hook sidebars:

| Bug | Field | Component | Priority |
|-----|-------|-----------|----------|
| BUG-030 | `tools` | Command sidebar | Low |
| BUG-031 | `argumentHint` | Command sidebar | Low |
| BUG-032 | `command` | Hook sidebar | Low |
| BUG-033 | `type` | Hook sidebar | Low |

**Implementation Process (if prioritized):**
1. Add field display line(s) to ProjectDetail.vue
2. Add field display line(s) to UserGlobal.vue
3. Test manually on port 5173
4. Get user approval
5. Create Playwright tests
6. Update documentation
7. Commit with reference to bug ticket

**Recommendation:** Consider these after Phase 3 (CRUD) is implemented, as CRUD operations are more valuable to users than additional metadata display.

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

## Phase 3 Planning Checklist

Before starting work on Subagent CRUD (Phase 3):

### Discovery & Planning
- [ ] Review Phase 3 requirements in this document
- [ ] Research YAML frontmatter parsing libraries
- [ ] Review existing parser implementation in backend
- [ ] Sketch UI mockups for create/edit forms
- [ ] Plan API endpoint design (POST/PUT/DELETE)
- [ ] Identify file system safety considerations

### Development Setup
- [ ] Pull latest changes: `git pull origin phase-2`
- [ ] Create feature branch: `git checkout -b feature/phase-3-crud`
- [ ] Verify Vite dev server runs on port 5173
- [ ] Verify backend server runs on port 8420

### Implementation Strategy
- [ ] Start with read-only form UI (state management)
- [ ] Add form validation for YAML frontmatter
- [ ] Implement POST endpoint for file creation
- [ ] Implement PUT endpoint for file updates
- [ ] Implement DELETE endpoint with safety checks
- [ ] Add file write permission verification
- [ ] Create comprehensive test suite (50+ tests)
- [ ] Add error handling and user feedback

### Quality Gates
- [ ] All 583 existing tests still pass
- [ ] New tests for all CRUD operations pass
- [ ] Manual testing on port 5173 approved
- [ ] Zero console errors
- [ ] Documentation updated before commit

---

## Key Files for Phase 3 Development

### Architecture & Design
- `CLAUDE.md` - Main project documentation
- `docs/SESSION-SUMMARY-20251024.md` - Recent session work summary
- `src/backend/services/projectDiscovery.js` - Current parser implementation

### Frontend Components
- `src/components/ProjectDetail.vue` - Project-level configuration view
- `src/components/UserGlobal.vue` - User-level configuration view
- `src/components/cards/` - Configuration card components

### Backend API
- `src/backend/routes/` - API route definitions
- `src/backend/services/` - Business logic and file parsing
- `src/backend/services/projectDiscovery.js` - Agent parsing (reference for YAML handling)

### Testing
- `tests/frontend/04-component-rendering.spec.js` - Component tests
- `tests/e2e/` - End-to-end integration tests
- `tests/fixtures/` - Mock data and test helpers

### Optional Remaining Bug Tickets
- `docs/tickets/bugs/BUG-030-command-tools-display.md`
- `docs/tickets/bugs/BUG-031-command-argument-hint-display.md`
- `docs/tickets/bugs/BUG-032-hook-command-display.md`
- `docs/tickets/bugs/BUG-033-hook-type-display.md`

### Documentation
- `docs/tickets/NEXT-STEPS.md` (this file)

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

## Success Criteria for Phase 3

### Code Quality
- [ ] All new code follows project conventions
- [ ] Comprehensive error handling with user feedback
- [ ] File system operations validated and safe
- [ ] YAML parsing robust with helpful error messages
- [ ] Code review completed before merge

### Testing
- [ ] All 583 existing tests still passing
- [ ] 50+ new tests for CRUD operations
- [ ] Tests cover happy path and error cases
- [ ] Manual testing approved by user
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Zero console errors in production mode

### Documentation
- [ ] API endpoint documentation updated
- [ ] Component documentation updated
- [ ] User guide with CRUD instructions
- [ ] Architecture documentation for file operations
- [ ] Commit messages reference tickets

### Performance
- [ ] Form interactions responsive (< 100ms)
- [ ] File operations don't block UI
- [ ] No memory leaks in long sessions

### Deployment Readiness
- [ ] All tests passing
- [ ] Production build successful
- [ ] No breaking changes to existing features
- [ ] Ready for release on main branch

---

## Phase Roadmap Summary

| Phase | Status | Scope | Timeline |
|-------|--------|-------|----------|
| **Phase 1: MVP** | ✅ Complete | Read-only interface | Complete |
| **Phase 2: Vite** | ✅ Complete | Architecture modernization | Complete |
| **Phase 3: CRUD** | ⏳ Planned | Create/edit/delete agents | 3-4 weeks |
| **Phase 4: Commands** | 📋 Proposed | Command management | Q4 2025 |
| **Phase 5: Hooks** | 📋 Proposed | Hook configuration | Q4 2025 |
| **Phase 6: MCP** | 📋 Proposed | MCP server management | Q1 2026 |
| **Phase 7+: Advanced** | 📋 Future | Real-time, versioning, sync | Q1 2026+ |

---

**Phase 2 is complete. Phase 3 (Subagent CRUD) is ready for planning when you are ready to proceed.**
