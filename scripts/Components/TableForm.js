import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'

export class TableForm extends LitElement {
	static get properties() {
  	return {
    	row: Number,
      cell: Number,
      change: Function,
    }
  }
	constructor () {
  	super()
    this.row = 30
    this.cell = 30
  }
	render() {
  	const { row, cell, onChange } = this;
  	const handleSubmit = (e) => {
    	e.preventDefault();
      if (typeof this.change === 'function') {
	      this.change({ row, cell });
      }
    }
    const handleRowChange = (e) => {
    	this.row = parseInt(e.target.value)
    }
    const handleCellChange = (e) => {
    	this.cell = parseInt(e.target.value)
    }
    return html `
    	<form novalidate @submit=${handleSubmit}>
      	<div>
        	<label>Row Size (${row})</label>
          <br>
          <input type="range" min="10" max="200" .value=${row} @input=${handleRowChange} />
         </div>
      	<div>
        	<label>Cell Size (${cell})</label>
          <br>
          <input type="range" min="10" max="200" .value=${cell} @input=${handleCellChange} />
         </div>
         <button type="submit">Set Table Size</button>
      </form>
    `
  }
}

customElements.define('as-table-form', TableForm);
