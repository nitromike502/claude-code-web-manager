# Story 3.4: Search & Filter Functionality

**Epic:** 3 - Frontend Implementation (Phase 1 MVP)
**Story:** 3.4 - Implement global search and filter across configuration types
**Status:** Pending
**Estimated Time:** 120 minutes (3 tasks × 40 min avg)
**Dependencies:** Story 3.2 (Configuration Cards), Story 3.3 (Interactive Features)
**Assigned To:** frontend-developer

## Story Description

Implement global search functionality that filters configuration items across all four card types (Subagents, Commands, Hooks, MCP Servers). Search should highlight matches, show match counts, and provide clear feedback.

## Acceptance Criteria

- [ ] Global search input in header works
- [ ] Search filters items across all 4 card types simultaneously
- [ ] Matching text highlighted in results
- [ ] Card headers show match count (e.g., "Subagents (2 of 5)")
- [ ] Cards with no matches show "No matches found" message
- [ ] Search input has clear (X) button
- [ ] Search debounced (300ms) for performance
- [ ] Empty search shows all items
- [ ] Search works with "View Details" button
- [ ] Search state preserved when opening/closing sidebar
- [ ] Case-insensitive search
- [ ] Automated tests passing (Playwright)

## Tasks

### Task 3.4.1: Implement Global Search Input
**File:** `src/frontend/components/AppHeader.js` or `ProjectDetailView.js`
**Estimated Time:** 40 minutes
**Dependencies:** None
**Assigned To:** frontend-developer

**Description:**
Add global search input to the header with debouncing and clear functionality.

**Acceptance Criteria:**
- [ ] Search input in header (top-right area)
- [ ] PrimeVue InputText with search icon
- [ ] Placeholder: "Search configurations..."
- [ ] Clear (X) button appears when text entered
- [ ] Input debounced 300ms (prevents excessive filtering)
- [ ] Search query stored in reactive state
- [ ] Query shared with all card components
- [ ] Keyboard shortcut: Ctrl+K / Cmd+K to focus (optional)
- [ ] Styled per wireframe specifications

**Implementation:**
```javascript
import { ref, watch } from 'vue';

const searchQuery = ref('');
const debouncedQuery = ref('');
let debounceTimeout = null;

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = newValue;
  }, 300);
});

const clearSearch = () => {
  searchQuery.value = '';
  debouncedQuery.value = '';
};
```

**Props/Events:**
- Component emits `@search-change` event with query string
- Parent (ProjectDetailView) listens and updates search state

**Testing:**
- Search input renders correctly
- Debouncing works (no filter until 300ms pause)
- Clear button appears/disappears correctly
- Query shared across components

---

### Task 3.4.2: Implement Search Filtering Logic
**File:** `src/frontend/components/BaseConfigCard.js` or individual card components
**Estimated Time:** 50 minutes
**Dependencies:** Task 3.4.1
**Assigned To:** frontend-developer

**Description:**
Implement filtering logic in each card component to filter items based on search query.

**Acceptance Criteria:**
- [ ] Cards receive search query as prop
- [ ] Each card filters its items by query
- [ ] Search matches: name, description, content (all fields)
- [ ] Case-insensitive matching
- [ ] Partial matches supported (e.g., "back" matches "backend-developer")
- [ ] Filtered items displayed immediately
- [ ] "No matches found" message when query matches nothing
- [ ] Empty query shows all items (no filter)
- [ ] Filter count displayed in card header
- [ ] Performance optimized (filter computed reactively)

**Filter Logic:**
```javascript
const filteredItems = computed(() => {
  if (!props.searchQuery || props.searchQuery.trim() === '') {
    return props.items;
  }

  const query = props.searchQuery.toLowerCase();
  return props.items.filter(item => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    );
  });
});

const matchCount = computed(() => filteredItems.value.length);
const totalCount = computed(() => props.items.length);
```

**Card Header Update:**
```javascript
// Show: "Subagents (2 of 5)" when searching
// Show: "Subagents (5)" when not searching
const headerText = computed(() => {
  if (props.searchQuery) {
    return `${props.title} (${matchCount.value} of ${totalCount.value})`;
  }
  return `${props.title} (${totalCount.value})`;
});
```

**Testing:**
- Search filters agents correctly
- Search filters commands correctly
- Search filters hooks correctly
- Search filters MCP servers correctly
- Empty query shows all items
- No matches shows empty state
- Match count displayed correctly

---

### Task 3.4.3: Implement Match Highlighting
**File:** `src/frontend/components/BaseConfigCard.js` or individual card components
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.4.2
**Assigned To:** frontend-developer

**Description:**
Highlight matching text in search results for better visual feedback.

**Acceptance Criteria:**
- [ ] Matching text highlighted in item name
- [ ] Matching text highlighted in item description
- [ ] Highlight color: `#ffd54f` (yellow) with dark background
- [ ] Multiple matches highlighted in same item
- [ ] Highlighting updates as search query changes
- [ ] No highlighting when search empty
- [ ] HTML entities properly escaped (prevent XSS)
- [ ] Case-insensitive highlighting

**Implementation:**
```javascript
const highlightMatch = (text, query) => {
  if (!query || !text) return text;

  // Escape HTML to prevent XSS
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const escapedText = escapeHtml(text);
  const regex = new RegExp(`(${query})`, 'gi');

  return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
};
```

**CSS for Highlighting:**
```css
.search-highlight {
  background-color: #ffd54f;
  color: #000;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 500;
}
```

**Rendering:**
```javascript
// Use v-html to render highlighted text
<div v-html="highlightMatch(item.name, searchQuery)"></div>
<div v-html="highlightMatch(item.description, searchQuery)"></div>
```

**Security Note:**
Always escape HTML before using `v-html` to prevent XSS attacks.

**Testing:**
- Matches highlighted in name
- Matches highlighted in description
- Multiple matches highlighted
- Highlighting updates with query
- HTML properly escaped (test with `<script>` input)

---

## Technical Notes

### Search Scope
Search should match against these fields per config type:

**Subagents:**
- `name` (always visible)
- `description` (always visible)
- `content` (full markdown body - used for filtering)

**Commands:**
- `name` (e.g., "/api-spec")
- `description`
- `namespace` (if present)
- `content` (full markdown)

**Hooks:**
- `name`
- `event` (e.g., "beforeWrite")
- `pattern` (e.g., "**/*.js")
- `command` (e.g., "/lint")

**MCP Servers:**
- `name`
- `transport` (e.g., "stdio")
- `command` (e.g., "npx")
- `args` (full args array joined as string)

### Performance Considerations

**Debouncing:**
- 300ms delay prevents excessive filtering on each keystroke
- Improves performance when many items present
- Provides better UX (less flickering)

**Computed Properties:**
Use Vue's computed properties for reactive filtering:
```javascript
const filteredItems = computed(() => {
  // Filter logic runs only when searchQuery or items change
  // Vue caches result until dependencies change
});
```

**Large Datasets:**
For projects with 100+ configurations:
- Consider virtual scrolling (future optimization)
- Lazy render initially hidden items
- Index search fields for faster matching (future)

### Empty States

**No Results:**
```
┌─────────────────────────────────────────────┐
│ 🤖 Subagents (0 of 5)                      │
├─────────────────────────────────────────────┤
│                                             │
│    🔍 No matches found for "xyz"            │
│                                             │
│    Try a different search term              │
│                                             │
└─────────────────────────────────────────────┘
```

**All Cards Empty:**
If search returns no results across ALL cards:
- Show message above cards: "No configurations match 'xyz'"
- Keep cards visible but show empty states
- Suggest clearing search or trying different terms

### Accessibility

**Search Input:**
- `aria-label="Search configurations"`
- `role="searchbox"`
- Clear button: `aria-label="Clear search"`

**Results:**
- Announce match count to screen readers: `aria-live="polite"`
- Example: "5 results found" or "No results found"

**Keyboard Navigation:**
- Tab to search input
- Type to search
- ESC to clear search (optional)
- Tab away to navigate results

### Search Persistence

**During Session:**
- Search query persists when opening/closing sidebar
- Search state maintained when viewing details
- Query cleared when navigating to different project

**Between Sessions:**
- Do NOT persist search query in localStorage
- Always start with empty search on page load
- Each project starts with fresh search state

### Edge Cases

**Special Characters:**
Handle these search queries safely:
- Regex special chars: `.`, `*`, `+`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, `$`, `|`, `\`
- HTML tags: `<`, `>`, `&`
- Quotes: `"`, `'`

Escape regex special characters:
```javascript
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
```

**Empty/Whitespace Queries:**
- Trim whitespace: `query.trim()`
- Empty string = no filter (show all)
- Only whitespace = treat as empty

**Very Long Queries:**
- Limit search input to 100 characters (reasonable max)
- Use `maxlength="100"` on input

## Definition of Done

- [ ] All 3 tasks completed and tested
- [ ] Search filters all 4 card types correctly
- [ ] Match highlighting works across all fields
- [ ] Performance acceptable with 50+ items
- [ ] Automated tests passing (Playwright)
- [ ] Code follows project style guide
- [ ] Accessibility requirements met
- [ ] Committed to feature branch (feature/search-filter)
- [ ] PR created and reviewed
- [ ] Merged to main after approval

## Related Files

- `/home/claude/manager/docs/wireframes/04-search-filter.md` - Search design (if exists)
- `/home/claude/manager/docs/wireframes/02-project-detail-view.md` - Main view design
- `/home/claude/manager/src/frontend/views/ProjectDetailView.js` - Parent component
- `/home/claude/manager/src/frontend/components/*.js` - All card components

## Notes

- Search is a key usability feature for projects with many configurations
- Performance critical - debouncing and computed properties essential
- Security critical - always escape HTML before using v-html
- Test with large datasets (50+ items) to ensure performance
- Consider adding search tips/help text for users (future enhancement)
