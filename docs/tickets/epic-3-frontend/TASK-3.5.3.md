# TASK-3.5.3: Responsive Design Testing

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.5 - Integration & Testing
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Comprehensive testing of responsive design across all screen sizes and devices. Verify that all layouts, components, and interactions work correctly on desktop, laptop, tablet, and mobile devices. Ensure touch interactions and mobile-specific features function properly.

## Prerequisites

- ✅ TASK-3.5.1: Integration testing complete
- ✅ TASK-3.5.2: Cross-browser testing complete
- ✅ All frontend features implemented

## Acceptance Criteria

1. **Breakpoint Testing**
   - [ ] Desktop: 1920x1080 (full features)
   - [ ] Laptop: 1366x768 (full features)
   - [ ] Tablet: 768x1024 (adapted layout)
   - [ ] Mobile: 375x667 (mobile-optimized)

2. **Layout Verification**
   - [ ] Cards stack correctly on small screens
   - [ ] Sidebar adapts to screen width
   - [ ] Header responsive (User button becomes icon-only)
   - [ ] Breadcrumbs responsive
   - [ ] No horizontal scroll on any screen size

3. **Touch Interactions**
   - [ ] Buttons have adequate touch targets (44x44px minimum)
   - [ ] Sidebar swipe-to-close (optional enhancement)
   - [ ] Card interactions work with touch
   - [ ] Scrolling smooth on touch devices

4. **Mobile-Specific**
   - [ ] Viewport meta tag correct
   - [ ] Font sizes readable on mobile
   - [ ] Spacing adequate for touch
   - [ ] No elements too small to interact with

## Implementation Notes

### Responsive Breakpoints

```css
/* Mobile (< 600px) */
@media (max-width: 599px) {
    .app-header {
        flex-wrap: wrap;
        padding: 1rem;
    }

    .btn-user span {
        display: none; /* Icon only */
    }

    .detail-sidebar {
        width: 90%;
        min-width: 0;
    }

    .config-card {
        margin: 0 0.5rem;
    }
}

/* Tablet (600px - 767px) */
@media (min-width: 600px) and (max-width: 767px) {
    .config-cards-container {
        max-width: 100%;
        padding: 0 1rem;
    }

    .detail-sidebar {
        width: 70%;
    }
}

/* Laptop (768px - 1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
    .config-cards-container {
        max-width: 800px;
    }

    .detail-sidebar {
        width: 50%;
    }
}

/* Desktop (1200px+) */
@media (min-width: 1200px) {
    .config-cards-container {
        max-width: 960px;
    }

    .detail-sidebar {
        width: 40%;
        max-width: 600px;
    }
}
```

### Touch Target Sizing

```css
/* Ensure touch targets are at least 44x44px */
.btn-view-details,
.btn-close-sidebar,
.theme-toggle,
.btn-user {
    min-width: 44px;
    min-height: 44px;
}

.config-item {
    min-height: 60px; /* Adequate touch target */
}
```

### Viewport Configuration

```html
<!-- Ensure this is in all HTML files -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### Playwright Responsive Testing

```javascript
// tests/frontend/responsive.spec.js

test.describe('Responsive Design', () => {
    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Laptop', width: 1366, height: 768 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
        test(`Dashboard layout on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('http://localhost:8420');
            await page.waitForSelector('.project-card');

            // Take screenshot for visual verification
            await page.screenshot({
                path: `tests/screenshots/${viewport.name}-dashboard.png`
            });

            // Verify no horizontal scroll
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            expect(hasHorizontalScroll).toBeFalsy();
        });

        test(`Project detail view on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('http://localhost:8420');
            await page.waitForSelector('.project-card');
            await page.locator('.project-card').first().click();
            await page.waitForSelector('.config-cards-container');

            // Take screenshot
            await page.screenshot({
                path: `tests/screenshots/${viewport.name}-detail.png`
            });

            // Verify all cards visible
            await expect(page.locator('.config-card')).toHaveCount(4);
        });

        test(`Sidebar on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('http://localhost:8420');
            await page.waitForSelector('.project-card');
            await page.locator('.project-card').first().click();
            await page.waitForSelector('#agents-card .btn-view-details');
            await page.locator('#agents-card .btn-view-details').first().click();

            // Verify sidebar visible
            await expect(page.locator('.detail-sidebar')).toBeVisible();

            // Take screenshot
            await page.screenshot({
                path: `tests/screenshots/${viewport.name}-sidebar.png`
            });

            // Verify sidebar width appropriate for viewport
            const sidebarWidth = await page.locator('.detail-sidebar').evaluate(el =>
                el.offsetWidth
            );

            if (viewport.width < 600) {
                // Mobile: sidebar should be ~90% of viewport
                expect(sidebarWidth).toBeGreaterThan(viewport.width * 0.85);
            } else {
                // Larger screens: sidebar should be reasonable width
                expect(sidebarWidth).toBeLessThan(viewport.width);
            }
        });
    }
});

test('Touch interactions work on mobile', async ({ page, context }) => {
    // Emulate mobile device
    await context.newPage({
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true
    });

    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');

    // Tap project card
    await page.tap('.project-card');
    await expect(page).toHaveURL(/project-detail\.html/);

    // Tap View Details
    await page.waitForSelector('#agents-card .btn-view-details');
    await page.tap('#agents-card .btn-view-details');

    // Verify sidebar opened
    await expect(page.locator('.detail-sidebar')).toBeVisible();

    // Tap overlay to close
    await page.tap('.sidebar-overlay', { position: { x: 10, y: 10 } });
    await expect(page.locator('.detail-sidebar')).not.toBeVisible();
});
```

## Testing Checklist

### Manual Testing - Desktop (1920x1080)
- [ ] Layout uses full width appropriately
- [ ] Sidebar at 40% width
- [ ] All features accessible
- [ ] No wasted space

### Manual Testing - Laptop (1366x768)
- [ ] Layout compact but readable
- [ ] Sidebar at 50% width
- [ ] All features functional
- [ ] Scrolling works correctly

### Manual Testing - Tablet (768x1024)
- [ ] Cards stack if needed
- [ ] Sidebar at 60-70% width
- [ ] Touch targets adequate
- [ ] Buttons easily tappable

### Manual Testing - Mobile (375x667)
- [ ] Single column layout
- [ ] Sidebar nearly full-width (90%)
- [ ] User button icon-only
- [ ] Font sizes readable
- [ ] No horizontal scroll
- [ ] Touch interactions smooth
- [ ] Scrolling smooth

### Automated Testing
- [ ] Playwright tests pass on all viewports
- [ ] Screenshots generated for review
- [ ] No horizontal scroll detected
- [ ] Touch interactions work

## Files to Create

- `tests/frontend/responsive.spec.js` - Responsive design tests
- `docs/testing/responsive-test-report.md` - Document results

## Files to Modify

- CSS files - Adjust breakpoints if needed
- HTML files - Fix any responsive issues

## Success Indicators

1. No horizontal scroll on any screen size
2. All features accessible on all devices
3. Touch targets meet minimum size (44x44px)
4. Layout adapts appropriately
5. Text readable on all screen sizes
6. Images/icons scale correctly
7. Performance good on mobile

## Related Tickets

**Depends On:**
- TASK-3.5.1: Integration testing
- TASK-3.5.2: Cross-browser testing

**Epic:**
- EPIC-3: Frontend Development

## Notes

### Mobile Considerations

**Priority:** Laptop/Desktop (primary use case for developer tool)
**Nice-to-have:** Mobile responsive for reference/viewing

**Mobile Limitations (Acceptable):**
- Some features may be harder to use on very small screens
- Editing disabled (Phase 1 is read-only anyway)
- Complex interactions simplified

### Performance on Mobile

Test and document:
- Page load times
- Animation smoothness
- Scroll performance
- Memory usage

**Wireframe Reference:** `docs/wireframes/07-responsive-design.md`
