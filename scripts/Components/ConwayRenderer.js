import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1?module'

export class ConwayRenderer extends LitElement {
  static get properties() {
    return {
      table: Array,
      cellSize: Number,
      translate: Object,
      zoom: Number,
      setZoom: Function,
      setTranslate: Function,
      onDrag: Function,
      width: Number,
      height: Number,
      tool: String,
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
    const calculate = ({ clientX: x, clientY: y}) => {
      const { width, height, zoom} = this;
      const cw = width / 2
      const ch = height / 2
      return {
        x: (x - cw) / zoom,
        y: (y - ch) / zoom,
      }
    }
    const startTranslate = { ...this.translate }
    const start = calculate(e);
    let last = start
    const mousemove = e => {
      const { translate } = this
      const now = calculate(e)
      const diff = { x: now.x - start.x, y: now.y - start.y }
      const nextX = Math.floor(startTranslate.x + diff.x)
      const nextY = Math.floor(startTranslate.y + diff.y)
      this.onDrag({
        now: { x: now.x - translate.x, y: now.y - translate.y},
        last: { x: last.x - translate.x, y: last.y - translate.y },
        cellPos: { x: nextX, y: nextY },
      })
      last = now
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
