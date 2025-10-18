# TODO - Future Tasks & Ideas

This file tracks ideas, issues, and tasks to address at a later time.

**Note:** Changes to this file can be included in any branch/PR regardless of the feature being developed, as it's a meta-task tracking document.

---

## Pending Tasks

### Frontend Test Remediation (In Progress - 2025-10-17)
- [ ] **Phase 1: Quick Wins** (45 min) - Remove 4 obsolete tests + fix console error filter
  - [ ] BUG-007, 008, 009, 010: Remove tests referencing deleted `.btn-user` button
  - [ ] BUG-037: Fix console error filter (copy pattern from working test)
  - Target: 84% pass rate (131/156 tests)
- [ ] **Phase 2: Root Cause Investigation** (2-4 hours) - Identify timeout patterns
  - [ ] Run primary timeout test with trace viewer
  - [ ] Document root cause findings
  - [ ] Categorize 25 timeout failures by type
- [ ] **Phase 3: Systematic Fixes** (2-4 hours) - Apply fixes to all timeout tests
  - [ ] Fix navigation timeouts (6 tests)
  - [ ] Fix sidebar interaction timeouts (2 tests)
  - [ ] Fix warning/error display timeouts (6 tests)
  - [ ] Fix empty state timeouts (2 tests)
  - [ ] Fix theme toggle timeouts (2 tests)
  - [ ] Fix search filter timeouts (4 tests)
  - [ ] Fix miscellaneous timeouts (4 tests)
- [ ] **Phase 4: Validation** (1-2 hours) - Multi-browser testing
  - [ ] Chromium: 100% pass rate (156/156)
  - [ ] Firefox: 100% pass rate (156/156)
  - [ ] WebKit: 100% pass rate (156/156)
- [ ] **Phase 5: Documentation** (30 min) - Close tickets and create knowledge base
  - [ ] Update all bug tickets with resolution
  - [ ] Create timeout fix patterns knowledge base
  - [ ] Generate final test report

**Current Status:** 81% pass rate (126/156 tests, 30 failures)
**Target:** 100% pass rate (468/468 tests across 3 browsers)
**Documentation:**
- Bug tickets: `/home/claude/manager/docs/testing/BUG-TICKETS.md`
- Remediation plan: `/home/claude/manager/docs/testing/TEST-REMEDIATION-PLAN.md`

### Workflow Analyzer Script Integration
- [ ] Update `/analyze-workflow` slash command to utilize condense-transcript.js helper script
- [ ] Update `workflow-analyzer` agent instructions to leverage condense-transcript.js for large transcripts
- [ ] Add documentation in workflow-analyzer about when/how to use the transcript condenser
- [ ] Test workflow analysis with condensed vs. raw transcripts for efficiency comparison

### YAML Frontmatter Validation & Auto-Fix (Phase 2)
- [ ] Add YAML validation UI that highlights files with parsing errors
- [ ] Implement "Fix YAML" button/feature to auto-correct common issues
- [ ] Support unquoted text values (add quotes where needed)
- [ ] Handle special characters in YAML values (colons, brackets, etc.)
- [ ] Provide diff preview before applying fixes
- [ ] Add option to bulk-fix all YAML errors in a project

---

## Completed Tasks

### NPX Support for Claude Code Manager (Completed 2025-10-17)
- [x] Add NPX support to allow running the tool without installation
- [x] Create appropriate package.json configuration for NPX execution (bin field)
- [x] Implement automatic port detection (8420-8429)
- [x] Add running instance detection with health check
- [x] User-friendly CLI messages and warnings
- [x] Published as v1.0.1

**Summary:**
- Created `/bin/cli.js` executable entry point
- Configured `package.json` with `bin` and `files` fields
- Implemented smart port increment when default port (8420) is in use
- Added detection for already-running instances to avoid duplicates
- Updated health check endpoint to support instance detection
- Users can now run: `npx claude-code-config-manager`

### Git Workflow Review (Completed 2025-10-12)
- [x] Review session '99830cc0-218c-417a-ae2b-9e8ca2fdab37' logs
- [x] Correct git workflow branch timing documentation
- [x] Validate the sequence: create branch → implement → test → commit → PR

**Summary:**
- Analyzed git reflog from session 99830cc0 (Oct 11, 2025, 11:30 PM - 12:15 AM)
- Identified common mistake: checking out to main before creating PR, leading to accidental commits on main
- Updated CLAUDE.md with improved git workflow documentation:
  - Added emphasis on creating branch BEFORE starting work
  - Added verification step: `git branch --show-current` before committing
  - Added explicit warning about NOT checking out to main before PR creation
  - Added "Common Mistake to Avoid" section with clear DO/DON'T guidance
- Validated the corrected sequence: create branch → implement → test → commit → PR

---

## Ideas for Future Enhancements

_(Add ideas here as they come up during development)_
