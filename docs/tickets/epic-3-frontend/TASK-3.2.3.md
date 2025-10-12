# TASK-3.2.3: Build Commands Card Component with API Integration

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.2 - Configuration Cards Layout
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement the Commands card component with full API integration to fetch and display project-level slash commands. Display each command as a list item with command name, description, and "View Details" button. Support nested directory namespacing display.

## Prerequisites

- ✅ TASK-3.2.1: Card grid layout structure created
- ✅ TASK-3.2.2: Agents card implemented (use as reference)
- ✅ Backend API `/api/projects/:projectId/commands` functional

## Acceptance Criteria

1. **API Integration**
   - [ ] Fetches commands from `/api/projects/:projectId/commands`
   - [ ] Handles loading state with skeleton/spinner
   - [ ] Handles API errors gracefully
   - [ ] Displays warnings from backend if present

2. **Data Display**
   - [ ] Shows list of commands with name (e.g., `/test`) and description
   - [ ] Displays namespace if command is in subdirectory
   - [ ] Truncates long descriptions with ellipsis
   - [ ] Shows count badge with number of commands
   - [ ] Empty state when no commands exist

3. **Interactions**
   - [ ] "View Details" button on each command
   - [ ] Hover effect on command rows
   - [ ] Click command row to view details (opens sidebar)

## Implementation Notes

### API Integration

```javascript
methods: {
    async loadCommands() {
        this.loading.commands = true;
        try {
            const projectId = this.project.id;
            const response = await fetch(`/api/projects/${projectId}/commands`);
            const data = await response.json();

            if (data.success) {
                this.commands = data.commands || [];

                // Display warnings if present
                if (data.warnings && data.warnings.length > 0) {
                    this.warnings = [...this.warnings, ...data.warnings];
                }
            } else {
                console.error('Failed to load commands:', data.error);
            }
        } catch (err) {
            console.error('Error loading commands:', err);
        } finally {
            this.loading.commands = false;
        }
    },

    viewCommandDetails(command) {
        // Will be implemented in TASK-3.3.1 (sidebar)
        console.log('View command:', command);
    }
}
```

### HTML Structure

```html
<!-- Commands Card Body -->
<div class="card-body">
    <!-- Loading State -->
    <div v-if="loading.commands" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading commands...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="commands.length === 0" class="empty-state">
        <i class="fas fa-terminal"></i>
        <p>No commands configured</p>
    </div>

    <!-- Command List -->
    <div v-else class="config-list">
        <div
            v-for="command in commands"
            :key="command.name"
            class="config-item"
            @click="viewCommandDetails(command)"
        >
            <div class="item-content">
                <div class="item-name">
                    <span class="command-name">{{ command.name }}</span>
                    <span v-if="command.namespace" class="command-namespace">
                        {{ command.namespace }}
                    </span>
                </div>
                <div class="item-description">{{ command.description }}</div>
            </div>
            <button class="btn-view-details" @click.stop="viewCommandDetails(command)">
                View Details
            </button>
        </div>
    </div>
</div>
```

### CSS Styling

```css
.command-name {
    font-family: 'Courier New', monospace;
    color: var(--color-commands);
    font-weight: 600;
}

.command-namespace {
    font-size: 0.75rem;
    color: var(--text-muted);
    background-color: var(--bg-tertiary);
    padding: 0.125rem 0.5rem;
    border-radius: 3px;
    margin-left: 0.5rem;
}
```

### **Warning Display Handling** ⚠️

Same pattern as TASK-3.2.2 - warnings collected and displayed in banner above cards.

## Testing Checklist

### Manual Testing
- [ ] Commands load and display correctly
- [ ] Loading spinner shows while fetching
- [ ] Empty state displays when no commands
- [ ] Command names display with `/` prefix
- [ ] Namespace badges show for nested commands
- [ ] "View Details" button visible on each command
- [ ] Hover effect works on command rows
- [ ] Count badge updates with command count
- [ ] Warnings display if backend returns them
- [ ] Responsive on mobile/tablet/desktop

### Playwright Tests

**Test File:** `tests/frontend/commands-card.spec.js`

```javascript
test('Commands card displays commands from API', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#commands-card');

    // Wait for commands to load
    await page.waitForSelector('#commands-card .config-item', { timeout: 5000 });

    // Verify at least one command is displayed
    const commandCount = await page.locator('#commands-card .config-item').count();
    expect(commandCount).toBeGreaterThan(0);
});

test('Command item shows name and description', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#commands-card .config-item');

    // Verify first command has name and description
    const firstCommand = page.locator('#commands-card .config-item').first();
    await expect(firstCommand.locator('.command-name')).toBeVisible();
    await expect(firstCommand.locator('.item-description')).toBeVisible();
});
```

## Files to Create

None

## Files to Modify

- `src/frontend/project-detail.html` - Add commands card implementation

## Success Indicators

1. Commands fetch successfully from API
2. Command list displays with names and descriptions
3. Namespace badges show for nested commands
4. Loading and empty states work correctly
5. "View Details" buttons render
6. No console errors

## Related Tickets

**Depends On:**
- TASK-3.2.1: Card grid layout structure created
- TASK-3.2.2: Agents card (reference implementation)

**Blocks:**
- TASK-3.3.1: Create detail sidebar component

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
**Accessibility:** Same requirements as TASK-3.2.2
