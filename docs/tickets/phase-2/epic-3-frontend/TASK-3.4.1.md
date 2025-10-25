# TASK-3.4.1: Create User/Global View Page Component

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.4 - User/Global Configuration View
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Create the user/global configuration view page that displays user-level configurations from `~/.claude/`. This page mirrors the project detail view structure but shows configurations that apply to all projects. Accessible via "User" button in header.

## Prerequisites

- ✅ TASK-3.2.1-3.2.5: Config card components implemented
- ✅ TASK-3.3.1-3.3.6: Sidebar functionality complete
- ✅ Wireframes approved (`docs/wireframes/03-user-global-view.md`)

## Acceptance Criteria

1. **Page Structure**
   - [ ] Create `src/frontend/user-view.html` page
   - [ ] Header with breadcrumb navigation
   - [ ] User info bar showing `~/.claude/` path
   - [ ] Four config cards (same structure as project view)

2. **Visual Differentiation**
   - [ ] Purple accent color for user view
   - [ ] Info bar indicates "Applies to all projects"
   - [ ] Different icon (user icon)

3. **API Integration**
   - [ ] Fetches from `/api/user/agents`
   - [ ] Fetches from `/api/user/commands`
   - [ ] Fetches from `/api/user/hooks`
   - [ ] Fetches from `/api/user/mcp`

## Implementation Notes

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Configurations - Claude Code Manager</title>
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/global.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="app-header">
            <div class="app-title">
                <i class="fas fa-code"></i>
                <span>Claude Code Manager</span>
            </div>
            <div class="header-search">
                <input
                    type="text"
                    class="search-input"
                    placeholder="Search configurations..."
                    v-model="searchQuery"
                />
            </div>
            <button class="theme-toggle" @click="toggleTheme" :title="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
                <i :class="currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
        </header>

        <!-- Breadcrumbs -->
        <div class="breadcrumbs">
            <button class="breadcrumb-item clickable" @click="goToDashboard">
                <i class="fas fa-home"></i>
                Dashboard
            </button>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active user-breadcrumb">
                <i class="fas fa-user"></i>
                User Configurations
            </span>
        </div>

        <!-- User Info Bar -->
        <main class="main-content">
            <div class="project-info-bar user-info-bar">
                <div class="project-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="project-details">
                    <h2 class="project-title">User Configurations</h2>
                    <p class="project-path">~/.claude/ • Applies to all projects</p>
                </div>
            </div>

            <!-- Warning Banner -->
            <div v-if="warnings.length > 0" class="warning-banner">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="warning-content">
                    <strong>Configuration Warnings:</strong>
                    <ul>
                        <li v-for="(warning, index) in warnings" :key="index">{{ warning }}</li>
                    </ul>
                </div>
                <button class="btn-close-warning" @click="warnings = []">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Configuration Cards (reuse from project detail view) -->
            <div class="config-cards-container">
                <!-- Agents Card -->
                <div class="config-card" id="agents-card">
                    <!-- Same structure as project-detail.html -->
                </div>

                <!-- Commands Card -->
                <div class="config-card" id="commands-card">
                    <!-- Same structure -->
                </div>

                <!-- Hooks Card -->
                <div class="config-card" id="hooks-card">
                    <!-- Same structure -->
                </div>

                <!-- MCP Servers Card -->
                <div class="config-card" id="mcp-card">
                    <!-- Same structure -->
                </div>
            </div>
        </main>

        <!-- Detail Sidebar (same as project-detail.html) -->
        <!-- ... -->
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <!-- App script similar to project-detail.html -->
</body>
</html>
```

### Vue App Structure

```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            currentTheme: 'dark',
            searchQuery: '',
            agents: [],
            commands: [],
            hooks: [],
            mcpServers: [],
            loading: {
                agents: false,
                commands: false,
                hooks: false,
                mcp: false
            },
            warnings: [],
            sidebarVisible: false,
            currentItem: {}
        };
    },
    async mounted() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Load all user configurations
        await Promise.all([
            this.loadAgents(),
            this.loadCommands(),
            this.loadHooks(),
            this.loadMcpServers()
        ]);
    },
    methods: {
        async loadAgents() {
            this.loading.agents = true;
            try {
                const response = await fetch('/api/user/agents');
                const data = await response.json();
                if (data.success) {
                    this.agents = data.agents || [];
                    if (data.warnings) this.warnings.push(...data.warnings);
                }
            } catch (err) {
                console.error('Error loading user agents:', err);
            } finally {
                this.loading.agents = false;
            }
        },

        async loadCommands() {
            // Similar to loadAgents but with /api/user/commands
        },

        async loadHooks() {
            // Similar to loadAgents but with /api/user/hooks
        },

        async loadMcpServers() {
            // Similar to loadAgents but with /api/user/mcp
        },

        goToDashboard() {
            window.location.href = '/';
        },

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
        }

        // All sidebar methods same as project-detail.html
    }
}).mount('#app');
```

### CSS for User View Differentiation

```css
/* User view purple accent */
.user-breadcrumb {
    color: var(--color-mcp) !important;
}

.user-info-bar {
    background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a1a4a 100%);
    border-color: #4a3a6a;
}

.user-info-bar .project-icon {
    color: var(--color-mcp);
}
```

## Testing Checklist

### Manual Testing
- [ ] Page accessible at `/user-view.html`
- [ ] Header and breadcrumbs display correctly
- [ ] User info bar shows purple accent
- [ ] All four config cards present
- [ ] Cards fetch from user API endpoints
- [ ] "View Details" opens sidebar
- [ ] Theme toggle works
- [ ] Responsive on all screen sizes

### Playwright Tests

**Test File:** `tests/frontend/user-view.spec.js`

```javascript
test('User view page loads', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('.user-info-bar');

    // Verify page title
    await expect(page.locator('.project-title')).toHaveText('User Configurations');
});

test('User view fetches from user API endpoints', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('.config-card');

    // Verify agents card loaded
    const agentCard = page.locator('#agents-card');
    await expect(agentCard).toBeVisible();
});

test('Breadcrumb navigates back to dashboard', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('.breadcrumbs');

    // Click Dashboard breadcrumb
    await page.locator('.breadcrumb-item.clickable').click();

    // Verify returned to dashboard
    await expect(page).toHaveURL('http://localhost:8420/');
});
```

## Files to Create

- `src/frontend/user-view.html` - User/global configuration view page

## Files to Modify

None (pure addition)

## Success Indicators

1. User view page accessible
2. Fetches from user API endpoints
3. Purple accent visible
4. Sidebar works same as project view
5. No console errors

## Related Tickets

**Depends On:**
- TASK-3.2.1-3.2.5: Config cards implemented
- TASK-3.3.1-3.3.6: Sidebar complete

**Blocks:**
- TASK-3.4.2: Navigation to user view from header

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/03-user-global-view.md`
**Color Palette:** Use CSS variables + purple accent (`var(--color-mcp)`)
**Accessibility:** Same requirements as project detail view
