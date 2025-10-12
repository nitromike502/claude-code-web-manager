# Pull Request Workflow

## Overview

This document defines the ticket-based PR workflow for the Claude Code Manager project. All development follows a structured process with dedicated ticket branches and centralized git operations through the git-workflow-specialist agent.

## Workflow Architecture

### Key Principle: Separation of Concerns
- **Developers** (backend-architect, frontend-developer, data-parser) focus purely on implementation
- **Git-workflow-specialist** handles ALL git operations (branches, commits, PRs, merges)
- **Orchestrator** coordinates handoffs between agents

### Workflow Sequence
1. **Orchestrator** assigns ticket (TASK-X.X.X)
2. **Git-workflow-specialist** creates ticket branch: `feature/TASK-X.X.X-description`
3. **Developer** implements feature AND tests it immediately (no git operations)
4. **Documentation-engineer** updates docs (if applicable)
5. **Code-reviewer** reviews code and test results (pre-PR review)
6. **Git-workflow-specialist** commits changes to ticket branch
7. **Git-workflow-specialist** creates PR to `main`
8. **Human** reviews and approves PR (for critical PRs)
9. **Git-workflow-specialist** squash-merges to `main`

**Note:** Testing is integrated into step 3, not a separate step. Developers test their implementation immediately before handing off to code review.

## Branch Naming Convention

ALL feature branches MUST follow this format:
```
feature/TASK-X.X.X-description
```

Examples:
- `feature/TASK-2.3.4-project-scanner`
- `feature/TASK-1.5.2-dark-theme`
- `feature/TASK-2.4.1-api-router`

## PR Approval Requirements

### Standard Workflow

All PRs require **TWO levels of review**:

1. **Pre-PR Code Review** - code-reviewer subagent reviews implementation
2. **Post-PR Human Approval** - Manual review and approval on GitHub (for critical PRs)

### PR Creation Points

PRs are created by git-workflow-specialist after code-reviewer approval, typically at task completion.

## Epic 1: Wireframe Design PRs

### PR #1: Dashboard & Project List Wireframes
**After:** TASK-1.1.3 completed
**Includes:**
- PrimeVue component research
- Project list layout mockup
- Project card component design
**Branch:** `feature/TASK-1.1.3-wireframes-dashboard`
**Workflow:** wireframe-designer implements + validates → code-reviewer reviews → git-workflow-specialist commits & creates PR → Human approves

### PR #2: Project Detail & Config Card Wireframes
**After:** TASK-1.2.3 completed
**Includes:**
- Project detail page layout
- Configuration card component
- Search/filter design
**Branch:** `feature/TASK-1.2.3-project-detail`
**Workflow:** wireframe-designer → code-reviewer → git commits & PR → Human approves

### PR #3: Configuration Detail Views
**After:** TASK-1.3.5 completed
**Includes:**
- Detail view interaction pattern decision
- Subagent detail view
- Command detail view
- Hooks detail view
- MCP server detail view
**Branch:** `feature/TASK-1.3.5-detail-views`
**Workflow:** wireframe-designer → code-reviewer → git commits & PR → Human approves

### PR #4: User Config & Navigation Wireframes
**After:** TASK-1.4.2 completed
**Includes:**
- User configuration page layout
- Global navigation design
**Branch:** `feature/TASK-1.4.2-user-config`
**Workflow:** wireframe-designer → code-reviewer → git commits & PR → Human approves

### PR #5: Responsive & Dark Mode Design
**After:** TASK-1.5.2 completed
**Includes:**
- Responsive breakpoints
- Dark mode color scheme
**Branch:** `feature/TASK-1.5.2-responsive-dark`
**Workflow:** wireframe-designer → code-reviewer → git commits & PR → Human approves

### PR #6: Complete Wireframe Package (PHASE GATE)
**After:** TASK-1.6.1 completed
**Includes:**
- Compiled wireframe review document
- All wireframe mockups
- Component specifications
- Design decisions documentation
**Branch:** `feature/TASK-1.6.1-wireframes-complete`
**Workflow:** wireframe-designer → code-reviewer → project-manager → git commits & PR → Human approves (CRITICAL)

**IMPORTANT:** TASK-1.6.2 (PM Approval) is a phase gate that requires explicit human sign-off before frontend development can begin.

## Epic 2: Backend Foundation PRs

### PR #7: Project Initialization
**After:** TASK-2.1.4 completed
**Includes:**
- package.json setup
- Dependencies installed
- Directory structure
- .gitignore configuration
**Branch:** `feature/TASK-2.1.4-backend-init`
**Workflow:** backend-architect → code-reviewer → git commits & PR → Human approves

### PR #8: Express Server Setup
**After:** TASK-2.2.4 completed
**Includes:**
- Express server entry point
- Static file serving
- Health check endpoint
- Startup scripts
**Branch:** `feature/TASK-2.2.4-express-server`
**Workflow:** backend-architect → code-reviewer → git commits & PR → Human approves

### PR #9: File System Utilities & Parsers
**After:** TASK-2.3.4 completed
**Includes:**
- File system utilities
- Markdown parser
- JSON parser
- Project scanner utility
**Branch:** `feature/TASK-2.3.4-utilities-parsers`
**Workflow:** data-parser → documentation-engineer → code-reviewer → git commits & PR → Human approves

### PR #10: API Endpoint Skeleton
**After:** TASK-2.4.5 completed
**Includes:**
- API router
- Project routes
- Project config routes
- User config routes
- Route tests
**Branch:** `feature/TASK-2.4.5-api-endpoints`
**Workflow:** backend-architect → documentation-engineer → code-reviewer → git commits & PR (automated approval only)

### PR #11: Error Handling Framework
**After:** TASK-2.5.4 completed
**Includes:**
- Error handler middleware
- Custom error classes
- Error logging
- Error handling tests
**Branch:** `feature/TASK-2.5.4-error-handling`
**Workflow:** backend-architect → code-reviewer → git commits & PR (automated approval only)

## Workflow Steps (New Ticket-Based Process)

### 1. Orchestrator Assigns Task
- Orchestrator reads ticket (TASK-X.X.X)
- Delegates to git-workflow-specialist: "Create branch for TASK-X.X.X"

### 2. Git-Workflow-Specialist Creates Branch
```bash
git checkout main && git pull origin main
git checkout -b feature/TASK-X.X.X-description
git push -u origin feature/TASK-X.X.X-description
```

### 3. Developer Implements AND Tests
- Developer (backend/frontend/parser) implements feature
- Developer tests implementation immediately (manual or automated tests)
- Developer verifies acceptance criteria are met
- NO git operations by developer
- Developer reports: "Implementation complete and tested"

### 4. Documentation Engineer Updates (if applicable)
- Updates relevant documentation
- NO git operations

### 5. Code-Reviewer Reviews (Pre-PR)
- Reviews all changes using Read tool
- Reviews test results and verification
- Applies review checklist
- Approves or requests changes
- Reports: "Code review passed" or provides feedback

### 6. Git-Workflow-Specialist Commits
```bash
git checkout feature/TASK-X.X.X-description
git add <files>
git commit -m "type: description\n\nRefs TASK-X.X.X"
git push origin feature/TASK-X.X.X-description
```

### 7. Git-Workflow-Specialist Creates PR
```bash
gh pr create --title "type: description" --body "..."
```

### 8. Human Review (For Critical PRs)
**Required for PRs #1-9**
- Review implementation on GitHub
- Verify requirements met
- Check design decisions
- Approve or request changes

### 9. Git-Workflow-Specialist Merges
```bash
git checkout main && git pull origin main
git merge --squash feature/TASK-X.X.X-description
git commit -m "type: description\n\nCloses #<PR>\nRefs TASK-X.X.X"
git push origin main
git branch -d feature/TASK-X.X.X-description
git push origin --delete feature/TASK-X.X.X-description
```

## PR Template

Git-workflow-specialist uses this template when creating PRs:

```markdown
## Summary
Implements TASK-X.X.X: [Brief description of changes]

## Changes Made
- [Change 1]
- [Change 2]

## Testing Performed
- [ ] Developer tested implementation immediately
- [ ] All acceptance criteria verified
- [ ] Manual testing completed (describe tests)
- [ ] Automated tests passing (if applicable)
- [ ] No breaking changes

## Screenshots (if applicable)
[Add wireframe images or UI screenshots]

## Pre-PR Review
- [x] Developer testing completed
- [x] Code-reviewer approval obtained
- [x] Documentation updated (if applicable)

## References
- Closes TASK-X.X.X
- Related to Epic X, Story Y
```

## Key Differences from Traditional Workflow

### Traditional Approach (OLD)
❌ Developer creates branch
❌ Developer commits directly
❌ Developer creates PR
❌ Code review happens on GitHub
❌ Developer or reviewer merges

### Ticket-Based Approach (NEW)
✅ Git-workflow-specialist creates ticket branch
✅ Developer implements AND tests immediately (no git ops)
✅ Code-reviewer reviews code + test results pre-PR
✅ Git-workflow-specialist commits
✅ Git-workflow-specialist creates PR
✅ Human reviews PR on GitHub
✅ Git-workflow-specialist merges

## Benefits

1. **Single Source of Truth** - All git operations centralized
2. **Consistent Naming** - Enforced ticket-based branch names
3. **Clear Separation** - Developers focus on implementation
4. **Better Reviews** - Pre-PR code review catches issues early
5. **Audit Trail** - All git operations traceable to one agent

## Notes

- **Epic 1 PRs** contain wireframe documentation and mockups, not code
- **Early Epic 2 PRs** (#7-9) require human approval to establish code quality baseline
- **Later Epic 2 PRs** (#10-11) use automated review only
- **Phase Gate:** PR #6 requires project-manager AND human approval before frontend work begins
- All code must pass code-reviewer checks before PR creation
- Branch names MUST include ticket reference: `feature/TASK-X.X.X-description`
