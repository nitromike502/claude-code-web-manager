# TASK-3.1.1: Create Project Detail Page Component Structure

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.1 - Project Detail View Structure
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Create the HTML structure and Vue component for the project detail page. This page displays detailed information about a single project, including cards for Agents, Commands, Hooks, and MCP servers.

## Prerequisites

- ✅ Backend API endpoints functional (`/api/projects/:id/*`)
- ✅ Wireframes approved (`docs/wireframes/02-project-detail-view.md`)
- ✅ Dashboard view exists (`src/frontend/index.html`)

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/frontend/project-detail.html` page
   - [ ] Include Vue 3 integration (CDN-hosted)
   - [ ] Add proper page title and meta tags

2. **Page Layout**
   - [ ] Header with app branding (consistent with dashboard)
   - [ ] Breadcrumb navigation showing: Dashboard > [Project Name]
   - [ ] Main content area for configuration cards
   - [ ] Responsive layout structure

3. **Navigation**
   - [ ] Back button/link to dashboard
   - [ ] Breadcrumb click navigation

4. **Theme Support**
   - [ ] Dark mode / light mode toggle
   - [ ] Uses existing CSS variables from `css/variables.css`
   - [ ] Theme preference persists (localStorage)

5. **Vue Data Structure**
   - [ ] `projectId` - Current project ID from URL
   - [ ] `project` - Project metadata (name, path, stats)
   - [ ] `loading` - Loading state
   - [ ] `error` - Error message state

## Implementation Notes

### Page Structure
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <!-- Meta tags, CSS links -->
</head>
<body>
    <div id="app">
        <!-- Header (same as dashboard) -->
        <!-- Breadcrumbs -->
        <!-- Main content area -->
        <!-- Four cards will go here (next tickets) -->
    </div>
    <!-- Vue 3 CDN -->
    <script>
        // Vue app with routing logic
    </script>
</body>
</html>
```

### URL Parameter Handling
```javascript
// Extract projectId from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
```

### Navigation Back
```javascript
// Method to return to dashboard
goToDashboard() {
    window.location.href = '/';
}
```

### **Warning Display Handling** ⚠️

Backend may return warnings in API responses. Prepare data structure to collect warnings:

```javascript
data() {
    return {
        projectId: '',
        project: {
            id: '',
            name: '',
            path: ''
        },
        warnings: [], // Collect warnings from all API calls
        loading: false,
        error: null
    };
},
methods: {
    async loadProject() {
        // When fetching project data
        const response = await fetch(`/api/projects`);
        const data = await response.json();

        if (data.warnings && data.warnings.length > 0) {
            // Store warnings to display in banner
            this.warnings = data.warnings;
        }

        // Find current project
        const currentProject = data.projects.find(p => p.id === this.projectId);
        if (currentProject) {
            this.project = currentProject;
        }
    }
}
```

Warning banner will be added in TASK-3.2.1 when card layout is created.

### Complete Vue App Structure

```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            currentTheme: 'dark',
            projectId: '',
            project: {
                id: '',
                name: '',
                path: ''
            },
            warnings: [],
            loading: false,
            error: null
        };
    },
    async mounted() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Extract project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.projectId = urlParams.get('id');

        if (!this.projectId) {
            this.error = 'No project ID provided';
            return;
        }

        // Load project information
        await this.loadProject();
    },
    methods: {
        async loadProject() {
            this.loading = true;
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();

                if (data.success) {
                    // Find current project
                    const currentProject = data.projects.find(p => p.id === this.projectId);

                    if (currentProject) {
                        this.project = currentProject;
                    } else {
                        this.error = 'Project not found';
                    }

                    // Collect warnings
                    if (data.warnings) {
                        this.warnings = data.warnings;
                    }
                } else {
                    this.error = data.error || 'Failed to load project';
                }
            } catch (err) {
                this.error = 'Failed to connect to server';
                console.error('Error loading project:', err);
            } finally {
                this.loading = false;
            }
        },

        goToDashboard() {
            window.location.href = '/';
        },

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
        }
    }
}).mount('#app');
```

## Testing Checklist

### Manual Testing
- [ ] Page loads without errors
- [ ] Project ID extracted from URL correctly
- [ ] Header displays correctly
- [ ] Breadcrumbs show project name
- [ ] Back button returns to dashboard
- [ ] Theme toggle works
- [ ] Theme persists after page reload
- [ ] Responsive layout on mobile/tablet/desktop

### Playwright Tests

**Test File:** `tests/frontend/project-detail-structure.spec.js`

```javascript
test('Project detail page loads successfully', async ({ page }) => {
    // Navigate to dashboard first
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Get project ID
    const firstCard = page.locator('.project-card').first();
    const projectId = await firstCard.getAttribute('data-id') || 'test-project';

    // Navigate to project detail directly
    await page.goto(`http://localhost:8420/project-detail.html?id=${projectId}`);

    // Verify page loaded
    await expect(page.locator('.breadcrumbs')).toBeVisible();
    await expect(page.locator('.main-content')).toBeVisible();
});

test('Project ID extracted from URL', async ({ page }) => {
    await page.goto('http://localhost:8420/project-detail.html?id=testproject123');

    // Verify project ID is read correctly
    const projectId = await page.evaluate(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    });

    expect(projectId).toBe('testproject123');
});

test('Theme toggle persists on project detail page', async ({ page }) => {
    await page.goto('http://localhost:8420/project-detail.html?id=test');
    await page.waitForSelector('.theme-toggle');

    // Verify default theme
    let theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');

    // Toggle theme
    await page.locator('.theme-toggle').click();
    theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');

    // Reload page and verify theme persisted
    await page.reload();
    theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
});

test('Header consistent with dashboard', async ({ page }) => {
    // Check dashboard header
    await page.goto('http://localhost:8420');
    const dashboardHeader = await page.locator('.app-header').innerHTML();

    // Check project detail header
    await page.goto('http://localhost:8420/project-detail.html?id=test');
    const detailHeader = await page.locator('.app-header').innerHTML();

    // Headers should have same structure
    expect(dashboardHeader).toContain('Claude Code Manager');
    expect(detailHeader).toContain('Claude Code Manager');
});
```

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Files to Create

- `src/frontend/project-detail.html` - Main project detail page

## Files to Modify

None (pure addition)

## Success Indicators

1. Page accessible at `http://localhost:8420/project-detail.html?id=[projectId]`
2. Navigation between dashboard and detail view works smoothly
3. Theme toggle functional
4. Layout matches wireframe design
5. No console errors

## Related Tickets

**Depends On:**
- ✅ Dashboard view (already implemented)
- ✅ Wireframe approval (complete)

**Blocks:**
- TASK-3.1.2 - Add routing from dashboard to detail view
- TASK-3.2.1 - Create card grid layout for 4 config types

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Accessibility Requirements
- **ARIA Labels:** Add `aria-label="Main content"` to main content area
- **Heading Hierarchy:** Maintain proper H1-H6 structure
- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Reader:** Announce page title and project name on load

### Code Examples - Complete HTML Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Detail - Claude Code Manager</title>
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/global.css">
    <link rel="stylesheet" href="/css/components.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            <button class="theme-toggle" @click="toggleTheme">
                <i :class="currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>
        </header>

        <!-- Breadcrumbs -->
        <div class="breadcrumbs" role="navigation" aria-label="Breadcrumb navigation">
            <button class="breadcrumb-item clickable" @click="goToDashboard">
                <i class="fas fa-home"></i>
                Dashboard
            </button>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active" aria-current="page">
                <i class="fas fa-folder"></i>
                {{ project.name || 'Loading...' }}
            </span>
        </div>

        <!-- Main Content -->
        <main class="main-content" role="main" aria-label="Main content">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading project...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Project</h3>
                <p>{{ error }}</p>
                <button class="btn-retry" @click="loadProject">Retry</button>
            </div>

            <!-- Project Content (when loaded) -->
            <div v-else>
                <!-- Project info bar and cards will be added in next tasks -->
                <p>Project detail page loaded for: {{ project.name }}</p>
            </div>
        </main>
    </div>

    <!-- Vue 3 CDN -->
    <script src="https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js"></script>

    <!-- App Script -->
    <script>
        // Vue app code here (see Complete Vue App Structure above)
    </script>
</body>
</html>
```

### Design Decisions

**Page Shell Only:**
- This ticket creates the structural foundation
- Configuration cards added in TASK-3.2.1
- Sidebar added in TASK-3.3.1
- Focus on routing, theme, and navigation

**Consistency with Dashboard:**
- Use identical header structure
- Reuse CSS classes from dashboard
- Maintain same theme toggle behavior
- Keep breadcrumb styling consistent

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
