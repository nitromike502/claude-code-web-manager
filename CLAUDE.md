# Claude Code Manager

A web-based tool for managing Claude Code projects, subagents, slash commands, hooks, and MCP servers.

## Project Overview

**Purpose:** Centralized interface to view and manage Claude Code configurations across all projects on a local machine.

**Deployment:** Local web server accessible at `http://localhost:8420`

**Current Phase:** Phase 2 (Vite Migration) - ✅ COMPLETE

## Tech Stack

- **Backend:** Node.js + Express (port 8420)
- **Frontend:** Vite + Vue 3 + Vue Router + Pinia (SPA on port 5173 in dev)
- **Data Source:** Live file system reads (no database)

## Project Structure

```
manager/
├── docs/
│   ├── PRD-Phase1-MVP.md             # Phase 1 requirements (archived)
│   ├── PRD-Phase2-Vite-Migration.md  # Phase 2 (current - complete)
│   └── testing/                      # Test reports and documentation
├── src/
│   ├── backend/                      # Express server & API (unchanged)
│   ├── main.js                       # Vue app initialization
│   ├── App.vue                       # Root component
│   ├── router/
│   │   └── index.js                 # Vue Router setup
│   ├── stores/
│   │   ├── theme.js                # Theme state management
│   │   ├── projects.js             # Projects state management
│   │   └── notifications.js        # Notifications state management
│   ├── components/
│   │   ├── Dashboard.vue           # Project list view
│   │   ├── ProjectDetail.vue       # Project configuration view
│   │   ├── UserGlobal.vue          # User-level configs
│   │   └── cards/                  # Configuration card components
│   ├── api/
│   │   └── client.js               # Centralized API client
│   ├── styles/
│   │   ├── variables.css           # CSS variables for theming
│   │   ├── global.css              # Global styles
│   │   └── components.css          # Component-specific styles
│   └── utils/                       # Utility functions
├── tests/
│   ├── backend/                     # Jest backend tests (270 tests)
│   ├── frontend/                    # Playwright component tests (120 tests)
│   │   └── visual/                  # Visual regression tests (57 tests)
│   ├── e2e/                         # Playwright E2E integration tests (90 tests)
│   ├── responsive/                  # Playwright responsive design tests (44 tests)
│   └── fixtures/                    # Centralized mock data and test helpers
├── index.html                        # SPA entry point
├── vite.config.js                   # Vite configuration
└── CLAUDE.md                         # This file
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

## Phase 2 Features (Vite Migration)

### Architecture Modernization
1. **Vite Build System** - Modern dev server with Hot Module Replacement (< 1s reload)
2. **Vue Router** - Client-side routing with SPA navigation (no page reloads)
3. **Pinia State Management** - Global state for theme, projects, and notifications
4. **Single File Components** - .vue files with template, script, and style sections
5. **CSS Variables** - Theming system with 80+ variables for dark/light modes
6. **Centralized API Client** - Unified API layer with timeout and error handling

### Performance Improvements
- **Dev Server Startup:** < 1 second
- **HMR (Hot Module Replacement):** < 1 second file change reload
- **Bundle Size:** < 500KB (gzipped)
- **Initial Load Time:** < 2 seconds
- **No Page Reloads:** SPA navigation between views

### Feature Parity
- ✅ 100% Phase 1 feature parity maintained
- ✅ All API endpoints working
- ✅ All configuration viewing functional
- ✅ Dark/light theme toggle
- ✅ Responsive design
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)

### Testing
- **Backend Tests:** 270 Jest tests (100% pass rate)
- **Frontend Tests:** 313 Playwright tests (100% pass rate)
  - 90 E2E integration tests (Tests 100, 101, 102, 105)
  - 122 Component tests (Tests 01-06, 23) - includes new BUG-028 tests (04.004.005, 04.004.006)
  - 44 Responsive design tests (Test 200)
  - 57 Visual regression tests (Test 300)
  - Cross-browser: Chromium, Firefox, WebKit
- **Total Test Coverage:** 583 tests (100% pass rate)

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

### Phase 1 MVP - ✅ COMPLETE
1. ✅ Requirements gathering (PRD complete)
2. ✅ Create wireframe mockups (Approved)
3. ✅ Build backend API with automated testing (COMPLETE - 100%)
4. ✅ Build frontend UI with automated testing (COMPLETE - 100%)
   - ✅ Story 3.1: Project Detail View Structure (COMPLETE - 80 min)
   - ✅ Story 3.2: Configuration Cards (COMPLETE - 150 min)
   - ✅ Story 3.3: Interactive Features (COMPLETE - 120 min)
   - ✅ Story 3.4: User/Global Configuration View (COMPLETE - 95 min)
   - ✅ Story 3.5: Integration & Testing (COMPLETE - 45 min)
5. ✅ Integration verification & cross-platform testing (COMPLETE)
6. ✅ Polish & final quality review (COMPLETE)

### Phase 2 Vite Migration - ✅ COMPLETE
1. ✅ Story 2.1: Vite Setup & Project Structure
2. ✅ Story 2.2: Vue Router Implementation
3. ✅ Story 2.3: Pinia State Management
4. ✅ Story 2.4: Component Conversion to SFCs
5. ✅ Story 2.5: API Integration Layer
6. ✅ Story 2.6: Styling & CSS Variables
7. ✅ Story 2.7: Testing & Validation (100% test pass rate)
8. ✅ Story 2.8: Documentation & Cleanup

**Note:** Phase 1 = MVP (Read-only interface). Phase 2 = Architecture modernization with Vite. Future phases will add CRUD operations.

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

**Test File Naming Convention:**

All Playwright test files use numbered prefixes for easy identification:
- **Frontend Component Tests (01-99):** `tests/frontend/XX-test-name.spec.js`
- **E2E Integration Tests (100-199):** `tests/e2e/1XX-test-name.spec.js`
- **Responsive Tests (200-299):** `tests/responsive/2XX-test-name.spec.js`
- **Visual Regression Tests (300-399):** `tests/visual/3XX-test-name.spec.js`
- **Backend Jest Tests:** No number prefix (standard Jest convention)

**Test Reference Format:**

Use `[Test XXX]` format in commit messages and bug reports:
- `test: add [Test 06] new component rendering tests`
- `test: fix [Test 100] timeout in user flow navigation`
- `[Test 201] failing due to responsive layout issue`

See `/home/claude/manager/.claude/templates/test-template.md` for detailed guidelines.

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

### Frontend (100% Complete)
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
- [x] Automated test suite passing (Playwright - 313/313 tests, 100% pass rate)
- [x] Detail sidebar for viewing full content
- [x] Sidebar content rendering (markdown parsing, syntax highlighting)
- [x] Sidebar navigation (copy to clipboard, keyboard shortcuts)
- [x] Structured data display for hooks and MCP servers
- [x] User/global configuration view
- [x] User card on dashboard (purple accent)
- [x] User-level API integration for all config types
- [x] Cross-browser compatibility verified (Chrome, Firefox, Safari)
- [x] Responsive design verified (mobile, tablet, desktop)
- [x] End-to-end integration testing complete
- [x] Agent model field display in sidebars [BUG-028 - Fixed]
- [x] Agent color field display in sidebars [BUG-027 - Fixed]
- [x] Agent tools field display in sidebars [BUG-029 - Fixed]
- [x] User configuration card persistent after navigation [BUG-035 - Fixed]
- [x] Sidebar width consistency (75vw) across components

## Current Status & Priorities

### Recent Bug Fixes (October 24, 2025)
- **BUG-027:** Agent color field now displays in sidebars ✅
- **BUG-028:** Agent model field now displays in sidebars ✅
- **BUG-029:** Agent tools field now displays in sidebars ✅
- **BUG-035:** User configuration card now persists after navigation ✅

All bugs were resolved with comprehensive test coverage. Remaining known issues are tracked in `/docs/tickets/bugs/` directory.

## Future Features (Phase 3+)

With Phase 1 MVP and Phase 2 Vite migration complete with 100% test coverage and all critical bugs resolved, future phases will build on this solid foundation:

### Phase 3 - Subagent CRUD (Planned)
- Create, edit, and delete subagent definitions
- YAML frontmatter validation
- Live preview of subagent content
- Template system for common subagent types

### Phase 4 - Command Management (Planned)
- Create, edit, and delete slash commands
- Command testing and validation
- Nested directory support
- Import/export command libraries

### Phase 5 - Hooks Configuration (Planned)
- Visual hook editor
- Hook testing and validation
- Pre-built hook templates
- Hook dependency management

### Phase 6 - MCP Server Management (Planned)
- Add, edit, and remove MCP servers
- Server configuration validation
- Connection testing
- Server discovery and recommendations

### Phase 7+ - Advanced Features (Future)
- Real-time file watching for automatic updates
- Configuration version history and rollback
- Bulk operations and batch editing
- Multi-project synchronization
- Configuration backup and restore

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

#### Development Mode (Recommended)

Start both frontend and backend servers:

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```
Opens http://localhost:5173 with HMR enabled (< 1s reload on file changes)

**Terminal 2 - Backend (Express server):**
```bash
npm run dev:backend
```
Runs on http://localhost:8420 (API endpoints)

#### Production Mode

Build and serve the optimized production bundle:
```bash
npm run build    # Build frontend to dist/
npm start        # Start backend server (serves frontend from dist/)
```
Opens http://localhost:8420

The application will automatically:
1. Read your Claude Code projects from `~/.claude.json`
2. Display all discovered projects in the dashboard
3. Allow you to view agents, commands, hooks, and MCP servers for each project

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
test: add [Test 06] sidebar interaction tests
test: fix [Test 100] complete user flow timeout
```

**Test-Related Commit Messages:**

When working with tests, include the test number reference:
```
test: add [Test XXX] description
test: fix [Test XXX] description
test: remove [Test XXX] description
```

Where XXX is the test file number:
- 01-99: Frontend component tests
- 100-199: E2E integration tests
- 200-299: Responsive tests
- 300-399: Visual regression tests

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
