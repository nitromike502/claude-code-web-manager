// CommandCard Component
// Displays slash commands in a card format

export default {
  name: 'CommandCard',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      commands: [],
      loading: true,
      error: null,
      visibleCount: 5,
      showingAll: false
    };
  },
  computed: {
    displayedCommands() {
      return this.showingAll ? this.commands : this.commands.slice(0, this.visibleCount);
    },
    remainingCount() {
      return this.commands.length - this.visibleCount;
    },
    hasMore() {
      return this.commands.length > this.visibleCount && !this.showingAll;
    }
  },
  async mounted() {
    await this.loadCommands();
  },
  methods: {
    async loadCommands() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`/api/projects/${this.projectId}/commands`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          this.commands = data.commands || [];
        } else {
          this.error = data.error || 'Failed to load commands';
        }
      } catch (err) {
        this.error = err.message || 'Failed to connect to server';
        console.error('Error loading commands:', err);
      } finally {
        this.loading = false;
      }
    },
    showAllCommands() {
      this.showingAll = true;
    },
    viewCommandDetails(command) {
      this.$emit('view-details', { command, type: 'command' });
    },
    formatCommandName(name) {
      // Add "/" prefix if not already present
      return name.startsWith('/') ? name : `/${name}`;
    }
  },
  template: `
    <div class="config-card command-card">
      <div class="card-header">
        <div class="card-title">
          <i class="fas fa-terminal card-icon"></i>
          <span>Slash Commands</span>
          <span v-if="!loading" class="count-badge">{{ commands.length }}</span>
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
          <button @click="loadCommands" class="btn-retry-small">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="commands.length === 0" class="empty-state">
          <i class="fas fa-terminal empty-icon"></i>
          <p>No slash commands configured</p>
        </div>

        <!-- Command List -->
        <div v-else class="command-list">
          <div
            v-for="command in displayedCommands"
            :key="command.name"
            class="command-item"
            :class="{ 'has-error': command.hasError }"
            @click="viewCommandDetails(command)"
          >
            <div class="command-info">
              <div class="command-name">
                <span>{{ formatCommandName(command.name) || 'Unnamed Command' }}</span>
                <i v-if="command.hasError" class="fas fa-exclamation-triangle error-icon" title="YAML parsing error"></i>
              </div>
              <div class="command-description">{{ command.description || 'No description available' }}</div>
            </div>
            <button class="btn-view-details">
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>

          <!-- Show More Button -->
          <button
            v-if="hasMore"
            @click="showAllCommands"
            class="btn-show-more"
          >
            Show {{ remainingCount }} more...
          </button>
        </div>
      </div>
    </div>
  `
};
