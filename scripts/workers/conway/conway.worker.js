import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
import { conway, stringify } from '../../utils/table.js'
import { workerMethodCreator } from '../utils.js'
const exporter = workerMethodCreator(self)

const defaultState = {
  table: {},
}

const store = createStore({
  randomize(state, { width, height, x = 0, y = 0, randomChance = 0.5 }) {
    let table = {}
    for (let cx = 0; cx < width; cx++) {
      for (let cy = 0; cy < height; cy++) {
        if (Math.random() <= randomChance) {
          const ax = cx + x
          const ay = cy + y
          table[stringify(ax, ay)] = true
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
      table: conway(state.table),
    }
  }
}, defaultState)

console.log('store', store);

exporter(async function randomize({ width, height, x, y, randomChance }) {
  store.actions.randomize({ width, height, x, y, randomChance })
  return store.getState().table
})

exporter(async function conway () {
  store.actions.fireConway()
  return store.getState().table
})
