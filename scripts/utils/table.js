export function parse (xy) {
  return xy.split(',').map(i => parseInt(i))
}

export function stringify (x, y) {
  return `${x},${y}`
}

export function isActive(table, x, y) {
  return table.hasOwnProperty(stringify(x, y))
}

export function count(table) {
  return Object.keys(table).length
}

export function getAllActive (table) {
  return Object.keys(table)
}
export function activate(table, x, y) {
  return {
    ...table,
    [stringify(x, y)]: true
  }
}
export function deactivate(table, x, y) {
  const clone = {...table}
  delete clone[stringify(x, y)]
  return clone
}

/*
  return string[]
*/
export function neighborCoords(x, y) {
  const neighbors = []
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      if (row === 0 && col === 0) {
        continue
      }
      neighbors.push(stringify(x + col, y + row))
    }
  }
  return neighbors
}

export function getActiveNeighborCount (table, x, y) {
  let activeNeighborCount = 0
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      if (row === 0 && col === 0) {
        continue
      }
      if (isActive(table, x + col, y + row)) {
        activeNeighborCount++
      }
    }
  }
  return activeNeighborCount
}
export function getActiveAndInactiveNeighboringCells (table) {
  const active = getAllActive(table)
  const all = new Set(active)
  for (let [x, y] of active.map(pos => parse(pos))) {
    for (let neighbor of neighborCoords(x, y)) {
      all.add(neighbor)
    }
  }
  const getActiveAndInactiveNeighboringCellsMap = (cordStr) => {
    const [x, y] = parse(cordStr)
    return [[x, y], isActive(table, x, y)]
  }
  return [...all].map(getActiveAndInactiveNeighboringCellsMap)
}
// export function neighborCount (tableL)
export function conway (table) {
  let newTable = {}
  for (let [[x, y], active] of getActiveAndInactiveNeighboringCells(table)) {
    const neighborCount = getActiveNeighborCount(table, x, y)
    if (active && neighborCount < 2) {
      // cell becomes inactive
    } else if (active && (neighborCount == 2 || neighborCount === 3)) {
      newTable[stringify(x, y)] = true
    } else if (active && neighborCount > 3) {
      // cell becomes inactive
    } else if (!active && neighborCount === 3) {
      newTable[stringify(x, y)] = true
    }
  }
  return newTable
}


