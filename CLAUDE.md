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

1. **Backend Team** - API endpoints, file parsing, project discovery
2. **Frontend Team** - Vue components, PrimeVue integration, routing
3. **Testing Team** - Cross-platform testing, error handling, edge cases

See subagent proposals in project `.claude/agents/` directory.

## Development Workflow

1. ✅ Requirements gathering (Phase 1 complete)
2. ✅ Create wireframe mockups
3. ✅ Build backend API
4. ✅ Build frontend UI
5. ✅ Integration & testing
6. ⏳ Polish & cross-platform verification

## Success Criteria (Phase 1)

- [x] Requirements documented and reviewed
- [x] Wireframes approved
- [x] All Claude Code projects visible
- [x] All config types viewable (agents/commands/hooks/MCP)
- [x] Search/filter functionality working
- [x] Clean, intuitive UI
- [ ] Works on Windows, Mac, Linux (requires testing)
- [x] Handles missing/malformed files gracefully

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

## Contributing

This project uses Claude Code with specialized subagents. See `.claude/agents/` for team structure.
