// Config Card Component

export default {
  name: 'ConfigCard',
  template: `
    <Card class="config-card">
      <template #header>
        <div class="config-header">
          <div class="config-header-left">
            <i :class="icon" :style="{ color: iconColor }"></i>
            <span class="config-title">{{ title }} ({{ items.length }})</span>
          </div>
          <div class="config-header-right">
            <Button
              :label="expandedAll ? 'Collapse All' : 'Expand All'"
              text
              size="small"
              @click="toggleExpandAll"
              v-if="items.length > 0"
            />
          </div>
        </div>
      </template>

      <template #content>
        <div v-if="loading" class="loading-container">
          <Skeleton height="60px" class="mb-2"></Skeleton>
          <Skeleton height="60px" class="mb-2"></Skeleton>
          <Skeleton height="60px"></Skeleton>
        </div>

        <div v-else-if="items.length === 0" class="empty-state">
          <i :class="icon" style="font-size: 3rem; opacity: 0.3;"></i>
          <p>No {{ title.toLowerCase() }} configured</p>
        </div>

        <div v-else>
          <config-item
            v-for="(item, index) in displayedItems"
            :key="index"
            :item="item"
            :type="type"
            @view-details="handleViewDetails(item)"
          />

          <Button
            v-if="hasMore"
            :label="'Show ' + remainingCount + ' more...'"
            text
            class="show-more-btn"
            @click="showAll"
          />
        </div>
      </template>
    </Card>
  `,
  props: {
    title: String,
    icon: String,
    iconColor: String,
    type: String,
    items: Array,
    loading: Boolean,
    initialDisplayCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      expandedAll: false,
      showingAll: false,
    };
  },
  computed: {
    displayedItems() {
      if (this.showingAll) return this.items;
      return this.items.slice(0, this.initialDisplayCount);
    },
    hasMore() {
      return this.items.length > this.initialDisplayCount && !this.showingAll;
    },
    remainingCount() {
      return this.items.length - this.initialDisplayCount;
    },
  },
  methods: {
    toggleExpandAll() {
      this.expandedAll = !this.expandedAll;
      this.$emit('expand-all', this.expandedAll);
    },
    showAll() {
      this.showingAll = true;
    },
    handleViewDetails(item) {
      this.$emit('view-details', {
        item,
        type: this.type,
        items: this.items,
      });
    },
  },
};
