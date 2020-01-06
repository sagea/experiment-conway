import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'

export class App extends LitElement {
  static get properties () {
    return {
      store: Object
    }
  }
	constructor() {
    super()
  }
  firstUpdated() {
    this.store.subscribe(() => {
    	this.requestUpdate();
    })
  }
	render() {
    const { store } = this;
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
