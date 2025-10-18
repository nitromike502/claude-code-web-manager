<template>
  <div id="app" class="app-container" :data-theme="themeStore.currentTheme">
    <header class="app-header">
      <div class="header-content">
        <h1>Claude Code Manager</h1>
        <button @click="themeStore.toggleTheme" class="theme-toggle">
          {{ themeStore.currentTheme === 'light' ? '🌙' : '☀️' }}
        </button>
      </div>

      <nav class="app-nav">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/user">User Config</router-link>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <!-- Notifications Container -->
    <div class="notifications" v-if="notificationsStore.notifications.length">
      <div
        v-for="notification in notificationsStore.notifications"
        :key="notification.id"
        class="notification"
        :class="'notification-' + notification.type"
      >
        <p>{{ notification.message }}</p>
        <button @click="notificationsStore.removeNotification(notification.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from './stores/theme'
import { useNotificationsStore } from './stores/notifications'
import { useProjectsStore } from './stores/projects'

export default {
  name: 'App',
  setup() {
    const themeStore = useThemeStore()
    const notificationsStore = useNotificationsStore()
    const projectsStore = useProjectsStore()

    return {
      themeStore,
      notificationsStore,
      projectsStore
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--header-bg, #f5f5f5);
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color, #ddd);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-color, #ddd);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 4px;
}

.theme-toggle:hover {
  background: var(--hover-bg, #e0e0e0);
}

.app-nav {
  display: flex;
  gap: 1rem;
}

.app-nav a {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

.app-nav a:hover {
  text-decoration: underline;
}

.app-main {
  flex: 1;
}

.notifications {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
}

.notification {
  padding: 1rem;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  border-left: 4px solid #4caf50;
}

.notification-error {
  border-left: 4px solid #f44336;
}

.notification-warning {
  border-left: 4px solid #ff9800;
}

.notification-info {
  border-left: 4px solid #2196f3;
}

.notification button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

:root[data-theme="dark"] {
  --header-bg: #333;
  --border-color: #555;
  --hover-bg: #444;
}
</style>
