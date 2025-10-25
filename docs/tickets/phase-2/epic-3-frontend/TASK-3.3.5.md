# TASK-3.3.5: Add Syntax Highlighting for Code Content

**Epic:** EPIC-3 (Frontend Development)
**Story:** 3.3 - Detail Sidebar/Panel
**Estimated Time:** 30 minutes
**Priority:** High
**Status:** Not Started

## Description

Add syntax highlighting to display agent/command markdown content and hook/MCP JSON configuration in the sidebar. Use Prism.js or Highlight.js for code highlighting with dark mode support.

## Prerequisites

- ✅ TASK-3.3.1: Sidebar structure created

## Acceptance Criteria

1. **Syntax Highlighting**
   - [ ] YAML frontmatter highlighted
   - [ ] Markdown code blocks highlighted
   - [ ] JSON configuration highlighted
   - [ ] Dark mode color scheme

2. **Content Display**
   - [ ] Frontmatter section collapsible
   - [ ] Markdown rendered with highlighting
   - [ ] JSON formatted and highlighted

3. **Library Integration**
   - [ ] Prism.js or Highlight.js loaded via CDN
   - [ ] Supports YAML, JSON, JavaScript, markdown

## Implementation Notes

### Add Prism.js CDN

```html
<head>
    <!-- Prism.js for syntax highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-yaml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markdown.min.js"></script>
</head>
```

### Sidebar Content Structure

```html
<div class="sidebar-content">
    <!-- Type Badge and File Path -->
    <div class="item-type-badge">{{ currentItem.type }}</div>
    <div class="item-file-path">{{ currentItem.filePath }}</div>

    <!-- YAML Frontmatter Section (collapsible) -->
    <div v-if="currentItem.frontmatter" class="content-section">
        <div class="section-header" @click="toggleFrontmatter">
            <h4>YAML Frontmatter</h4>
            <i :class="frontmatterExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="frontmatterExpanded" class="section-body">
            <pre><code class="language-yaml">{{ formatYaml(currentItem.frontmatter) }}</code></pre>
            <button class="btn-copy-section" @click="copySection('yaml')">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>

    <!-- Markdown Content Section -->
    <div v-if="currentItem.type === 'Subagent' || currentItem.type === 'Slash Command'" class="content-section">
        <div class="section-header">
            <h4>Content</h4>
        </div>
        <div class="section-body markdown-content" v-html="renderMarkdown(currentItem.content)">
        </div>
    </div>

    <!-- JSON Configuration Section (for Hooks and MCP) -->
    <div v-if="currentItem.type === 'Hook' || currentItem.type === 'MCP Server'" class="content-section">
        <div class="section-header">
            <h4>Configuration</h4>
        </div>
        <div class="section-body">
            <pre><code class="language-json">{{ currentItem.content }}</code></pre>
        </div>
    </div>
</div>
```

### Vue Methods

```javascript
data() {
    return {
        frontmatterExpanded: false
    };
},
methods: {
    formatYaml(frontmatter) {
        return '---\n' + JSON.stringify(frontmatter, null, 2)
            .replace(/^{/, '')
            .replace(/}$/, '')
            .replace(/"/g, '') + '\n---';
    },

    renderMarkdown(content) {
        // Simple markdown rendering (or use marked.js library)
        // For now, wrap in pre/code for highlighting
        return `<pre><code class="language-markdown">${this.escapeHtml(content)}</code></pre>`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    toggleFrontmatter() {
        this.frontmatterExpanded = !this.frontmatterExpanded;
    },

    copySection(type) {
        // Will be implemented in TASK-3.3.6
        console.log('Copy section:', type);
    }
},
updated() {
    // Re-highlight code after content updates
    if (window.Prism) {
        this.$nextTick(() => {
            window.Prism.highlightAll();
        });
    }
}
```

### CSS Styling

```css
.content-section {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-secondary);
    border-radius: 6px;
    margin-bottom: 1rem;
    overflow: hidden;
}

.section-header {
    padding: 1rem;
    background-color: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.section-header:hover {
    background-color: var(--bg-hover);
}

.section-header h4 {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--text-primary);
}

.section-body {
    padding: 1rem;
    position: relative;
}

.section-body pre {
    margin: 0;
    background-color: var(--bg-code);
    border: 1px solid var(--border-secondary);
    border-radius: 4px;
    padding: 1rem;
    overflow-x: auto;
}

.section-body code {
    font-family: 'Courier New', Monaco, monospace;
    font-size: 0.875rem;
    line-height: 1.5;
}

.btn-copy-section {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background-color: var(--bg-hover);
    color: var(--text-secondary);
    border: 1px solid var(--border-primary);
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8125rem;
    transition: all 0.2s ease;
}

.btn-copy-section:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
}

/* Override Prism.js dark theme if needed */
.detail-sidebar pre[class*="language-"] {
    background-color: var(--bg-code) !important;
}
```

## Testing Checklist

### Manual Testing
- [ ] YAML frontmatter highlighted correctly
- [ ] Markdown content displayed
- [ ] JSON configuration highlighted
- [ ] Frontmatter section collapsible
- [ ] Syntax colors match dark theme
- [ ] Code blocks scrollable horizontally

### Playwright Tests

```javascript
test('Syntax highlighting applied', async ({ page }) => {
    await page.goto('http://localhost:8420');
    await page.waitForSelector('.project-card');
    await page.locator('.project-card').first().click();
    await page.locator('#agents-card .btn-view-details').first().click();

    // Wait for Prism to highlight
    await page.waitForSelector('.sidebar-content code[class*="language-"]');

    // Verify code block has syntax highlighting classes
    const hasHighlighting = await page.evaluate(() => {
        const codeBlock = document.querySelector('.sidebar-content code');
        return codeBlock && codeBlock.className.includes('language-');
    });
    expect(hasHighlighting).toBeTruthy();
});
```

## Files to Modify

- `src/frontend/project-detail.html` - Add Prism.js and content sections

## Success Indicators

1. Syntax highlighting works for all code types
2. Dark mode colors applied
3. Content sections render correctly
4. No console errors

## Related Tickets

**Depends On:**
- TASK-3.3.1: Sidebar structure

**Epic:**
- EPIC-3: Frontend Development

## Notes

**Wireframe Reference:** `docs/wireframes/04-detail-interactions.md`
