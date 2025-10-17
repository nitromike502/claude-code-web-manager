# Claude Code Manager

A web-based interface for viewing and managing Claude Code projects, subagents, slash commands, hooks, and MCP servers across your local machine.

## Overview

Claude Code Manager provides a centralized dashboard to browse all your Claude Code configurations from one place. View your project structures, explore subagent definitions, review slash commands, inspect hooks, and examine MCP server configurations—all from a clean, intuitive web interface.

## Features

- **Project Discovery** - Automatically discovers all Claude Code projects from `~/.claude.json`
- **Subagent Viewing** - Browse and view all project and user-level subagents with full frontmatter specs
- **Slash Command Viewing** - View all custom slash commands across projects
- **Hooks Viewing** - Display configured hooks from settings files
- **MCP Server Viewing** - View MCP server configurations
- **Search & Filter** - Quickly find specific configurations
- **Dark Mode** - Built-in dark/light theme toggle
- **Manual Refresh** - Rescan projects on demand
- **Detail Sidebar** - View full content with markdown rendering and syntax highlighting
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Claude Code installed with at least one project configured in `~/.claude.json`

## Installation

```bash
# Install from npm
npm install -g claude-code-manager

# Or install from source
git clone <repository-url>
cd manager
npm install
```

## Usage

### Starting the Server

```bash
# If installed globally
claude-code-manager

# Or from source
npm start
```

### Accessing the Application

Once the server is running, open your browser to:
```
http://localhost:8420
```

The application will automatically:
1. Read your Claude Code projects from `~/.claude.json`
2. Display all discovered projects in the dashboard
3. Allow you to view agents, commands, hooks, and MCP servers for each project

### Navigating the Interface

- **Dashboard** - View all discovered projects
- **Project Detail** - Click any project to see its configurations
- **User Configs** - Click the purple "User" card to view global configurations
- **Detail Sidebar** - Click any item to view its full content
- **Search** - Use the search bar to filter configurations
- **Theme Toggle** - Switch between dark and light modes
- **Rescan** - Click the refresh button to reload project list

## How It Works

Claude Code Manager reads your Claude Code configurations directly from the file system:

### Project-Level Configurations
- `.claude/agents/*.md` - Subagent definitions
- `.claude/commands/**/*.md` - Slash commands
- `.claude/settings.json` - Project settings and hooks
- `.mcp.json` - MCP server configurations

### User-Level Configurations
- `~/.claude/agents/*.md` - User subagents
- `~/.claude/commands/**/*.md` - User commands
- `~/.claude/settings.json` - User settings, hooks, and MCP servers
- `~/.claude.json` - Project registry

## Platform Support

Claude Code Manager works on:
- Linux
- macOS
- Windows (both WSL and native)

## Future Plans

**Phase 2 - CRUD Operations** (Planned)
- Create, edit, and delete subagents, commands, hooks, and MCP servers
- Configuration validation and testing
- Real-time file watching for automatic updates

**Phase 3 - Advanced Features** (Future)
- Configuration templates
- Import/export functionality
- Bulk operations and batch editing
- Version history and rollback

## License

MIT License

## Support

For issues, questions, or feature requests, please create an issue in the repository.

## Troubleshooting

### Server Won't Start
- Ensure Node.js 18+ is installed: `node --version`
- Check if port 8420 is already in use
- Reinstall dependencies: `npm install`

### No Projects Showing
- Verify `~/.claude.json` exists and contains project paths
- Try clicking the "Rescan" button in the UI
- Check browser console for errors (F12)

### Configurations Not Loading
- Verify project directories exist and are accessible
- Ensure `.claude/` directories have proper read permissions
- Check that configuration files are valid (proper YAML frontmatter for agents/commands)

### Frontend Not Loading
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors (F12)
- Try a different browser
