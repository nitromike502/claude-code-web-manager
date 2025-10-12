# Claude Code Manager - Tickets

This directory contains all project tickets organized by Epic and Story. Each ticket is a standalone markdown file with detailed implementation notes, acceptance criteria, and references.

## Ticket Structure

```
EPIC-[number].md         - Epic overview
TASK-[number].[number].md - Individual task tickets
```

## Epic 1: Wireframe Design & Approval (CRITICAL PATH)

**Status:** In Progress
**Priority:** CRITICAL
**Assigned Team:** wireframe-designer

Wireframes must be completed and approved before frontend development can begin.

### Story 1.1: Dashboard & Project List Wireframes
- [TASK-1.1.1](TASK-1.1.1.md) - Research PrimeVue component options for project list display ✅ IN PROGRESS
- [TASK-1.1.2](TASK-1.1.2.md) - Create wireframe mockup of dashboard project grid/list layout
- [TASK-1.1.3](TASK-1.1.3.md) - Design individual project card component with status indicators
- **📋 PR #1** after TASK-1.1.3 → `code-reviewer` + **Human approval required** ✅

### Story 1.2: Project Detail View Wireframes
- [TASK-1.2.1](TASK-1.2.1.md) - Design 4-card layout for project detail page with navigation
- [TASK-1.2.2](TASK-1.2.2.md) - Design configuration card component for agents/commands/hooks/MCP
- [TASK-1.2.3](TASK-1.2.3.md) - Design search and filter controls within configuration cards
- **📋 PR #2** after TASK-1.2.3 → `code-reviewer` + **Human approval required** ✅

### Story 1.3: Configuration Detail Interaction Wireframes
- [TASK-1.3.1](TASK-1.3.1.md) - Decide modal vs inline vs page interaction pattern (DECISION REQUIRED)
- [TASK-1.3.2](TASK-1.3.2.md) - Design detail view for subagents with syntax highlighting areas
- [TASK-1.3.3](TASK-1.3.3.md) - Design detail view for slash commands with nested directory display
- [TASK-1.3.4](TASK-1.3.4.md) - Design detail view for hooks showing JSON structure clearly
- [TASK-1.3.5](TASK-1.3.5.md) - Design detail view for MCP servers handling different transport types
- **📋 PR #3** after TASK-1.3.5 → `code-reviewer` + **Human approval required** ✅

### Story 1.4: User/Global Configuration View Wireframes
- [TASK-1.4.1](TASK-1.4.1.md) - Design user settings page layout with visual distinction from project configs
- [TASK-1.4.2](TASK-1.4.2.md) - Design global navigation structure and breadcrumbs
- **📋 PR #4** after TASK-1.4.2 → `code-reviewer` + **Human approval required** ✅

### Story 1.5: Responsive & Dark Mode Design
- [TASK-1.5.1](TASK-1.5.1.md) - Define responsive breakpoints and mobile layout changes
- [TASK-1.5.2](TASK-1.5.2.md) - Choose PrimeVue dark theme and define color scheme
- **📋 PR #5** after TASK-1.5.2 → `code-reviewer` + **Human approval required** ✅

### Story 1.6: Wireframe Package & Project Manager Review
- [TASK-1.6.1](TASK-1.6.1.md) - Compile all wireframes into comprehensive review document
- [TASK-1.6.2](TASK-1.6.2.md) - Submit wireframes for project manager approval ⚠️ PHASE GATE
- **📋 PR #6** after TASK-1.6.1 → `code-reviewer` + `project-manager` + **Human approval required** ✅✅

---

## Epic 2: Backend Foundation Setup (PARALLEL WORK)

**Status:** Pending
**Priority:** HIGH
**Assigned Team:** backend-architect, api-developer

Backend setup can proceed in parallel with wireframe design.

### Story 2.1: Node.js Project Initialization
- [TASK-2.1.1](TASK-2.1.1.md) - Create package.json with project metadata and scripts
- [TASK-2.1.2](TASK-2.1.2.md) - Install express, cors, gray-matter, marked, and nodemon
- [TASK-2.1.3](TASK-2.1.3.md) - Create src/backend and src/frontend directory structure
- [TASK-2.1.4](TASK-2.1.4.md) - Configure .gitignore for node_modules and environment files
- **📋 PR #7** after TASK-2.1.4 → `code-reviewer` + **Human approval required** ✅

### Story 2.2: Express Server Setup
- [TASK-2.2.1](TASK-2.2.1.md) - Create server.js with Express app on port 8420
- [TASK-2.2.2](TASK-2.2.2.md) - Configure static file serving for frontend directory
- [TASK-2.2.3](TASK-2.2.3.md) - Create /api/health endpoint with system information
- [TASK-2.2.4](TASK-2.2.4.md) - Test npm start and npm run dev scripts work correctly
- **📋 PR #8** after TASK-2.2.4 → `code-reviewer` + **Human approval required** ✅

### Story 2.3: File System Utilities & Parsers
- [TASK-2.3.1](TASK-2.3.1.md) - Create fileUtils.js with home expansion and safe file operations
- [TASK-2.3.2](TASK-2.3.2.md) - Create markdownParser.js to parse YAML frontmatter and content
- [TASK-2.3.3](TASK-2.3.3.md) - Create jsonParser.js with error handling for malformed files
- [TASK-2.3.4](TASK-2.3.4.md) - Create projectScanner.js to read and validate ~/.claude.json
- **📋 PR #9** after TASK-2.3.4 → `code-reviewer` + **Human approval required** ✅

### Story 2.4: API Endpoint Skeleton
- [TASK-2.4.1](TASK-2.4.1.md) - Create api.js router and mount at /api in Express
- [TASK-2.4.2](TASK-2.4.2.md) - Create GET /api/projects and POST /api/projects/scan routes
- [TASK-2.4.3](TASK-2.4.3.md) - Create 4 project config routes (agents/commands/hooks/mcp)
- [TASK-2.4.4](TASK-2.4.4.md) - Create 4 user config routes for ~/.claude directory
- [TASK-2.4.5](TASK-2.4.5.md) - Document API examples with curl commands (routes tested during implementation)
- **📋 PR #10** after TASK-2.4.5 → `code-reviewer` only (no human approval)

### Story 2.5: Error Handling Framework
- [TASK-2.5.1](TASK-2.5.1.md) - Create errorHandler middleware for consistent error responses
- [TASK-2.5.2](TASK-2.5.2.md) - Create custom error classes (NotFoundError, ValidationError, etc.)
- [TASK-2.5.3](TASK-2.5.3.md) - Add structured error logging with timestamps and stack traces
- [TASK-2.5.4](TASK-2.5.4.md) - Test error handling by triggering each error type
- **📋 PR #11** after TASK-2.5.4 → `code-reviewer` only (no human approval)

---

## Ticket Statistics

- **Total Epics:** 2
- **Total Stories:** 11
- **Total Tasks:** 38
  - Epic 1: 17 tasks
  - Epic 2: 21 tasks

## Current Status

- ✅ **TASK-1.1.1** is IN PROGRESS (Research PrimeVue components)
- ⏳ All other tasks are PENDING
- ⚠️ **TASK-1.6.2** is a CRITICAL PHASE GATE - frontend cannot proceed until wireframes are approved

## Next Steps

1. **Start Epic 1 work** - Launch `wireframe-designer` subagent to begin wireframe creation
2. **Start Epic 2 work in parallel** - Launch `backend-architect` subagent to begin backend setup
3. **Track progress** - Update ticket status as work progresses
4. **Phase gate checkpoint** - Project Manager must approve wireframes (TASK-1.6.2) before frontend development begins

## Ticket-Based Branch Workflow

### Branch Naming Convention

ALL feature branches MUST follow this format:
```
feature/TASK-X.X.X-description
```

**Examples:**
- `feature/TASK-2.3.4-project-scanner`
- `feature/TASK-1.5.2-dark-theme-palette`
- `feature/TASK-2.4.1-api-router-setup`

### Workflow Process

1. **Orchestrator** assigns ticket (TASK-X.X.X)
2. **Git-workflow-specialist** creates ticket branch
3. **Developer** implements AND tests immediately (no git operations)
4. **Documentation-engineer** updates docs (if needed)
5. **Code-reviewer** reviews code and test results (pre-PR review)
6. **Git-workflow-specialist** commits changes
7. **Git-workflow-specialist** creates PR to `main`
8. **Human** reviews PR on GitHub (for critical PRs)
9. **Git-workflow-specialist** squash-merges to `main`

### Key Principles

- **Testing is integrated into development** - Developers test immediately after implementation, not as a separate phase
- **Developers NEVER perform git operations** - git-workflow-specialist handles all branches, commits, PRs, and merges
- **Code review includes test verification** - code-reviewer validates both implementation and test results
- **Consistent ticket-based naming** - Every branch includes ticket reference
- **Centralized git operations** - Single source of truth for all git commands

## Pull Request Workflow

**Human Approval Required:** PRs #1-9 (Epic 1 + first 3 stories of Epic 2)
**Automated Review Only:** PRs #10-11 (remaining Epic 2 stories)

All code must pass code-reviewer checks before PR creation. See [PR-Workflow.md](PR-Workflow.md) for complete details.

### PR Checkpoints
- **PR #1-6** - Epic 1 wireframe work (requires human approval)
- **PR #7-9** - Backend foundation (requires human approval for code quality baseline)
- **PR #10-11** - API endpoints and error handling (automated review only)

## Related Documents

- [PR-Workflow.md](PR-Workflow.md) - Complete PR approval workflow and branch strategy
- [../PRD-Phase1-MVP.md](../PRD-Phase1-MVP.md) - Complete MVP requirements
- [../CLAUDE.md](../CLAUDE.md) - Project overview and success criteria
- [EPIC-1.md](EPIC-1.md) - Epic 1 details
- [EPIC-2.md](EPIC-2.md) - Epic 2 details
