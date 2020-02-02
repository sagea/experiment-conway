import { Event } from '../generics/Event.js'
class ToolManager {
  constructor(store) {
    this.store = store
    this.wheel = new Event()
    this.mousemove = new Event()
    this.mouseup = new Event()
    this.mousedown = new Event()
  }
  setActiveTool() {}
}

class CanvasMoveTool {
  constructor(toolManager, store) {
    this.store = store
    this.toolManager = toolManager
    this.disposables = new Set()
  }
  added = () => {
    
    const wheelOff = this.toolManager.wheel.on((e) => {
      e.preventDefault()
      const change = e.deltaY / 10
      this.store.actions.setZoom(this.zoom + change)
    })
    const mousedownOff = this.toolManager.mousemove.on(e => {
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
    })
    this.disposables.add(wheelOff)
    this.disposables.add(mousedownOff)
  }
  dispose() {
    for (let disposable of this.disposables) {
      disposable()
    }
  }

}