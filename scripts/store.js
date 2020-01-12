import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
import { activate, conway, stringify } from './utils/table.js'

const defaultState = {
  activeTool: 'move',
  table: new Int16Array(),
  changes: [],
  playing: false,
  zoom: 5,
  translate: { x: 0, y: 0 },
  speed: 30,
  randomForm: {
    variation: .3,
    size: 300,
  }
}

export const store = createStore(
  {
    setTable(state, { table }) {
      return {
        ...state,
        table,
      }
    },
    randomizeTable(state, { width, height, x = 0, y = 0, randomChance = 0.5 }) {
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

    conwayFrameLite(state) {
      return {
        ...state,
        table: conway(state.table),
      }
    },

    setPlaying(state, value) {
      return {
        ...state,
        playing: value,
      }
    },
    setSpeed(state, speed) {
      return {
        ...state,
        speed,
      }
    },
    setZoom(state, zoom) {
      const zoomLimit = Math.min(Math.max(zoom, 2), 20)
      const newZoom = Math.floor(zoomLimit * 10) / 10

      if (newZoom === state.zoom) {
        return state
      }
      return {
        ...state,
        zoom: newZoom,
      }
    },
    setTranslate(state, { x, y }) {
      if (state.translate.x === x && state.translate.y === y) {
        return state
      }
      return {
        ...state,
        translate: { x, y },
      }
    },
    setTool(state, tool) {
      return {
        ...state,
        tool,
      }
    },
    setRandomFormVariation(state, variation) {
      if (state.randomForm.variation === variation) {
        return state
      }
      return {
        ...state,
        randomForm: {
          ...state.randomForm,
          variation,
        }
      }
    },
    setRandomFormSize(state, size) {
      if (state.randomForm.size === size) {
        return state
      }
      return {
        ...state,
        randomForm: {
          ...state.randomForm,
          size,
        }
      }
    }
  },
  defaultState,
)
