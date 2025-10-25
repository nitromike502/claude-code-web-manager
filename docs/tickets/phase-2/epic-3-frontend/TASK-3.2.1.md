# TASK-3.2.1: Create Card Grid Layout for 4 Config Types

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.2 - Configuration Cards Layout
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Create the card grid layout container on the project detail page to display four configuration type cards: Agents, Commands, Hooks, and MCP Servers. This task establishes the foundation structure for all configuration cards but does not implement the individual card content (that's in subsequent tasks).

## Prerequisites

- ✅ TASK-3.1.1: Project detail page component structure created
- ✅ TASK-3.1.2: Routing from dashboard implemented
- ✅ TASK-3.1.3: Breadcrumb navigation implemented
- ✅ Wireframes approved (`docs/wireframes/02-project-detail-view.md`)

## Acceptance Criteria

1. **Layout Structure**
   - [ ] Main content area with 4 card placeholders
   - [ ] Cards stacked vertically with consistent spacing
   - [ ] Responsive layout on all screen sizes
   - [ ] Cards have consistent width (max 960px centered)

2. **Card Placeholders**
   - [ ] Agents card placeholder with icon and title
   - [ ] Commands card placeholder with icon and title
   - [ ] Hooks card placeholder with icon and title
   - [ ] MCP Servers card placeholder with icon and title

3. **Visual Design**
   - [ ] Uses PrimeVue card styling
   - [ ] Category-specific icon colors (green, blue, orange, purple)
   - [ ] Proper spacing between cards (1.5rem)
   - [ ] Dark mode compatible

4. **Empty State**
   - [ ] Shows message when no data available
   - [ ] Loading skeleton while fetching data

## Implementation Notes

### HTML Structure

```html
<!-- In src/frontend/project-detail.html -->
<main class="main-content">
    <!-- Project Info Bar -->
    <div class="project-info-bar">
        <div class="project-icon">
            <i class="fas fa-folder"></i>
        </div>
        <div class="project-details">
            <h2 class="project-title">{{ project.name }}</h2>
            <p class="project-path">{{ project.path }}</p>
        </div>
    </div>

    <!-- Configuration Cards Container -->
    <div class="config-cards-container">
        <!-- Agents Card Placeholder -->
        <div class="config-card" id="agents-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-robot" style="color: var(--color-agents)"></i>
                    <h3>Subagents</h3>
                    <span class="count-badge">{{ agents.length }}</span>
                </div>
                <button class="btn-expand-all" @click="expandAllAgents">
                    Expand All
                </button>
            </div>
            <div class="card-body">
                <!-- Content added in TASK-3.2.2 -->
                <p class="placeholder-text">Loading agents...</p>
            </div>
        </div>

        <!-- Commands Card Placeholder -->
        <div class="config-card" id="commands-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-terminal" style="color: var(--color-commands)"></i>
                    <h3>Slash Commands</h3>
                    <span class="count-badge">{{ commands.length }}</span>
                </div>
                <button class="btn-expand-all" @click="expandAllCommands">
                    Expand All
                </button>
            </div>
            <div class="card-body">
                <!-- Content added in TASK-3.2.3 -->
                <p class="placeholder-text">Loading commands...</p>
            </div>
        </div>

        <!-- Hooks Card Placeholder -->
        <div class="config-card" id="hooks-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-plug" style="color: var(--color-hooks)"></i>
                    <h3>Hooks</h3>
                    <span class="count-badge">{{ hooks.length }}</span>
                </div>
                <button class="btn-expand-all" @click="expandAllHooks">
                    Expand All
                </button>
            </div>
            <div class="card-body">
                <!-- Content added in TASK-3.2.4 -->
                <p class="placeholder-text">Loading hooks...</p>
            </div>
        </div>

        <!-- MCP Servers Card Placeholder -->
        <div class="config-card" id="mcp-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-server" style="color: var(--color-mcp)"></i>
                    <h3>MCP Servers</h3>
                    <span class="count-badge">{{ mcpServers.length }}</span>
                </div>
                <button class="btn-expand-all" @click="expandAllMcp">
                    Expand All
                </button>
            </div>
            <div class="card-body">
                <!-- Content added in TASK-3.2.5 -->
                <p class="placeholder-text">Loading MCP servers...</p>
            </div>
        </div>
    </div>
</main>
```

### Vue Data Structure

```javascript
data() {
    return {
        project: {
            id: '',
            name: '',
            path: ''
        },
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
        error: null,
        warnings: []
    };
}
```

### CSS Styling

```css
/* Project Info Bar */
.project-info-bar {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.project-icon {
    font-size: 2rem;
    color: var(--text-secondary);
}

.project-details {
    flex: 1;
}

.project-title {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    color: var(--text-emphasis);
}

.project-path {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
}

/* Configuration Cards Container */
.config-cards-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.config-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
}

.config-card:hover {
    box-shadow: var(--shadow-card);
}

.card-header {
    background-color: var(--bg-tertiary);
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.card-title i {
    font-size: 1.25rem;
}

.card-title h3 {
    margin: 0;
    font-size: 1.125rem;
    color: var(--text-primary);
}

.count-badge {
    background-color: var(--bg-hover);
    color: var(--text-secondary);
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
}

.btn-expand-all {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.btn-expand-all:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
}

.card-body {
    padding: 1.5rem;
    min-height: 100px;
}

.placeholder-text {
    text-align: center;
    color: var(--text-muted);
    padding: 2rem;
}

/* Responsive */
@media (max-width: 767px) {
    .config-cards-container {
        gap: 1rem;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .btn-expand-all {
        width: 100%;
        text-align: center;
    }
}
```

## Testing Checklist

### Manual Testing
- [ ] Four card placeholders display correctly
- [ ] Cards have proper spacing between them
- [ ] Card headers show icons and titles
- [ ] Count badges display (even with 0 count)
- [ ] Expand All buttons render but don't do anything yet
- [ ] Project info bar displays above cards
- [ ] Responsive on mobile/tablet/desktop
- [ ] Theme toggle maintains card visibility
- [ ] No console errors

### Playwright Tests

**Test File:** `tests/frontend/config-cards-layout.spec.js`

```javascript
test('Config cards layout displays correctly', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Verify all 4 cards are present
    const cards = page.locator('.config-card');
    await expect(cards).toHaveCount(4);
});

test('Card headers display icons and titles', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.config-cards-container');

    // Verify card titles
    await expect(page.locator('#agents-card h3')).toHaveText('Subagents');
    await expect(page.locator('#commands-card h3')).toHaveText('Slash Commands');
    await expect(page.locator('#hooks-card h3')).toHaveText('Hooks');
    await expect(page.locator('#mcp-card h3')).toHaveText('MCP Servers');

    // Verify icons are present
    await expect(page.locator('#agents-card .fa-robot')).toBeVisible();
    await expect(page.locator('#commands-card .fa-terminal')).toBeVisible();
    await expect(page.locator('#hooks-card .fa-plug')).toBeVisible();
    await expect(page.locator('#mcp-card .fa-server')).toBeVisible();
});

test('Project info bar displays', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    const projectName = await page.locator('.project-card .project-name').first().textContent();

    await page.locator('.project-card').first().click();
    await page.waitForSelector('.project-info-bar');

    // Verify project info bar shows project name
    const infoBarTitle = await page.locator('.project-title').textContent();
    expect(infoBarTitle).toContain(projectName);
});
```

## Files to Create

None (modify existing)

## Files to Modify

- `src/frontend/project-detail.html` - Add card grid layout structure and CSS

## Success Indicators

1. Four card placeholders visible on page
2. Cards properly spaced and aligned
3. Project info bar displays above cards
4. Icons use correct category colors
5. Responsive layout on all screen sizes
6. No console errors

## Related Tickets

**Depends On:**
- TASK-3.1.1: Create project detail page component structure
- TASK-3.1.3: Breadcrumb navigation implemented

**Blocks:**
- TASK-3.2.2: Build Agents card component with API integration
- TASK-3.2.3: Build Commands card component with API integration
- TASK-3.2.4: Build Hooks card component with API integration
- TASK-3.2.5: Build MCP Servers card component with API integration

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Accessibility Requirements
- **ARIA Labels:** Add `aria-label` to each card section
- **Heading Hierarchy:** H2 for project title, H3 for card titles
- **Keyboard Navigation:** Ensure Expand All buttons are keyboard accessible
- **Screen Reader:** Announce count badges

### Design Consistency
- Use the same icon colors as dashboard (`--color-agents`, `--color-commands`, etc.)
- Match card styling with dashboard project cards
- Consistent spacing with dashboard layout

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
