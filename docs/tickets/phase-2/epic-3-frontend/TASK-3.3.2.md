# TASK-3.3.2: Implement Sidebar Open/Close Functionality

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Enhance sidebar open/close functionality with keyboard support (Escape key), proper focus management, and smooth animations. This task adds accessibility features beyond the basic sidebar structure.

## Prerequisites

- ✅ TASK-3.3.1: Sidebar component structure created

## Acceptance Criteria

1. **Keyboard Support**
   - [ ] Escape key closes sidebar
   - [ ] Focus moves to sidebar when opened
   - [ ] Focus returns to trigger button when closed

2. **Animation**
   - [ ] Smooth slide-in animation (300ms)
   - [ ] Smooth slide-out animation (300ms)
   - [ ] Overlay fades in/out

3. **Accessibility**
   - [ ] ARIA attributes for dialog
   - [ ] Screen reader announces sidebar opening

## Implementation Notes

### Keyboard Event Handling

```javascript
mounted() {
    // Add escape key listener
    document.addEventListener('keydown', this.handleKeyDown);
},
beforeUnmount() {
    // Clean up listener
    document.removeEventListener('keydown', this.handleKeyDown);
},
methods: {
    handleKeyDown(event) {
        if (event.key === 'Escape' && this.sidebarVisible) {
            this.closeSidebar();
        }
    },

    openSidebar() {
        this.sidebarVisible = true;
        // Focus sidebar after animation
        this.$nextTick(() => {
            const sidebar = document.querySelector('.detail-sidebar');
            if (sidebar) sidebar.focus();
        });
    },

    closeSidebar() {
        this.sidebarVisible = false;
        // Return focus to trigger button
        // This will be handled by saving the trigger element
    }
}
```

### ARIA Attributes

```html
<div
    v-if="sidebarVisible"
    class="sidebar-overlay"
    @click="closeSidebar"
    role="dialog"
    aria-modal="true"
    aria-labelledby="sidebar-title"
>
    <div class="detail-sidebar" @click.stop tabindex="-1">
        <div class="sidebar-header">
            <div class="sidebar-title" id="sidebar-title">
                <!-- ... -->
            </div>
        </div>
    </div>
</div>
```

## Testing Checklist

### Manual Testing
- [ ] Escape key closes sidebar
- [ ] Clicking overlay closes sidebar
- [ ] Clicking close button closes sidebar
- [ ] Animations smooth
- [ ] Focus moves to sidebar when opened
- [ ] Keyboard navigation works

### Playwright Tests

```javascript
test('Escape key closes sidebar', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.locator('#agents-card .btn-view-details').first().click();
    await expect(page.locator('.detail-sidebar')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify sidebar closed
    await expect(page.locator('.detail-sidebar')).not.toBeVisible();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add keyboard and accessibility features

## Success Indicators

1. Escape key closes sidebar
2. Focus management works correctly
3. Animations smooth
4. No console errors

## Related Tickets

**Depends On:**
- TASK-3.3.1: Sidebar structure created

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/04-detail-interactions.md`
