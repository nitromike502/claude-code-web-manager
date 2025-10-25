# TASK-3.3.3: Add Body Scroll Lock When Sidebar Open

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Prevent main page from scrolling when sidebar is open. This improves UX by ensuring users don't accidentally scroll the background content while viewing sidebar details.

## Prerequisites

- ✅ TASK-3.3.1: Sidebar structure created

## Acceptance Criteria

1. **Scroll Lock**
   - [ ] Main page doesn't scroll when sidebar open
   - [ ] Sidebar content is still scrollable
   - [ ] Scroll restored when sidebar closes

2. **No Layout Shift**
   - [ ] Page doesn't jump when scroll locked
   - [ ] Scrollbar space preserved

## Implementation Notes

### Scroll Lock Methods

```javascript
methods: {
    openSidebar() {
        this.sidebarVisible = true;
        this.lockBodyScroll();
    },

    closeSidebar() {
        this.sidebarVisible = false;
        this.unlockBodyScroll();
    },

    lockBodyScroll() {
        // Save current scroll position
        this.scrollY = window.scrollY;

        // Lock scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
    },

    unlockBodyScroll() {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, this.scrollY);
    }
}
```

## Testing Checklist

### Manual Testing
- [ ] Can't scroll main page when sidebar open
- [ ] Can scroll sidebar content
- [ ] Scroll restored when sidebar closes
- [ ] No layout shift when opening sidebar

### Playwright Tests

```javascript
test('Body scroll locked when sidebar open', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();

    // Scroll main page
    await page.evaluate(() => window.scrollTo(0, 500));

    // Open sidebar
    await page.locator('#agents-card .btn-view-details').first().click();

    // Verify body has fixed position
    const bodyStyle = await page.evaluate(() =>
        getComputedStyle(document.body).position
    );
    expect(bodyStyle).toBe('fixed');
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add scroll lock logic

## Success Indicators

1. Body scroll locked when sidebar open
2. Sidebar scrollable
3. No layout shift

## Related Tickets

**Depends On:**
- TASK-3.3.1: Sidebar structure

**Epic:**
- EPIC-3: Frontend Development
