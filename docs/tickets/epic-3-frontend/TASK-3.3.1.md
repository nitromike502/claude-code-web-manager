# TASK-3.3.1: Create Detail Sidebar Component Structure

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Create the sidebar/panel component structure that will display full details when a user clicks "View Details" on any configuration item (agent, command, hook, or MCP server). The sidebar slides in from the right and overlays the main content area.

## Prerequisites

- ✅ TASK-3.2.2-3.2.5: All config cards implemented
- ✅ Wireframes approved (`docs/wireframes/04-detail-interactions.md`)

## Acceptance Criteria

1. **Sidebar Structure**
   - [ ] Sidebar container with right-side positioning
   - [ ] Header with close button and item title
   - [ ] Content area for displaying details
   - [ ] Footer with action buttons (Copy All, Download)

2. **Visual Design**
   - [ ] Slides in from right (300ms animation)
   - [ ] 40% width (min 400px, max 600px)
   - [ ] Overlay dims main content
   - [ ] Z-index ensures sidebar is on top

3. **Basic Functionality**
   - [ ] Sidebar hidden by default
   - [ ] Opens when view details clicked
   - [ ] Placeholder content displayed

## Implementation Notes

### HTML Structure

```html
<!-- Detail Sidebar (add to project-detail.html) -->
<div v-if="sidebarVisible" class="sidebar-overlay" @click="closeSidebar">
    <div class="detail-sidebar" @click.stop>
        <!-- Header -->
        <div class="sidebar-header">
            <div class="sidebar-title">
                <i :class="getSidebarIcon()" :style="{ color: getSidebarColor() }"></i>
                <h3>{{ currentItem.name }}</h3>
            </div>
            <button class="btn-close-sidebar" @click="closeSidebar" title="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Content Area (scrollable) -->
        <div class="sidebar-content">
            <div class="item-type-badge">{{ currentItem.type }}</div>
            <div class="item-file-path">{{ currentItem.filePath }}</div>

            <!-- Content sections will be added in subsequent tasks -->
            <div class="content-placeholder">
                <p>Details will be displayed here</p>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="sidebar-footer">
            <button class="btn-secondary" @click="copyAllContent">
                <i class="fas fa-copy"></i>
                Copy All
            </button>
            <button class="btn-secondary" @click="downloadContent">
                <i class="fas fa-download"></i>
                Download
            </button>
        </div>
    </div>
</div>
```

### Vue Data and Methods

```javascript
data() {
    return {
        sidebarVisible: false,
        currentItem: {
            name: '',
            type: '',
            filePath: '',
            content: '',
            frontmatter: null
        }
    };
},
methods: {
    viewAgentDetails(agent) {
        this.currentItem = {
            name: agent.name,
            type: 'Subagent',
            filePath: agent.filePath,
            content: agent.content,
            frontmatter: agent.frontmatter
        };
        this.openSidebar();
    },

    viewCommandDetails(command) {
        this.currentItem = {
            name: command.name,
            type: 'Slash Command',
            filePath: command.filePath,
            content: command.content,
            frontmatter: command.frontmatter
        };
        this.openSidebar();
    },

    viewHookDetails(hook) {
        this.currentItem = {
            name: hook.name || hook.event,
            type: 'Hook',
            filePath: hook.source,
            content: JSON.stringify(hook, null, 2),
            frontmatter: null
        };
        this.openSidebar();
    },

    viewMcpDetails(server) {
        this.currentItem = {
            name: server.name,
            type: 'MCP Server',
            filePath: server.source,
            content: JSON.stringify(server, null, 2),
            frontmatter: null
        };
        this.openSidebar();
    },

    openSidebar() {
        this.sidebarVisible = true;
    },

    closeSidebar() {
        this.sidebarVisible = false;
        this.currentItem = {
            name: '',
            type: '',
            filePath: '',
            content: '',
            frontmatter: null
        };
    },

    getSidebarIcon() {
        const icons = {
            'Subagent': 'fas fa-robot',
            'Slash Command': 'fas fa-terminal',
            'Hook': 'fas fa-plug',
            'MCP Server': 'fas fa-server'
        };
        return icons[this.currentItem.type] || 'fas fa-file';
    },

    getSidebarColor() {
        const colors = {
            'Subagent': 'var(--color-agents)',
            'Slash Command': 'var(--color-commands)',
            'Hook': 'var(--color-hooks)',
            'MCP Server': 'var(--color-mcp)'
        };
        return colors[this.currentItem.type] || 'var(--text-primary)';
    },

    copyAllContent() {
        // Will be implemented in TASK-3.3.6
        console.log('Copy all content');
    },

    downloadContent() {
        // Will be implemented in TASK-3.3.6
        console.log('Download content');
    }
}
```

### CSS Styling

```css
/* Sidebar Overlay */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Detail Sidebar */
.detail-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40%;
    min-width: 400px;
    max-width: 600px;
    background-color: var(--bg-secondary);
    border-left: 1px solid var(--border-primary);
    box-shadow: var(--shadow-sidebar);
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease;
    z-index: 1001;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

/* Sidebar Header */
.sidebar-header {
    padding: 1.5rem;
    background-color: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.sidebar-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.sidebar-title i {
    font-size: 1.5rem;
}

.sidebar-title h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-emphasis);
}

.btn-close-sidebar {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.btn-close-sidebar:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
}

/* Sidebar Content */
.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.item-type-badge {
    display: inline-block;
    background-color: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.item-file-path {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-family: 'Courier New', monospace;
    margin-bottom: 1.5rem;
    word-break: break-all;
}

.content-placeholder {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-muted);
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1rem 1.5rem;
    background-color: var(--bg-tertiary);
    border-top: 1px solid var(--border-primary);
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
}

.btn-secondary {
    flex: 1;
    background-color: var(--bg-hover);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    padding: 0.625rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--color-primary);
}

/* Responsive */
@media (max-width: 1199px) {
    .detail-sidebar {
        width: 50%;
    }
}

@media (max-width: 767px) {
    .detail-sidebar {
        width: 90%;
        min-width: 0;
    }

    .sidebar-footer {
        flex-direction: column;
    }
}
```

## Testing Checklist

### Manual Testing
- [ ] Sidebar hidden by default
- [ ] Clicking "View Details" opens sidebar
- [ ] Sidebar slides in from right
- [ ] Overlay dims main content
- [ ] Close button visible and styled
- [ ] Footer action buttons visible
- [ ] Responsive on different screen sizes
- [ ] Theme toggle maintains sidebar visibility

### Playwright Tests

**Test File:** `tests/frontend/detail-sidebar.spec.js`

```javascript
test('Sidebar opens when View Details clicked', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .btn-view-details');

    // Click View Details on first agent
    await page.locator('#agents-card .btn-view-details').first().click();

    // Verify sidebar is visible
    await expect(page.locator('.detail-sidebar')).toBeVisible();
});

test('Sidebar displays item name in header', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .btn-view-details');

    // Get agent name
    const agentName = await page.locator('#agents-card .item-name').first().textContent();

    // Click View Details
    await page.locator('#agents-card .btn-view-details').first().click();

    // Verify sidebar shows agent name
    const sidebarTitle = await page.locator('.sidebar-title h3').textContent();
    expect(sidebarTitle).toBe(agentName);
});

test('Close button closes sidebar', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .btn-view-details');

    // Open sidebar
    await page.locator('#agents-card .btn-view-details').first().click();
    await expect(page.locator('.detail-sidebar')).toBeVisible();

    // Close sidebar
    await page.locator('.btn-close-sidebar').click();

    // Verify sidebar is hidden
    await expect(page.locator('.detail-sidebar')).not.toBeVisible();
});

test('Clicking overlay closes sidebar', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .btn-view-details');

    // Open sidebar
    await page.locator('#agents-card .btn-view-details').first().click();
    await expect(page.locator('.detail-sidebar')).toBeVisible();

    // Click overlay
    await page.locator('.sidebar-overlay').click({ position: { x: 10, y: 10 } });

    // Verify sidebar is hidden
    await expect(page.locator('.detail-sidebar')).not.toBeVisible();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add sidebar component and methods

## Success Indicators

1. Sidebar component renders correctly
2. Opens when "View Details" clicked
3. Closes when close button or overlay clicked
4. Displays item name and type
5. Smooth animation on open/close
6. No console errors

## Related Tickets

**Depends On:**
- TASK-3.2.2-3.2.5: Config cards with "View Details" buttons

**Blocks:**
- TASK-3.3.2: Implement sidebar open/close functionality (enhanced)
- TASK-3.3.5: Add syntax highlighting
- TASK-3.3.6: Add copy-to-clipboard

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Accessibility Requirements
- **Focus Trap:** Keep focus within sidebar when open
- **Escape Key:** Close sidebar on Escape key press
- **ARIA:** Add `role="dialog"` and `aria-modal="true"` to sidebar
- **Screen Reader:** Announce sidebar opening

**Wireframe Reference:** `docs/wireframes/04-detail-interactions.md`
**Color Palette:** Use CSS variables from `css/variables.css`
