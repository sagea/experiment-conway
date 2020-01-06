import { createStore } from 'https://unpkg.com/state-store-lite@1.0.2/es/statestorelit.mjs?module'
import { LIVE, DEAD } from './constants.js'
import { surroundingCells, eachCellTable } from './utils/table.js'


const defaultState = {
	table: [],
  tableSize: {
  	row: 0,
    cell: 0,
  },
  playing: false,
  cellSize: 10,
  speed: 30,
}

export const store = createStore({
	setTableDimensions(state, { row, cell }) {
  	return {
    	...state,
      table: new Array(row).fill()
      	.map(i => new Array(cell).fill(DEAD)),
      tableSize: {
      	...state.tableSize,
        row,
        cell,
      },
    };
  },
  randomizeTable(state) {
  	const { row, cell } = state.tableSize;
  	return {
    	...state,
      table: new Array(row)
      	.fill()
      	.map(i => 
        	new Array(cell)
          	.fill()
            .map(() => Math.random() <= .3 ? LIVE : DEAD)
        ),
    }
  },
  setCell(state, { x, y, value }) {
  	if (x < 0 || x > state.tableSize.cell - 1) {
    	return state
    }
    if (y < 0 || y > state.tableSize.row -1) {
	    return state
    }
    const row = state.table[y];
    return {
    	...state,
    	table: [
      	...state.table.slice(0, y),
        [
        	...row.slice(0, x),
          value,
          ...row.slice(x + 1),
        ],
        ...state.table.slice(y + 1),
      ]
    }
  },
  conwayFrame(state) {
  	const newTable = [];
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
		// Any live cell with two or three live neighbours lives on to the next generation.
		// Any live cell with more than three live neighbours dies, as if by overpopulation.
		// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  	for (let { x, y, value } of eachCellTable(state.table)) {
    	newTable[y] = newTable[y] || [];
      const neighborCount = [...surroundingCells(state.table, x, y)].filter(i => i === LIVE).length;
      if (value === LIVE && neighborCount < 2) {
      	newTable[y][x] = DEAD
      } else if (value === LIVE && (neighborCount == 2 || neighborCount === 3)) {
      	newTable[y][x] = LIVE
      } else if (value === LIVE && neighborCount > 3) {
      	newTable[y][x] = DEAD
      } else if (value === DEAD && neighborCount === 3) {
      	newTable[y][x] = LIVE
      } else {
      	newTable[y][x] = value
      }
    }
  	return {
    	...state,
      table: newTable,
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
  }
}, defaultState)
