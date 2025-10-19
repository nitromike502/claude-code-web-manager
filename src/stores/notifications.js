import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  let nextId = 1

  // Add notification (auto-dismiss after 5 seconds)
  function addNotification(message, type = 'info', duration = 5000) {
    const id = nextId++
    const notification = { id, message, type }
    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }

    return id
  }

  // Remove notification by id
  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // Clear all notifications
  function clearAll() {
    notifications.value = []
  }

  // Helpers for specific notification types
  function success(message, duration = 5000) {
    return addNotification(message, 'success', duration)
  }

  function error(message, duration = 5000) {
    return addNotification(message, 'error', duration)
  }

  function warning(message, duration = 5000) {
    return addNotification(message, 'warning', duration)
  }

  function info(message, duration = 5000) {
    return addNotification(message, 'info', duration)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
})
