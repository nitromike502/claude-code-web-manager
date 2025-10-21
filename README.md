# Claude Code Manager

A web-based interface for viewing and managing Claude Code projects, subagents, slash commands, hooks, and MCP servers across your local machine.

## Overview

Claude Code Manager provides a centralized dashboard to browse all your Claude Code configurations from one place. View your project structures, explore subagent definitions, review slash commands, inspect hooks, and examine MCP server configurations—all from a clean, intuitive web interface.

## Tech Stack

### Frontend
- **Vite 7.1.10** - Lightning-fast dev server with Hot Module Replacement (HMR)
- **Vue 3.5.22** - Progressive JavaScript framework for reactive UIs
- **Vue Router 4.6.3** - Official router for Vue.js with client-side routing
- **Pinia 3.0.3** - Official state management library for Vue 3

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4.18** - Fast, minimalist web framework
- **Gray Matter** - YAML frontmatter parser for agents and commands

### Testing
- **Jest 30.2.0** - Backend API and parser testing (270 tests, 100% pass rate)
- **Playwright 1.56.0** - Frontend E2E and component testing (311 tests, 100% pass rate)

### Development
- **Vite Dev Server** - < 1 second startup, instant HMR
- **Vue DevTools** - Full integration for debugging
- **Source Maps** - Debug original source code

## Features

### Core Functionality
- **Project Discovery** - Automatically discovers all Claude Code projects from `~/.claude.json`
- **Subagent Viewing** - Browse and view all project and user-level subagents with full frontmatter specs
- **Slash Command Viewing** - View all custom slash commands across projects
- **Hooks Viewing** - Display configured hooks from settings files
- **MCP Server Viewing** - View MCP server configurations
- **Search & Filter** - Quickly find specific configurations
- **Detail Sidebar** - View full content with markdown rendering and syntax highlighting

### User Experience
- **SPA Navigation** - Client-side routing with no page reloads
- **Dark Mode** - Built-in dark/light theme toggle with CSS variables
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Manual Refresh** - Rescan projects on demand
- **Toast Notifications** - Auto-dismissing success/error messages

### Performance
- **< 1 Second Dev Server** - Vite HMR for instant feedback
- **< 2 Second Load Time** - Optimized production bundle
- **< 500KB Bundle** - Gzipped and code-split for fast delivery
- **Instant Navigation** - No page reloads between views

### Testing
- **581 Tests** - 100% pass rate across all test suites
  - 270 Backend tests (Jest) - 100% passing
  - 311 Frontend tests (Playwright: E2E, component, responsive, visual) - 100% passing
- **Cross-Browser** - Verified on Chromium, Firefox, and WebKit
- **Automated Quality** - Comprehensive test coverage with continuous validation

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

### Development Mode (Recommended)

For development with Hot Module Replacement (HMR) and instant feedback:

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

### Production Mode

Build and serve the optimized production bundle:

```bash
npm run build    # Build frontend to dist/
npm start        # Start backend server (serves frontend from dist/)
```
Opens http://localhost:8420

### Accessing the Application

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

**Phase 3 - Subagent CRUD** (Planned)
- Create, edit, and delete subagent definitions
- YAML frontmatter validation
- Live preview of subagent content
- Template system for common subagent types

**Phase 4 - Command Management** (Planned)
- Create, edit, and delete slash commands
- Command testing and validation
- Nested directory support
- Import/export command libraries

**Phase 5+ - Advanced Features** (Future)
- Hooks configuration editor
- MCP server management
- Real-time file watching for automatic updates
- Configuration version history and rollback
- Bulk operations and batch editing

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
