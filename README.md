# Claude Code Manager

A web-based tool for managing Claude Code projects, subagents, slash commands, hooks, and MCP servers.

## Overview

Claude Code Manager provides a centralized interface to view and manage Claude Code configurations across all projects on your local machine. Access all your Claude Code projects, subagents, commands, hooks, and MCP server configurations from a single, intuitive web interface.

**Status:** Phase 1 (MVP) - Read-only viewing interface

## Features

### Current (Phase 1 MVP)
- **Project Discovery** - Automatically discovers all Claude Code projects from `~/.claude.json`
- **Subagent Viewing** - Browse and view all project and user-level subagents
- **Slash Command Viewing** - View all custom slash commands across projects
- **Hooks Viewing** - Display configured hooks from settings files
- **MCP Server Viewing** - View MCP server configurations
- **Search & Filter** - Quickly find specific configurations
- **Dark Mode** - Built-in dark mode support
- **Manual Refresh** - Rescan projects on demand

### Planned (Future Phases)
- CRUD operations for subagents, commands, hooks, and MCP servers
- Configuration validation and testing
- Templates and import/export functionality

## Tech Stack

- **Backend:** Node.js + Express (port 8420)
- **Frontend:** Vue 3 + PrimeVue (CDN-hosted)
- **Data Source:** Live file system reads (no database)

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Claude Code installed with at least one project configured in `~/.claude.json`

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd manager

# Install dependencies
npm install
```

## Usage

### Starting the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload on file changes)
npm run dev
```

### Accessing the Application

Open your browser to:
```
http://localhost:8420
```

The application will automatically:
1. Read your Claude Code projects from `~/.claude.json`
2. Display all discovered projects in the dashboard
3. Allow you to view agents, commands, hooks, and MCP servers for each project

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload (Node.js 18+)
- `npm test` - Run backend tests (when implemented)

## Architecture

### Project Structure

```
manager/
├── docs/                       # Project documentation
│   ├── PRD-Phase1-MVP.md      # MVP requirements
│   └── PRD-Phase*.md          # Future phase requirements
├── src/
│   ├── backend/               # Express server & API
│   └── frontend/              # Vue 3 + PrimeVue UI
├── .claude/                   # Claude Code configurations
│   ├── agents/                # Specialized subagents
│   ├── commands/              # Custom slash commands
│   ├── hooks/                 # Project hooks
│   └── settings.json          # Project settings
└── CLAUDE.md                  # Project instructions
```

### API Endpoints

```
GET  /api/projects                        # List all projects
GET  /api/projects/:projectId/agents      # Get project subagents
GET  /api/projects/:projectId/commands    # Get project commands
GET  /api/projects/:projectId/hooks       # Get project hooks
GET  /api/projects/:projectId/mcp         # Get project MCP servers
GET  /api/user/agents                     # Get user subagents
GET  /api/user/commands                   # Get user commands
GET  /api/user/hooks                      # Get user hooks
GET  /api/user/mcp                        # Get user MCP servers
POST /api/projects/scan                   # Trigger project refresh
```

## Configuration Sources

The application reads from the following locations:

### Project-Level
- `.claude/agents/*.md` - Subagent definitions
- `.claude/commands/**/*.md` - Slash commands (supports nested directories)
- `.claude/settings.json` - Project settings and hooks
- `.claude/settings.local.json` - Local project settings
- `.mcp.json` - MCP server configurations

### User-Level
- `~/.claude/agents/*.md` - User subagents
- `~/.claude/commands/**/*.md` - User commands
- `~/.claude/settings.json` - User settings, hooks, and MCP servers
- `~/.claude.json` - Project registry

## Development

This project uses Claude Code with specialized subagents for parallel development:

- **Backend Architect** - API design and implementation
- **Frontend Developer** - Vue components and UI
- **Data Parser** - File parsing and data extraction
- **Git Workflow Specialist** - Version control and PR management
- **Subagent Orchestrator** - Multi-agent coordination
- **Documentation Engineer** - Documentation creation and maintenance

See `.claude/agents/` for the complete team structure.

### Development Workflow

1. ✅ Requirements gathering (Phase 1 complete)
2. ✅ Wireframe creation
3. ✅ Backend API implementation
4. ✅ Frontend UI implementation
5. ✅ Integration & testing
6. ⏳ Cross-platform verification (ongoing)

### Making Changes

1. **Backend Changes**: Edit files in `src/backend/`, server will auto-reload in dev mode
2. **Frontend Changes**: Edit files in `src/frontend/`, refresh browser to see changes
3. **No Build Step**: Both backend and frontend run directly without compilation

### Testing

```bash
# Test backend server is running
curl http://localhost:8420/api/health

# Test project discovery
curl http://localhost:8420/api/projects
```

## Platform Support

- Linux
- macOS
- Windows (WSL and native)

## Contributing

This project is built using the SWARM methodology with Claude Code subagents. Contributions should follow the established patterns in the codebase.

## License

MIT License (see LICENSE file)

## Support

For issues and questions, please refer to the project documentation in the `docs/` directory or create an issue in the repository.

## Roadmap

### Phase 1 - MVP (Current) ✅
- [x] Project discovery from `~/.claude.json`
- [x] View subagents, commands, hooks, and MCP servers
- [x] Search and filter functionality
- [x] Dark/light mode support
- [x] Responsive design
- [ ] Cross-platform testing (Windows, Mac, Linux)

### Phase 2 - CRUD Operations (Planned)
- [ ] Create new subagents, commands, hooks, and MCP servers
- [ ] Edit existing configurations
- [ ] Delete configurations
- [ ] Configuration validation
- [ ] Real-time file watching

### Phase 3 - Advanced Features (Future)
- [ ] Configuration templates
- [ ] Import/export functionality
- [ ] Bulk operations
- [ ] Configuration testing
- [ ] Version history

See individual PRD documents in `docs/` for detailed phase specifications.

## Troubleshooting

### Server Won't Start
- Ensure Node.js 18+ is installed: `node --version`
- Check if port 8420 is available: `lsof -i :8420` (Mac/Linux) or `netstat -ano | findstr :8420` (Windows)
- Install dependencies: `npm install`

### No Projects Showing
- Verify `~/.claude.json` exists and contains project paths
- Check browser console for errors (F12)
- Try clicking the "Rescan" button in the UI

### API Errors
- Check backend server logs for error messages
- Verify project directories exist and are accessible
- Ensure `.claude/` directories have proper permissions

### Frontend Not Loading
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Verify CDN links are accessible (check Network tab)
- Try a different browser
