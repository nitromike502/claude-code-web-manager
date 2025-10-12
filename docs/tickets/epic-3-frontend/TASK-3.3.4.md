# TASK-3.3.4: Implement Sidebar Content Scrolling

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement smooth scrolling within sidebar content area. Ensure long content (agents, commands) can be scrolled without affecting main page. Add scroll-to-top when switching between items.

## Prerequisites

- ✅ TASK-3.3.1: Sidebar structure created
- ✅ TASK-3.3.3: Body scroll lock implemented

## Acceptance Criteria

1. **Scrolling**
   - [ ] Sidebar content area scrollable
   - [ ] Smooth scroll behavior
   - [ ] Scroll-to-top when opening new item
   - [ ] Custom scrollbar styling (dark mode)

2. **Performance**
   - [ ] No lag with long content
   - [ ] Smooth scrolling animation

## Implementation Notes

### Scroll Reset

```javascript
methods: {
    viewAgentDetails(agent) {
        this.currentItem = { /* ... */ };
        this.openSidebar();

        // Scroll to top after content loads
        this.$nextTick(() => {
            const content = document.querySelector('.sidebar-content');
            if (content) content.scrollTop = 0;
        });
    }
}
```

### CSS Scrollbar Styling

```css
.sidebar-content {
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 1.5rem;
}

/* Custom scrollbar for dark mode */
.sidebar-content::-webkit-scrollbar {
    width: 8px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: var(--bg-hover);
    border-radius: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: var(--border-primary);
}
```

## Testing Checklist

### Manual Testing
- [ ] Sidebar content scrollable
- [ ] Scrolls to top when switching items
- [ ] Smooth scrolling
- [ ] Custom scrollbar visible

### Playwright Tests

```javascript
test('Sidebar content scrolls', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.locator('#agents-card .btn-view-details').first().click();

    // Verify content is scrollable
    const isScrollable = await page.evaluate(() => {
        const content = document.querySelector('.sidebar-content');
        return content.scrollHeight > content.clientHeight;
    });
    expect(isScrollable).toBeTruthy();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add scroll reset and styling

## Success Indicators

1. Sidebar content scrolls smoothly
2. Scrolls to top when item changes
3. Custom scrollbar visible

## Related Tickets

**Depends On:**
- TASK-3.3.1: Sidebar structure

**Epic:**
- EPIC-3: Frontend Development
