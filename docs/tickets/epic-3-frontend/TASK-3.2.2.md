# TASK-3.2.2: Build Agents Card Component with API Integration

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.2 - Configuration Cards Layout
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement the Agents card component with full API integration to fetch and display project-level subagents. Display each agent as a list item with name, description, and "View Details" button. Handle loading states, errors, and empty states appropriately.

## Prerequisites

- ✅ TASK-3.2.1: Card grid layout structure created
- ✅ Backend API `/api/projects/:projectId/agents` functional
- ✅ Wireframes approved

## Acceptance Criteria

1. **API Integration**
   - [ ] Fetches agents from `/api/projects/:projectId/agents`
   - [ ] Handles loading state with skeleton/spinner
   - [ ] Handles API errors gracefully
   - [ ] Displays warnings from backend if present

2. **Data Display**
   - [ ] Shows list of agents with name and description
   - [ ] Truncates long descriptions with ellipsis
   - [ ] Shows count badge with number of agents
   - [ ] Empty state when no agents exist

3. **Interactions**
   - [ ] "View Details" button on each agent
   - [ ] Hover effect on agent rows
   - [ ] "Expand All" button (functionality in later task)
   - [ ] Click agent row to view details (opens sidebar)

4. **Visual Design**
   - [ ] Consistent with wireframe design
   - [ ] Uses green icon color for agents
   - [ ] Responsive layout

## Implementation Notes

### API Integration

```javascript
data() {
    return {
        agents: [],
        loading: { agents: false },
        warnings: []
    };
},
methods: {
    async loadAgents() {
        this.loading.agents = true;
        try {
            const projectId = this.project.id;
            const response = await fetch(`/api/projects/${projectId}/agents`);
            const data = await response.json();

            if (data.success) {
                this.agents = data.agents || [];

                // Display warnings if present
                if (data.warnings && data.warnings.length > 0) {
                    this.warnings = [...this.warnings, ...data.warnings];
                }
            } else {
                console.error('Failed to load agents:', data.error);
            }
        } catch (err) {
            console.error('Error loading agents:', err);
        } finally {
            this.loading.agents = false;
        }
    }
}
```

### HTML Structure

```html
<!-- Agents Card Body -->
<div class="card-body">
    <!-- Loading State -->
    <div v-if="loading.agents" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading agents...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="agents.length === 0" class="empty-state">
        <i class="fas fa-robot"></i>
        <p>No agents configured</p>
    </div>

    <!-- Agent List -->
    <div v-else class="config-list">
        <div
            v-for="agent in agents"
            :key="agent.name"
            class="config-item"
            @click="viewAgentDetails(agent)"
        >
            <div class="item-content">
                <div class="item-name">{{ agent.name }}</div>
                <div class="item-description">{{ agent.description }}</div>
            </div>
            <button class="btn-view-details" @click.stop="viewAgentDetails(agent)">
                View Details
            </button>
        </div>
    </div>
</div>
```

### CSS Styling

```css
.config-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.config-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-secondary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.config-item:hover {
    background-color: var(--bg-hover);
    border-color: var(--border-primary);
}

.item-content {
    flex: 1;
    min-width: 0;
}

.item-name {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.item-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn-view-details {
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.btn-view-details:hover {
    background-color: var(--color-primary);
    color: white;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-muted);
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.loading-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
}

.loading-state i {
    font-size: 2rem;
    margin-bottom: 1rem;
}
```

### **Warning Display Handling** ⚠️

```html
<!-- Warning Banner (add above cards if warnings exist) -->
<div v-if="warnings.length > 0" class="warning-banner">
    <i class="fas fa-exclamation-triangle"></i>
    <div class="warning-content">
        <strong>Configuration Warnings:</strong>
        <ul>
            <li v-for="(warning, index) in warnings" :key="index">
                {{ warning }}
            </li>
        </ul>
    </div>
    <button class="btn-close-warning" @click="warnings = []">
        <i class="fas fa-times"></i>
    </button>
</div>
```

```css
.warning-banner {
    background-color: var(--color-warning-bg);
    border: 1px solid var(--color-warning);
    border-radius: 6px;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.warning-banner i.fa-exclamation-triangle {
    color: var(--color-warning);
    font-size: 1.25rem;
}

.warning-content {
    flex: 1;
}

.warning-content strong {
    color: var(--text-emphasis);
}

.warning-content ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
    color: var(--text-secondary);
}
```

## Testing Checklist

### Manual Testing
- [ ] Agents load and display correctly
- [ ] Loading spinner shows while fetching
- [ ] Empty state displays when no agents
- [ ] Agent names and descriptions display
- [ ] "View Details" button visible on each agent
- [ ] Hover effect works on agent rows
- [ ] Count badge updates with agent count
- [ ] Warnings display if backend returns them
- [ ] Responsive on mobile/tablet/desktop
- [ ] Theme toggle maintains visibility

### Playwright Tests

**Test File:** `tests/frontend/agents-card.spec.js`

```javascript
test('Agents card displays agents from API', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card');

    // Wait for agents to load
    await page.waitForSelector('#agents-card .config-item', { timeout: 5000 });

    // Verify at least one agent is displayed
    const agentCount = await page.locator('#agents-card .config-item').count();
    expect(agentCount).toBeGreaterThan(0);
});

test('Agent item shows name and description', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .config-item');

    // Verify first agent has name and description
    const firstAgent = page.locator('#agents-card .config-item').first();
    await expect(firstAgent.locator('.item-name')).toBeVisible();
    await expect(firstAgent.locator('.item-description')).toBeVisible();
});

test('View Details button is present', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#agents-card .config-item');

    // Verify View Details button exists
    const viewDetailsBtn = page.locator('#agents-card .btn-view-details').first();
    await expect(viewDetailsBtn).toBeVisible();
    await expect(viewDetailsBtn).toHaveText('View Details');
});

test('Empty state displays when no agents', async ({ page }) => {
    // This test requires a project with no agents
    // Mock or use test project
    await page.goto('http://localhost:8420/project-detail.html?id=testproject');
    await page.waitForSelector('#agents-card');

    // Verify empty state (if no agents)
    const emptyState = page.locator('#agents-card .empty-state');
    if (await emptyState.isVisible()) {
        await expect(emptyState).toContainText('No agents configured');
    }
});
```

## Files to Create

None

## Files to Modify

- `src/frontend/project-detail.html` - Add agents card implementation

## Success Indicators

1. Agents fetch successfully from API
2. Agent list displays with names and descriptions
3. Loading and empty states work correctly
4. "View Details" buttons render
5. Warning banner displays if backend returns warnings
6. No console errors

## Related Tickets

**Depends On:**
- TASK-3.2.1: Card grid layout structure created

**Blocks:**
- TASK-3.3.1: Create detail sidebar component structure (sidebar will show agent details)

**Related:**
- TASK-3.2.3: Build Commands card (similar implementation)
- TASK-3.2.4: Build Hooks card (similar implementation)
- TASK-3.2.5: Build MCP card (similar implementation)

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Accessibility Requirements
- **ARIA Labels:** Add `aria-label="Agent list"` to config-list
- **Keyboard Navigation:** Agent rows keyboard accessible (Tab + Enter)
- **Screen Reader:** Announce agent count
- **Focus Management:** Maintain focus after sidebar opens

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
