import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { getAllActive, parse } from '../utils/table.js'

export class ConwayRenderer extends LitElement {
  static get properties() {
    return {
      table: Array,
      cellSize: Number,
      translate: Object,
      zoom: Number,
      setZoom: Function,
      setTranslate: Function,
      width: Number,
      height: Number,
    }
  }
  constructor() {
    super()
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    const setSize = () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    window.addEventListener('resize', setSize)
    setSize()
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
  }
  handleMouseDown(e) {
    e.preventDefault()
    const startTranslate = { ...this.translate }
    const start = { x: e.clientX / this.zoom, y: e.clientY / this.zoom }
    const mousemove = e => {
      const now = { x: e.clientX / this.zoom, y: e.clientY / this.zoom }
      const diff = { x: now.x - start.x, y: now.y - start.y }
      const nextX = Math.floor(startTranslate.x + diff.x)
      const nextY = Math.floor(startTranslate.y + diff.y)
      this.setTranslate({ x: nextX, y: nextY })
    }
    const mouseup = () => {
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
    }
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }
  handleWheel(e) {
    e.preventDefault()
    const change = e.deltaY / 10
    this.setZoom(this.zoom + change)
  }
  render() {
    const { table, width, height, translate, zoom } = this
    
    return html`
      <style>
        .container {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
      </style>
      <div class="container">
        <as-conway-canvas
          .table=${table}
          .width=${width}
          .height=${height}
          .translate=${translate}
          .zoom=${zoom}
          .mousedown=${this.handleMouseDown}
          .wheel=${this.handleWheel}
        ></as-conway-canvas>
      </div>
    `
  }
}
customElements.define('as-conway-renderer', ConwayRenderer)
