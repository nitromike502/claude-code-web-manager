# TASK-3.1.2: Add Routing from Dashboard to Detail View

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.1 - Project Detail View Structure
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement navigation from the dashboard project cards to the project detail view. When a user clicks on a project card, they should be taken to the detail page with the project ID passed in the URL. Update the dashboard's `selectProject` method to navigate to the detail view.

## Prerequisites

- ✅ TASK-3.1.1: Project detail page component structure created
- ✅ Dashboard view exists with project cards (`src/frontend/index.html`)
- ✅ Backend API endpoints functional

## Acceptance Criteria

1. **Navigation Functionality**
   - [ ] Clicking a project card navigates to `project-detail.html?id=[projectId]`
   - [ ] Project ID is passed correctly in URL query parameter
   - [ ] Browser back button returns to dashboard
   - [ ] Browser forward button returns to detail view

2. **URL Structure**
   - [ ] Format: `/project-detail.html?id=[projectId]`
   - [ ] Project ID format: Path with slashes removed (e.g., `/home/user/project` → `homeuserproject`)
   - [ ] Handles special characters in paths correctly

3. **User Experience**
   - [ ] Navigation feels instant (no delay)
   - [ ] No page flicker or layout shift
   - [ ] Previous dashboard scroll position preserved on back navigation
   - [ ] Selected project remembered on back navigation

## Implementation Notes

### Dashboard Navigation Update

```javascript
// In src/frontend/index.html, update selectProject method
methods: {
    selectProject(project) {
        // Navigate to project detail page with project ID
        window.location.href = `/project-detail.html?id=${encodeURIComponent(project.id)}`;
    }
}
```

### URL Encoding

```javascript
// Ensure project IDs with special characters are properly encoded
const encodedId = encodeURIComponent(project.id);
```

### Preserving Dashboard State

```javascript
// Optional: Save scroll position and filters before navigating
methods: {
    selectProject(project) {
        // Save state to sessionStorage
        sessionStorage.setItem('dashboardScrollY', window.scrollY.toString());
        sessionStorage.setItem('dashboardSearch', this.searchQuery);

        // Navigate
        window.location.href = `/project-detail.html?id=${encodeURIComponent(project.id)}`;
    }
}
```

### Alternative: History API

```javascript
// For better UX without page reload (future enhancement)
selectProject(project) {
    history.pushState({ projectId: project.id }, '', `/project-detail.html?id=${project.id}`);
    // Then load project detail component
}
```

## Testing Checklist

### Manual Testing
- [ ] Click project card - navigates to detail view
- [ ] URL contains correct project ID
- [ ] Browser back button returns to dashboard
- [ ] Browser forward button returns to detail view
- [ ] Project with spaces in path navigates correctly
- [ ] Project with special characters navigates correctly
- [ ] Navigation works on all projects in list
- [ ] Theme preference persists after navigation

### Playwright Tests

**Test File:** `tests/frontend/navigation.spec.js`

```javascript
test('Navigate from dashboard to project detail', async ({ page }) => {
    // Go to dashboard
    await page.goto('http://localhost:8420');

    // Wait for projects to load
    await page.waitForSelector('.project-card');

    // Click first project card
    const firstCard = page.locator('.project-card').first();
    await firstCard.click();

    // Verify navigation to detail page
    await expect(page).toHaveURL(/project-detail\.html\?id=.+/);

    // Verify page loaded
    await page.waitForSelector('.breadcrumbs');
});

test('Project ID passed correctly in URL', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Get project ID from card
    const projectId = await page.locator('.project-card').first().getAttribute('data-project-id');

    // Click card
    await page.locator('.project-card').first().click();

    // Verify URL contains project ID
    const url = page.url();
    expect(url).toContain(`id=${projectId}`);
});

test('Back button returns to dashboard', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Navigate to detail
    await page.locator('.project-card').first().click();
    await page.waitForURL(/project-detail\.html/);

    // Go back
    await page.goBack();

    // Verify returned to dashboard
    await expect(page).toHaveURL('http://localhost:8420/');
    await page.waitForSelector('.project-card');
});
```

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Files to Create

None (pure modification)

## Files to Modify

- `src/frontend/index.html` - Update `selectProject()` method in Vue app

## Success Indicators

1. Clicking any project card navigates to detail view
2. URL contains correctly formatted project ID
3. Back button returns to dashboard
4. Navigation feels smooth and instant
5. No console errors during navigation
6. Theme preference maintained across navigation

## Related Tickets

**Depends On:**
- TASK-3.1.1: Create project detail page component structure

**Blocks:**
- TASK-3.1.3: Implement breadcrumb navigation with back button
- TASK-3.2.1: Create card grid layout for 4 config types

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Future Enhancements (Out of Scope for Phase 1)
- Use Vue Router for SPA-style navigation without page reloads
- Add loading transition between pages
- Preload detail page data on card hover
- Deep linking with shareable URLs

### Accessibility
- Navigation should be keyboard accessible (Tab + Enter)
- Screen reader should announce navigation intent
- Focus should move to detail page after navigation

**Wireframe Reference:** `docs/wireframes/02-project-detail-view.md`
**Color Palette:** Use CSS variables from `css/variables.css`
