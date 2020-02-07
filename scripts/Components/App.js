import { html, LitElement } from 'https://unpkg.com/lit-element@2.2.1?module'

import { whenChanged } from '../utils/memory.js'
import { randomize, enableCells, disableCells } from '../workers/conway/conway.js'
import { Path } from '../modules/generics/Shapes.js'
import { v, applyModifier } from '../modules/generics/Vector.js'

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
    const { playing, speed, table, zoom, translate, randomForm: { variation, size }, tool } = store.getState()
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
    const populateRandomly = async () => {
      const width = size
      const height = size
      const table = await randomize({
        width,
        height,
        x: - width / 2,
        y: - height / 2,
        variation,
      })
      store.actions.setTable({ table })
    }
    const setSize = (e) => {
      const value = e.target.value
      if (/^[0-9]*$/.test(value)) {
        if (!value) {
          e.target.value = 0
        }
        store.actions.setRandomFormSize( value ? parseInt(value): 0)
        return
      }
      const start = e.target.selectionStart
      e.target.value = size + ''
      e.target.selectionStart = e.target.selectionEnd = Math.max(0, start - 1)
    }
    const limitSizeOnBlur = e => {
      const value = Math.min(parseInt(e.target.value.trim()), 1500)
      store.actions.setRandomFormSize(value)
    }
    const validatesizeInput = (e) => {
      if (window.isNaN(parseInt(e.target.value))) {
        e.preventDefault()
      }
    }
    const setVariation = e => {
      store.actions.setRandomFormVariation(parseFloat(e.target.value))
    }
    const reset = () => {
      store.actions.setZoom(5)
      store.actions.setTranslate({ x: 0, y: 0 })
    }
    let toolHandler = () => {}
    if (tool === 'CANVAS_DRAG') {
      toolHandler = ({ now, cellPos }) => {
        if (this.translate.x !== cellPos.x || this.translate.y !== cellPos.y) {
          store.actions.setTranslate(cellPos)
        }
      }
    } else if (tool === 'DRAW') {
      toolHandler = async ({ now, last, cellPos }) => {
        const from = applyModifier(v(last.x, last.y), Math.floor)
        const to = applyModifier(v(now.x, now.y), Math.floor)
        const pixels = Path(from, to, 4)
        const table = await enableCells(new Int16Array(pixels.flat()));
        store.actions.setTable({ table })
      }
    }  else if (tool === 'ERASER') {
      toolHandler = async ({ now, last, cellPos }) => {
        const from = applyModifier(v(last.x, last.y), Math.floor)
        const to = applyModifier(v(now.x, now.y), Math.floor)
        const pixels = Path(from, to, 4)
        const table = await disableCells(new Int16Array(pixels.flat()));
        store.actions.setTable({ table })
      }
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
        hr {
          border: none;
          border-bottom: 1px solid #9e9e9e;
        }
      </style>
      <h3> Conway Game of Life </h3>
      <as-conway-renderer
        .table=${table}
        .translate=${translate}
        .zoom=${zoom}
        .setTranslate=${setTranslate}
        .onDrag=${toolHandler}
        .setZoom=${setZoom}
        .tool=${tool}>
      </as-conway-renderer>
      <div class="awesome">
        <h1>Conway Game of Life</h1>
          <label>Speed (${speed})</label>
        <br>
        <input type="range" min="30" max="1000" .value=${speed} @input=${handleSpeedRangeChange} />
        <br>
        
        <as-button .click=${pauseOrStart}>${playing ? 'Stop' : 'Start'}</as-button>
        <as-button .click=${reset}>Reset</as-button>
        <hr>
        <h3>Generator</h3>
        <div>
          <label>Variation ${Math.floor(variation * 100)}%</label>
          <br>
          <input type="range" min="0" max="1" step=".01" .value=${variation} @input=${setVariation} />
        </div>
        <div>
          <label>Size</label>
          <br>
          <input type="text" .value=${size} @input=${setSize} @beforeinput=${validatesizeInput} @blur=${limitSizeOnBlur} />
        </div>
        <br>

        <as-button .click=${populateRandomly}>Populate Randomly</as-button>
        <hr>
        <div class="stats">
          translate x: ${translate.x}
          <br>
          translate y: ${translate.y}
          <br>
          zoom: ${zoom}
          <br>  
          Live Cells: ${table.length / 2}
        </div>
        <as-toolbox
          .selected=${tool}
          .onSelectionChange=${(tool) => store.actions.setTool(tool.new)}></as-toolbox>
      </div>
    `
  }
}

customElements.define('as-app', App)
