<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1>Claude Code Manager</h1>
      <nav class="app-nav">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/user">User Config</router-link>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #f5f5f5;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
}

.app-nav {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
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
</style>
