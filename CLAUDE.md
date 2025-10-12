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

## Development Workflow

1. ✅ Requirements gathering (Phase 1 complete)
2. ✅ Create wireframe mockups
3. ✅ Build backend API with automated testing (COMPLETE - 100%)
4. ⏳ Build frontend UI with automated testing (NOT STARTED)
5. ⏳ Integration verification & cross-platform testing
6. ⏳ Polish & final quality review

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

### Frontend (0% Complete)
- [ ] All Claude Code projects visible in UI
- [ ] All config types viewable (agents/commands/hooks/MCP)
- [ ] Search/filter functionality working
- [ ] Clean, intuitive UI
- [ ] Works on Windows, Mac, Linux (requires testing)
- [ ] Frontend displays warnings from backend
- [ ] Automated test suite passing (Playwright)

## Future Phases

- **Phase 2:** CRUD operations for subagents, commands, hooks, and MCP servers
- **Phase 3:** Advanced features (validation, testing, templates, import/export)

⚠️ Phase 2+ documents exist but have not been fully reviewed.

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
4. **Frequent Commits** - Commit every 15-30 minutes of productive work
5. **Test Immediately** - Test after every task completion
6. **Pull Request Required** - All features require code review before merging

### Feature Branch Workflow

```bash
# 1. Create a feature branch from main
git checkout main
git pull
git checkout -b feature/your-feature-name

# 2. Make your changes (30-60 min max per task)
# ...edit files...

# 3. Test your changes
npm test  # or manual testing

# 4. Commit frequently (every 15-30 min)
git add <files>
git commit -m "type: brief description"

# 5. Push your feature branch
git push -u origin feature/your-feature-name

# 6. Create a Pull Request on GitHub
gh pr create --title "..." --body "..."

# 7. After PR approval, merge and delete branch
gh pr merge <pr-number>
git checkout main
git pull
git branch -d feature/your-feature-name
```

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
