import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Initialize Vue app
const app = createApp(App)

// Use Vue Router
app.use(router)

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('claude-code-manager-theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

// Mount to #app
app.mount('#app')
