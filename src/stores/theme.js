import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('dark')

  // Load theme from localStorage on init
  function loadTheme() {
    const saved = localStorage.getItem('claude-code-manager-theme')
    if (saved) {
      currentTheme.value = saved
      applyTheme(saved)
    } else {
      // Apply default theme if no saved preference
      applyTheme(currentTheme.value)
    }
  }

  // Apply theme to DOM
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('claude-code-manager-theme', theme)
  }

  // Toggle between light and dark
  function toggleTheme() {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    currentTheme.value = newTheme
    applyTheme(newTheme)
  }

  // Set specific theme
  function setTheme(theme) {
    if (['light', 'dark'].includes(theme)) {
      currentTheme.value = theme
      applyTheme(theme)
    }
  }

  return {
    currentTheme,
    loadTheme,
    toggleTheme,
    setTheme
  }
})
