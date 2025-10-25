# TASK-3.3.6: Add Copy-to-Clipboard Functionality

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 20 minutes
**Priority:** High
**Status:** Not Started

## Description

Implement copy-to-clipboard functionality for sidebar content. Allow users to copy entire configuration, individual sections (YAML, markdown, JSON), or specific code blocks with visual feedback.

## Prerequisites

- ✅ TASK-3.3.1: Sidebar structure created
- ✅ TASK-3.3.5: Syntax highlighting added

## Acceptance Criteria

1. **Copy Functionality**
   - [ ] "Copy All" button copies entire content
   - [ ] Section copy buttons work
   - [ ] Visual feedback on copy (toast notification)

2. **Content Format**
   - [ ] Copies plain text (no HTML)
   - [ ] Preserves formatting (line breaks, indentation)
   - [ ] Includes YAML frontmatter when copying all

## Implementation Notes

### Copy Methods

```javascript
methods: {
    async copyAllContent() {
        let textToCopy = '';

        // Add frontmatter if exists
        if (this.currentItem.frontmatter) {
            textToCopy += this.formatYaml(this.currentItem.frontmatter) + '\n\n';
        }

        // Add main content
        textToCopy += this.currentItem.content;

        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showToast('Content copied to clipboard');
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy content', 'error');
        }
    },

    async copySection(type) {
        let textToCopy = '';

        switch (type) {
            case 'yaml':
                textToCopy = this.formatYaml(this.currentItem.frontmatter);
                break;
            case 'content':
                textToCopy = this.currentItem.content;
                break;
            case 'json':
                textToCopy = this.currentItem.content;
                break;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showToast('Section copied to clipboard');
        } catch (err) {
            console.error('Failed to copy section:', err);
            this.showToast('Failed to copy section', 'error');
        }
    },

    downloadContent() {
        const filename = `${this.currentItem.type.toLowerCase().replace(' ', '-')}-${this.currentItem.name}.md`;
        const content = this.currentItem.frontmatter
            ? this.formatYaml(this.currentItem.frontmatter) + '\n\n' + this.currentItem.content
            : this.currentItem.content;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        this.showToast('Downloaded successfully');
    },

    showToast(message, type = 'success') {
        this.toastMessage = message;
        this.toastType = type;
        this.toastVisible = true;

        setTimeout(() => {
            this.toastVisible = false;
        }, 3000);
    }
}
```

### Toast Notification Component

```html
<!-- Toast Notification -->
<div v-if="toastVisible" :class="['toast-notification', `toast-${toastType}`]">
    <i :class="toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
    <span>{{ toastMessage }}</span>
</div>
```

### CSS Styling

```css
.toast-notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background-color: var(--color-success-bg);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 2000;
    animation: slideInRight 0.3s ease;
}

.toast-error {
    background-color: var(--color-error-bg);
}

.toast-notification i {
    font-size: 1.25rem;
}

@keyframes slideInRight {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
```

### Vue Data

```javascript
data() {
    return {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success'
    };
}
```

## Testing Checklist

### Manual Testing
- [ ] "Copy All" button copies full content
- [ ] Section copy buttons work
- [ ] Toast notification appears
- [ ] Toast disappears after 3 seconds
- [ ] Downloaded file has correct content
- [ ] Clipboard contains expected text

### Playwright Tests

```javascript
test('Copy All button copies content', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.locator('#agents-card .btn-view-details').first().click();

    // Click Copy All
    await page.locator('.sidebar-footer button:has-text("Copy All")').click();

    // Verify toast appears
    await expect(page.locator('.toast-notification')).toBeVisible();
    await expect(page.locator('.toast-notification')).toContainText('copied');

    // Verify clipboard has content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.length).toBeGreaterThan(0);
});

test('Download button downloads file', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.locator('#agents-card .btn-view-details').first().click();

    // Listen for download
    const downloadPromise = page.waitForEvent('download');

    // Click Download
    await page.locator('.sidebar-footer button:has-text("Download")').click();

    // Verify download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.(md|json)$/);
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add copy/download methods and toast

## Success Indicators

1. Copy buttons work for all sections
2. Toast notifications appear and disappear
3. Download creates correct file
4. No console errors

## Related Tickets

**Depends On:**
- TASK-3.3.1: Sidebar structure
- TASK-3.3.5: Syntax highlighting

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/04-detail-interactions.md`
