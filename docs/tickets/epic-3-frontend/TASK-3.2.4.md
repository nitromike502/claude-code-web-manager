# TASK-3.2.4: Build Hooks Card Component with API Integration

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.2 - Configuration Cards Layout
**Estimated Time:** 45 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement the Hooks card component with full API integration to fetch and display project-level hooks. Display each hook with its event type, pattern, command, and "View Details" button.

## Prerequisites

- ✅ TASK-3.2.1: Card grid layout structure created
- ✅ TASK-3.2.2: Agents card implemented (use as reference)
- ✅ Backend API `/api/projects/:projectId/hooks` functional

## Acceptance Criteria

1. **API Integration**
   - [ ] Fetches hooks from `/api/projects/:projectId/hooks`
   - [ ] Handles loading state
   - [ ] Handles API errors
   - [ ] Displays warnings from backend

2. **Data Display**
   - [ ] Shows hook name (if provided) or event type
   - [ ] Displays event type and pattern on same line
   - [ ] Shows count badge with number of hooks
   - [ ] Empty state when no hooks exist

3. **Interactions**
   - [ ] "View Details" button on each hook
   - [ ] Hover effect on hook rows
   - [ ] Click hook row to view details

## Implementation Notes

### API Integration

```javascript
methods: {
    async loadHooks() {
        this.loading.hooks = true;
        try {
            const projectId = this.project.id;
            const response = await fetch(`/api/projects/${projectId}/hooks`);
            const data = await response.json();

            if (data.success) {
                this.hooks = data.hooks || [];

                if (data.warnings && data.warnings.length > 0) {
                    this.warnings = [...this.warnings, ...data.warnings];
                }
            } else {
                console.error('Failed to load hooks:', data.error);
            }
        } catch (err) {
            console.error('Error loading hooks:', err);
        } finally {
            this.loading.hooks = false;
        }
    },

    viewHookDetails(hook) {
        console.log('View hook:', hook);
    }
}
```

### HTML Structure

```html
<!-- Hooks Card Body -->
<div class="card-body">
    <div v-if="loading.hooks" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading hooks...</p>
    </div>

    <div v-else-if="hooks.length === 0" class="empty-state">
        <i class="fas fa-plug"></i>
        <p>No hooks configured</p>
    </div>

    <div v-else class="config-list">
        <div
            v-for="(hook, index) in hooks"
            :key="index"
            class="config-item"
            @click="viewHookDetails(hook)"
        >
            <div class="item-content">
                <div class="item-name">{{ hook.name || hook.event }}</div>
                <div class="item-description hook-details">
                    <span class="hook-event">Event: {{ hook.event }}</span>
                    <span class="hook-separator">•</span>
                    <span class="hook-pattern">Pattern: {{ hook.pattern }}</span>
                </div>
            </div>
            <button class="btn-view-details" @click.stop="viewHookDetails(hook)">
                View Details
            </button>
        </div>
    </div>
</div>
```

### CSS Styling

```css
.hook-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.hook-event, .hook-pattern {
    font-size: 0.8125rem;
}

.hook-event {
    color: var(--color-hooks);
}

.hook-pattern {
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
}

.hook-separator {
    color: var(--text-muted);
}
```

## Testing Checklist

### Manual Testing
- [ ] Hooks load and display correctly
- [ ] Hook events and patterns visible
- [ ] "View Details" button on each hook
- [ ] Empty state when no hooks
- [ ] Count badge updates

### Playwright Tests

**Test File:** `tests/frontend/hooks-card.spec.js`

```javascript
test('Hooks card displays hooks from API', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#hooks-card');

    await page.waitForSelector('#hooks-card .config-item', { timeout: 5000 });
    const hookCount = await page.locator('#hooks-card .config-item').count();
    expect(hookCount).toBeGreaterThan(0);
});

test('Hook item shows event and pattern', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('#hooks-card .config-item');

    const firstHook = page.locator('#hooks-card .config-item').first();
    await expect(firstHook.locator('.hook-event')).toBeVisible();
    await expect(firstHook.locator('.hook-pattern')).toBeVisible();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add hooks card implementation

## Success Indicators

1. Hooks fetch successfully from API
2. Hook list displays event types and patterns
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
