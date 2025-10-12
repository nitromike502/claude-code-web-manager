# TASK-3.4.2: Implement Navigation to User View

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.4 - User/Global Configuration View
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Add "User" button to header on dashboard and project detail pages that navigates to the user/global configuration view. The button should be visually distinct and accessible from all pages.

## Prerequisites

- ✅ TASK-3.4.1: User view page created
- ✅ Dashboard and project detail pages exist

## Acceptance Criteria

1. **User Button**
   - [ ] User button in header on all pages
   - [ ] Icon + "User" text
   - [ ] Navigates to user-view.html
   - [ ] Highlighted when on user view page

2. **Visual Design**
   - [ ] Consistent styling with header theme toggle
   - [ ] Hover state
   - [ ] Active state on user view page

## Implementation Notes

### Add User Button to Headers

```html
<!-- In both index.html and project-detail.html headers -->
<header class="app-header">
    <div class="app-title">
        <i class="fas fa-code"></i>
        <span>Claude Code Manager</span>
    </div>
    <div class="header-search">
        <input type="text" class="search-input" placeholder="Search..." v-model="searchQuery" />
    </div>
    <div class="header-actions">
        <button class="btn-user" @click="goToUserView" title="User configurations">
            <i class="fas fa-user"></i>
            <span>User</span>
        </button>
        <button class="theme-toggle" @click="toggleTheme">
            <i :class="currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
    </div>
</header>
```

### Vue Method

```javascript
methods: {
    goToUserView() {
        window.location.href = '/user-view.html';
    }
}
```

### CSS Styling

```css
.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.btn-user {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    padding: 0.625rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
}

.btn-user:hover {
    background-color: var(--bg-hover);
    border-color: var(--color-mcp);
    color: var(--color-mcp);
}

.btn-user.active {
    background-color: var(--color-mcp);
    border-color: var(--color-mcp);
    color: white;
}

@media (max-width: 767px) {
    .btn-user span {
        display: none;
    }
}
```

## Testing Checklist

### Manual Testing
- [ ] User button visible on dashboard
- [ ] User button visible on project detail page
- [ ] Clicking User button navigates to user view
- [ ] Button highlighted on user view page
- [ ] Hover effect works
- [ ] Responsive on mobile (icon only)

### Playwright Tests

```javascript
test('User button navigates to user view', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.btn-user');

    // Click User button
    await page.locator('.btn-user').click();

    // Verify navigation
    await expect(page).toHaveURL('http://localhost:8420/user-view.html');
});

test('User button highlighted on user view', async ({ page }) => {
    await page.goto('http://localhost:8420/user-view.html');
    await page.waitForSelector('.btn-user');

    // Verify active state
    const hasActiveClass = await page.locator('.btn-user').evaluate(el =>
        el.classList.contains('active')
    );
    expect(hasActiveClass).toBeTruthy();
});
```

## Files to Modify

- `src/frontend/index.html` - Add User button to dashboard header
- `src/frontend/project-detail.html` - Add User button to detail view header
- `src/frontend/user-view.html` - Add active state to User button

## Success Indicators

1. User button visible on all pages
2. Navigation to user view works
3. Active state visible on user view page
4. No console errors

## Related Tickets

**Depends On:**
- TASK-3.4.1: User view page created

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Accessibility:** Add `aria-label="User configurations"` to button
