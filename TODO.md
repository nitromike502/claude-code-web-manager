# TODO - Future Tasks & Ideas

This file tracks ideas, issues, and tasks to address at a later time.

**Note:** Changes to this file can be included in any branch/PR regardless of the feature being developed, as it's a meta-task tracking document.

---

## Pending Tasks

### NPX Support for Claude Code Manager
- [ ] Add NPX support to allow running the tool without installation
- [ ] Create appropriate package.json configuration for NPX execution
- [ ] Add documentation for NPX usage (e.g., `npx claude-code-manager`)
- [ ] Test NPX workflow on clean environment

---

## Completed Tasks

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
