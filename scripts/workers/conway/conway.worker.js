import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2?module';
import { workerMethodCreator, TransferObjects } from '../utils.worker.js';
import { TableMap } from './tableWithMaps.js';
import { VectorFiller } from '../../modules/generics/VectorFiller.js';

const exporter = workerMethodCreator(self)
const defaultState = {
  table: new TableMap(),
}
const store = createStore({
  randomize(state, { width, height, x = 0, y = 0, variation = 0.5 }) {
    const table = new TableMap()
    for (let cx = 0; cx < width; cx++) {
      for (let cy = 0; cy < height; cy++) {
        if (Math.random() <= variation) {
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
      table: state.table.conway(),
    }
  },
  enableCells(state, cells) {
    for (let i = 0; i < cells.length; i+=2) {
      state.table.set(cells[i], cells[i + 1])
    }
    return {
      ...state,
      table: state.table,
    }
  },
  disableCells(state, cells) {
    let filler = new VectorFiller()
    for (let i = 0; i < cells.length; i+=2) {
      filler.add(cells[i], cells[i + 1])
    }
    const list = filler.calculate()
    for (let i = 0; i < list.length; i+=2) {
      state.table.delete(list[i], list[i + 1])
    }
    return {
      ...state,
      table: state.table
    }
  }
}, defaultState)

exporter(async function randomize({ width, height, x, y, variation }) {
  store.actions.randomize({ width, height, x, y, variation })
  const buffer = store.getState().table.buffer
  return TransferObjects(buffer, [buffer]);
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

exporter(async function enableCells(cellsBuffer) {
  store.actions.enableCells(new Int16Array(cellsBuffer))
  const table = store.getState().table.buffer
  return TransferObjects(table, [table])
})

exporter(async function disableCells(cellsBufer) {
  store.actions.disableCells(new Int16Array(cellsBufer))
  const table = store.getState().table.buffer
  return TransferObjects(table, [table])
})
