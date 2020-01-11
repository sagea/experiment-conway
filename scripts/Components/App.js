import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { whenChanged } from '../utils/memory.js'
import { count } from '../utils/table.js'

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
    const storeStateMemory = whenChanged(() => {
      this.requestUpdate()
    })
    this.store.subscribe(() => {
      storeStateMemory(this.store.getState())
    })
  }
  render() {
    const { store } = this
    const { playing, speed, table, zoom, translate } = store.getState()  
    const pauseOrStart = () => {
        store.actions.setPlaying(!playing)
    }
    const handleSpeedRangeChange = (e) => {
        store.actions.setSpeed(parseInt(e.target.value))
    }
    const setTranslate = ({ x, y }) => {
      store.actions.setTranslate({ x, y })
    }
    const setZoom = (zoom) => {
      store.actions.setZoom(zoom)
    }
    const populateRandomly = () => {
      const width = 200
      const height = 200

      store.actions.randomizeTable({
        width,
        height,
        x: - width / 2,
        y: - height / 2,
        randomChance: .3
      })
    }
    const reset = () => {
      store.actions.setZoom(5)
      store.actions.setTranslate({ x: 0, y: 0 })
    }
    return html `
      <style>
        * {
          font-family: Courier;
          font-size: 10px;
        }
        .awesome {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #252525;
          padding: 10px;
          color: #9e9e9e;
        }
        .stats {
          color: #9e9e9e;
          
        }
      </style>
      <h3> Conway Game of Life </h3>
      <as-conway-renderer
        .table=${table}
        .translate=${translate}
        .zoom=${zoom}
        .setTranslate=${setTranslate}
        .setZoom=${setZoom}>
      </as-conway-renderer>
      <div class="awesome">
        <h1>Conway Game of Life</h1>
          <label>Speed (${speed})</label>
        <br>
        <input type="range" min="30" max="1000" .value=${speed} @input=${handleSpeedRangeChange} />
        <br>
        <as-button .click=${pauseOrStart}>${playing ? 'Stop' : 'Start'}</as-button>
        <as-button .click=${populateRandomly}>Populate Randomly</as-button>
        <as-button .click=${reset}>Reset</as-button>
        <div class="stats">
          translate x: ${translate.x}
          <br>
          translate y: ${translate.y}
          <br>
          zoom: ${zoom}
          <br>
          Live Cells: ${count(table)}
        </div>
      </div>
    `
  }
}

customElements.define('as-app', App)
