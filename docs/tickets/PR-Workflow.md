# Pull Request Workflow

## Overview

This document defines the PR approval workflow for the Claude Code Manager project. All code changes must be reviewed and approved before merging to the main branch.

## PR Approval Requirements

### Standard Workflow (Epic 1 & Early Epic 2)

For the first few stories, all PRs require **TWO approvals**:

1. **Code Reviewer Agent** - Automated review using `code-reviewer` subagent
2. **Human Approval (You)** - Manual review and approval

### PR Creation Points

PRs should be created at logical checkpoints where a cohesive set of functionality is complete and testable.

## Epic 1: Wireframe Design PRs

### PR #1: Dashboard & Project List Wireframes
**After:** TASK-1.1.3 completed
**Includes:**
- PrimeVue component research
- Project list layout mockup
- Project card component design
**Branch:** `feature/wireframes-dashboard`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #2: Project Detail & Config Card Wireframes
**After:** TASK-1.2.3 completed
**Includes:**
- Project detail page layout
- Configuration card component
- Search/filter design
**Branch:** `feature/wireframes-project-detail`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #3: Configuration Detail Views
**After:** TASK-1.3.5 completed
**Includes:**
- Detail view interaction pattern decision
- Subagent detail view
- Command detail view
- Hooks detail view
- MCP server detail view
**Branch:** `feature/wireframes-detail-views`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #4: User Config & Navigation Wireframes
**After:** TASK-1.4.2 completed
**Includes:**
- User configuration page layout
- Global navigation design
**Branch:** `feature/wireframes-user-config`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #5: Responsive & Dark Mode Design
**After:** TASK-1.5.2 completed
**Includes:**
- Responsive breakpoints
- Dark mode color scheme
**Branch:** `feature/wireframes-responsive-dark`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #6: Complete Wireframe Package (PHASE GATE)
**After:** TASK-1.6.1 completed
**Includes:**
- Compiled wireframe review document
- All wireframe mockups
- Component specifications
- Design decisions documentation
**Branch:** `feature/wireframes-complete`
**Reviewers:** code-reviewer → project-manager → Human approval required ✅✅

**IMPORTANT:** TASK-1.6.2 (PM Approval) is a phase gate that requires explicit human sign-off before frontend development can begin.

## Epic 2: Backend Foundation PRs

### PR #7: Project Initialization
**After:** TASK-2.1.4 completed
**Includes:**
- package.json setup
- Dependencies installed
- Directory structure
- .gitignore configuration
**Branch:** `feature/backend-init`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #8: Express Server Setup
**After:** TASK-2.2.4 completed
**Includes:**
- Express server entry point
- Static file serving
- Health check endpoint
- Startup scripts
**Branch:** `feature/express-server`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #9: File System Utilities & Parsers
**After:** TASK-2.3.4 completed
**Includes:**
- File system utilities
- Markdown parser
- JSON parser
- Project scanner utility
**Branch:** `feature/utilities-parsers`
**Reviewers:** code-reviewer → Human approval required ✅

### PR #10: API Endpoint Skeleton
**After:** TASK-2.4.5 completed
**Includes:**
- API router
- Project routes
- Project config routes
- User config routes
- Route tests
**Branch:** `feature/api-endpoints`
**Reviewers:** code-reviewer (automated) only

### PR #11: Error Handling Framework
**After:** TASK-2.5.4 completed
**Includes:**
- Error handler middleware
- Custom error classes
- Error logging
- Error handling tests
**Branch:** `feature/error-handling`
**Reviewers:** code-reviewer (automated) only

## Workflow Steps

### 1. Create Feature Branch
```bash
git checkout -b feature/[branch-name]
```

### 2. Complete Tasks
- Implement all tasks in the PR scope
- Test thoroughly
- Commit changes with clear messages

### 3. Create Pull Request
```bash
git push -u origin feature/[branch-name]
gh pr create --title "[PR Title]" --body "[Description]"
```

### 4. Code Reviewer Agent Review
The `code-reviewer` subagent will automatically:
- Review code quality
- Check for security issues
- Verify best practices
- Approve or request changes

### 5. Human Review (Epic 1 & First Few PRs of Epic 2)
**Required for PRs #1-9**
- Review wireframe mockups / code implementation
- Verify requirements met
- Check design decisions
- Approve or request changes

### 6. Merge to Main
```bash
# After all approvals obtained:
gh pr merge [pr-number] --squash --delete-branch
```

## PR Template

When creating a PR, use this template:

```markdown
## Summary
[Brief description of changes]

## Related Tickets
- Closes TASK-X.X.X
- Closes TASK-X.X.X

## Changes Made
- [Change 1]
- [Change 2]

## Testing
- [ ] Manual testing completed
- [ ] All acceptance criteria met
- [ ] No breaking changes

## Screenshots (if applicable)
[Add wireframe images or UI screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated (if needed)
- [ ] All commits have clear messages
- [ ] Ready for code-reviewer agent review
- [ ] Ready for human review
```

## Notes

- **Epic 1 PRs** contain wireframe documentation and mockups, not code
- **Early Epic 2 PRs** (#7-9) require human approval to establish code quality baseline
- **Later Epic 2 PRs** (#10-11) use automated review only
- **Phase Gate:** PR #6 requires project-manager AND human approval before frontend work begins
- All PRs must pass code-reviewer checks before human review
