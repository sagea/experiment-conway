import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { surroundingCells, eachCellTable } from './table.js';

const DEAD = 'a';
const LIVE = 'b';
const defaultState = {
	table: [],
  tableSize: {
  	row: 0,
    cell: 0,
  },
  playing: false,
  cellSize: 10,
  speed: 30,
}

const store = createStore({
	setTableDimensions(state, { row, cell }) {
  	return {
    	...state,
      table: new Array(row).fill()
      	.map(i => new Array(cell).fill(DEAD)),
      tableSize: {
      	...state.tableSize,
        row,
        cell,
      },
    };
  },
  randomizeTable(state) {
  	const { row, cell } = state.tableSize;
  	return {
    	...state,
      table: new Array(row)
      	.fill()
      	.map(i => 
        	new Array(cell)
          	.fill()
            .map(() => Math.random() <= .3 ? LIVE : DEAD)
        ),
    }
  },
  setCell(state, { x, y, value }) {
  	if (x < 0 || x > state.tableSize.cell - 1) {
    	return state
    }
    if (y < 0 || y > state.tableSize.row -1) {
	    return state
    }
    const row = state.table[y];
    return {
    	...state,
    	table: [
      	...state.table.slice(0, y),
        [
        	...row.slice(0, x),
          value,
          ...row.slice(x + 1),
        ],
        ...state.table.slice(y + 1),
      ]
    }
  },
  conwayFrame(state) {
  	const newTable = [];
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
		// Any live cell with two or three live neighbours lives on to the next generation.
		// Any live cell with more than three live neighbours dies, as if by overpopulation.
		// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  	for (let { x, y, value } of eachCellTable(state.table)) {
    	newTable[y] = newTable[y] || [];
      const neighborCount = [...surroundingCells(state.table, x, y)].filter(i => i === LIVE).length;
      if (value === LIVE && neighborCount < 2) {
      	newTable[y][x] = DEAD
      } else if (value === LIVE && (neighborCount == 2 || neighborCount === 3)) {
      	newTable[y][x] = LIVE
      } else if (value === LIVE && neighborCount > 3) {
      	newTable[y][x] = DEAD
      } else if (value === DEAD && neighborCount === 3) {
      	newTable[y][x] = LIVE
      } else {
      	newTable[y][x] = value
      }
    }
  	return {
    	...state,
      table: newTable,
    }
  },
  setPlaying(state, value) {
  	return {
      ...state,
      playing: value,
    }
  },
  setSpeed(state, speed) {
  	return {
    	...state,
      speed,
    }
  }
}, defaultState)
store.actions.setTableDimensions({
  row: 30,
  cell: 30,
})

class ConwayRenderer extends LitElement {
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

class TableForm extends LitElement {
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
class App extends LitElement {
	constructor() {
  	super()
    store.subscribe(() => {
    	this.requestUpdate();
    })
  }
	render() {
    const { table, tableSize, playing, cellSize, speed } = store.getState()
    const pauseOrStart = () => {
    	store.actions.setPlaying(!playing);
    }
    const reset = () => {
      store.actions.randomizeTable();
    }
    const handleSpeedRangeChange = (e) => {
    	store.actions.setSpeed(parseInt(e.target.value))
    }
    const handleTableChange = ({row, cell}) => {
    	store.actions.setTableDimensions({ row, cell })
    }
  	return html `
      <h3> Conway Game of Life </h3>
      <as-conway-renderer
        .table=${table}
        .cellSize=${cellSize}
        .tableSize=${tableSize}>
      </as-conway-renderer>
      <button type="button" @click=${pauseOrStart}>${playing ? 'Stop' : 'Start'}</button>
      <button type="button" @click=${reset}>Populate Randomly</button>
      <div>
      	<label>Speed (${speed})</label>
        <br>
	      <input type="range" min="30" max="1000" .value=${speed} @input=${handleSpeedRangeChange} />
      </div>
      <as-table-form .change=${handleTableChange}></as-table-form>
    `
  }
}
customElements.define('as-app', App);
customElements.define('as-conway-renderer', ConwayRenderer);
customElements.define('as-table-form', TableForm);

let lastConwayTime = 0;
const animate = (time) => {
	const { playing, speed } = store.getState();
  if (playing && (time - lastConwayTime) > speed) {
  	lastConwayTime = time
    store.actions.conwayFrame();
  } 
	requestAnimationFrame(animate)
}
animate()
