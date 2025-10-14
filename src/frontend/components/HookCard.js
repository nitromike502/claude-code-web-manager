// HookCard Component
// Displays hooks in a card format

export default {
  name: 'HookCard',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hooks: [],
      loading: true,
      error: null,
      visibleCount: 5,
      showingAll: false
    };
  },
  computed: {
    displayedHooks() {
      return this.showingAll ? this.hooks : this.hooks.slice(0, this.visibleCount);
    },
    remainingCount() {
      return this.hooks.length - this.visibleCount;
    },
    hasMore() {
      return this.hooks.length > this.visibleCount && !this.showingAll;
    }
  },
  async mounted() {
    await this.loadHooks();
  },
  methods: {
    async loadHooks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`/api/projects/${this.projectId}/hooks`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          this.hooks = data.hooks || [];
        } else {
          this.error = data.error || 'Failed to load hooks';
        }
      } catch (err) {
        this.error = err.message || 'Failed to connect to server';
        console.error('Error loading hooks:', err);
      } finally {
        this.loading = false;
      }
    },
    showAllHooks() {
      this.showingAll = true;
    },
    viewHookDetails(hook) {
      this.$emit('view-details', { hook, type: 'hook' });
    },
    formatEventName(event) {
      // Convert PascalCase to readable format (e.g., "UserPromptSubmit" -> "User Prompt Submit")
      return event
        .replace(/([A-Z])/g, ' $1')
        .trim();
    },
    getScopeLabel(source) {
      // Determine scope from source
      return source && source.includes('user') ? 'User' : 'Project';
    },
    getHookCommands(hook) {
      // Extract commands from hook.hooks array
      if (!hook.hooks || !Array.isArray(hook.hooks)) {
        return [];
      }
      return hook.hooks.map(h => h.command).filter(cmd => cmd);
    },
    getPrimaryCommand(hook) {
      // Get the first command from the hooks array
      const commands = this.getHookCommands(hook);
      return commands[0] || 'No command';
    },
    getCommandCount(hook) {
      // Get count of commands in the hooks array
      return this.getHookCommands(hook).length;
    }
  },
  template: `
    <div class="config-card hook-card">
      <div class="card-header">
        <div class="card-title">
          <i class="fas fa-plug card-icon"></i>
          <span>Hooks</span>
          <span v-if="!loading" class="count-badge">{{ hooks.length }}</span>
        </div>
      </div>

      <div class="card-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-skeleton">
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="loadHooks" class="btn-retry-small">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="hooks.length === 0" class="empty-state">
          <i class="fas fa-plug empty-icon"></i>
          <p>No hooks configured</p>
        </div>

        <!-- Hook List -->
        <div v-else class="hook-list">
          <div
            v-for="(hook, index) in displayedHooks"
            :key="hook.event + '-' + index"
            class="hook-item"
            @click="viewHookDetails(hook)"
          >
            <div class="hook-info">
              <div class="hook-header">
                <div class="hook-event">{{ formatEventName(hook.event) }}</div>
                <span v-if="hook.source" class="scope-badge" :class="'scope-' + (hook.source.includes('user') ? 'user' : 'project')">
                  {{ getScopeLabel(hook.source) }}
                </span>
              </div>
              <div class="hook-command">{{ getPrimaryCommand(hook) }}</div>
              <div v-if="getCommandCount(hook) > 1" class="hook-description">
                +{{ getCommandCount(hook) - 1 }} more command{{ getCommandCount(hook) > 2 ? 's' : '' }}
              </div>
            </div>
            <button class="btn-view-details">
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>

          <!-- Show More Button -->
          <button
            v-if="hasMore"
            @click="showAllHooks"
            class="btn-show-more"
          >
            Show {{ remainingCount }} more...
          </button>
        </div>
      </div>
    </div>
  `
};
