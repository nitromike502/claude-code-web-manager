// MCPCard Component
// Displays MCP servers in a card format

export default {
  name: 'MCPCard',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      servers: [],
      loading: true,
      error: null,
      visibleCount: 5,
      showingAll: false
    };
  },
  computed: {
    displayedServers() {
      return this.showingAll ? this.servers : this.servers.slice(0, this.visibleCount);
    },
    remainingCount() {
      return this.servers.length - this.visibleCount;
    },
    hasMore() {
      return this.servers.length > this.visibleCount && !this.showingAll;
    }
  },
  async mounted() {
    await this.loadServers();
  },
  methods: {
    async loadServers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`/api/projects/${this.projectId}/mcp`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          this.servers = data.mcp || [];
        } else {
          this.error = data.error || 'Failed to load MCP servers';
        }
      } catch (err) {
        this.error = err.message || 'Failed to connect to server';
        console.error('Error loading MCP servers:', err);
      } finally {
        this.loading = false;
      }
    },
    showAllServers() {
      this.showingAll = true;
    },
    viewServerDetails(server) {
      this.$emit('view-details', { mcp: server, type: 'mcp' });
    },
    getScopeLabel(source) {
      // Determine scope from source
      return source && source.includes('settings') ? 'User' : 'Project';
    },
    getServerCommand(server) {
      // Format the full command with args
      if (!server.command) {
        return 'No command specified';
      }

      // Combine command with args
      if (server.args && Array.isArray(server.args) && server.args.length > 0) {
        return `${server.command} ${server.args.join(' ')}`;
      }

      return server.command;
    },
    getTransportType(server) {
      // Get transport type (stdio, sse, etc.)
      return server.type || server.transport || 'stdio';
    },
    getTransportBadgeClass(transport) {
      // Return appropriate CSS class for transport type
      return `transport-badge transport-${transport.toLowerCase()}`;
    }
  },
  template: `
    <div class="config-card mcp-card">
      <div class="card-header">
        <div class="card-title">
          <i class="fas fa-server card-icon"></i>
          <span>MCP Servers</span>
          <span v-if="!loading" class="count-badge">{{ servers.length }}</span>
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
          <button @click="loadServers" class="btn-retry-small">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="servers.length === 0" class="empty-state">
          <i class="fas fa-server empty-icon"></i>
          <p>No MCP servers configured</p>
        </div>

        <!-- Server List -->
        <div v-else class="mcp-list">
          <div
            v-for="(server, index) in displayedServers"
            :key="server.name + '-' + index"
            class="mcp-item"
            @click="viewServerDetails(server)"
          >
            <div class="mcp-info">
              <div class="mcp-header">
                <div class="mcp-name">{{ server.name }}</div>
                <div class="mcp-badges">
                  <span :class="getTransportBadgeClass(getTransportType(server))">
                    {{ getTransportType(server) }}
                  </span>
                  <span v-if="server.source" class="scope-badge" :class="'scope-' + (server.source.includes('settings') ? 'user' : 'project')">
                    {{ getScopeLabel(server.source) }}
                  </span>
                </div>
              </div>
              <div class="mcp-command">{{ getServerCommand(server) }}</div>
            </div>
            <button class="btn-view-details">
              <i class="fas fa-eye"></i>
              View Details
            </button>
          </div>

          <!-- Show More Button -->
          <button
            v-if="hasMore"
            @click="showAllServers"
            class="btn-show-more"
          >
            Show {{ remainingCount }} more...
          </button>
        </div>
      </div>
    </div>
  `
};
