// AgentCard Component
// Displays subagent information in a card format

export default {
  name: 'AgentCard',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      agents: [],
      loading: true,
      error: null,
      visibleCount: 5,
      showingAll: false
    };
  },
  computed: {
    displayedAgents() {
      return this.showingAll ? this.agents : this.agents.slice(0, this.visibleCount);
    },
    remainingCount() {
      return this.agents.length - this.visibleCount;
    },
    hasMore() {
      return this.agents.length > this.visibleCount && !this.showingAll;
    }
  },
  async mounted() {
    await this.loadAgents();
  },
  methods: {
    async loadAgents() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`/api/projects/${this.projectId}/agents`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          this.agents = data.agents || [];
        } else {
          this.error = data.error || 'Failed to load agents';
        }
      } catch (err) {
        this.error = err.message || 'Failed to connect to server';
        console.error('Error loading agents:', err);
      } finally {
        this.loading = false;
      }
    },
    showAllAgents() {
      this.showingAll = true;
    },
    viewAgentDetails(agent) {
      this.$emit('view-details', { agent, type: 'agent' });
    }
  },
  template: `
    <div class="config-card agent-card">
      <div class="card-header">
        <div class="card-title">
          <i class="fas fa-robot card-icon"></i>
          <span>Subagents</span>
          <span v-if="!loading" class="count-badge">{{ agents.length }}</span>
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
          <button @click="loadAgents" class="btn-retry-small">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="agents.length === 0" class="empty-state">
          <i class="fas fa-robot empty-icon"></i>
          <p>No subagents configured</p>
        </div>

        <!-- Agent List -->
        <div v-else class="agent-list">
          <div
            v-for="agent in displayedAgents"
            :key="agent.name"
            class="agent-item"
            :class="{ 'has-error': agent.hasError }"
            @click="viewAgentDetails(agent)"
          >
            <div class="agent-info">
              <div class="agent-name">
                <span>{{ agent.name || 'Unnamed Agent' }}</span>
                <i v-if="agent.hasError" class="fas fa-exclamation-triangle error-icon" title="YAML parsing error"></i>
              </div>
              <div class="agent-description">{{ agent.description || 'No description available' }}</div>
            </div>
            <button class="btn-view-details">
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>

          <!-- Show More Button -->
          <button
            v-if="hasMore"
            @click="showAllAgents"
            class="btn-show-more"
          >
            Show {{ remainingCount }} more...
          </button>
        </div>
      </div>
    </div>
  `
};
