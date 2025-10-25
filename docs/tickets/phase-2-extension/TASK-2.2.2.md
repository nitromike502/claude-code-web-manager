# TASK-2.2.2: Extract MetadataDisplay Logic

**Epic:** EPIC-4 (Phase 2 Extension - Component Refactoring)
**Story:** 2.2 - Extract Sidebar Component
**Estimated Time:** 15 minutes
**Priority:** Medium
**Status:** Not Started

## Description

Refine the metadata display logic in `ConfigDetailSidebar.vue` to ensure all fields are handled gracefully, including null/undefined values, and that the type-aware rendering is clean and maintainable.

## Prerequisites

- ✅ TASK-2.2.1 complete (ConfigDetailSidebar component created)

## Acceptance Criteria

1. **Graceful Null Handling**
   - [ ] All metadata fields check for null/undefined
   - [ ] Missing fields don't display (no empty labels)
   - [ ] No console errors for missing data

2. **Type Safety**
   - [ ] Proper validation for each field type
   - [ ] Arrays handled correctly (tools, args)
   - [ ] Objects handled correctly (env variables)

3. **Field Formatting**
   - [ ] Tools array displays as comma-separated list
   - [ ] Args array displays correctly
   - [ ] Environment variables display as key=value
   - [ ] Color preview displays with visual swatch

4. **Code Quality**
   - [ ] DRY principles applied
   - [ ] Reusable helper methods
   - [ ] Clean conditional rendering

## Implementation Notes

### Enhanced Metadata Rendering

```vue
<script>
export default {
  // ... existing code ...

  computed: {
    hasMetadata() {
      // Check if item has any displayable metadata
      const fields = this.getMetadataFields();
      return fields.some(field => this.hasValue(field.value));
    },

    metadataFields() {
      // Return type-specific metadata fields
      return this.getMetadataFields().filter(field => this.hasValue(field.value));
    }
  },

  methods: {
    hasValue(value) {
      // Check if value exists and is not empty
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    },

    getMetadataFields() {
      switch (this.type) {
        case 'agents':
          return [
            { label: 'Name', value: this.item.name },
            { label: 'Description', value: this.item.description },
            { label: 'Model', value: this.item.model },
            { label: 'Color', value: this.item.color, type: 'color' },
            { label: 'Tools', value: this.item.tools, type: 'array' }
          ];

        case 'commands':
          return [
            { label: 'Name', value: this.item.name },
            { label: 'Usage', value: this.item.usage },
            { label: 'Description', value: this.item.description }
          ];

        case 'hooks':
          return [
            { label: 'Event Type', value: this.item.event },
            { label: 'Script', value: this.item.script, type: 'code' },
            { label: 'Conditions', value: this.item.when }
          ];

        case 'mcp':
          return [
            { label: 'Name', value: this.item.name },
            { label: 'Command', value: this.item.command, type: 'code' },
            { label: 'Arguments', value: this.item.args, type: 'array' },
            { label: 'Environment', value: this.item.env, type: 'object' }
          ];

        default:
          return [];
      }
    },

    formatFieldValue(field) {
      if (!this.hasValue(field.value)) return '';

      switch (field.type) {
        case 'array':
          return Array.isArray(field.value) ? field.value.join(', ') : field.value;

        case 'object':
          return field.value; // Will be rendered specially in template

        case 'code':
        case 'color':
        default:
          return field.value;
      }
    }
  }
};
</script>
```

### Updated Template (Cleaner)

```vue
<template>
  <!-- ... header ... -->

  <div class="sidebar-content">
    <div v-if="hasMetadata" class="metadata-section">
      <h4>Details</h4>
      <div class="metadata-fields">
        <div
          v-for="field in metadataFields"
          :key="field.label"
          class="metadata-field"
        >
          <span class="field-label">{{ field.label }}:</span>

          <!-- Color field with preview -->
          <span v-if="field.type === 'color'" class="field-value">
            <span class="color-preview" :style="{ backgroundColor: field.value }"></span>
            {{ field.value }}
          </span>

          <!-- Array field -->
          <span v-else-if="field.type === 'array'" class="field-value">
            {{ formatFieldValue(field) }}
          </span>

          <!-- Object field (environment variables) -->
          <div v-else-if="field.type === 'object'" class="field-value">
            <div class="env-variables">
              <div v-for="(value, key) in field.value" :key="key" class="env-var">
                <code>{{ key }}={{ value }}</code>
              </div>
            </div>
          </div>

          <!-- Code field -->
          <span v-else-if="field.type === 'code'" class="field-value code">
            {{ field.value }}
          </span>

          <!-- Regular field -->
          <span v-else class="field-value">
            {{ field.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content preview - unchanged -->
  </div>

  <!-- ... footer ... -->
</template>
```

## Testing Checklist

- [ ] Missing fields don't display
- [ ] Null values handled gracefully
- [ ] Arrays display correctly
- [ ] Objects display correctly
- [ ] Color preview works
- [ ] No console errors

## Files to Modify

- `/home/claude/manager/src/components/sidebar/ConfigDetailSidebar.vue`

## Success Indicators

1. Cleaner template code
2. Better null handling
3. No duplicate logic
4. All tests still pass

## Related Tickets

**Part of Story:** STORY-2.2
**Depends On:** TASK-2.2.1

## Notes

This task refines the sidebar component for better maintainability. It's optional but recommended for code quality.
