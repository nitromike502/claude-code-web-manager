# TASK-2.2.1: Create ConfigDetailSidebar Component

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.2 - Extract Sidebar Component
**Estimated Time:** 25 minutes
**Priority:** Critical
**Status:** Not Started

## Description

Create a reusable Vue component `ConfigDetailSidebar.vue` that displays detailed information about a selected configuration item. The sidebar must support type-aware metadata rendering for all four configuration types (agents, commands, hooks, MCP servers) and include navigation controls.

## Prerequisites

- ✅ Phase 2 Vite migration complete
- ✅ Story 2.1 complete (ConfigCard components)
- ✅ Understanding of current sidebar implementation in ProjectDetail.vue and UserGlobal.vue

## Acceptance Criteria

1. **Component Structure**
   - [ ] Create `src/components/sidebar/ConfigDetailSidebar.vue` file
   - [ ] Use Vue 3 Single File Component format
   - [ ] Include template, script, and scoped style sections

2. **Props Interface**
   - [ ] `item` (Object, required) - Selected configuration item
   - [ ] `type` (String, required) - Config type: 'agents' | 'commands' | 'hooks' | 'mcp'
   - [ ] `currentItems` (Array, required) - Full list for navigation
   - [ ] `currentIndex` (Number, required) - Current item index

3. **Sidebar Structure**
   - [ ] Close button (top-right)
   - [ ] Metadata section (type-aware fields)
   - [ ] Content preview section
   - [ ] Navigation controls (prev/next buttons)
   - [ ] Sidebar overlay/backdrop

4. **Type-Aware Metadata Display**
   - [ ] **Agents:** name, description, model, color, tools
   - [ ] **Commands:** name, description, usage
   - [ ] **Hooks:** event, script, conditions
   - [ ] **MCP Servers:** name, command, args, environment variables

5. **Navigation Controls**
   - [ ] Previous button (disabled on first item)
   - [ ] Next button (disabled on last item)
   - [ ] Item counter (e.g., "2 of 5")

6. **Events**
   - [ ] `@close` - Emitted when close button clicked
   - [ ] `@navigate` - Emitted when prev/next clicked (payload: direction)

7. **Styling**
   - [ ] Sidebar width: 75vw
   - [ ] Slide-in animation from right
   - [ ] Backdrop overlay
   - [ ] Responsive design

## Implementation Notes

### Component Template

```vue
<template>
  <!-- Backdrop -->
  <div class="sidebar-backdrop" @click="$emit('close')"></div>

  <!-- Sidebar -->
  <div class="detail-sidebar">
    <!-- Header with close button -->
    <div class="sidebar-header">
      <h3>{{ getTitle() }}</h3>
      <button class="close-btn" @click="$emit('close')">
        <i class="pi pi-times"></i>
      </button>
    </div>

    <!-- Metadata Section -->
    <div class="sidebar-content">
      <div class="metadata-section">
        <h4>Details</h4>

        <!-- Type-Aware Metadata Rendering -->
        <div class="metadata-fields">
          <!-- Agents Metadata -->
          <template v-if="type === 'agents'">
            <div v-if="item.name" class="metadata-field">
              <span class="field-label">Name:</span>
              <span class="field-value">{{ item.name }}</span>
            </div>
            <div v-if="item.description" class="metadata-field">
              <span class="field-label">Description:</span>
              <span class="field-value">{{ item.description }}</span>
            </div>
            <div v-if="item.model" class="metadata-field">
              <span class="field-label">Model:</span>
              <span class="field-value">{{ item.model }}</span>
            </div>
            <div v-if="item.color" class="metadata-field">
              <span class="field-label">Color:</span>
              <span class="field-value">
                <span class="color-preview" :style="{ backgroundColor: item.color }"></span>
                {{ item.color }}
              </span>
            </div>
            <div v-if="item.tools && item.tools.length > 0" class="metadata-field">
              <span class="field-label">Tools:</span>
              <span class="field-value">{{ item.tools.join(', ') }}</span>
            </div>
          </template>

          <!-- Commands Metadata -->
          <template v-else-if="type === 'commands'">
            <div v-if="item.name" class="metadata-field">
              <span class="field-label">Name:</span>
              <span class="field-value">{{ item.name }}</span>
            </div>
            <div v-if="item.usage" class="metadata-field">
              <span class="field-label">Usage:</span>
              <span class="field-value">{{ item.usage }}</span>
            </div>
            <div v-if="item.description" class="metadata-field">
              <span class="field-label">Description:</span>
              <span class="field-value">{{ item.description }}</span>
            </div>
          </template>

          <!-- Hooks Metadata -->
          <template v-else-if="type === 'hooks'">
            <div v-if="item.event" class="metadata-field">
              <span class="field-label">Event Type:</span>
              <span class="field-value">{{ item.event }}</span>
            </div>
            <div v-if="item.script" class="metadata-field">
              <span class="field-label">Script:</span>
              <span class="field-value code">{{ item.script }}</span>
            </div>
            <div v-if="item.when" class="metadata-field">
              <span class="field-label">Conditions:</span>
              <span class="field-value">{{ item.when }}</span>
            </div>
          </template>

          <!-- MCP Servers Metadata -->
          <template v-else-if="type === 'mcp'">
            <div v-if="item.name" class="metadata-field">
              <span class="field-label">Name:</span>
              <span class="field-value">{{ item.name }}</span>
            </div>
            <div v-if="item.command" class="metadata-field">
              <span class="field-label">Command:</span>
              <span class="field-value code">{{ item.command }}</span>
            </div>
            <div v-if="item.args && item.args.length > 0" class="metadata-field">
              <span class="field-label">Arguments:</span>
              <span class="field-value code">{{ item.args.join(' ') }}</span>
            </div>
            <div v-if="item.env && Object.keys(item.env).length > 0" class="metadata-field">
              <span class="field-label">Environment:</span>
              <div class="env-variables">
                <div v-for="(value, key) in item.env" :key="key" class="env-var">
                  <code>{{ key }}={{ value }}</code>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Content Preview Section -->
      <div v-if="item.content" class="content-section">
        <h4>Content</h4>
        <div class="content-preview" v-html="formatContent(item.content)"></div>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="sidebar-footer">
      <div class="nav-controls">
        <button
          class="nav-btn"
          :disabled="currentIndex === 0"
          @click="$emit('navigate', 'prev')"
        >
          <i class="pi pi-chevron-left"></i>
          Previous
        </button>

        <span class="item-counter">
          {{ currentIndex + 1 }} of {{ currentItems.length }}
        </span>

        <button
          class="nav-btn"
          :disabled="currentIndex === currentItems.length - 1"
          @click="$emit('navigate', 'next')"
        >
          Next
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
```

### Component Script

```vue
<script>
// You may want to use a markdown parser for content formatting
// import { marked } from 'marked';

export default {
  name: 'ConfigDetailSidebar',
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['agents', 'commands', 'hooks', 'mcp'].includes(value)
    },
    currentItems: {
      type: Array,
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'navigate'],
  methods: {
    getTitle() {
      const titleMap = {
        'agents': 'Subagent Details',
        'commands': 'Command Details',
        'hooks': 'Hook Details',
        'mcp': 'MCP Server Details'
      };
      return titleMap[this.type] || 'Details';
    },

    formatContent(content) {
      // Simple HTML escaping for now
      // In production, you'd want to use marked.js or similar
      return content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

      // With marked.js:
      // return marked(content);
    }
  }
};
</script>
```

### Component Styles

```vue
<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 75vw;
  height: 100vh;
  background: var(--surface-ground);
  border-left: 1px solid var(--surface-border);
  z-index: 999;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-section);
}

.sidebar-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: var(--surface-hover);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.metadata-section,
.content-section {
  margin-bottom: 2rem;
}

.metadata-section h4,
.content-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metadata-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metadata-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 600;
}

.field-value {
  font-size: 1rem;
  color: var(--text-color);
}

.field-value.code {
  font-family: 'Courier New', monospace;
  background: var(--surface-section);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.color-preview {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 3px;
  border: 1px solid var(--surface-border);
  vertical-align: middle;
  margin-right: 0.5rem;
}

.env-variables {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.env-var code {
  background: var(--surface-section);
  padding: 0.5rem;
  border-radius: 4px;
  display: block;
  font-size: 0.875rem;
}

.content-preview {
  background: var(--surface-section);
  padding: 1rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-color);
  max-height: 400px;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-section);
}

.nav-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: var(--primary-color-hover);
}

.nav-btn:disabled {
  background: var(--surface-border);
  color: var(--text-color-secondary);
  cursor: not-allowed;
  opacity: 0.5;
}

.item-counter {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-sidebar {
    width: 85vw;
  }
}

@media (max-width: 768px) {
  .detail-sidebar {
    width: 100vw;
  }
}
</style>
```

## Testing Checklist

### Manual Testing
- [ ] Sidebar slides in from right
- [ ] Backdrop overlay displays
- [ ] Close button closes sidebar
- [ ] Clicking backdrop closes sidebar
- [ ] Agent metadata displays correctly
- [ ] Command metadata displays correctly
- [ ] Hook metadata displays correctly
- [ ] MCP metadata displays correctly
- [ ] Previous button works
- [ ] Next button works
- [ ] Previous disabled on first item
- [ ] Next disabled on last item
- [ ] Item counter shows correct numbers
- [ ] Content preview displays
- [ ] Sidebar width is 75vw
- [ ] Responsive on tablet (85vw)
- [ ] Responsive on mobile (100vw)
- [ ] Dark mode styling correct
- [ ] Light mode styling correct

## Files to Create

- `/home/claude/manager/src/components/sidebar/ConfigDetailSidebar.vue`

## Dependencies

**Enables:**
- TASK-2.2.2 - Extract MetadataDisplay logic (optional refinement)
- TASK-2.2.3 - Refactor ProjectDetail sidebar
- TASK-2.2.4 - Refactor UserGlobal sidebar

## Success Indicators

1. Component renders without errors
2. All metadata fields display correctly
3. Navigation works smoothly
4. Styling matches design
5. Responsive behavior correct

## Related Tickets

**Part of Story:** STORY-2.2 (Extract Sidebar Component)
**Part of Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)

## Notes

This component includes the fixes for BUG-027 (agent color), BUG-028 (agent model), and BUG-029 (agent tools) by explicitly displaying these fields in the agents metadata template.
