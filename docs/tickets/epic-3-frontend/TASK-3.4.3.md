# TASK-3.4.3: Display User-Level Configs in Cards

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.4 - User/Global Configuration View
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement the four configuration cards on the user view page with full API integration. Reuse the card components from project detail view but connect to user-level API endpoints. Ensure all functionality (loading states, empty states, warnings, sidebar) works identically to project view.

## Prerequisites

- ✅ TASK-3.4.1: User view page structure created
- ✅ TASK-3.2.2-3.2.5: Config card components implemented

## Acceptance Criteria

1. **Card Implementation**
   - [ ] All four cards functional (Agents, Commands, Hooks, MCP)
   - [ ] Fetch from user API endpoints
   - [ ] Display user-level configurations
   - [ ] Loading/empty states work

2. **Functionality**
   - [ ] "View Details" opens sidebar with user config
   - [ ] Copy and download work
   - [ ] Warnings display correctly
   - [ ] Count badges update

3. **Visual Consistency**
   - [ ] Same card styling as project view
   - [ ] Purple accent maintained

## Implementation Notes

### Complete Vue Methods (Abbreviated)

```javascript
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
        this.loading.commands = true;
        try {
            const response = await fetch('/api/user/commands');
            const data = await response.json();
            if (data.success) {
                this.commands = data.commands || [];
                if (data.warnings) this.warnings.push(...data.warnings);
            }
        } catch (err) {
            console.error('Error loading user commands:', err);
        } finally {
            this.loading.commands = false;
        }
    },

    async loadHooks() {
        this.loading.hooks = true;
        try {
            const response = await fetch('/api/user/hooks');
            const data = await response.json();
            if (data.success) {
                this.hooks = data.hooks || [];
                if (data.warnings) this.warnings.push(...data.warnings);
            }
        } catch (err) {
            console.error('Error loading user hooks:', err);
        } finally {
            this.loading.hooks = false;
        }
    },

    async loadMcpServers() {
        this.loading.mcp = true;
        try {
            const response = await fetch('/api/user/mcp');
            const data = await response.json();
            if (data.success) {
                this.mcpServers = data.mcpServers || [];
                if (data.warnings) this.warnings.push(...data.warnings);
            }
        } catch (err) {
            console.error('Error loading user MCP servers:', err);
        } finally {
            this.loading.mcp = false;
        }
    }

    // viewAgentDetails, viewCommandDetails, etc. - same as project-detail.html
}
```

### HTML Card Implementation

Copy the exact card structure from `project-detail.html` for all four cards. The only difference is the API endpoints being called (user endpoints instead of project endpoints).

## Testing Checklist

### Manual Testing
- [ ] All cards load user configurations
- [ ] User agents display correctly
- [ ] User commands display correctly
- [ ] User hooks display correctly
- [ ] User MCP servers display correctly
- [ ] Empty states show when no configs
- [ ] Loading spinners show during fetch
- [ ] Warnings display if backend returns them
- [ ] "View Details" opens sidebar
- [ ] Sidebar shows correct user config content

### Playwright Tests

**Test File:** `tests/frontend/user-view-cards.spec.js`

```javascript
test('User view loads all config cards', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('.config-card');

    // Verify all 4 cards present
    const cardCount = await page.locator('.config-card').count();
    expect(cardCount).toBe(4);
});

test('User agents card displays user-level agents', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('#agents-card');

    // Wait for agents to load (may be empty)
    await page.waitForTimeout(1000);

    // Verify card is visible
    await expect(page.locator('#agents-card')).toBeVisible();
});

test('User view sidebar shows user config details', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('#agents-card');

    // If agents exist, click View Details
    const hasAgents = await page.locator('#agents-card .config-item').count() > 0;
    if (hasAgents) {
        await page.locator('#agents-card .btn-view-details').first().click();
        await expect(page.locator('.detail-sidebar')).toBeVisible();
    }
});
```

## Files to Modify

- `src/frontend/user-view.html` - Complete card implementations and API integration

## Success Indicators

1. All four cards fetch from user endpoints
2. User configurations display correctly
3. Sidebar works with user configs
4. No console errors
5. Warning handling works

## Related Tickets

**Depends On:**
- TASK-3.4.1: User view page structure
- TASK-3.2.2-3.2.5: Config card components

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Reuse:** This task is primarily about connecting existing card components to different API endpoints. Most code can be copied from `project-detail.html`.

**Wireframe Reference:** `docs/wireframes/03-user-global-view.md`
