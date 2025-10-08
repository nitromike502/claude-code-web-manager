// User/Global View Component

export default {
  name: 'UserGlobal',
  template: `
    <div>
      <div class="main-content">
        <div class="user-info-bar">
          <div class="project-info-title">
            <i class="pi pi-user"></i>
            <span>User Configurations</span>
          </div>
          <div class="project-info-subtitle">~/.claude/ • Applies to all projects</div>
        </div>

        <div v-if="loading" class="loading-container">
          <ProgressSpinner />
        </div>

        <div v-else class="config-cards-container">
          <config-card
            title="User Subagents"
            icon="pi pi-users"
            icon-color="var(--color-agents)"
            type="agents"
            :items="agents"
            :loading="loadingAgents"
            @view-details="showDetail"
          />

          <config-card
            title="User Slash Commands"
            icon="pi pi-bolt"
            icon-color="var(--color-commands)"
            type="commands"
            :items="commands"
            :loading="loadingCommands"
            @view-details="showDetail"
          />

          <config-card
            title="User Hooks"
            icon="pi pi-link"
            icon-color="var(--color-hooks)"
            type="hooks"
            :items="hooks"
            :loading="loadingHooks"
            @view-details="showDetail"
          />

          <config-card
            title="User MCP Servers"
            icon="pi pi-server"
            icon-color="var(--color-mcp)"
            type="mcp"
            :items="mcpServers"
            :loading="loadingMCP"
            @view-details="showDetail"
          />
        </div>
      </div>

      <detail-sidebar
        v-model:visible="sidebarVisible"
        :item="selectedItem"
        :type="selectedType"
        :has-prev="hasPrev"
        :has-next="hasNext"
        @navigate-prev="navigatePrev"
        @navigate-next="navigateNext"
      />
    </div>
  `,
  data() {
    return {
      agents: [],
      commands: [],
      hooks: [],
      mcpServers: [],
      loading: true,
      loadingAgents: false,
      loadingCommands: false,
      loadingHooks: false,
      loadingMCP: false,
      sidebarVisible: false,
      selectedItem: null,
      selectedType: null,
      currentItems: [],
      currentIndex: -1,
    };
  },
  computed: {
    hasPrev() {
      return this.currentIndex > 0;
    },
    hasNext() {
      return this.currentIndex < this.currentItems.length - 1;
    },
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    async loadUserData() {
      this.loading = true;

      try {
        await Promise.all([
          this.loadAgents(),
          this.loadCommands(),
          this.loadHooks(),
          this.loadMCP(),
        ]);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        this.loading = false;
      }
    },

    async loadAgents() {
      this.loadingAgents = true;
      try {
        const data = await window.api.user.getAgents();
        this.agents = data.agents || [];
      } catch (err) {
        console.error('Error loading user agents:', err);
        this.agents = [];
      } finally {
        this.loadingAgents = false;
      }
    },

    async loadCommands() {
      this.loadingCommands = true;
      try {
        const data = await window.api.user.getCommands();
        this.commands = data.commands || [];
      } catch (err) {
        console.error('Error loading user commands:', err);
        this.commands = [];
      } finally {
        this.loadingCommands = false;
      }
    },

    async loadHooks() {
      this.loadingHooks = true;
      try {
        const data = await window.api.user.getHooks();
        this.hooks = data.hooks || [];
      } catch (err) {
        console.error('Error loading user hooks:', err);
        this.hooks = [];
      } finally {
        this.loadingHooks = false;
      }
    },

    async loadMCP() {
      this.loadingMCP = true;
      try {
        const data = await window.api.user.getMCP();
        this.mcpServers = data.mcpServers || [];
      } catch (err) {
        console.error('Error loading user MCP servers:', err);
        this.mcpServers = [];
      } finally {
        this.loadingMCP = false;
      }
    },

    showDetail({ item, type, items }) {
      this.selectedItem = item;
      this.selectedType = type;
      this.currentItems = items;
      this.currentIndex = items.findIndex(i => i === item);
      this.sidebarVisible = true;
    },

    navigatePrev() {
      if (this.hasPrev) {
        this.currentIndex--;
        this.selectedItem = this.currentItems[this.currentIndex];
      }
    },

    navigateNext() {
      if (this.hasNext) {
        this.currentIndex++;
        this.selectedItem = this.currentItems[this.currentIndex];
      }
    },
  },
};
