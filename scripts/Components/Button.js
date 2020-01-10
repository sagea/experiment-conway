import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { whenChanged } from '../utils/memory.js'

export class Button extends LitElement {
  get properties () {
    return {
      click: Function
    }
  }

  render() {
    const f = (event) => this.click(event);
    return html`
      <style>
        button {
          background-color: #29c7d1;
          border: 1px solid #06bdcb;
          color: #dff7f8;
        }
        button:hover {
          background-color: #06bdcb;
        }
      </style>
      <button type="button" @click=${f}>
        <slot></slot>
      </button>
    `
  }
}

customElements.define('as-button', Button);
