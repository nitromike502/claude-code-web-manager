// Main Vue Application

import api from './api.js';
import createRouter from './router.js';
import Dashboard from './components/Dashboard.js';
import ProjectDetail from './components/ProjectDetail.js';
import UserGlobal from './components/UserGlobal.js';
import ConfigCard from './components/ConfigCard.js';
import ConfigItem from './components/ConfigItem.js';
import DetailSidebar from './components/DetailSidebar.js';

const { createApp } = Vue;
const { useToast } = primevue.usetoast;

// Create Vue app
const app = createApp({
  data() {
    return {
      currentView: 'dashboard',
      routeParams: {},
      searchQuery: '',
      currentTheme: 'dark',
    };
  },
  computed: {
    breadcrumbs() {
      if (this.currentView === 'dashboard') {
        return null;
      }

      const crumbs = [
        { label: 'Dashboard', command: () => router.navigate('/') },
      ];

      if (this.currentView === 'project-detail') {
        crumbs.push({
          label: this.routeParams.projectId || 'Project',
        });
      } else if (this.currentView === 'user-global') {
        crumbs.push({ label: 'User Configurations' });
      }

      return crumbs;
    },
    isUserView() {
      return this.currentView === 'user-global';
    },
    showBack() {
      return this.currentView !== 'dashboard';
    },
  },
  mounted() {
    // Load saved theme
    this.loadTheme();

    // Set up theme toggle
    document.addEventListener('theme-toggle', () => {
      this.toggleTheme();
    });
  },
  methods: {
    handleBack() {
      router.navigate('/');
    },
    handleSearch(query) {
      this.searchQuery = query;
      window.dispatchEvent(new CustomEvent('header-search', { detail: query }));
    },
    handleRescan() {
      window.dispatchEvent(new CustomEvent('trigger-rescan'));
    },
    handleUserView() {
      router.navigate('/user');
    },
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    },
    loadTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      this.currentTheme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    },
  },
  template: `
    <div id="app">
      <Toolbar class="app-header">
        <template #start>
          <Button
            v-if="showBack"
            icon="pi pi-arrow-left"
            text
            @click="handleBack"
            style="margin-right: 1rem;"
          />
          <Breadcrumb v-if="breadcrumbs" :model="breadcrumbs" style="border: none; background: transparent;" />
          <div v-else class="app-title">
            <i class="pi pi-code"></i>
            <span>Claude Code Manager</span>
          </div>
        </template>

        <template #center>
          <IconField iconPosition="left" class="header-search">
            <InputIcon class="pi pi-search"></InputIcon>
            <InputText
              v-model="searchQuery"
              placeholder="Search..."
              @input="handleSearch(searchQuery)"
            />
          </IconField>
        </template>

        <template #end>
          <Button
            icon="pi pi-sun"
            v-if="currentTheme === 'dark'"
            text
            rounded
            @click="toggleTheme"
            v-tooltip.bottom="'Switch to light mode'"
          />
          <Button
            icon="pi pi-moon"
            v-else
            text
            rounded
            @click="toggleTheme"
            v-tooltip.bottom="'Switch to dark mode'"
          />
          <Button
            icon="pi pi-user"
            text
            rounded
            :class="{ 'active': isUserView }"
            @click="handleUserView"
            v-tooltip.bottom="'User configurations'"
          />
        </template>
      </Toolbar>

      <component
        :is="currentView"
        v-bind="routeParams"
      ></component>

      <Toast />
    </div>
  `,
});

// Register PrimeVue
app.use(PrimeVue.Config, {
  theme: 'none', // We'll use CSS variables for theming
});

// Register PrimeVue components
app.component('Button', primevue.button);
app.component('Card', primevue.card);
app.component('Toolbar', primevue.toolbar);
app.component('InputText', primevue.inputtext);
app.component('IconField', primevue.iconfield);
app.component('InputIcon', primevue.inputicon);
app.component('Breadcrumb', primevue.breadcrumb);
app.component('Dropdown', primevue.dropdown);
app.component('ProgressSpinner', primevue.progressspinner);
app.component('Skeleton', primevue.skeleton);
app.component('Sidebar', primevue.sidebar);
app.component('Panel', primevue.panel);
app.component('Tag', primevue.tag);
app.component('Toast', primevue.toast);

// Register directives
app.directive('tooltip', primevue.tooltip);

// Register PrimeVue services
app.use(primevue.toastservice);

// Register custom components
app.component('dashboard', Dashboard);
app.component('project-detail', ProjectDetail);
app.component('user-global', UserGlobal);
app.component('config-card', ConfigCard);
app.component('config-item', ConfigItem);
app.component('detail-sidebar', DetailSidebar);

// Set up routing
const routes = {
  '/': 'dashboard',
  '/project/:projectId': 'project-detail',
  '/user': 'user-global',
};

const router = createRouter(routes);

// Make API and router available globally
window.api = api;
window.router = router;

// Mount the app
app.mount('#app');
window.app = app;

console.log('Claude Code Manager initialized');
