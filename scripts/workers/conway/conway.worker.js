importScripts(
  'https://unpkg.com/state-store-lite@1.0.2',
  '../utils.worker.js',
  './tableWithMaps.js'
)

const { createStore } = self.statestorelit
const { workerMethodCreator, TransferObjects } = self.WorkerUtils
const { TableMap } = self.TableMap

const exporter = workerMethodCreator(self)

const defaultState = {
  table: {},
}

const store = createStore({
  randomize(state, { width, height, x = 0, y = 0, randomChance = 0.5 }) {
    const table = new TableMap()
    for (let cx = 0; cx < width; cx++) {
      for (let cy = 0; cy < height; cy++) {
        if (Math.random() <= randomChance) {
          const ax = cx + x
          const ay = cy + y
          table.set(ax, ay)
        }
      }
    }
    return {
      ...state,
      table,
    }
  },
  fireConway(state) {
    return {
      ...state,
      table: state.table.conway()
    }
  }
}, defaultState)

exporter(async function randomize({ width, height, x, y, randomChance }) {
  store.actions.randomize({ width, height, x, y, randomChance })
  return store.getState().table.buffer
})

exporter(async function conway () {
  store.actions.fireConway()
  const obj = store.getState().table.buffer
  return TransferObjects(obj, [obj])
})

exporter(async function get() {
  const obj = store.getState().table.buffer
  return TransferObjects(obj, [obj])
})
