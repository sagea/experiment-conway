import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { workerMethodCaller } from '../../workers/utils.js'

export class ConwayCanvas extends LitElement {
  static get properties() {
    return {
      table: Array,
      zoom: Number,
      translate: Object,
      width: Number,
      height: Number,
      mousedown: Function,
      wheel: Function,
    }
  }
  constructor() {
    super()
    this.canvas = document.createElement('canvas')
    this.offscreenCanvas = this.canvas.transferControlToOffscreen()
    const worker = new Worker('./scripts/Components/ConwayCanvas/ConwayCanvas.worker.js');
    const createCaller = workerMethodCaller(worker)
    this.setActions = {
      zoom: createCaller('setZoom'),
      translate: createCaller('setTranslate'),
      windowSize: createCaller('setWindowSize'),
      table: createCaller('setTable', true),
      canvas: createCaller('setCanvas', true),
    }
    this.shouldUpdateAgain = true
  }
  shouldUpdate(props) {
    if (props.has('table')) {
      this.setActions.table(new Int16Array(this.table).buffer)
    }
    if (props.has('zoom')) {
      this.setActions.zoom(this.zoom)
    }
    if (props.has('translate')) {
      this.setActions.translate(this.translate)
    }
    if (props.has('width') || props.has('height')) {
      this.setActions.windowSize({ width: this.width, height: this.height })
    }
    this.handleEventUpdate('mousedown', props)
    this.handleEventUpdate('wheel', props)
    return this.shouldUpdateAgain
  }
  handleEventUpdate(eventName, props) {
    if (props.has(eventName)) {
      const lastEventListener = props.get(eventName)
      if (typeof lastValue === 'function') {
        this.canvas.removeEventListener(eventName, lastEventListener)
      }
      this.canvas.addEventListener(eventName, this[eventName])
    }
  }
  firstUpdated() {
    this.shouldUpdateAgain = false
    this.setActions.windowSize({ width: this.width, height: this.height });
    this.setActions.canvas(this.offscreenCanvas)
  }
  render () {
    return html `${this.canvas}`
  }
}

customElements.define('as-conway-canvas', ConwayCanvas)
