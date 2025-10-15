# Claude Code Manager

A web-based tool for managing Claude Code projects, subagents, slash commands, hooks, and MCP servers.

## Project Overview

**Purpose:** Centralized interface to view and manage Claude Code configurations across all projects on a local machine.

**Deployment:** Local web server accessible at `http://localhost:8420`

**Current Phase:** Phase 1 (MVP) - Read-only viewing interface

## Tech Stack

- **Backend:** Node.js + Express (port 8420)
- **Frontend:** Vue 3 + PrimeVue (CDN-hosted)
- **Data Source:** Live file system reads (no database)

## Project Structure

```
manager/
├── docs/
│   ├── PRD-Phase1-MVP.md          # Main MVP requirements (reviewed & approved)
│   ├── PRD-Phase2-Subagents.md    # Future: Subagent CRUD (not reviewed)
│   ├── PRD-Phase2-Commands.md     # Future: Command CRUD (not reviewed)
│   ├── PRD-Phase2-Hooks.md        # Future: Hooks CRUD (not reviewed)
│   └── PRD-Phase2-MCP.md          # Future: MCP CRUD (not reviewed)
├── src/
│   ├── backend/                    # Express server & API
│   └── frontend/                   # Vue + PrimeVue UI
└── CLAUDE.md                       # This file
```

## Phase 1 MVP Features

### Core Functionality
1. **Project Discovery** - Read from `~/.claude.json` to list all Claude Code projects
2. **Subagent Viewing** - Display subagents from `.claude/agents/*.md`
3. **Slash Command Viewing** - Display commands from `.claude/commands/**/*.md`
4. **Hooks Viewing** - Display hooks from `.claude/settings.json` files
5. **MCP Server Viewing** - Display MCP servers from `.mcp.json` and settings files

### Key Constraints
- **Read-only:** No editing, creating, or deleting in Phase 1
- **Manual refresh:** Rescan button to refresh project list
- **Dark mode:** Implemented in Phase 1
- **No authentication:** Local-only tool

## Data Sources

### Project List
- `~/.claude.json` - Contains all Claude Code project paths (paths are keys in `projects` object)

### Per-Project Configurations
- `.claude/agents/*.md` - Subagents (markdown with YAML frontmatter)
- `.claude/commands/**/*.md` - Slash commands (markdown, supports nested directories)
- `.claude/settings.json` - Project settings including hooks
- `.claude/settings.local.json` - Local project settings
- `.mcp.json` - Project MCP servers

### User-Level Configurations
- `~/.claude/agents/*.md` - User subagents
- `~/.claude/commands/**/*.md` - User commands
- `~/.claude/settings.json` - User settings including hooks and MCP servers

## API Endpoints (Phase 1)

```
GET  /api/projects                   - List all projects from ~/.claude.json
GET  /api/projects/:projectId/agents - Get project subagents
GET  /api/projects/:projectId/commands - Get project commands
GET  /api/projects/:projectId/hooks  - Get project hooks
GET  /api/projects/:projectId/mcp    - Get project MCP servers
GET  /api/user/agents                - Get user subagents
GET  /api/user/commands              - Get user commands
GET  /api/user/hooks                 - Get user hooks
GET  /api/user/mcp                   - Get user MCP servers
POST /api/projects/scan              - Trigger project list refresh
```

**Note:** `projectId` = project path with slashes removed (e.g., `/home/user/projects/myapp` → `homeuserprojectsmyapp`)

## UI Design Principles

- Clean, minimal interface
- Card-based layout for config sections (all on one page)
- Fast navigation between projects
- Dark mode support
- Responsive design for laptop/desktop

**Wireframes:** ✅ Complete - See `docs/wireframes/` directory

## Implementation Approach

Building with **parallel subagent teams** using the SWARM method:

1. **Backend Team** - API endpoints, file parsing, project discovery (includes immediate testing)
2. **Frontend Team** - Vue components, PrimeVue integration, routing (includes immediate testing)
3. **Quality Team** - Code review, cross-platform verification, documentation

**Note:** Testing is integrated into development, not a separate phase. Each developer tests their implementation immediately before code review.

See subagent proposals in project `.claude/agents/` directory.

## Development Workflow (Phase 1 MVP)

1. ✅ Requirements gathering (PRD complete)
2. ✅ Create wireframe mockups (Approved)
3. ✅ Build backend API with automated testing (COMPLETE - 100%)
4. ⏳ Build frontend UI with automated testing (IN PROGRESS - 60%)
   - ✅ Story 3.1: Project Detail View Structure (COMPLETE - 80 min)
   - ✅ Story 3.2: Configuration Cards (COMPLETE - 150 min)
   - ✅ Story 3.3: Interactive Features (COMPLETE - 120 min)
   - ⏳ Story 3.4: Search & Filter (Pending - 3 tasks)
   - ⏳ Story 3.5: Final Polish (Pending - 3 tasks)
5. ⏳ Integration verification & cross-platform testing
6. ⏳ Polish & final quality review

**Note:** Phase 1 = MVP (Read-only interface). Phase 2+ features (CRUD operations) are documented but not part of current scope.

### Testing Workflow (Automated Quality Gate)

All code changes must pass automated tests before PR creation:

1. **Developer implements feature** (backend-architect or frontend-developer)
2. **test-automation-engineer runs tests** (Jest for backend, Playwright for frontend)
   - ✅ If all tests pass → Proceed to step 3
   - ❌ If any tests fail → Return to developer to fix issues (loop until pass)
3. **git-workflow-specialist creates PR** (only after tests pass)
4. **Code review and merge**

**Test Types:**
- **Backend (Jest + Supertest):** API endpoint tests, parser unit tests, error handling, regression tests
- **Frontend (Playwright):** Component rendering, user interactions, API integration, visual verification

**Test Reports:** All test results are saved to `/home/claude/manager/docs/testing/test-reports/`

**Hard Block:** PRs cannot be created if tests fail. This prevents broken code from being merged.

## Success Criteria (Phase 1)

### Backend (100% Complete)
- [x] Requirements documented and reviewed
- [x] Wireframes approved
- [x] All 8 API endpoints implemented and tested
- [x] All 4 parsers (agents/commands/hooks/MCP) functional
- [x] Resilient error handling (malformed files skipped with warnings)
- [x] Warnings system implemented (`{data, warnings}` response structure)
- [x] Cross-platform path handling
- [x] BUG-001 and BUG-002 resolved
- [x] Automated test suite passing (Jest)

### Frontend (60% Complete)
- [x] Project detail page structure created
- [x] Breadcrumb navigation with back button
- [x] Routing from dashboard to detail view
- [x] Theme toggle functionality
- [x] Loading and error states
- [x] Warning display from backend
- [x] Configuration cards for all 4 types (agents/commands/hooks/MCP)
- [x] Card color scheme (green/blue/orange/purple)
- [x] "Show more" functionality for configuration lists
- [x] API integration with all configuration endpoints
- [x] Automated test suite passing (Playwright - 92/100 tests, 92% pass rate)
- [x] Detail sidebar for viewing full content
- [x] Sidebar content rendering (markdown parsing, syntax highlighting)
- [x] Sidebar navigation (copy to clipboard, keyboard shortcuts)
- [x] Structured data display for hooks and MCP servers
- [ ] User/global configuration view
- [ ] Search/filter functionality
- [ ] Cross-browser compatibility verified

## Future Features (Beyond MVP)

After Phase 1 MVP is complete, future enhancements are documented but not yet prioritized:

- CRUD operations for subagents, commands, hooks, and MCP servers
- Advanced features (validation, testing, templates, import/export)

⚠️ Future feature PRDs exist in `docs/PRD-Phase2-*.md` but have not been fully reviewed or scheduled.

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Claude Code installed with at least one project configured in `~/.claude.json`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd manager

# Install dependencies
npm install

# Setup Git hooks (enforces feature branch workflow)
./scripts/setup-git-hooks.sh

# Start the server
npm start
```

### Usage

Once the server is running, open your browser to:
```
http://localhost:8420
```

The application will automatically:
1. Read your Claude Code projects from `~/.claude.json`
2. Display all discovered projects in the dashboard
3. Allow you to view agents, commands, hooks, and MCP servers for each project

### Development Mode

For development with auto-reload on file changes:
```bash
npm run dev
```

## Git Workflow

This project enforces a **feature branch workflow** to ensure code quality and enable frequent, small commits.

### Mandatory Workflow Rules

1. **No Direct Commits to Main** - A pre-push hook prevents direct pushes to `main`, `master`, or `develop` branches
2. **Feature Branches Required** - All work must be done on feature branches
3. **Small, Focused Tasks** - Tasks should be 30-60 minutes maximum
4. **One Commit Per Task** - Each completed task MUST receive its own dedicated commit
5. **Frequent Commits** - Commit every 15-30 minutes of productive work
6. **Test Immediately** - Test after every task completion
7. **Pull Request Required** - All features require code review before merging

### Feature Branch Workflow

```bash
# 1. Create a feature branch from main BEFORE starting work
git checkout main
git pull
git checkout -b feature/your-feature-name

# 2. Work on ONE task at a time (30-60 min max per task)
# ...edit files for Task A...

# 3. Test your changes for this task
npm test  # or manual testing

# 4. Commit THIS TASK immediately after completion
# IMPORTANT: Verify you're on feature branch before committing
git branch --show-current  # Should show feature/your-feature-name
git add <files>
git commit -m "type: brief description of THIS task"
git push -u origin feature/your-feature-name

# 5. Repeat steps 2-4 for each subsequent task
# Task B → test → commit → push
# Task C → test → commit → push
# Each task gets its own commit!

# 6. Create a Pull Request on GitHub after ALL tasks complete
# IMPORTANT: Create PR from feature branch, do NOT checkout to main first
# The gh pr create command works from the feature branch
gh pr create --title "..." --body "..."

# 7. After PR approval, merge and delete branch
gh pr merge <pr-number>
git checkout main
git pull
git branch -d feature/your-feature-name
```

**Common Mistake to Avoid:**
- ❌ **DO NOT** checkout to main to create the PR - this often leads to accidentally committing on main
- ✅ **DO** stay on your feature branch and run `gh pr create` directly from there

### Branch Naming Conventions

- `feature/` - New features (e.g., `feature/project-discovery`)
- `fix/` - Bug fixes (e.g., `fix/sidebar-scrolling`)
- `chore/` - Maintenance tasks (e.g., `chore/update-deps`)
- `docs/` - Documentation only (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/api-service`)

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <brief description>

[optional body]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `style:` - Code style changes (formatting)

**Examples:**
```
feat: add project discovery service
fix: resolve sidebar scrolling issue
docs: update API endpoint documentation
chore: consolidate sidebar fix docs
```

### Why This Workflow?

Per the workflow analysis (see `docs/workflow-analysis-20251007.md`), the October 7 revert was caused by:
- Massive feature scope (2-3 hour chunks)
- No feature branches (100% work on main)
- Infrequent commits (40+ min gaps)
- Late testing (only after "completion")

This resulted in **350+ errors** and lost work. The new workflow prevents these issues by enforcing small, testable, reviewable changes.

### One Commit Per Task Policy

**Why it matters:**
- **Traceability:** Each commit maps to exactly one task, making history clear
- **Revert Granularity:** Can revert individual tasks without losing other work
- **Progress Visibility:** Commit history shows actual work progression
- **Code Review:** Reviewers can see logical progression of changes
- **Debugging:** Easier to identify when/where bugs were introduced

**How to implement:**

#### Default: Sequential Work
When tasks must be completed in order:

1. **Start task** → Work on feature
2. **Complete task** → Test immediately
3. **Tests pass** → Commit immediately with task reference
4. **Push to remote** → Make work visible
5. **Start next task** → Repeat cycle

**Example (Sequential):**
```
Task 3.2.1: Create AgentCard component
→ Implement component (20 min)
→ Test rendering (5 min)
→ Commit: "feat: create AgentCard component (Task 3.2.1)"
→ Push to origin

Task 3.2.2: Add agent metadata display
→ Implement metadata (15 min)
→ Test display (5 min)
→ Commit: "feat: add agent metadata display (Task 3.2.2)"
→ Push to origin

Task 3.2.3: Add agent action buttons
→ Implement buttons (20 min)
→ Test interactions (10 min)
→ Commit: "feat: add agent action buttons (Task 3.2.3)"
→ Push to origin
```

#### Exception: Parallel Work
When multiple tasks have **no dependencies** and **no file conflicts**, they can be executed in parallel with a batch commit:

**Criteria for parallel execution:**
- ✅ Independent files (or append-only shared files)
- ✅ No logical dependencies between tasks
- ✅ Same feature branch
- ✅ Similar scope (15-30 min each)

**Example (Parallel):**
```
Tasks 3.2.1-3.2.4: Four independent component files
→ Launch 4 agents in parallel (00:00)
→ Agent 1: AgentCard.js (6 min)
→ Agent 2: CommandCard.js (4 min)
→ Agent 3: HookCard.js (3 min)
→ Agent 4: MCPCard.js (3 min)
→ All complete at 00:06 (longest task)
→ Batch commit: "feat: implement configuration cards for all 4 types (Tasks 3.2.1-3.2.4)"
→ Push to origin

Time savings: 20 min sequential → 6 min parallel (70% reduction)
```

**Commit timing for parallel work:**
- Parallel execution: 4 tasks × 5 min = 5 min total (not 20 min)
- Single batch commit after all complete
- Still maintains "commit every 15-30 min" guideline if total parallel time < 30 min

**Reference:** See `docs/workflow-patterns/PARALLEL-EXECUTION.md` for detailed patterns

**Never bundle independent sequential tasks:**
- ❌ BAD (Sequential): "feat: implement agent card with metadata and buttons (Tasks 3.2.1-3.2.3)"
- ✅ GOOD (Sequential): Three separate commits, one per task
- ✅ GOOD (Parallel): "feat: implement 4 configuration cards (Tasks 3.2.1-3.2.4)" - if truly parallel execution

**Exception:** Only bundle related changes if they are part of the same atomic task (e.g., fixing a typo in documentation doesn't need its own commit if it's noticed during the same task).

### Pre-Push Hook

A pre-push Git hook is installed at `.git/hooks/pre-push` that prevents direct pushes to protected branches. If you accidentally try to push to main, you'll see:

```
❌ ERROR: Direct pushes to 'main' branch are not allowed!

Please use the feature branch workflow:
  1. Create a feature branch: git checkout -b feature/your-feature-name
  2. Make your changes and commit
  3. Push your feature branch: git push -u origin feature/your-feature-name
  4. Create a Pull Request for review
```

## Contributing

This project uses Claude Code with specialized subagents. See `.claude/agents/` for team structure.

**All contributions must follow the Git Workflow above.**
