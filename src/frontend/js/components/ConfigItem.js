// Config Item Component

export default {
  name: 'ConfigItem',
  template: `
    <div class="config-item" @click="$emit('view-details')">
      <div class="item-content">
        <div class="item-name">{{ itemName }}</div>
        <div class="item-description">{{ itemDescription }}</div>
      </div>
      <div class="item-actions">
        <Button
          label="View Details"
          icon="pi pi-eye"
          text
          size="small"
          @click.stop="$emit('view-details')"
        />
      </div>
    </div>
  `,
  props: {
    item: Object,
    type: String,
  },
  computed: {
    itemName() {
      switch (this.type) {
        case 'agents':
          return this.item.name || 'Unnamed Agent';
        case 'commands':
          return this.item.name || 'Unnamed Command';
        case 'hooks':
          return this.item.name || this.item.event || 'Unnamed Hook';
        case 'mcp':
          return this.item.name || 'Unnamed Server';
        default:
          return 'Unnamed Item';
      }
    },
    itemDescription() {
      switch (this.type) {
        case 'agents':
          return this.item.description || 'No description available';
        case 'commands':
          return this.item.description || 'No description available';
        case 'hooks':
          return `Event: ${this.item.event || 'N/A'} • Pattern: ${this.item.pattern || 'N/A'}`;
        case 'mcp':
          const transport = this.item.transport || 'N/A';
          const command = this.item.command || 'N/A';
          return `Transport: ${transport} • Command: ${command}`;
        default:
          return 'No description available';
      }
    },
  },
};
