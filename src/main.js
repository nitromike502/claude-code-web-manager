import { createApp } from 'vue'
import App from './App.vue'

// Initialize Vue app
const app = createApp(App)

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('claude-code-manager-theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

// Mount to #app
app.mount('#app')
