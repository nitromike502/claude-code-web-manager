<template>
  <div class="user-global">
    <div class="main-content">
      <!-- User Info Bar -->
      <div class="user-info-bar">
        <div class="user-info-title">
          <i class="pi pi-user"></i>
          <span>User Configurations</span>
        </div>
        <div class="user-info-subtitle">~/.claude</div>
      </div>

      <!-- Breadcrumbs -->
      <div class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">
          <i class="pi pi-home"></i>
          Dashboard
        </router-link>
        <i class="pi pi-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-current">User Configurations</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading user configurations...</p>
      </div>

      <!-- Config Cards Container -->
      <div v-else class="config-cards-container">
        <!-- Agents Card -->
        <div class="config-card agents-card">
          <div class="config-header">
            <div class="config-header-left">
              <i class="pi pi-users" style="color: var(--color-agents)"></i>
              <span class="config-title">Subagents ({{ agents.length }})</span>
            </div>
            <div class="config-header-right">
              <button
                v-if="agents.length > initialDisplayCount"
                @click="showingAllAgents = !showingAllAgents"
                class="expand-btn"
              >
                {{ showingAllAgents ? 'Show Less' : `Show ${agents.length - initialDisplayCount} more...` }}
              </button>
            </div>
          </div>

          <div v-if="loadingAgents" class="loading-state">
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
          </div>

          <div v-else-if="agents.length === 0" class="empty-state">
            <i class="pi pi-users"></i>
            <p>No user subagents configured</p>
          </div>

          <div v-else class="items-list">
            <div
              v-for="(agent, index) in displayedAgents"
              :key="index"
              class="config-item"
              @click="showDetail(agent, 'agents', agents)"
            >
              <div class="item-content">
                <div class="item-name">{{ agent.name }}</div>
                <div class="item-description">{{ agent.description || 'No description available' }}</div>
              </div>
              <button class="view-details-btn" @click.stop="showDetail(agent, 'agents', agents)">
                <i class="pi pi-eye"></i>
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Commands Card -->
        <div class="config-card commands-card">
          <div class="config-header">
            <div class="config-header-left">
              <i class="pi pi-bolt" style="color: var(--color-commands)"></i>
              <span class="config-title">Slash Commands ({{ commands.length }})</span>
            </div>
            <div class="config-header-right">
              <button
                v-if="commands.length > initialDisplayCount"
                @click="showingAllCommands = !showingAllCommands"
                class="expand-btn"
              >
                {{ showingAllCommands ? 'Show Less' : `Show ${commands.length - initialDisplayCount} more...` }}
              </button>
            </div>
          </div>

          <div v-if="loadingCommands" class="loading-state">
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
          </div>

          <div v-else-if="commands.length === 0" class="empty-state">
            <i class="pi pi-bolt"></i>
            <p>No user slash commands configured</p>
          </div>

          <div v-else class="items-list">
            <div
              v-for="(cmd, index) in displayedCommands"
              :key="index"
              class="config-item"
              @click="showDetail(cmd, 'commands', commands)"
            >
              <div class="item-content">
                <div class="item-name">{{ cmd.name }}</div>
                <div class="item-description">{{ cmd.description || 'No description available' }}</div>
              </div>
              <button class="view-details-btn" @click.stop="showDetail(cmd, 'commands', commands)">
                <i class="pi pi-eye"></i>
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- Hooks Card -->
        <div class="config-card hooks-card">
          <div class="config-header">
            <div class="config-header-left">
              <i class="pi pi-link" style="color: var(--color-hooks)"></i>
              <span class="config-title">Hooks ({{ hooks.length }})</span>
            </div>
            <div class="config-header-right">
              <button
                v-if="hooks.length > initialDisplayCount"
                @click="showingAllHooks = !showingAllHooks"
                class="expand-btn"
              >
                {{ showingAllHooks ? 'Show Less' : `Show ${hooks.length - initialDisplayCount} more...` }}
              </button>
            </div>
          </div>

          <div v-if="loadingHooks" class="loading-state">
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
          </div>

          <div v-else-if="hooks.length === 0" class="empty-state">
            <i class="pi pi-link"></i>
            <p>No user hooks configured</p>
          </div>

          <div v-else class="items-list">
            <div
              v-for="(hook, index) in displayedHooks"
              :key="index"
              class="config-item"
              @click="showDetail(hook, 'hooks', hooks)"
            >
              <div class="item-content">
                <div class="item-name">{{ hook.name || hook.event }}</div>
                <div class="item-description">Event: {{ hook.event || 'N/A' }} • Pattern: {{ hook.pattern || 'N/A' }}</div>
              </div>
              <button class="view-details-btn" @click.stop="showDetail(hook, 'hooks', hooks)">
                <i class="pi pi-eye"></i>
                View Details
              </button>
            </div>
          </div>
        </div>

        <!-- MCP Servers Card -->
        <div class="config-card mcp-card">
          <div class="config-header">
            <div class="config-header-left">
              <i class="pi pi-server" style="color: var(--color-mcp)"></i>
              <span class="config-title">MCP Servers ({{ mcpServers.length }})</span>
            </div>
            <div class="config-header-right">
              <button
                v-if="mcpServers.length > initialDisplayCount"
                @click="showingAllMcp = !showingAllMcp"
                class="expand-btn"
              >
                {{ showingAllMcp ? 'Show Less' : `Show ${mcpServers.length - initialDisplayCount} more...` }}
              </button>
            </div>
          </div>

          <div v-if="loadingMCP" class="loading-state">
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
          </div>

          <div v-else-if="mcpServers.length === 0" class="empty-state">
            <i class="pi pi-server"></i>
            <p>No user MCP servers configured</p>
          </div>

          <div v-else class="items-list">
            <div
              v-for="(server, index) in displayedMcp"
              :key="index"
              class="config-item"
              @click="showDetail(server, 'mcp', mcpServers)"
            >
              <div class="item-content">
                <div class="item-name">{{ server.name }}</div>
                <div class="item-description">Transport: {{ server.transport || 'N/A' }} • Command: {{ server.command || 'N/A' }}</div>
              </div>
              <button class="view-details-btn" @click.stop="showDetail(server, 'mcp', mcpServers)">
                <i class="pi pi-eye"></i>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Overlay -->
    <div v-if="sidebarVisible" class="sidebar-overlay" @click="sidebarVisible = false"></div>

    <!-- Detail Sidebar -->
    <div v-if="sidebarVisible" class="sidebar" @click.stop>
      <div class="sidebar-header">
        <div class="sidebar-header-title">
          <i :class="typeIcon" :style="{ color: typeColor }"></i>
          <span>{{ selectedItem?.name || selectedItem?.event || 'Item Details' }}</span>
        </div>
        <div class="sidebar-nav">
          <button @click="navigatePrev" :disabled="!hasPrev" class="nav-btn">
            <i class="pi pi-chevron-left"></i>
          </button>
          <button @click="navigateNext" :disabled="!hasNext" class="nav-btn">
            <i class="pi pi-chevron-right"></i>
          </button>
          <button @click="sidebarVisible = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="sidebar-section">
          <h4>Metadata</h4>
          <div v-if="selectedType === 'agents'">
            <p><strong>Name:</strong> {{ selectedItem.name }}</p>
            <p><strong>Description:</strong> {{ selectedItem.description }}</p>
            <p v-if="selectedItem.tools && selectedItem.tools.length > 0">
              <strong>Allowed Tools:</strong> {{ selectedItem.tools.join(', ') }}
            </p>
            <p v-else-if="selectedItem.tools && selectedItem.tools.length === 0">
              <strong>Allowed Tools:</strong> None specified
            </p>
          </div>
          <div v-else-if="selectedType === 'commands'">
            <p><strong>Name:</strong> {{ selectedItem.name }}</p>
            <p><strong>Description:</strong> {{ selectedItem.description }}</p>
            <p v-if="selectedItem.namespace"><strong>Namespace:</strong> {{ selectedItem.namespace }}</p>
            <p v-if="selectedItem.tools && selectedItem.tools.length > 0">
              <strong>Allowed Tools:</strong> {{ selectedItem.tools.join(', ') }}
            </p>
            <p v-else-if="selectedItem.tools && selectedItem.tools.length === 0">
              <strong>Allowed Tools:</strong> None specified
            </p>
          </div>
          <div v-else-if="selectedType === 'hooks'">
            <p><strong>Event:</strong> {{ selectedItem.event }}</p>
            <p><strong>Pattern:</strong> {{ selectedItem.pattern }}</p>
            <p v-if="selectedItem.command"><strong>Command:</strong> {{ selectedItem.command }}</p>
          </div>
          <div v-else-if="selectedType === 'mcp'">
            <p><strong>Name:</strong> {{ selectedItem.name }}</p>
            <p><strong>Transport:</strong> {{ selectedItem.transport }}</p>
            <p v-if="selectedItem.command"><strong>Command:</strong> {{ selectedItem.command }}</p>
          </div>
        </div>

        <div v-if="selectedItem?.content" class="sidebar-section">
          <h4>Content</h4>
          <pre class="content-preview">{{ selectedItem.content }}</pre>
        </div>
      </div>

      <div class="sidebar-footer">
        <button @click="sidebarVisible = false" class="action-btn close-action-btn">
          <i class="pi pi-times"></i>
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { userAPI } from '../frontend/js/api'

export default {
  name: 'UserGlobal',
  setup() {
    const agents = ref([])
    const commands = ref([])
    const hooks = ref([])
    const mcpServers = ref([])

    const loading = ref(true)
    const loadingAgents = ref(false)
    const loadingCommands = ref(false)
    const loadingHooks = ref(false)
    const loadingMCP = ref(false)

    const initialDisplayCount = 5
    const showingAllAgents = ref(false)
    const showingAllCommands = ref(false)
    const showingAllHooks = ref(false)
    const showingAllMcp = ref(false)

    const sidebarVisible = ref(false)
    const selectedItem = ref(null)
    const selectedType = ref(null)
    const currentItems = ref([])
    const currentIndex = ref(-1)

    // Computed: displayed items with show more/less
    const displayedAgents = computed(() => {
      return showingAllAgents.value ? agents.value : agents.value.slice(0, initialDisplayCount)
    })

    const displayedCommands = computed(() => {
      return showingAllCommands.value ? commands.value : commands.value.slice(0, initialDisplayCount)
    })

    const displayedHooks = computed(() => {
      return showingAllHooks.value ? hooks.value : hooks.value.slice(0, initialDisplayCount)
    })

    const displayedMcp = computed(() => {
      return showingAllMcp.value ? mcpServers.value : mcpServers.value.slice(0, initialDisplayCount)
    })

    // Computed: sidebar navigation
    const hasPrev = computed(() => currentIndex.value > 0)
    const hasNext = computed(() => currentIndex.value < currentItems.value.length - 1)

    const typeIcon = computed(() => {
      const icons = {
        agents: 'pi pi-users',
        commands: 'pi pi-bolt',
        hooks: 'pi pi-link',
        mcp: 'pi pi-server'
      }
      return icons[selectedType.value] || 'pi pi-file'
    })

    const typeColor = computed(() => {
      // For agents, use the defined color if available
      if (selectedType.value === 'agents' && selectedItem.value?.color) {
        return selectedItem.value.color
      }

      // Otherwise use default type colors
      const colors = {
        agents: 'var(--color-agents)',
        commands: 'var(--color-commands)',
        hooks: 'var(--color-hooks)',
        mcp: 'var(--color-mcp)'
      }
      return colors[selectedType.value] || 'var(--text-primary)'
    })

    // Load user data
    const loadUserData = async () => {
      loading.value = true

      try {
        await Promise.all([
          loadAgents(),
          loadCommands(),
          loadHooks(),
          loadMCP()
        ])
      } catch (err) {
        console.error('Error loading user data:', err)
      } finally {
        loading.value = false
      }
    }

    const loadAgents = async () => {
      loadingAgents.value = true
      try {
        const data = await userAPI.getAgents()
        agents.value = data.agents || []
      } catch (err) {
        console.error('Error loading agents:', err)
        agents.value = []
      } finally {
        loadingAgents.value = false
      }
    }

    const loadCommands = async () => {
      loadingCommands.value = true
      try {
        const data = await userAPI.getCommands()
        commands.value = data.commands || []
      } catch (err) {
        console.error('Error loading commands:', err)
        commands.value = []
      } finally {
        loadingCommands.value = false
      }
    }

    const loadHooks = async () => {
      loadingHooks.value = true
      try {
        const data = await userAPI.getHooks()
        hooks.value = data.hooks || []
      } catch (err) {
        console.error('Error loading hooks:', err)
        hooks.value = []
      } finally {
        loadingHooks.value = false
      }
    }

    const loadMCP = async () => {
      loadingMCP.value = true
      try {
        const data = await userAPI.getMCP()
        mcpServers.value = data.mcp || []
      } catch (err) {
        console.error('Error loading MCP servers:', err)
        mcpServers.value = []
      } finally {
        loadingMCP.value = false
      }
    }

    // Sidebar actions
    const showDetail = (item, type, items) => {
      selectedItem.value = item
      selectedType.value = type
      currentItems.value = items
      currentIndex.value = items.findIndex(i => i === item)
      sidebarVisible.value = true
    }

    const navigatePrev = () => {
      if (hasPrev.value) {
        currentIndex.value--
        selectedItem.value = currentItems.value[currentIndex.value]
      }
    }

    const navigateNext = () => {
      if (hasNext.value) {
        currentIndex.value++
        selectedItem.value = currentItems.value[currentIndex.value]
      }
    }


    onMounted(() => {
      loadUserData()
    })

    return {
      agents,
      commands,
      hooks,
      mcpServers,
      loading,
      loadingAgents,
      loadingCommands,
      loadingHooks,
      loadingMCP,
      initialDisplayCount,
      showingAllAgents,
      showingAllCommands,
      showingAllHooks,
      showingAllMcp,
      displayedAgents,
      displayedCommands,
      displayedHooks,
      displayedMcp,
      sidebarVisible,
      selectedItem,
      selectedType,
      hasPrev,
      hasNext,
      typeIcon,
      typeColor,
      showDetail,
      navigatePrev,
      navigateNext
    }
  }
}
</script>

<style scoped>
.user-global {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* User Info Bar */
.user-info-bar {
  margin-bottom: 2rem;
}

.user-info-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.user-info-title i {
  font-size: 1.75rem;
  color: var(--color-user);
}

.user-info-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 2.5rem;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--surface-border);
  font-size: 0.9rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--primary-color-dark);
  text-decoration: underline;
}

.breadcrumb-link i {
  font-size: 0.85rem;
}

.breadcrumb-separator {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 3rem 1rem;
}

.spinner {
  border: 3px solid var(--surface-border);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: var(--text-secondary);
}

/* Config Cards Container */
.config-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

.config-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

.config-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.config-header-left i {
  font-size: 1.5rem;
}

.config-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.expand-btn {
  padding: 0.25rem 0.75rem;
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.expand-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton {
  background: linear-gradient(90deg, var(--surface-ground) 0%, var(--surface-border) 50%, var(--surface-ground) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  height: 60px;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 1rem;
}

.config-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-details-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.view-details-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 500px;
  height: 100vh;
  background: var(--surface-card);
  border-left: 1px solid var(--surface-border);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.sidebar-header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  min-width: 0;
}

.sidebar-header-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn,
.close-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled),
.close-btn:hover {
  background: var(--surface-ground);
  border-color: var(--primary-color);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.sidebar-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-section p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.sidebar-section strong {
  color: var(--text-primary);
}

.content-preview {
  background: var(--surface-ground);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--surface-border);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.action-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.action-btn:hover {
  background: var(--primary-color-dark);
}

/* Responsive */
@media (max-width: 1200px) {
  .config-cards-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
