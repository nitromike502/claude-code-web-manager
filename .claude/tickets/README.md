# Bug Tickets & Epic

**EPIC-001** - Phase 2 Migration Bug Fixes (all 16 bugs grouped as one coordinated effort)

All 16 bugs from the Phase 2 migration build review are documented here as structured tickets, organized under a master Epic for efficient `/swarm` orchestration.

## Epic

| ID | Title | Type | Status |
|---|---|---|---|
| EPIC-001 | Phase 2 Migration Bug Fixes - Complete Build Review Resolution | Epic | open |

This Epic groups all 16 individual bug tickets into a coordinated effort. When you run `/swarm`, it will recognize this Epic and coordinate all work accordingly.

## Quick Reference - Individual Bugs

| ID | Title | Severity | Category | Status |
|---|---|---|---|---|
| BUG-001 | Theme toggle button text remains dark in dark mode | high | ui/styling | open |
| BUG-002 | Navigation and close icons in sidebar are black in dark mode | high | ui/styling | open |
| BUG-003 | Remove navigation that shouldn't exist | medium | ui/structure | open |
| BUG-004 | Add breadcrumbs below the header | medium | ui/navigation | open |
| BUG-005 | User configurations should be a card, first in grid | medium | ui/structure | open |
| BUG-006 | Remove Copy button in sidebar | low | ui/refinement | open |
| BUG-007 | Sidebar should be minimum 75% window width | medium | ui/layout | open |
| BUG-008 | Sidebar should close when clicking outside | medium | ui/behavior | open |
| BUG-009 | Show More buttons should be centered at bottom of cards | medium | ui/layout | open |
| BUG-010 | Hooks not fully populating in sidebar | high | data/parser | open |
| BUG-011 | Agent parser skips agents with invalid YAML frontmatter | high | parser/robustness | open |
| BUG-012 | Ensure other parsers handle invalid YAML like agent parser | high | parser/consistency | open |
| BUG-013 | Allowed Tools not shown in sidebar for Agents | medium | data-display | open |
| BUG-014 | Verify Allowed Tools shown in sidebar for Slash Commands | medium | data-display | open |
| BUG-015 | MCP Servers not loading on project view page | high | data-loading | open |
| BUG-016 | Defined color for agents not shown in sidebar | medium | data-display | open |

## Execution Groups

### Group 1: UI/Styling (Parallel)
- BUG-001: Theme toggle button text
- BUG-002: Sidebar icons color
- BUG-007: Sidebar minimum width
- BUG-009: Show More button positioning

### Group 2: Navigation/Structure (Dependent)
- BUG-003: Remove navigation
- BUG-004: Add breadcrumbs
- BUG-005: User config as first card
- BUG-008: Sidebar close on outside click

### Group 3: Parser/Data Issues (Parallel)
- BUG-010: Hooks population
- BUG-011: Agent parser YAML handling
- BUG-012: Other parsers YAML consistency
- BUG-015: MCP servers loading

### Group 4: Data Display (Parallel)
- BUG-006: Remove Copy button
- BUG-013: Allowed Tools for Agents
- BUG-014: Allowed Tools for Commands
- BUG-016: Agent color indicator

## File Structure

```
.claude/tickets/
├── README.md (this file)
├── BUG-001-theme-toggle-button-text.md
├── BUG-002-sidebar-icons-dark-mode.md
├── BUG-003-remove-navigation.md
├── BUG-004-add-breadcrumbs.md
├── BUG-005-user-config-first-card.md
├── BUG-006-remove-copy-button.md
├── BUG-007-sidebar-minimum-width.md
├── BUG-008-sidebar-close-outside-click.md
├── BUG-009-show-more-button-positioning.md
├── BUG-010-hooks-population.md
├── BUG-011-agent-parser-yaml-handling.md
├── BUG-012-parsers-yaml-consistency.md
├── BUG-013-agent-allowed-tools-display.md
├── BUG-014-command-allowed-tools-verify.md
├── BUG-015-mcp-servers-loading.md
└── BUG-016-agent-color-indicator.md
```

## How to Work on Tickets

1. **Read the ticket** - Open the relevant ticket file
2. **Review acceptance criteria** - Understand what "done" looks like
3. **Check technical details** - See which files need changes
4. **Implement the fix** - Make code changes
5. **Add tests** - Create test file specified in ticket
6. **Verify tests pass** - Run `npm test` to validate
7. **Update ticket status** - Mark as `completed` in ticket file

## Dependencies

- **BUG-011** → **BUG-012**: Parser consistency depends on agent parser fix
- **BUG-004** and **BUG-005** → **BUG-008**: Navigation structure affects outside-click behavior
- Most other tickets are independent

## Test Files to Create

```
tests/frontend/
├── 04-theme-toggle-contrast.spec.js (BUG-001)
├── 04-sidebar-icons-visibility.spec.js (BUG-002)
├── 04-navigation-removal.spec.js (BUG-003)
├── 04-breadcrumbs.spec.js (BUG-004)
├── 04-user-config-card.spec.js (BUG-005)
├── 04-sidebar-copy-button-removal.spec.js (BUG-006)
├── 04-sidebar-width.spec.js (BUG-007)
├── 04-sidebar-outside-click-close.spec.js (BUG-008)
├── 04-show-more-button-positioning.spec.js (BUG-009)
├── 04-hooks-population.spec.js (BUG-010)
├── 04-agent-allowed-tools-display.spec.js (BUG-013)
├── 04-command-allowed-tools-verify.spec.js (BUG-014)
├── 04-mcp-servers-loading.spec.js (BUG-015)
└── 04-agent-color-indicator.spec.js (BUG-016)

tests/backend/
├── agents-parser-yaml-recovery.test.js (BUG-011)
├── commands-parser-yaml-recovery.test.js (BUG-012)
├── hooks-parser-yaml-recovery.test.js (BUG-012)
└── mcp-parser-yaml-recovery.test.js (BUG-012)
```

## Status Legend

- `open` - Not started
- `in_progress` - Currently being worked on
- `blocked` - Waiting on something else
- `completed` - Done and tested
