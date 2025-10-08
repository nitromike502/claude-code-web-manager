// Detail Sidebar Component

export default {
  name: 'DetailSidebar',
  template: `
    <Sidebar
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      position="right"
      :style="sidebarStyle"
      :modal="true"
      class="detail-sidebar"
    >
      <template #header>
        <div style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="sidebar-header-title">
              <i :class="typeIcon" :style="{ color: typeColor }"></i>
              <span>{{ itemName }}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <Button
                icon="pi pi-chevron-left"
                text
                rounded
                @click="$emit('navigate-prev')"
                :disabled="!hasPrev"
                v-tooltip.bottom="'Previous'"
              />
              <Button
                icon="pi pi-chevron-right"
                text
                rounded
                @click="$emit('navigate-next')"
                :disabled="!hasNext"
                v-tooltip.bottom="'Next'"
              />
            </div>
          </div>
          <div class="sidebar-header-metadata">
            <Tag :value="typeLabel" />
            <span class="file-path" v-if="item && item.filePath">{{ item.filePath }}</span>
          </div>
        </div>
      </template>

      <div class="sidebar-content" v-if="item">
        <Panel header="Metadata" :collapsed="false" toggleable class="mb-3">
          <div v-if="type === 'agents'">
            <p><strong>Name:</strong> {{ item.name }}</p>
            <p><strong>Description:</strong> {{ item.description }}</p>
          </div>
          <div v-else-if="type === 'commands'">
            <p><strong>Name:</strong> {{ item.name }}</p>
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p v-if="item.namespace"><strong>Namespace:</strong> {{ item.namespace }}</p>
          </div>
          <div v-else-if="type === 'hooks'">
            <p><strong>Event:</strong> {{ item.event }}</p>
            <p><strong>Pattern:</strong> {{ item.pattern }}</p>
            <p v-if="item.command"><strong>Command:</strong> {{ item.command }}</p>
            <p v-if="item.source"><strong>Source:</strong> {{ item.source }}</p>
          </div>
          <div v-else-if="type === 'mcp'">
            <p><strong>Name:</strong> {{ item.name }}</p>
            <p><strong>Transport:</strong> {{ item.transport }}</p>
            <p v-if="item.command"><strong>Command:</strong> {{ item.command }}</p>
            <p v-if="item.args"><strong>Args:</strong> {{ JSON.stringify(item.args) }}</p>
          </div>
        </Panel>

        <Panel
          v-if="yamlContent"
          header="YAML Frontmatter"
          :collapsed="true"
          toggleable
          class="mb-3"
        >
          <pre><code>{{ yamlContent }}</code></pre>
          <Button
            icon="pi pi-copy"
            text
            size="small"
            label="Copy YAML"
            @click="copyYaml"
            class="mt-2"
          />
        </Panel>

        <div v-if="markdownContent" class="mb-3">
          <h4 class="mb-2">Content</h4>
          <div class="markdown-content" v-html="renderedMarkdown"></div>
        </div>

        <Panel
          v-if="type === 'hooks' || type === 'mcp'"
          header="Raw Configuration"
          :collapsed="true"
          toggleable
        >
          <pre><code>{{ JSON.stringify(item, null, 2) }}</code></pre>
        </Panel>
      </div>

      <template #footer>
        <div class="sidebar-actions">
          <Button
            label="Copy All"
            icon="pi pi-copy"
            @click="copyAll"
          />
          <Button
            label="Download"
            icon="pi pi-download"
            outlined
            @click="download"
            v-if="type === 'agents' || type === 'commands'"
          />
        </div>
      </template>
    </Sidebar>
  `,
  props: {
    visible: Boolean,
    item: Object,
    type: String,
    hasPrev: Boolean,
    hasNext: Boolean,
  },
  computed: {
    sidebarStyle() {
      return {
        width: '40%',
        minWidth: '400px',
        maxWidth: '600px',
      };
    },
    typeIcon() {
      const icons = {
        agents: 'pi pi-users',
        commands: 'pi pi-bolt',
        hooks: 'pi pi-link',
        mcp: 'pi pi-server',
      };
      return icons[this.type] || 'pi pi-file';
    },
    typeColor() {
      const colors = {
        agents: 'var(--color-agents)',
        commands: 'var(--color-commands)',
        hooks: 'var(--color-hooks)',
        mcp: 'var(--color-mcp)',
      };
      return colors[this.type] || 'var(--text-primary)';
    },
    typeLabel() {
      const labels = {
        agents: 'Subagent',
        commands: 'Slash Command',
        hooks: 'Hook',
        mcp: 'MCP Server',
      };
      return labels[this.type] || 'Item';
    },
    itemName() {
      if (!this.item) return '';
      return this.item.name || this.item.event || 'Unnamed';
    },
    yamlContent() {
      if (!this.item || !this.item.frontmatter) return '';
      return JSON.stringify(this.item.frontmatter, null, 2);
    },
    markdownContent() {
      if (!this.item) return '';
      return this.item.content || '';
    },
    renderedMarkdown() {
      if (!this.markdownContent) return '';

      // Simple markdown rendering (basic support)
      let html = this.markdownContent;

      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

      // Bold
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Italic
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Lists
      html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

      // Line breaks
      html = html.replace(/\n\n/g, '</p><p>');
      html = '<p>' + html + '</p>';

      return html;
    },
  },
  methods: {
    copyYaml() {
      navigator.clipboard.writeText(this.yamlContent);
      this.$toast.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'YAML copied to clipboard',
        life: 3000,
      });
    },
    copyAll() {
      let content = '';
      if (this.yamlContent) {
        content += `---\n${this.yamlContent}\n---\n\n`;
      }
      if (this.markdownContent) {
        content += this.markdownContent;
      }
      if (!content && this.item) {
        content = JSON.stringify(this.item, null, 2);
      }

      navigator.clipboard.writeText(content);
      this.$toast.add({
        severity: 'success',
        summary: 'Copied',
        detail: 'Content copied to clipboard',
        life: 3000,
      });
    },
    download() {
      let content = '';
      if (this.yamlContent) {
        content += `---\n${this.yamlContent}\n---\n\n`;
      }
      if (this.markdownContent) {
        content += this.markdownContent;
      }

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.itemName}.md`;
      a.click();
      URL.revokeObjectURL(url);

      this.$toast.add({
        severity: 'success',
        summary: 'Downloaded',
        detail: 'File downloaded successfully',
        life: 3000,
      });
    },
  },
};
