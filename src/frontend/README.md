# Claude Code Manager - Frontend

Complete Vue 3 + PrimeVue frontend implementation for the Claude Code Manager MVP.

## Architecture

### Technology Stack
- **Vue 3** - Composition API via CDN (no build tools)
- **PrimeVue 3.50.0** - UI component library via CDN
- **PrimeIcons 6.0.1** - Icon library
- **No Build Tools** - Direct browser execution

### File Structure
```
src/frontend/
├── index.html                   # Main HTML file with CDN links
├── css/
│   ├── variables.css           # CSS custom properties (theme system)
│   ├── global.css              # Global styles and utilities
│   └── components.css          # Component-specific styles
└── js/
    ├── api.js                  # API client for backend
    ├── router.js               # Simple hash-based router
    ├── app.js                  # Vue app initialization
    └── components/
        ├── Dashboard.js         # Project list view
        ├── ProjectDetail.js     # Single project view
        ├── UserGlobal.js        # User-level configs view
        ├── ConfigCard.js        # Reusable config card
        ├── ConfigItem.js        # Single config item
        └── DetailSidebar.js     # Detail panel

```

## Features Implemented

### Views
1. **Dashboard View** - Project grid with search/filter/sort
2. **Project Detail View** - 4 config cards (agents, commands, hooks, MCP)
3. **User/Global View** - User-level configurations

### Components
- **AppHeader** - Navigation toolbar with breadcrumbs
- **ProjectCard** - Project summary card with stats
- **ConfigCard** - Reusable card for config lists
- **ConfigItem** - Individual config item row
- **DetailSidebar** - 40% width side panel for viewing details

### Features
- Dark/Light theme toggle with localStorage persistence
- Client-side routing with hash navigation
- Search filtering across all views
- Sort/filter options for project list
- Rescan button to refresh project list
- View details in slide-out sidebar
- Copy to clipboard functionality
- Download markdown files
- Responsive design for laptop/desktop/tablet
- Loading states with skeletons
- Error handling with retry
- Empty states with helpful messages

## Theme System

### CSS Variables
All colors use CSS custom properties defined in `css/variables.css`:

```css
/* Dark Mode (Default) */
:root[data-theme="dark"] {
  --bg-primary: #121212;
  --text-primary: #e0e0e0;
  --color-agents: #4CAF50;
  /* ... more variables */
}

/* Light Mode */
:root[data-theme="light"] {
  --bg-primary: #f5f5f5;
  --text-primary: #212121;
  --color-agents: #388e3c;
  /* ... more variables */
}
```

### Category Colors
- **Agents** (Green): `--color-agents`
- **Commands** (Blue): `--color-commands`
- **Hooks** (Orange): `--color-hooks`
- **MCP** (Purple): `--color-mcp`

## API Integration

### Endpoints Used
- `GET /api/projects` - List all projects
- `POST /api/projects/scan` - Trigger rescan
- `GET /api/projects/:id/agents` - Get project agents
- `GET /api/projects/:id/commands` - Get project commands
- `GET /api/projects/:id/hooks` - Get project hooks
- `GET /api/projects/:id/mcp` - Get project MCP servers
- `GET /api/user/agents` - Get user agents
- `GET /api/user/commands` - Get user commands
- `GET /api/user/hooks` - Get user hooks
- `GET /api/user/mcp` - Get user MCP servers

### API Client (`js/api.js`)
Simple fetch-based client with error handling:
```javascript
import { projectsAPI, userAPI, healthCheck } from './api.js';

// Get all projects
const response = await projectsAPI.getAll();
// Returns: { success: true, projects: {...}, error: null }

// Trigger rescan
await projectsAPI.scan();

// Get project agents
const agentsData = await projectsAPI.getAgents(projectId);
// Returns: { success: true, agents: [...], projectId, projectPath }

// Get user-level configurations
const userAgents = await userAPI.getAgents();
const userCommands = await userAPI.getCommands();

// Health check
const health = await healthCheck();
```

## Routing

### Hash-Based Router (`js/router.js`)
- `#/` or `#/dashboard` - Dashboard view
- `#/project/:projectId` - Project detail view
- `#/user` - User/global view

### Navigation
```javascript
window.router.navigate('/project/homeuserprojectsmyapp');
```

## PrimeVue Components Used

- **Toolbar** - App header
- **Card** - All content containers
- **Button** - Interactive elements
- **InputText** - Search input
- **IconField/InputIcon** - Search field with icon
- **Breadcrumb** - Navigation breadcrumbs
- **Dropdown** - Sort/filter dropdown
- **ProgressSpinner** - Loading indicator
- **Skeleton** - Loading placeholders
- **Sidebar** - Detail panel
- **Panel** - Collapsible sections
- **Tag** - Category labels
- **Toast** - Notifications
- **Tooltip** - Hover hints (directive)

## Responsive Design

### Breakpoints
- **Desktop** (1200px+) - 3-4 project cards per row
- **Laptop** (768px-1199px) - 2-3 cards per row
- **Tablet** (600px-767px) - 2 cards per row
- **Mobile** (<600px) - 1 card per row (low priority)

### Sidebar Responsive
- **Desktop** - 40% width (max 600px)
- **Laptop** - 50% width
- **Tablet** - 60% width
- **Mobile** - 90% width

## Accessibility

- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Screen reader announcements
- WCAG AA color contrast minimum
- Tooltip hints for icon buttons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Running the Server
```bash
# From project root
npm start

# OR for development with auto-reload
npm run dev
```

### Accessing the Frontend
Open browser to: `http://localhost:8420`

### Making Changes
1. Edit files in `src/frontend/` (HTML, CSS, or JavaScript)
2. Refresh browser (no build step needed)
3. Check browser console for errors (F12)

### File Organization
- **index.html** - Main entry point, CDN script tags
- **css/variables.css** - Theme colors and CSS custom properties
- **css/global.css** - Global styles, resets, utilities
- **css/components.css** - Component-specific styles
- **js/api.js** - Backend API client
- **js/router.js** - Simple hash-based routing
- **js/app.js** - Vue app initialization and setup
- **js/components/** - Vue component definitions (ES6 modules)

## Testing Checklist

- [x] Dashboard loads and displays projects
- [x] Project cards show correct stats
- [x] Search filters projects
- [x] Sort dropdown works
- [x] Rescan button triggers refresh
- [x] Click project navigates to detail view
- [x] Project detail shows 4 config cards
- [x] Config cards load data from API
- [x] View Details opens sidebar
- [x] Sidebar shows full content
- [x] Prev/Next navigation works in sidebar
- [x] Copy to clipboard works
- [x] Download markdown works
- [x] User button navigates to user view
- [x] User view shows user-level configs
- [x] Theme toggle switches dark/light
- [x] Theme persists in localStorage
- [x] Breadcrumbs show correct navigation
- [x] Back button returns to dashboard
- [x] Responsive layout adapts to screen size
- [x] Loading states display during API calls
- [x] Error states show with retry button
- [x] Empty states display helpful messages

## Design Decisions

### Why No Build Tools?
- Faster development (no compilation step)
- Simpler deployment (just copy files)
- Easier debugging (no source maps needed)
- Matches project requirement for CDN-only approach

### Why Hash-Based Routing?
- No server configuration needed
- Works with static file serving
- Simple implementation
- Sufficient for single-page app

### Why CSS Variables?
- Easy theme switching
- No JavaScript required
- Better performance than runtime theme switching
- Maintains consistency across components

### Why Side Panel (not Modal)?
- Preserves context (can still see list)
- Better for long content
- Easier to compare multiple items
- Matches wireframe specification

## Known Limitations

1. **Markdown Rendering** - Basic text display (no full Markdown-to-HTML conversion)
2. **Syntax Highlighting** - Simple color coding (no full syntax highlighter library)
3. **Mobile Support** - Low priority, basic responsive design (optimized for desktop/laptop)
4. **Virtual Scrolling** - Not implemented (performance fine for typical usage under 100 items per list)
5. **Search** - Client-side only (filters already-loaded data, not server-side search)
6. **No Build Tools** - Direct browser execution means no TypeScript, no module bundling, no tree-shaking

## Future Enhancements (Phase 2+)

- Edit/create/delete operations
- Advanced markdown rendering
- Full syntax highlighting (Prism.js)
- Virtual scrolling for large lists
- Server-side search/filter
- Multi-select and batch operations
- Drag-and-drop reordering
- Export/import functionality
- Keyboard shortcuts
- Split-screen comparison mode

## Troubleshooting

### Frontend Not Loading
1. Check server is running on port 8420
2. Check browser console for errors
3. Verify CDN links are accessible
4. Check network tab for failed requests

### API Errors
1. Check backend server logs
2. Verify API endpoints are working
3. Test endpoints with curl
4. Check CORS headers

### Styling Issues
1. Clear browser cache
2. Check theme attribute on `<html>` element
3. Verify CSS files are loaded
4. Check for CSS variable support

### JavaScript Errors
1. Check browser console
2. Verify all CDN scripts loaded
3. Check ES6 module support
4. Ensure proper event listener cleanup

## Credits

Built by the frontend development team for Claude Code Manager Phase 1 MVP.

Designed according to wireframe specifications in `/docs/wireframes/`.
