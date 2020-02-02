
import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1?module'
import { tools } from '../toolList.js';



export class Toolbox extends LitElement {
  static get properties() {
    return {
      selected: String,
      onSelectionChange: Function,
    }
  }

  render() {
    const onSelect = (tool) => {
      if (tool.type !== this.selected) {
        this.onSelectionChange({ new: tool.type, old: this.selected });
      }
    }
    return html`
      <div>
        <h3>Toolbox</h3>
        <hr>
        ${
          tools
            .map(tool => html `
              ${
                tool.type === this.selected
                  ? html `<as-icon .icon=${'chevron-circle-right'}></as-icon>`
                  : html `<as-icon .icon=${'circle'}></as-icon>`
              }
              <as-toolbox-button
                .tool=${tool}
                .selected=${tool.type === this.selected}
                .onSelect=${onSelect}>
              </as-toolbox-button>
              <br>
              <br>
            `)
        }
      </div>
    `
  }
}

export class ToolboxButton extends LitElement {
  get properties() {
    return {
      tool: Object,
      selected: Boolean,
      onSelect: Function,
    }
  }
  render() {
    return html `
      <as-button .click=${() => this.onSelect(this.tool)}>
        <as-icon .icon=${this.tool.icon}></as-icon>
        ${this.tool.text}
      </as-button>
    `
  }
}
customElements.define('as-toolbox', Toolbox)
customElements.define('as-toolbox-button', ToolboxButton)
