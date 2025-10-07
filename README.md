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

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd manager

# Install dependencies
npm install
```

## Usage

```bash
# Start the server
npm start

# Access in browser
http://localhost:8420
```

The application will automatically discover all Claude Code projects configured in your `~/.claude.json` file.

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
POST /api/scan                            # Trigger project refresh
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
- **Integration Tester** - Cross-platform testing and verification

See `.claude/agents/` for the complete team structure.

### Development Workflow

1. Requirements gathering
2. Wireframe creation
3. Backend API implementation
4. Frontend UI implementation
5. Integration & testing
6. Cross-platform verification

## Platform Support

- Linux
- macOS
- Windows (WSL and native)

## Contributing

This project is built using the SWARM methodology with Claude Code subagents. Contributions should follow the established patterns in the codebase.

## License

[To be determined]

## Support

For issues and questions, please refer to the project documentation in the `docs/` directory or create an issue in the repository.

## Roadmap

- **Phase 1 (Current):** Read-only viewing interface ✓
- **Phase 2:** CRUD operations for all configuration types
- **Phase 3:** Advanced features (validation, templates, import/export)

See individual PRD documents in `docs/` for detailed phase specifications.
