# Detail View Interactions Wireframe

## Overview
This wireframe defines how users view full content for individual configurations (subagents, commands, hooks, MCP servers). When a user clicks "View Details" on any item, they need to see complete information including YAML frontmatter, markdown content, and configuration details.

## Interaction Pattern Decision: Side Panel (Recommended)

After evaluating three options (Modal Dialog, Side Panel, Inline Expansion), **Side Panel** is recommended for these reasons:
- Preserves context (user can still see the list)
- Handles long content well (full height for scrolling)
- Feels more "native" for detail views
- Better for repeated viewing of multiple items
- Easier to implement navigation between items

## Side Panel Layout

```
┌────────────────────────────────────┬────────────────────────────────────────┐
│                                    │ SIDE PANEL (40% width)                 │
│  PROJECT/USER VIEW                 │                                        │
│  (60% width, dimmed overlay)       │ ┌────────────────────────────────────┐ │
│                                    │ │ [✕ Close]              [< Prev Next>]│ │
│  ┌──────────────────────────────┐ │ └────────────────────────────────────┘ │
│  │ 🤖 Subagents (3)             │ │                                        │
│  ├──────────────────────────────┤ │ HEADER                                 │
│  │                              │ │ ┌────────────────────────────────────┐ │
│  │  ┌────────────────────────┐  │ │ │ 🤖 backend-developer               │ │
│  │  │ backend-developer  [→]│ ← ACTIVE                                   │ │
│  │  │ Backend API specialist│  │ │ │ Type: Subagent                     │ │
│  │  └────────────────────────┘  │ │ │ File: .claude/agents/backend-...  │ │
│  │                              │ │ └────────────────────────────────────┘ │
│  │  ┌────────────────────────┐  │ │                                        │
│  │  │ frontend-developer [→]│  │ │ CONTENT (Scrollable)                   │
│  │  │ Vue.js frontend...    │  │ │ ┌────────────────────────────────────┐ │
│  │  └────────────────────────┘  │ │ │ YAML Frontmatter                   │ │
│  │                              │ │ │ ┌────────────────────────────────┐ │ │
│  └──────────────────────────────┘ │ │ │ name: backend-developer        │ │ │
│                                    │ │ │ description: Backend API...    │ │ │
│  ┌──────────────────────────────┐ │ │ │ capabilities:                  │ │ │
│  │ ⚡ Slash Commands (5)        │ │ │ │   - Express.js development     │ │ │
│  └──────────────────────────────┘ │ │ │   - Database design            │ │ │
│                                    │ │ └────────────────────────────────┘ │ │
│                                    │ │                                    │ │ │
│                                    │ │ Markdown Content                   │ │ │
│                                    │ │ ┌────────────────────────────────┐ │ │
│                                    │ │ │ # Backend Developer            │ │ │
│                                    │ │ │                                │ │ │
│                                    │ │ │ You are a backend specialist...│ │ │
│                                    │ │ │                                │ │ │
│                                    │ │ │ ## Responsibilities            │ │ │
│                                    │ │ │ - API design and development   │ │ │
│                                    │ │ │ - Database schema design       │ │ │
│                                    │ │ │                                │ │ │
│                                    │ │ └────────────────────────────────┘ │ │
│                                    │ └────────────────────────────────────┘ │
│                                    │                                        │
│                                    │ ACTIONS                                │
│                                    │ ┌────────────────────────────────────┐ │
│                                    │ │ [📋 Copy All]  [↓ Download]        │ │
│                                    │ └────────────────────────────────────┘ │
│                                    │                                        │
└────────────────────────────────────┴────────────────────────────────────────┘
```

## Side Panel Components

### Panel Container
- **Component:** PrimeVue `Sidebar`
- **Position:** Right
- **Width:** 40% of viewport (min 400px, max 600px)
- **Behavior:**
  - Slides in from right
  - Overlay dims left content
  - Closes on Escape key or clicking dimmed overlay
  - Closes on clicking X button

### Panel Header
- **Component:** Custom header with PrimeVue elements
- **Contents:**
  - Close button (X) - top right
  - Navigation buttons (< Prev | Next >) - if applicable
  - Icon + Item name (large, bold)
  - Item type badge (PrimeVue `Tag`)
  - File path (small, muted, truncated with tooltip)

### Panel Content (Scrollable)
- **Component:** Scrollable div with PrimeVue styling
- **Sections:**

#### 1. Metadata Section (If Applicable)
- Display key-value pairs
- Use PrimeVue `DataTable` or simple list
- Examples:
  - **Subagents:** name, description, capabilities
  - **Commands:** name, description, namespace
  - **Hooks:** event, pattern, command, source
  - **MCP:** name, transport, command, args

#### 2. YAML Frontmatter Section
- **Component:** PrimeVue `Panel` (collapsible)
- **Content:** Syntax-highlighted YAML
- **Features:**
  - Copy button for YAML only
  - Collapsed by default (expandable)
  - Syntax highlighting (using Prism.js or similar)

#### 3. Markdown Content Section
- **Component:** Rendered markdown with PrimeVue styling
- **Features:**
  - Full markdown rendering (headings, lists, code blocks, etc.)
  - Syntax highlighting for code blocks
  - Copy button for entire content
  - Preserve formatting and structure

#### 4. Raw Content Section (Optional)
- **Component:** PrimeVue `Panel` (collapsible)
- **Content:** Raw markdown text in monospace font
- **Features:**
  - Collapsed by default
  - "View Raw" toggle
  - Copy button for raw content

### Panel Footer (Actions)
- **Component:** Fixed footer with PrimeVue buttons
- **Actions:**
  - **Copy All:** Copy entire config to clipboard (PrimeVue `Button`)
  - **Download:** Download as .md file (PrimeVue `Button`)
  - **Edit:** (Phase 2) Link to edit mode
  - **Delete:** (Phase 2) Delete with confirmation

## Content Display by Config Type

### Subagents
```
Header:
  🤖 backend-developer
  Type: Subagent
  File: .claude/agents/backend-developer.md

Metadata:
  Name: backend-developer
  Description: Backend API development specialist

YAML Frontmatter (Collapsible):
  ---
  name: backend-developer
  description: Backend API development specialist
  capabilities:
    - Express.js development
    - Database design
    - REST API implementation
  ---

Markdown Content (Rendered):
  # Backend Developer

  You are a backend development specialist...

  ## Responsibilities
  - API design and implementation
  - Database schema design
  ...
```

### Slash Commands
```
Header:
  ⚡ /api-spec
  Type: Slash Command
  File: .claude/commands/api-spec.md

Metadata:
  Name: /api-spec
  Description: Generate API endpoint specifications
  Namespace: (none)

YAML Frontmatter (Collapsible - if present):
  ---
  description: Generate API endpoint specifications
  ---

Markdown Content (Rendered):
  # API Specification Generator

  This command generates comprehensive API...

  ## Usage
  /api-spec [endpoint-name]
  ...
```

### Hooks
```
Header:
  🪝 pre-commit
  Type: Hook
  Source: .claude/settings.json

Metadata:
  Name: pre-commit
  Event: beforeWrite
  Pattern: **/*.js
  Command: /lint
  Description: Run linter before writing JavaScript files

Configuration (JSON):
  {
    "event": "beforeWrite",
    "pattern": "**/*.js",
    "command": "/lint",
    "description": "Run linter before writing JavaScript files"
  }
```

### MCP Servers
```
Header:
  🔌 filesystem
  Type: MCP Server
  Source: .mcp.json

Metadata:
  Name: filesystem
  Transport: stdio
  Command: npx
  Arguments: @modelcontextprotocol/server-filesystem, /path/to/directory

Configuration (JSON):
  {
    "command": "npx",
    "args": [
      "@modelcontextprotocol/server-filesystem",
      "/path/to/directory"
    ]
  }

Environment Variables (if any):
  API_KEY: ***hidden***
  BASE_URL: https://api.example.com
```

## Interactions

### Opening Side Panel
1. User clicks "View Details" button on any item
2. Side panel slides in from right (300ms animation)
3. Main content area dims with overlay
4. Focus moves to side panel
5. Panel loads content:
   - Show skeleton/loading state
   - Fetch data if not cached
   - Render content with syntax highlighting

### Navigation Within Panel
1. **Prev/Next Buttons:**
   - Navigate through items in same category
   - Circular navigation (last item → first item)
   - Keyboard shortcuts: Ctrl+Left, Ctrl+Right
   - Update panel content without closing

2. **Scrolling:**
   - Content area scrollable independently
   - Scroll to top when changing items
   - Smooth scroll behavior

3. **Collapsible Sections:**
   - Click section header to expand/collapse
   - Save state in session storage
   - Animate expansion/collapse

### Closing Side Panel
1. Click X button in header
2. Click dimmed overlay
3. Press Escape key
4. Navigate away from view
5. Panel slides out (300ms animation)
6. Main content area undims

### Copy Actions
1. **Copy All:**
   - Copy entire config to clipboard
   - Show toast notification "Copied to clipboard"
   - Include YAML frontmatter + markdown content

2. **Copy Section:**
   - Copy button available for each section
   - YAML section: Copy YAML only
   - Markdown section: Copy rendered content as markdown
   - Configuration: Copy as JSON

3. **Copy Notification:**
   - PrimeVue `Toast` component
   - Position: Top-right
   - Duration: 3 seconds
   - Message: "Content copied to clipboard"

### Download Action
1. Click "Download" button
2. Generate .md file with full content
3. Download with filename: `{type}-{name}.md`
4. Include YAML frontmatter and markdown body
5. Show toast notification "Downloaded successfully"

## Loading States
- **Initial Load:** Show skeleton for panel content
- **Navigation:** Show loading spinner when switching items
- **Error:** Display error message with retry button

## Error States
- **File Not Found:** "Configuration file not found"
- **Parse Error:** "Unable to parse configuration" + error details
- **Network Error:** "Failed to load content" + retry button

## Responsive Behavior

### Desktop (1200px+)
- Panel width: 40% (min 400px, max 600px)
- Comfortable padding and spacing
- All features visible

### Laptop (768px - 1199px)
- Panel width: 50% (min 400px)
- Reduced padding
- All features remain accessible

### Tablet (600px - 767px)
- Panel width: 60%
- Compact layout
- May need to scroll more

### Mobile (< 600px)
- Panel width: 90% (full screen minus margins)
- Minimal padding
- Stack action buttons vertically
- Consider full-screen panel instead of sidebar

## Dark Mode Colors

### Side Panel
- **Background:** `#1e1e1e` (same as cards)
- **Border:** `#3e3e3e` (left border separating from main content)
- **Overlay Dim:** `rgba(0, 0, 0, 0.6)` (semi-transparent black)

### Panel Header
- **Background:** `#252525` (slightly lighter)
- **Border Bottom:** `#3e3e3e`
- **Text:** `#e0e0e0` (primary)
- **Type Badge:** Use type-specific colors (green, blue, orange, purple)

### Content Sections
- **Section Header Background:** `#2a2a2a`
- **Section Border:** `#3e3e3e`
- **Code Block Background:** `#1a1a1a` (darker)
- **Code Text:** `#e0e0e0` with syntax highlighting colors

### Syntax Highlighting (Code Blocks)
- **Keywords:** `#569CD6` (blue)
- **Strings:** `#CE9178` (orange)
- **Comments:** `#6A9955` (green)
- **Functions:** `#DCDCAA` (yellow)
- **Variables:** `#9CDCFE` (light blue)

### Action Buttons
- **Primary:** `#007ad9` background with `#ffffff` text
- **Secondary:** `#3e3e3e` background with `#e0e0e0` text
- **Hover:** Lighten by 10%

## Accessibility Notes

- Focus trap within side panel when open
- Escape key closes panel
- Tab navigation through interactive elements
- Skip link to close button
- ARIA labels for all buttons
- Screen reader announces panel opening/closing
- Keyboard shortcuts documented
- High contrast in dark mode (WCAG AA minimum)

## Notes

### Design Decisions

1. **Side Panel vs Modal:**
   - Side panel preserves context
   - Users can reference the list while viewing details
   - Better for comparing multiple items
   - More space for long content

2. **Collapsible Sections:**
   - YAML frontmatter collapsed by default (advanced users can expand)
   - Keeps initial view clean
   - Rendered markdown is primary content

3. **Navigation Buttons:**
   - Prev/Next allows efficient browsing
   - No need to close and reopen for each item
   - Improves workflow for reviewing multiple configs

4. **Copy Actions:**
   - Copy All is most common use case
   - Section-specific copy for advanced users
   - Toast notifications provide feedback

### Alternative Patterns Considered

#### Modal Dialog
- Pros: More focus, simpler implementation
- Cons: Loses context, feels heavy for repeated viewing, less space

#### Inline Expansion
- Pros: No overlay, fastest interaction
- Cons: Can't handle long content, disrupts list layout, confusing for multiple expansions

#### Full Page View
- Pros: Maximum space for content
- Cons: Completely loses context, requires back navigation, overkill for simple configs

### Open Questions for Project Manager

1. Should we support side-by-side comparison of two configs?
2. Should we add "Pin" functionality to keep panel open while navigating?
3. Should we show version history (if available from git)?
4. Should we add inline commenting or annotations for future phases?

### Implementation Notes for Frontend Developer

- Use PrimeVue `Sidebar` component with `position="right"` and `modal="true"`
- Implement keyboard navigation (Escape, Ctrl+Left/Right)
- Use Prism.js or Highlight.js for syntax highlighting
- Cache opened items to speed up navigation
- Implement smooth scroll and animations
- Use PrimeVue `Toast` for copy notifications
- Store collapsed/expanded state in sessionStorage
- Preload next/prev item content for faster navigation
- Ensure focus management for accessibility
- Test with very long content (1000+ lines)
