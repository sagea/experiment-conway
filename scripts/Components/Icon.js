
import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1?module'

export class Icon extends LitElement {
  static get properties() {
    return {
      icon: String
    }
  }

  render() {
    return html`
      <style>
      @import "https://unpkg.com/@fortawesome/fontawesome-free@5.12.0/css/all.min.css";
      </style>
      <i class="fas fa-${this.icon}"></i>
    `
  }
}

customElements.define('as-icon', Icon)
