# Phase 1 Frontend Files (ARCHIVED)

> ⚠️ **STATUS: ARCHIVED - REPLACED BY PHASE 2**
>
> This directory contains the original Phase 1 frontend implementation using
> CDN-based Vue 3 + PrimeVue. These files are **no longer used** in production.
>
> **Phase 1 (Archived):** HTML + CDN Vue (this directory)
> **Phase 2 (Current):** Vite + Vue 3 SPA (see `/src/` root directory)
>
> These files are preserved for reference and historical purposes.

---

## Phase 1 Implementation (October 2025)

The Phase 1 frontend used a CDN-based approach with no build tools:

### Architecture
- **Vue 3** via CDN
- **PrimeVue** component library via CDN
- **Hash-based routing** (manual implementation)
- **No build tools** (direct browser execution)

### File Structure
```
src/frontend/
├── index.html              # Main dashboard page
├── project-detail.html     # Project detail page
├── user-view.html          # User configuration page
├── css/
│   ├── variables.css      # CSS custom properties (theme)
│   ├── global.css         # Global styles
│   └── components.css     # Component styles
├── js/
│   ├── api.js            # API client
│   ├── router.js         # Hash-based routing
│   ├── app.js            # Vue app initialization
│   └── components/       # Vue components (JS files)
└── components/
    ├── AgentCard.js      # Agent configuration card
    ├── CommandCard.js    # Command configuration card
    ├── HookCard.js       # Hook configuration card
    ├── MCPCard.js        # MCP server card
    └── DetailSidebar.js  # Detail viewing sidebar
```

### What Was Built
- ✅ Dashboard with project list
- ✅ Project detail view with 4 config cards (agents, commands, hooks, MCP)
- ✅ User/global configuration view
- ✅ Dark/light theme toggle
- ✅ Detail sidebar for viewing full content
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ All API endpoints integrated

### Why It Was Replaced

Phase 2 migrated to Vite+Vue3 SPA for:
- **Better developer experience** - Hot Module Replacement (< 1s reload)
- **Better performance** - Optimized production builds
- **Better maintainability** - Single File Components (.vue)
- **Better state management** - Pinia stores for global state
- **Better routing** - Vue Router with client-side navigation

See `/home/claude/manager/docs/PHASE2-MIGRATION-GUIDE.md` for full migration details.

## Current Implementation (Phase 2)

**Active frontend code is now located at:**
- `src/main.js` - App entry point
- `src/App.vue` - Root component
- `src/components/*.vue` - Page components
- `src/router/index.js` - Vue Router
- `src/stores/*.js` - Pinia state management
- `src/styles/*.css` - CSS variables and styles

## Why This Directory Still Exists

These files are preserved for:
1. **Historical reference** - Understanding Phase 1 implementation
2. **Rollback capability** - If Phase 2 needs to be reverted
3. **Migration documentation** - Showing what changed between phases
4. **Learning resource** - Comparing CDN vs. build-tool approaches

## Do Not Use These Files

**These files are NOT loaded by the application.**

The current application uses:
- `index.html` (in project root) - SPA entry point
- Vite build system
- Vue 3 Single File Components
- Vue Router for navigation
- Pinia for state management

## Migration Timeline

- **Phase 1 Complete:** October 2025
- **Phase 2 Migration:** October 2025 (~12 hours)
- **Phase 2 Complete:** October 18, 2025
- **Files Archived:** October 18, 2025

---

For current documentation, see:
- `/home/claude/manager/CLAUDE.md` - Project overview
- `/home/claude/manager/README.md` - User documentation
- `/home/claude/manager/docs/PHASE2-MIGRATION-GUIDE.md` - Migration guide
