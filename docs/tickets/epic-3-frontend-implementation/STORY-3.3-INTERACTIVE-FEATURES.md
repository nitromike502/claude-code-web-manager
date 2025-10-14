# Story 3.3: Interactive Features

**Epic:** 3 - Frontend Implementation (Phase 1 MVP)
**Story:** 3.3 - Implement interactive features (sidebar, expand/collapse, show more)
**Status:** Pending
**Estimated Time:** 210 minutes (6 tasks × 35 min avg)
**Dependencies:** Story 3.2 (Configuration Cards)
**Assigned To:** frontend-developer

## Story Description

Implement interactive features that enhance user experience: detail sidebar for viewing full config content, expand/collapse functionality for cards, "show more" buttons, and smooth transitions.

## Acceptance Criteria

- [ ] Detail sidebar opens when "View Details" clicked
- [ ] Sidebar displays full content with syntax highlighting
- [ ] Sidebar has copy-to-clipboard functionality
- [ ] Sidebar closes with X button, ESC key, or outside click
- [ ] "Expand All" / "Collapse All" toggles card expansion
- [ ] "Show more" button reveals all items in card
- [ ] All interactions have smooth animations
- [ ] Body scroll locked when sidebar open
- [ ] Keyboard navigation works (arrow keys, enter, escape)
- [ ] Focus trap in sidebar when open
- [ ] Automated tests passing (Playwright)

## Tasks

### Task 3.3.1: Create DetailSidebar Component (Basic Structure)
**File:** `src/frontend/components/DetailSidebar.js`
**Estimated Time:** 40 minutes
**Dependencies:** None
**Assigned To:** frontend-developer

**Description:**
Create the DetailSidebar component with basic open/close functionality.

**Acceptance Criteria:**
- [ ] Component renders as fixed sidebar (right side)
- [ ] Opens with smooth slide-in transition (0.3s)
- [ ] Closes with smooth slide-out transition
- [ ] Overlay backdrop dims main content when open
- [ ] Click backdrop to close sidebar
- [ ] Close button (X) in top-right corner
- [ ] ESC key closes sidebar
- [ ] Body scroll locked when sidebar open (prevents main page scroll)
- [ ] Sidebar content area scrollable independently
- [ ] Z-index properly layered above main content

**Props:**
- `visible` (boolean): Controls sidebar visibility
- `title` (string): Sidebar header title
- `content` (string): Main content to display

**Events:**
- `@close`: Emitted when sidebar should close

**Testing:**
- Sidebar opens/closes with transition
- ESC key closes sidebar
- Backdrop click closes sidebar
- Body scroll locked when open
- Sidebar scroll works independently

**CRITICAL:** This task addresses the sidebar scrolling issues identified in the workflow analysis. Test scroll behavior immediately after implementation.

---

### Task 3.3.2: Add Syntax Highlighting to Sidebar
**File:** `src/frontend/components/DetailSidebar.js`
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.3.1
**Assigned To:** frontend-developer

**Description:**
Add syntax highlighting for markdown/YAML content displayed in sidebar.

**Acceptance Criteria:**
- [ ] Use PrimeVue's built-in syntax highlighting
- [ ] Markdown content highlighted correctly
- [ ] YAML frontmatter highlighted with different color
- [ ] Code blocks within markdown highlighted
- [ ] Syntax highlighting theme matches dark mode
- [ ] Line numbers displayed for code sections (optional)
- [ ] Highlighting doesn't break layout

**Technical Notes:**
- Use PrimeVue `<Code>` component or integrate Prism.js
- Consider splitting content: frontmatter vs body
- Apply different highlighting to each section

**Testing:**
- Agent content (YAML + markdown) highlights correctly
- Command content (markdown only) highlights correctly
- Hook content (JSON structure) highlights correctly
- MCP content (JSON structure) highlights correctly

---

### Task 3.3.3: Add Copy-to-Clipboard to Sidebar
**File:** `src/frontend/components/DetailSidebar.js`
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.3.2
**Assigned To:** frontend-developer

**Description:**
Add copy-to-clipboard functionality for sidebar content.

**Acceptance Criteria:**
- [ ] "Copy" button in sidebar header (next to title)
- [ ] Button uses clipboard icon (PrimeVue icon)
- [ ] Clicking copies full content to clipboard
- [ ] Success message/toast appears after copy
- [ ] Button shows "Copied!" feedback briefly (2s)
- [ ] Button disabled if clipboard API unavailable
- [ ] Copy preserves formatting (markdown, YAML)
- [ ] Keyboard shortcut: Ctrl+C / Cmd+C (optional)

**Implementation:**
```javascript
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
    showToast('success', 'Copied to clipboard!');
    // Show "Copied!" state for 2s
  } catch (err) {
    showToast('error', 'Failed to copy');
  }
};
```

**Testing:**
- Copy button copies content correctly
- Success toast appears
- Button state changes to "Copied!" briefly
- Copy works for all content types

---

### Task 3.3.4: Integrate Sidebar with Configuration Cards
**File:** `src/frontend/components/*.js` (all card components)
**Estimated Time:** 40 minutes
**Dependencies:** Task 3.3.3
**Assigned To:** frontend-developer

**Description:**
Connect "View Details" buttons in all card components to open the detail sidebar.

**Acceptance Criteria:**
- [ ] All "View Details" buttons emit event with item data
- [ ] ProjectDetailView listens for detail events
- [ ] Sidebar opens with correct content for each item type
- [ ] Sidebar title shows item name
- [ ] Sidebar displays full content (frontmatter + body)
- [ ] Clicking details on different item switches content
- [ ] Sidebar closes when navigating away from view
- [ ] Multiple rapid clicks handled gracefully

**Changes Required:**
1. **AgentCard, CommandCard, HookCard, MCPCard:**
   - Add `@click` handler to "View Details" button
   - Emit `detail-clicked` event with item data

2. **ProjectDetailView:**
   - Add sidebar component
   - Listen for `detail-clicked` from all cards
   - Pass selected item to sidebar
   - Manage sidebar open/close state

**Testing:**
- "View Details" opens sidebar for agents
- "View Details" opens sidebar for commands
- "View Details" opens sidebar for hooks
- "View Details" opens sidebar for MCP servers
- Clicking another item switches content smoothly

---

### Task 3.3.5: Implement "Expand All" / "Collapse All" Functionality
**File:** `src/frontend/components/BaseConfigCard.js` (if created) or individual cards
**Estimated Time:** 35 minutes
**Dependencies:** None (parallel to sidebar work)
**Assigned To:** frontend-developer

**Description:**
Add "Expand All" / "Collapse All" toggle button to each card header.

**Acceptance Criteria:**
- [ ] "Expand All" button in card header (right side)
- [ ] Initially shows "Expand All" text
- [ ] Clicking expands all items in that card
- [ ] Button text changes to "Collapse All"
- [ ] Clicking again collapses items back to initial state (3-5 items)
- [ ] Smooth expand/collapse animation (0.2s)
- [ ] Icon rotates (chevron down → up) during toggle
- [ ] State persists during session (not between reloads)
- [ ] Independent state per card type

**Implementation:**
```javascript
const expanded = ref(false);
const visibleCount = computed(() =>
  expanded.value ? items.value.length : 5
);
const toggleExpand = () => {
  expanded.value = !expanded.value;
};
```

**Testing:**
- "Expand All" shows all items
- "Collapse All" returns to initial state
- Animation smooth
- Button text updates correctly
- Each card independent

---

### Task 3.3.6: Implement "Show More" Button
**File:** `src/frontend/components/BaseConfigCard.js` (if created) or individual cards
**Estimated Time:** 35 minutes
**Dependencies:** Task 3.3.5 (related feature)
**Assigned To:** frontend-developer

**Description:**
Add "Show X more..." button at bottom of card when items exceed initial visible count.

**Acceptance Criteria:**
- [ ] Button appears when items > 5
- [ ] Shows count: "Show 7 more..." (if 12 total, 5 visible)
- [ ] Clicking reveals all items
- [ ] Button disappears after click
- [ ] Smooth expand animation
- [ ] Auto-scroll to newly revealed items (optional)
- [ ] Button styled per wireframe (subtle, centered)
- [ ] Works in conjunction with "Expand All" feature

**Logic:**
```javascript
const initialVisible = 5;
const visibleCount = ref(initialVisible);
const showingAll = computed(() => visibleCount.value >= items.value.length);
const remainingCount = computed(() => items.value.length - visibleCount.value);

const showMore = () => {
  visibleCount.value = items.value.length;
};
```

**Testing:**
- Button shows correct count
- Button hidden when all items visible
- Clicking reveals all items
- Works with "Expand All" feature
- Animation smooth

---

## Technical Notes

### Sidebar Scroll Behavior (CRITICAL)
Per workflow analysis, sidebar scrolling was a major issue in October 7 session. Follow this implementation:

**Required CSS:**
```css
/* When sidebar open, lock body scroll */
body.sidebar-open {
  overflow: hidden;
}

/* Sidebar itself scrolls independently */
.sidebar-content {
  overflow-y: auto;
  max-height: calc(100vh - 100px); /* Account for header/footer */
  padding: 1rem;
}

/* Overlay backdrop */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Sidebar panel */
.sidebar-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 600px;
  background: var(--surface-overlay);
  z-index: 999;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.sidebar-panel.open {
  transform: translateX(0);
}
```

### Expand/Collapse Animation
Use CSS transitions for smooth animations:
```css
.card-items {
  transition: max-height 0.3s ease, opacity 0.2s ease;
  overflow: hidden;
}

.card-items.collapsed {
  max-height: 300px; /* ~5 items */
}

.card-items.expanded {
  max-height: 5000px; /* Large enough for all items */
}
```

### Keyboard Navigation
Implement these keyboard shortcuts:
- **ESC:** Close sidebar
- **Tab:** Navigate between "View Details" buttons
- **Enter/Space:** Activate focused button
- **Arrow Up/Down:** Navigate between items (optional)

### Focus Management
When sidebar opens:
1. Save current focus element
2. Move focus to sidebar close button
3. Trap focus within sidebar (Tab cycles within)
4. Restore focus to original element on close

### Accessibility
- Sidebar has `role="dialog"` and `aria-modal="true"`
- Focus trap prevents tabbing out of sidebar
- Close button has `aria-label="Close detail view"`
- ESC key always closes sidebar
- Screen reader announces sidebar open/close

### Performance
- Use CSS transforms for animations (hardware accelerated)
- Debounce rapid clicks on "View Details"
- Virtual scrolling for very long content (future)

## Definition of Done

- [ ] All 6 tasks completed and tested
- [ ] Detail sidebar works for all config types
- [ ] Expand/collapse and show more features functional
- [ ] Automated tests passing (Playwright)
- [ ] Code follows project style guide
- [ ] Accessibility features implemented
- [ ] Committed to feature branch (feature/interactive-features)
- [ ] PR created and reviewed
- [ ] Merged to main after approval

## Related Files

- `/home/claude/manager/docs/wireframes/03-sidebar-detail.md` - Sidebar design
- `/home/claude/manager/docs/workflow-analysis-20251007.md` - Sidebar scrolling lessons
- `/home/claude/manager/src/frontend/components/DetailSidebar.js` - New component
- `/home/claude/manager/src/frontend/views/ProjectDetailView.js` - Parent integration

## Notes

- **CRITICAL:** Test sidebar scroll behavior immediately after Task 3.3.1
- October 7 session spent 3+ hours debugging sidebar scrolling issues
- Follow the exact CSS structure above to prevent scroll problems
- Each task must be tested before moving to next
- Sidebar is a complex component - take time to get it right
