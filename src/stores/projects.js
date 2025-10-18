import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const selectedProject = ref(null)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  // Computed: filtered projects based on search
  const filteredProjects = computed(() => {
    if (!searchQuery.value) return projects.value
    const query = searchQuery.value.toLowerCase()
    return projects.value.filter(p =>
      p.name?.toLowerCase().includes(query) ||
      p.path?.toLowerCase().includes(query)
    )
  })

  // Load projects from backend API
  async function loadProjects() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to load projects')
      const data = await response.json()
      projects.value = data.projects || []
    } catch (err) {
      error.value = err.message
      console.error('Error loading projects:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Refresh projects from backend
  async function refreshProjects() {
    await fetch('/api/projects/scan', { method: 'POST' })
    await loadProjects()
  }

  // Select a project
  function selectProject(project) {
    selectedProject.value = project
  }

  // Filter projects by search query
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  return {
    projects,
    filteredProjects,
    selectedProject,
    searchQuery,
    isLoading,
    error,
    loadProjects,
    refreshProjects,
    selectProject,
    setSearchQuery
  }
})
