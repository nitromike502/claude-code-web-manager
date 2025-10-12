# TASK-1.5.2: Design Dark Mode Color Scheme

**Epic:** EPIC-1
**Story:** Story 1.5 - Responsive & Dark Mode Design
**Status:** Pending
**Priority:** HIGH
**Assigned To:** wireframe-designer
**Dependencies:** TASK-1.5.1

## Description

Design the dark mode color scheme for the application. Choose a PrimeVue dark theme and define any custom color overrides needed to ensure readability and visual appeal.

## Acceptance Criteria

- [ ] PrimeVue dark theme selected
- [ ] Custom color overrides defined (if needed)
- [ ] Color contrast ratios verified (WCAG AA minimum)
- [ ] Syntax highlighting dark theme chosen
- [ ] Dark mode mockups created

## Implementation Notes

PrimeVue dark themes available:
- lara-dark (modern, rounded)
- vela-dark (material-inspired)
- arya-dark (vibrant colors)
- fluent-dark (Microsoft Fluent design)

Theme selection criteria:
- Readability for code/text heavy content
- Professional appearance
- Good contrast for status indicators
- Matches developer tool aesthetic

Color considerations:
- Background: Dark gray, not pure black (#1e1e1e, #2d2d2d)
- Text: Light gray, not pure white (#e0e0e0, #cccccc)
- Primary accent: Blue, green, or purple
- Success/error/warning: Standard semantic colors with good dark mode contrast
- Code blocks: Slightly lighter/darker than background

Syntax highlighting theme:
- VS Code Dark+ theme
- GitHub Dark theme
- Monokai
- One Dark

Contrast ratios (WCAG AA):
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

Custom overrides:
- Card backgrounds: Slightly lighter than page background
- Borders: Subtle gray, not pure black
- Shadows: Lighter shadows, not black
- Focus indicators: High contrast accent color

Dark mode toggle:
- Persistent (saved in localStorage)
- Icon in header (sun/moon icon)
- Default to system preference

## References

- PRD Section 3: UI Design Principles (dark mode support)
- CLAUDE.md: Dark mode implemented in Phase 1
- PrimeVue Theming documentation
