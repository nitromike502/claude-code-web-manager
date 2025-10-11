// Dashboard View Component

export default {
  name: 'Dashboard',
  template: `
    <div>
      <div class="main-content">
        <div class="mb-3" style="max-width: 1400px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2>Projects</h2>
            <div style="display: flex; gap: 0.75rem;">
              <Dropdown
                v-model="sortBy"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Sort by..."
                style="width: 200px;"
              />
              <Button
                icon="pi pi-refresh"
                label="Rescan"
                :loading="scanning"
                @click="handleRescan"
              />
            </div>
          </div>

          <div v-if="loading" class="loading-container">
            <ProgressSpinner />
          </div>

          <div v-else-if="error" class="error-state">
            <h4>Error Loading Projects</h4>
            <p>{{ error }}</p>
            <Button label="Retry" @click="loadProjects" severity="danger" class="mt-2" />
          </div>

          <div v-else-if="filteredProjects.length === 0" class="empty-state">
            <i class="pi pi-folder"></i>
            <h3>No Projects Found</h3>
            <p>Add projects in Claude Code and click "Rescan" to see them here.</p>
          </div>

          <div v-else class="project-grid">
            <Card
              v-for="project in filteredProjects"
              :key="project.id"
              class="project-card"
              @click="navigateToProject(project.id)"
            >
              <template #header>
                <div class="project-header">
                  <i :class="project.isUser ? 'pi pi-user' : 'pi pi-folder'"></i>
                  <h3 class="project-name">{{ project.name }}</h3>
                </div>
              </template>

              <template #subtitle>
                <div class="project-path">{{ project.path }}</div>
              </template>

              <template #content>
                <div class="project-stats">
                  <div class="stat stat-agents">
                    <i class="pi pi-users"></i>
                    <span>{{ project.stats.agents }} Agents</span>
                  </div>
                  <div class="stat stat-commands">
                    <i class="pi pi-bolt"></i>
                    <span>{{ project.stats.commands }} Commands</span>
                  </div>
                  <div class="stat stat-hooks">
                    <i class="pi pi-link"></i>
                    <span>{{ project.stats.hooks }} Hooks</span>
                  </div>
                  <div class="stat stat-mcp">
                    <i class="pi pi-server"></i>
                    <span>{{ project.stats.mcp }} MCP</span>
                  </div>
                </div>
              </template>

              <template #footer>
                <Button label="View" icon="pi pi-arrow-right" iconPos="right" style="width: 100%;" />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      projects: [],
      userConfig: null,
      loading: false,
      scanning: false,
      error: null,
      searchQuery: '',
      sortBy: 'name-asc',
      sortOptions: [
        { label: 'Name (A-Z)', value: 'name-asc' },
        { label: 'Name (Z-A)', value: 'name-desc' },
        { label: 'Most Agents', value: 'agents' },
        { label: 'Most Commands', value: 'commands' },
      ],
    };
  },
  computed: {
    filteredProjects() {
      if (!Array.isArray(this.projects)) {
        return [];
      }
      let filtered = [...this.projects];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(query) || p.path.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      switch (this.sortBy) {
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'agents':
          filtered.sort((a, b) => b.stats.agents - a.stats.agents);
          break;
        case 'commands':
          filtered.sort((a, b) => b.stats.commands - a.stats.commands);
          break;
      }

      // Prepend user configuration as first card if available
      if (this.userConfig) {
        filtered.unshift(this.userConfig);
      }

      return filtered;
    },
  },
  mounted() {
    this.loadProjects();
    this.loadUserConfig();

    // Listen for search from header
    window.addEventListener('header-search', (e) => {
      this.searchQuery = e.detail;
    });
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      this.error = null;

      try {
        const data = await window.api.projects.getAll();
        this.projects = data.projects || [];
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async loadUserConfig() {
      try {
        const stats = await window.api.user.getStats();
        this.userConfig = {
          id: 'user',
          name: 'User Configurations',
          path: '~/.claude',
          stats,
          isUser: true,
        };
      } catch (err) {
        console.error('Failed to load user config:', err);
        // Don't set error state, just skip user config card
      }
    },

    async handleRescan() {
      this.scanning = true;

      try {
        await window.api.projects.scan();
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Projects rescanned successfully',
          life: 3000,
        });
        await this.loadProjects();
        await this.loadUserConfig();
      } catch (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 5000,
        });
      } finally {
        this.scanning = false;
      }
    },

    navigateToProject(projectId) {
      if (projectId === 'user') {
        window.router.navigate('/user');
      } else {
        window.router.navigate(`/project/${projectId}`);
      }
    },
  },
};
