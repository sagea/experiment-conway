import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { LIVE } from '../constants.js'
import { eachCellTable } from '../utils/table.js'

export class ConwayRenderer extends LitElement {
	static get properties() {
  	return {
    	table: Array,
      tableSize: Object,
      cellSize: Number,
    }
  }
	constructor() {
  	super()
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }
  updated () {
  	const { ctx, table, tableSize, cellSize } = this
    this.canvas.width = tableSize.cell * cellSize
    this.canvas.height = tableSize.row * cellSize
    ctx.save()
    ctx.fillStyle = '#f29e9a'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.restore()
    ctx.save()
    for (let { x, y, value } of eachCellTable(table)) {
    	if (value === LIVE) {
        ctx.rect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
    ctx.fillStyle = '#63286d'
    ctx.fill();
    ctx.restore()
  }
  render () {
   return html`
   	<div>
    	${this.canvas}
    </div>
   `
  }
}
customElements.define('as-conway-renderer', ConwayRenderer);
