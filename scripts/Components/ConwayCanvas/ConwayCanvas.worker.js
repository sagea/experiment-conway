importScripts(
  'https://unpkg.com/state-store-lite@1.0.2',
  '../../workers/utils.worker.js',
  '../../workers/conway/tableWithMaps.js'
)

const { createStore } = self.statestorelit
const { workerMethodCreator } = self.WorkerUtils

// import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
// import { workerMethodCreator } from '../../workers/utils.js'

function memory () {
  const set = new WeakSet()
  return (value, callback) => {
    if (!set.has(value)) {
      set.add(value)
      callback(value)
    }
  }
}

const defaultState = {
  zoom: 2,
  translate: { x: 0, y: 0 },
  canvas: null,
  ctx: null,
  table: [],
  window: {
    width: 0,
    height: 0,
  },
  renderPaused: false
}
const store = createStore({
  setZoom(state, zoom) {
    if (state.zoom === zoom) {
      return state
    }
    return {
      ...state,
      zoom,
    }
  },
  setTranslate(state, { x, y }) {
    if (state.translate.x === x && state.translate.y === y) {
      return state
    }
    return {
      ...state,
      translate: { x, y }
    }
  },
  setWindowSize(state, { width, height }) {
    if (state.window.width === width && state.window.height === height) {
      return state
    }
    return {
      ...state,
      window: { width, height }
    }
  },
  setTable(state, table) {
    return {
      ...state,
      table: new Int16Array(table)
    }
  },
  setCanvas(state, canvas) {
    if (state.canvas === canvas) {
      return state
    }
    return {
      ...state,
      canvas,
      ctx: canvas.getContext('2d'),
    }
  },
  setRenderPaused(state, paused) {
    if (state.renderPaused === paused) {
      return state
    }
    return {
      ...state,
      renderPaused: paused,
    }
  }
}, defaultState)

const whenChanged = memory()
store.subscribe(() => {
  const state = store.getState()
  const { ctx, canvas, zoom, translate, window, table, renderPaused } = state
  whenChanged(state, () => {
    if (renderPaused) {
      return
    }
    if (canvas) {
      whenChanged(window, () => {
        canvas.width = window.width
        canvas.height = window.height
      })
      ctx.save()
      {
        const { width, height } = window
        ctx.fillStyle = 'rgb(18, 18, 18)'
        ctx.fillRect(0, 0, width, height)
        ctx.translate(width / 2, height / 2)
        ctx.save()
        {
          ctx.scale(zoom, zoom)
          ctx.translate(translate.x, translate.y)
          // drawCells
          {
            ctx.beginPath()
            ctx.fillStyle = 'rgba(68,82,209)'
            for (let i = 0; i < table.length; i += 2) {
              ctx.rect(table[i], table[i + 1], 1, 1)
            }
            ctx.fill()
          }
          // end drawCells
        }
        ctx.restore()
      }
      ctx.restore()
    }
  })
})

const exporter = workerMethodCreator(self)

/**
 * This queue is designed to retrieve the last provided event
 * from the client. If the client sends multiple events while the 
 * thread is halted on the worker then we want to select the last 
 * known value and run the action once. Not run it multiple times
 */
const Queue = (handleQueue) => {
  const queue = new Map()
  let activeTimeout
  return methodName => {
    const method = event => {
      if (!activeTimeout) {
        activeTimeout = setTimeout(() => {
          activeTimeout = undefined
          handleQueue(queue.entries())
          queue.clear()
        })
      }
      queue.delete(methodName)
      queue.set(methodName, event)
    }
    Object.defineProperty(method, 'name', {
      get() { 
        return methodName
      },
    })
    return method
  }
}
const messageQueue = Queue((queue) => {
  try {
    store.actions.setRenderPaused(true)
    for (let [eventName, event] of queue) {
      store.actions[eventName](event)
    }
  } catch (err) {}
  store.actions.setRenderPaused(false)
})

exporter(messageQueue('setZoom'))
exporter(messageQueue('setTranslate'))
exporter(messageQueue('setWindowSize'))
exporter(messageQueue('setTable'))
exporter(store.actions.setCanvas)
