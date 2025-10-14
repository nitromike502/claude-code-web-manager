# Story 3.2: Configuration Cards

**Epic:** 3 - Frontend Implementation (Phase 1 MVP)
**Story:** 3.2 - Implement configuration cards for all 4 types
**Status:** Pending
**Estimated Time:** 150 minutes (5 tasks × 30 min avg)
**Dependencies:** Story 3.1 (Complete)
**Assigned To:** frontend-developer

## Story Description

Implement the four configuration card components (Subagents, Commands, Hooks, MCP Servers) that display project configurations in a clean, card-based layout on the Project Detail View.

## Acceptance Criteria

- [ ] All 4 configuration card types render correctly
- [ ] Each card displays: icon, title, count, and list of items
- [ ] Card data fetched from backend API endpoints
- [ ] Loading states shown while fetching data
- [ ] Empty states displayed when no configurations found
- [ ] Error states handled gracefully with retry option
- [ ] Cards styled per wireframe specifications
- [ ] Dark mode colors applied correctly
- [ ] Responsive layout works on desktop/laptop screens
- [ ] Automated tests passing (Playwright)

## Tasks

### Task 3.2.1: Create AgentCard Component
**File:** `src/frontend/components/AgentCard.js`
**Estimated Time:** 30 minutes
**Dependencies:** None
**Assigned To:** frontend-developer

**Description:**
Create the AgentCard component to display project subagents.

**Acceptance Criteria:**
- [ ] Component renders with PrimeVue Card
- [ ] Displays: 🤖 icon, "Subagents" title, count badge
- [ ] Shows list of agents (name, description)
- [ ] Each agent has "View Details" button
- [ ] Initially shows 3-5 items, "Show more" button for rest
- [ ] Empty state: "No subagents configured"
- [ ] Loading skeleton displayed while fetching
- [ ] Styled per dark mode wireframe

**API Integration:**
- Fetches from: `GET /api/projects/:projectId/agents`
- Expected response: `{ agents: [{name, description, filePath, content}] }`

**Testing:**
- Component renders with mock data
- Empty state displays correctly
- Loading state shows skeleton
- "Show more" expands full list

---

### Task 3.2.2: Create CommandCard Component
**File:** `src/frontend/components/CommandCard.js`
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.2.1 (template/pattern reference)
**Assigned To:** frontend-developer

**Description:**
Create the CommandCard component to display slash commands.

**Acceptance Criteria:**
- [ ] Component renders with PrimeVue Card
- [ ] Displays: ⚡ icon, "Slash Commands" title, count badge
- [ ] Shows list of commands (name, description)
- [ ] Each command has "View Details" button
- [ ] Initially shows 3-5 items, "Show more" button for rest
- [ ] Empty state: "No commands configured"
- [ ] Loading skeleton displayed while fetching
- [ ] Styled per dark mode wireframe

**API Integration:**
- Fetches from: `GET /api/projects/:projectId/commands`
- Expected response: `{ commands: [{name, description, filePath, namespace, content}] }`

**Testing:**
- Component renders with mock data
- Namespace display works for nested commands
- Empty state displays correctly
- Loading state shows skeleton

---

### Task 3.2.3: Create HookCard Component
**File:** `src/frontend/components/HookCard.js`
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.2.2 (template/pattern reference)
**Assigned To:** frontend-developer

**Description:**
Create the HookCard component to display hooks.

**Acceptance Criteria:**
- [ ] Component renders with PrimeVue Card
- [ ] Displays: 🪝 icon, "Hooks" title, count badge
- [ ] Shows list of hooks (name, event, pattern)
- [ ] Each hook has "View Details" button
- [ ] Initially shows 3-5 items, "Show more" button for rest
- [ ] Empty state: "No hooks configured"
- [ ] Loading skeleton displayed while fetching
- [ ] Styled per dark mode wireframe

**API Integration:**
- Fetches from: `GET /api/projects/:projectId/hooks`
- Expected response: `{ hooks: [{name, event, pattern, command, source}] }`

**Testing:**
- Component renders with mock data
- Event and pattern display correctly
- Empty state displays correctly
- Loading state shows skeleton

---

### Task 3.2.4: Create MCPCard Component
**File:** `src/frontend/components/MCPCard.js`
**Estimated Time:** 30 minutes
**Dependencies:** Task 3.2.3 (template/pattern reference)
**Assigned To:** frontend-developer

**Description:**
Create the MCPCard component to display MCP servers.

**Acceptance Criteria:**
- [ ] Component renders with PrimeVue Card
- [ ] Displays: 🔌 icon, "MCP Servers" title, count badge
- [ ] Shows list of servers (name, transport, command summary)
- [ ] Each server has "View Details" button
- [ ] Initially shows 3-5 items, "Show more" button for rest
- [ ] Empty state: "No MCP servers configured"
- [ ] Loading skeleton displayed while fetching
- [ ] Styled per dark mode wireframe

**API Integration:**
- Fetches from: `GET /api/projects/:projectId/mcp`
- Expected response: `{ mcpServers: [{name, transport, command, args, source}] }`

**Testing:**
- Component renders with mock data
- Transport type displayed correctly
- Command/args formatted properly
- Empty state displays correctly

---

### Task 3.2.5: Integrate Cards into ProjectDetailView
**File:** `src/frontend/views/ProjectDetailView.js`
**Estimated Time:** 30 minutes
**Dependencies:** Tasks 3.2.1-3.2.4 (all card components)
**Assigned To:** frontend-developer

**Description:**
Integrate all four card components into the ProjectDetailView, stacked vertically.

**Acceptance Criteria:**
- [ ] All 4 cards render in correct order (Agents, Commands, Hooks, MCP)
- [ ] Cards stacked vertically with consistent spacing
- [ ] ProjectId passed to each card component
- [ ] Page scrolls smoothly when cards exceed viewport
- [ ] Responsive layout works on different screen sizes
- [ ] Loading states for all cards show simultaneously
- [ ] Error in one card doesn't break others
- [ ] Page maintains scroll position on refresh

**Testing:**
- All cards render together
- Scroll behavior works correctly
- Independent error handling per card
- Responsive breakpoints work

---

## Technical Notes

### Reusable Card Pattern
Consider creating a `BaseConfigCard.vue` component that all 4 cards extend:
```javascript
// BaseConfigCard.js
export default {
  props: ['title', 'icon', 'items', 'loading', 'error'],
  setup(props) {
    const visibleCount = ref(5);
    const showMore = () => { visibleCount.value = props.items.length; };
    // ... common logic
  }
}
```

### API Error Handling
All cards should handle these scenarios:
1. Network error → Show retry button
2. 404 (project not found) → Show error message
3. Empty response → Show empty state
4. Parse error → Log warning, show partial data

### Performance Considerations
- Use `v-show` instead of `v-if` for "Show more" expansion (faster)
- Debounce API calls if user switches projects quickly
- Cache API responses in component state (5 minute TTL)
- Virtual scrolling for cards with 50+ items (future optimization)

### Accessibility
- Each card has `role="region"` with `aria-label`
- "Show more" button has descriptive `aria-label`
- Loading state announced by screen readers
- Error messages have `role="alert"`

## Definition of Done

- [ ] All 5 tasks completed and tested
- [ ] All 4 card types render correctly with real backend data
- [ ] Automated tests passing (Playwright)
- [ ] Code follows project style guide
- [ ] Components documented with JSDoc comments
- [ ] Committed to feature branch (feature/config-cards)
- [ ] PR created and reviewed
- [ ] Merged to main after approval

## Related Files

- `/home/claude/manager/docs/wireframes/02-project-detail-view.md` - Design specification
- `/home/claude/manager/docs/PRD-Phase1-MVP.md` - Requirements
- `/home/claude/manager/src/frontend/views/ProjectDetailView.js` - Parent component
- `/home/claude/manager/src/backend/routes/*.js` - API endpoints

## Notes

- This story follows the successful pattern from Story 3.1 (Project Detail View Structure)
- Each task should be completed, tested, and committed independently
- Testing is mandatory before moving to next task
- Use PrimeVue components consistently (Card, DataView, Button, Badge)
- Dark mode is the default - light mode support comes in Story 3.5
