import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
import { conway, stringify } from '../../utils/table.js'
import { workerMethodCreator, workerEventCreator, TransferObjects } from '../utils.js'
import { TableMap } from './tableWithMaps.js'
const exporter = workerMethodCreator(self)
const eventCreator = workerEventCreator(self)

const sendTableUpdateEvent = eventCreator('TableUpdated', true)

const defaultState = {
  table: {},
}

const store = createStore({
  randomize(state, { width, height, x = 0, y = 0, randomChance = 0.5 }) {
    const table = new TableMap()
    // let table = {}
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
      table: state.table.conway()// conway(state.table),
    }
  }
}, defaultState)

// store.subscribe(() => {
//   const buffer = store.getState().table.buffer
//   sendTableUpdateEvent(buffer, [buffer])
// })
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
