---
id: BUG-005
title: User configurations should be a card, first in the grid, slightly highlighted
severity: medium
category: ui/structure
status: open
created: 2025-10-21
---

## Problem Statement
User-level configurations should be displayed as a dedicated card that appears first in the configuration grid on the project detail page. This card should be slightly highlighted to distinguish it from project-level configuration cards.

## Acceptance Criteria
- [ ] User config displayed as a card in the grid
- [ ] User config card is first item in grid
- [ ] User config card has visual highlighting (different background or subtle border)
- [ ] User config card layout matches other configuration cards
- [ ] User config remains accessible on user configuration page
- [ ] Grid layout adjusts properly with user config card first
- [ ] Visual test confirms card positioning and styling
- [ ] No console errors or warnings

## Technical Details
**Components:** ProjectDetail.vue, UserConfigCard.vue (or create new)
**Files to Check:**
- `src/components/ProjectDetail.vue`
- `src/components/cards/` directory
- `src/styles/variables.css`

**Current Behavior:** User config displayed separately (not as card in grid)
**Expected Behavior:** User config as first card in grid with highlighting

## Visual Design
- Use slightly different background color than project cards
- Consider subtle border or shadow
- Maintain consistent size/spacing with other cards
- Could use gold/amber accent to distinguish

## Implementation Notes
- Create UserConfigCard component if not exists
- Update ProjectDetail to include user config card first in grid
- Ensure responsive layout
- Handle empty user config gracefully

## Testing Requirements
**Test File:** `tests/frontend/04-user-config-card.spec.js`
**Test Cases:**
1. User config card displays on project page
2. User config card is first in grid
3. User config card has highlighting
4. User config card content is accessible
5. Clicking user config card shows details
6. Grid layout responsive with user config card
7. User config page still accessible

## Deployment Notes
No breaking changes. Purely UI restructuring.
