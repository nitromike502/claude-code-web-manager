---
id: BUG-009
title: Show More buttons should be centered at bottom of cards
severity: medium
category: ui/layout
status: completed
created: 2025-10-21
completed: 2025-10-21
---

## Problem Statement
The "Show More" buttons on configuration cards are not properly positioned. They should be centered horizontally and positioned at the bottom of their respective cards.

## Acceptance Criteria
- [ ] Show More buttons centered horizontally on all cards
- [ ] Show More buttons positioned at bottom of cards
- [ ] Buttons align consistently across all card types
- [ ] Button positioning works for cards with varying heights
- [ ] Responsive at all breakpoints
- [ ] Visual test confirms button alignment
- [ ] No console errors or warnings

## Technical Details
**Components:** AgentCard.vue, CommandCard.vue, HookCard.vue, MCPCard.vue
**Files to Check:**
- `src/components/cards/` directory
- Look for "Show More" button elements
- Card layout CSS

**Card Types:** Agents, Commands, Hooks, MCP Servers

**Current Behavior:** Show More buttons not consistently positioned
**Expected Behavior:** Buttons centered horizontally at card bottom

## Implementation Notes
- Use flexbox for card layout: `display: flex; flex-direction: column`
- Use `margin-top: auto` on button or wrapper to push to bottom
- Center button: `justify-content: center` on button container
- Ensure consistent styling across all card types

## Testing Requirements
**Test File:** `tests/frontend/04-show-more-button-positioning.spec.js`
**Test Cases:**
1. Show More button centered on agent card
2. Show More button centered on command card
3. Show More button centered on hook card
4. Show More button centered on MCP card
5. Show More button at bottom of all card types
6. Button alignment consistent across different card content lengths
7. Responsive positioning on mobile

## Deployment Notes
CSS-only change, purely visual refinement.
