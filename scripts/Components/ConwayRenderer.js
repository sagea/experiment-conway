import {
  html,
  LitElement,
} from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { getAllActive, parse } from '../utils/table.js'

export class ConwayRenderer extends LitElement {
  static get properties() {
    return {
      table: Int16Array,
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
    this.canvas.addEventListener('mousedown', e => {
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
    })
    this.canvas.addEventListener('wheel', e => {
      e.preventDefault()
      const change = e.deltaY / 10
      this.setZoom(this.zoom + change)
    })
    const setSize = () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    window.addEventListener('resize', setSize)
    setSize()
  }
  updated() {
    const { ctx, width, height } = this
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width
      this.canvas.height = height
    }
    ctx.save()
    ctx.fillStyle = 'rgb(18, 18, 18)'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
    ctx.save()
    ctx.scale(this.zoom, this.zoom)

    ctx.translate(this.translate.x, this.translate.y)
    this.drawCells()
    ctx.restore()
    ctx.restore()
  }
  drawCells() {
    const { ctx, table } = this
    ctx.beginPath()
    ctx.fillStyle = 'rgba(68,82,209)'
    for (let i = 0; i < table.length; i += 2) {
      ctx.rect(table[i], table[i + 1], 1, 1)
    } 
    // for (let [x, y] of getAllActive(table).map(i => parse(i))) {
    //   ctx.rect(x, y, 1, 1)
    // }
    ctx.fill()
  }
  render() {
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
        ${this.canvas}
      </div>
    `
  }
}
customElements.define('as-conway-renderer', ConwayRenderer)
