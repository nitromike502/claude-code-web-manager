// DetailSidebar Component
// Displays detailed configuration content in a right-side overlay

export default {
  name: 'DetailSidebar',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: [String, Object],
      default: ''
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['agent', 'command', 'hook', 'mcp'].includes(value)
    },
    metadata: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible'],
  data() {
    return {
      isCopied: false,
      copyTimeout: null
    };
  },
  computed: {
    sidebarWidth() {
      return window.innerWidth < 768 ? '100%' : '75%';
    },
    iconClass() {
      const icons = {
        agent: 'fa-robot',
        command: 'fa-terminal',
        hook: 'fa-plug',
        mcp: 'fa-server'
      };
      return `fas ${icons[this.type]}`;
    },
    colorClass() {
      const colors = {
        agent: 'color-agents',
        command: 'color-commands',
        hook: 'color-hooks',
        mcp: 'color-mcp'
      };
      return colors[this.type];
    },
    renderedContent() {
      // For markdown content (agents and commands)
      if (this.type === 'agent' || this.type === 'command') {
        if (typeof this.content === 'string' && this.content.trim()) {
          try {
            // Use marked.js to parse markdown
            const html = marked.parse(this.content);
            return html;
          } catch (err) {
            console.error('Error parsing markdown:', err);
            return `<pre>${this.escapeHtml(this.content)}</pre>`;
          }
        }
        return '<p class="no-content">No content available</p>';
      }

      // For structured data (hooks and MCP servers)
      return null;
    },
    hasMetadata() {
      return this.metadata && Object.keys(this.metadata).length > 0;
    }
  },
  mounted() {
    // Apply syntax highlighting after content is rendered
    this.$nextTick(() => {
      if (this.visible) {
        this.applySyntaxHighlighting();
        this.focusSidebar();
      }
    });

    // Add keyboard event listener
    if (this.visible) {
      this.addKeyboardListeners();
    }
  },
  unmounted() {
    // Clean up keyboard event listeners
    this.removeKeyboardListeners();

    // Clear copy timeout
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        // Focus sidebar and add keyboard listeners when opened
        this.$nextTick(() => {
          this.focusSidebar();
          this.addKeyboardListeners();
        });
      } else {
        // Remove keyboard listeners when closed
        this.removeKeyboardListeners();

        // Reset copy state
        this.isCopied = false;
        if (this.copyTimeout) {
          clearTimeout(this.copyTimeout);
          this.copyTimeout = null;
        }
      }
    }
  },
  updated() {
    // Reapply syntax highlighting when content changes
    this.$nextTick(() => {
      if (this.visible) {
        this.applySyntaxHighlighting();
      }
    });
  },
  methods: {
    closeSidebar() {
      this.$emit('update:visible', false);
    },
    applySyntaxHighlighting() {
      // Apply highlight.js to all code blocks
      const codeBlocks = this.$el.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        if (typeof hljs !== 'undefined') {
          hljs.highlightElement(block);
        }
      });
    },
    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    },
    copyContent() {
      // Get the raw content to copy
      let textToCopy = '';

      if (typeof this.content === 'string') {
        textToCopy = this.content;
      } else if (typeof this.content === 'object' && this.content !== null) {
        textToCopy = JSON.stringify(this.content, null, 2);
      }

      // Use Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            console.log('Content copied to clipboard');
            this.showCopyFeedback();
          })
          .catch(err => {
            console.error('Failed to copy content:', err);
            // Show error in console, but don't break the UI
          });
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          console.log('Content copied to clipboard (fallback)');
          this.showCopyFeedback();
        } catch (err) {
          console.error('Failed to copy content (fallback):', err);
        }
        document.body.removeChild(textarea);
      }
    },
    showCopyFeedback() {
      // Clear existing timeout if any
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }

      // Show "Copied!" feedback
      this.isCopied = true;

      // Reset after 2 seconds
      this.copyTimeout = setTimeout(() => {
        this.isCopied = false;
        this.copyTimeout = null;
      }, 2000);
    },
    handleKeydown(event) {
      // ESC key - Close sidebar
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeSidebar();
        return;
      }

      // Ctrl+C / Cmd+C - Copy content
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        // Only handle if we're not in a text selection context
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          event.preventDefault();
          this.copyContent();
        }
      }
    },
    addKeyboardListeners() {
      // Bind the handler to this instance
      this._keydownHandler = this.handleKeydown.bind(this);
      document.addEventListener('keydown', this._keydownHandler);
    },
    removeKeyboardListeners() {
      if (this._keydownHandler) {
        document.removeEventListener('keydown', this._keydownHandler);
        this._keydownHandler = null;
      }
    },
    focusSidebar() {
      // Focus the sidebar container for keyboard shortcuts
      const sidebar = this.$el?.querySelector('.detail-sidebar');
      if (sidebar) {
        sidebar.focus();
      }
    }
  },
  template: `
    <div v-if="visible" class="detail-sidebar-overlay" @click="closeSidebar">
      <div class="detail-sidebar" :style="{ width: sidebarWidth }" @click.stop tabindex="-1">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="sidebar-header-content">
            <div class="sidebar-header-title">
              <i :class="iconClass" :style="{ color: 'var(--' + colorClass + ')' }"></i>
              <span>{{ title }}</span>
            </div>
            <div v-if="metadata.filePath" class="sidebar-header-metadata">
              <span class="file-path">{{ metadata.filePath }}</span>
            </div>
          </div>
          <button class="btn-close-sidebar" @click="closeSidebar" title="Close sidebar">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Sidebar Content -->
        <div class="sidebar-content">
          <!-- Frontmatter Specs (Agents & Commands) -->
          <div v-if="(type === 'agent' || type === 'command') && metadata.frontmatter && metadata.frontmatter.specs" class="structured-content">
            <div class="metadata-section">
              <h3 class="section-title">Frontmatter Specs</h3>
              <div class="metadata-grid">
                <div v-for="(value, key) in metadata.frontmatter.specs" :key="key" class="metadata-item full-width">
                  <label class="metadata-label">{{ key }}</label>
                  <div class="metadata-value code-value" v-if="typeof value === 'object'">{{ JSON.stringify(value, null, 2) }}</div>
                  <div class="metadata-value" v-else>{{ value }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Markdown Content (Agents & Commands) -->
          <div v-if="type === 'agent' || type === 'command'" class="markdown-content" v-html="renderedContent"></div>

          <!-- Hook Structured Data -->
          <div v-if="type === 'hook'" class="structured-content">
            <div class="metadata-section">
              <h3 class="section-title">Hook Configuration</h3>
              <div class="metadata-grid">
                <div class="metadata-item">
                  <label class="metadata-label">Event</label>
                  <div class="metadata-value">{{ content.event || 'N/A' }}</div>
                </div>
                <div class="metadata-item">
                  <label class="metadata-label">Scope</label>
                  <div class="metadata-value">
                    <span :class="['scope-badge', 'scope-' + (content.scope || 'unknown')]">
                      {{ content.scope || 'unknown' }}
                    </span>
                  </div>
                </div>
                <div class="metadata-item full-width">
                  <label class="metadata-label">Command</label>
                  <div class="metadata-value code-value">{{ content.command || 'N/A' }}</div>
                </div>
                <div v-if="content.description" class="metadata-item full-width">
                  <label class="metadata-label">Description</label>
                  <div class="metadata-value">{{ content.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- MCP Server Structured Data -->
          <div v-if="type === 'mcp'" class="structured-content">
            <div class="metadata-section">
              <h3 class="section-title">MCP Server Configuration</h3>
              <div class="metadata-grid">
                <div class="metadata-item full-width">
                  <label class="metadata-label">Command</label>
                  <div class="metadata-value code-value">{{ content.command || 'N/A' }}</div>
                </div>
                <div class="metadata-item">
                  <label class="metadata-label">Transport</label>
                  <div class="metadata-value">
                    <span class="transport-badge">{{ content.transport || 'stdio' }}</span>
                  </div>
                </div>
                <div v-if="content.args && content.args.length > 0" class="metadata-item full-width">
                  <label class="metadata-label">Arguments</label>
                  <ul class="argument-list">
                    <li v-for="(arg, index) in content.args" :key="index">{{ arg }}</li>
                  </ul>
                </div>
                <div v-if="content.env && Object.keys(content.env).length > 0" class="metadata-item full-width">
                  <label class="metadata-label">Environment Variables</label>
                  <div class="env-grid">
                    <div v-for="(value, key) in content.env" :key="key" class="env-item">
                      <span class="env-key">{{ key }}</span>
                      <span class="env-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="content.disabled" class="metadata-item full-width">
                  <div class="status-badge status-disabled">
                    <i class="fas fa-times-circle"></i>
                    Disabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <button class="btn-copy" @click="copyContent" :title="isCopied ? 'Content copied!' : 'Copy content to clipboard'" :class="{ 'copied': isCopied }">
            <i :class="isCopied ? 'fas fa-check' : 'fas fa-copy'"></i>
            {{ isCopied ? 'Copied!' : 'Copy Content' }}
          </button>
          <button class="btn-close" @click="closeSidebar">
            <i class="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  `
};
