# TASK-3.2.5: Build MCP Servers Card Component with API Integration

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.2 - Configuration Cards Layout
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement the MCP Servers card component with full API integration to fetch and display project-level MCP servers. Display each server with its name, transport type, command, and "View Details" button.

## Prerequisites

- ✅ TASK-3.2.1: Card grid layout structure created
- ✅ TASK-3.2.2: Agents card implemented (use as reference)
- ✅ Backend API `/api/projects/:projectId/mcp` functional

## Acceptance Criteria

1. **API Integration**
   - [ ] Fetches MCP servers from `/api/projects/:projectId/mcp`
   - [ ] Handles loading state
   - [ ] Handles API errors
   - [ ] Displays warnings from backend

2. **Data Display**
   - [ ] Shows server name
   - [ ] Displays transport type (stdio/HTTP/SSE)
   - [ ] Shows command preview (truncated)
   - [ ] Shows count badge with number of servers
   - [ ] Empty state when no servers exist

3. **Interactions**
   - [ ] "View Details" button on each server
   - [ ] Hover effect on server rows
   - [ ] Click server row to view details

## Implementation Notes

### API Integration

```javascript
methods: {
    async loadMcpServers() {
        this.loading.mcp = true;
        try {
            const projectId = this.project.id;
            const response = await fetch(`/api/projects/${projectId}/mcp`);
            const data = await response.json();

            if (data.success) {
                this.mcpServers = data.mcpServers || [];

                if (data.warnings && data.warnings.length > 0) {
                    this.warnings = [...this.warnings, ...data.warnings];
                }
            } else {
                console.error('Failed to load MCP servers:', data.error);
            }
        } catch (err) {
            console.error('Error loading MCP servers:', err);
        } finally {
            this.loading.mcp = false;
        }
    },

    viewMcpDetails(server) {
        console.log('View MCP server:', server);
    }
}
```

### HTML Structure

```html
<!-- MCP Servers Card Body -->
<div class="card-body">
    <div v-if="loading.mcp" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading MCP servers...</p>
    </div>

    <div v-else-if="mcpServers.length === 0" class="empty-state">
        <i class="fas fa-server"></i>
        <p>No MCP servers configured</p>
    </div>

    <div v-else class="config-list">
        <div
            v-for="server in mcpServers"
            :key="server.name"
            class="config-item"
            @click="viewMcpDetails(server)"
        >
            <div class="item-content">
                <div class="item-name">{{ server.name }}</div>
                <div class="item-description mcp-details">
                    <span class="mcp-transport">Transport: {{ server.transport }}</span>
                    <span class="hook-separator">•</span>
                    <span class="mcp-command">Command: {{ server.command }}</span>
                </div>
            </div>
            <button class="btn-view-details" @click.stop="viewMcpDetails(server)">
                View Details
            </button>
        </div>
    </div>
</div>
```

### CSS Styling

```css
.mcp-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.mcp-transport {
    color: var(--color-mcp);
    font-weight: 500;
    font-size: 0.8125rem;
}

.mcp-command {
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
}
```

## Testing Checklist

### Manual Testing
- [ ] MCP servers load and display correctly
- [ ] Server names, transport, and commands visible
- [ ] "View Details" button on each server
- [ ] Empty state when no servers
- [ ] Count badge updates

### Playwright Tests

**Test File:** `tests/frontend/mcp-card.spec.js`

```javascript
test('MCP card displays servers from API', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#mcp-card');

    await page.waitForSelector('#mcp-card .config-item', { timeout: 5000 });
    const mcpCount = await page.locator('#mcp-card .config-item').count();
    expect(mcpCount).toBeGreaterThan(0);
});

test('MCP item shows transport and command', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#mcp-card .config-item');

    const firstMcp = page.locator('#mcp-card .config-item').first();
    await expect(firstMcp.locator('.mcp-transport')).toBeVisible();
    await expect(firstMcp.locator('.mcp-command')).toBeVisible();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add MCP servers card implementation

## Success Indicators

1. MCP servers fetch successfully from API
2. Server list displays names, transport, and commands
3. Loading and empty states work
4. No console errors

## Related Tickets

**Depends On:**
- TASK-3.2.1: Card grid layout

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Accessibility:** Same requirements as TASK-3.2.2
