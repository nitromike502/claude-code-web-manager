# TASK-3.1.3: Implement Breadcrumb Navigation with Back Button

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.1 - Project Detail View Structure
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement interactive breadcrumb navigation on the project detail page that shows the current location (Dashboard > Project Name) and allows users to navigate back to the dashboard. The breadcrumb should be visually consistent with the dashboard and update based on the current project.

## Prerequisites

- ✅ TASK-3.1.1: Project detail page component structure created
- ✅ TASK-3.1.2: Routing from dashboard to detail view implemented
- ✅ Backend API `/api/projects` functional

## Acceptance Criteria

1. **Breadcrumb Display**
   - [ ] Shows "Dashboard > [Project Name]" format
   - [ ] Dashboard is clickable and navigates back
   - [ ] Project Name is not clickable (current page)
   - [ ] Project Name updates based on current project
   - [ ] Visual separator between breadcrumb items

2. **Navigation Functionality**
   - [ ] Clicking "Dashboard" returns to main page
   - [ ] Back button icon/link returns to dashboard
   - [ ] Keyboard accessible (Tab + Enter)
   - [ ] Hover states on clickable items

3. **Visual Design**
   - [ ] Matches dashboard breadcrumb styling
   - [ ] Uses Font Awesome icons
   - [ ] Responsive on mobile/tablet/desktop
   - [ ] Proper spacing and alignment

## Implementation Notes

### Breadcrumb HTML Structure

```html
<!-- In src/frontend/project-detail.html -->
<div class="breadcrumbs">
    <button class="breadcrumb-item clickable" @click="goToDashboard" title="Return to dashboard">
        <i class="fas fa-home"></i>
        Dashboard
    </button>
    <span class="breadcrumb-separator">/</span>
    <span class="breadcrumb-item active">
        <i class="fas fa-folder"></i>
        {{ project.name }}
    </span>
</div>
```

### Vue Methods

```javascript
methods: {
    goToDashboard() {
        window.location.href = '/';
    },

    async loadProject() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) {
            this.error = 'No project ID provided';
            return;
        }

        // Fetch project info to get name
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();

            if (data.success) {
                const currentProject = data.projects.find(p => p.id === projectId);
                if (currentProject) {
                    this.project = currentProject;
                } else {
                    this.error = 'Project not found';
                }
            }
        } catch (err) {
            this.error = 'Failed to load project';
        }
    }
}
```

### CSS Styling

```css
/* Breadcrumb styles */
.breadcrumbs {
    padding: 1rem 2rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: default;
    font-family: inherit;
    font-size: inherit;
}

.breadcrumb-item.clickable {
    cursor: pointer;
}

.breadcrumb-item.clickable:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
}

.breadcrumb-item.active {
    color: var(--text-emphasis);
    font-weight: 500;
}

.breadcrumb-separator {
    color: var(--text-muted);
    user-select: none;
}
```

### **Warning Display Handling** ⚠️

If the backend returns warnings (e.g., project path doesn't exist):

```javascript
async loadProject() {
    try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        // Display warnings if present
        if (data.warnings && data.warnings.length > 0) {
            this.warnings = data.warnings;
            // Show warning banner (to be implemented in card components)
        }

        // ... rest of logic
    } catch (err) {
        this.error = 'Failed to load project';
    }
}
```

## Testing Checklist

### Manual Testing
- [ ] Breadcrumb displays correctly on page load
- [ ] Project name shows actual project name (not ID)
- [ ] Dashboard link is clickable
- [ ] Project name is not clickable
- [ ] Clicking Dashboard returns to main page
- [ ] Hover effect works on Dashboard link
- [ ] Keyboard navigation (Tab to Dashboard, Enter to navigate)
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Theme toggle maintains breadcrumb visibility
- [ ] Long project names truncate appropriately

### Playwright Tests

**Test File:** `tests/frontend/breadcrumbs.spec.js`

```javascript
test('Breadcrumb displays project name', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Get project name from card
    const projectName = await page.locator('.project-card .project-name').first().textContent();

    // Navigate to detail
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.breadcrumbs');

    // Verify breadcrumb shows project name
    const breadcrumbText = await page.locator('.breadcrumb-item.active').textContent();
    expect(breadcrumbText).toContain(projectName);
});

test('Dashboard breadcrumb navigates back', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Navigate to detail
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.breadcrumbs');

    // Click Dashboard breadcrumb
    await page.locator('.breadcrumb-item.clickable').click();

    // Verify returned to dashboard
    await expect(page).toHaveURL('http://localhost:8420/');
});

test('Breadcrumb keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.waitForSelector('.breadcrumbs');

    // Tab to Dashboard breadcrumb and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify navigation
    await expect(page).toHaveURL('http://localhost:8420/');
});
```

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Files to Create

None (modify existing)

## Files to Modify

- `src/frontend/project-detail.html` - Add breadcrumb component and navigation logic

## Success Indicators

1. Breadcrumb displays "Dashboard > Project Name"
2. Dashboard link navigates back to main page
3. Project name is correctly displayed
4. Hover states work as expected
5. Keyboard accessible
6. No console errors

## Related Tickets

**Depends On:**
- TASK-3.1.1: Create project detail page component structure
- TASK-3.1.2: Add routing from dashboard to detail view

**Blocks:**
- TASK-3.2.1: Create card grid layout for 4 config types

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Accessibility Requirements
- **ARIA Label:** Add `aria-label="Breadcrumb navigation"` to breadcrumbs container
- **ARIA Current:** Add `aria-current="page"` to active breadcrumb item
- **Keyboard Navigation:** Ensure Tab can focus Dashboard link
- **Screen Reader:** Announce "Navigation: Dashboard, Project Name"

### Future Enhancements (Out of Scope)
- Multi-level breadcrumbs (Dashboard > Category > Project)
- Breadcrumb dropdown for project switching
- Breadcrumb history (last 5 visited projects)

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
