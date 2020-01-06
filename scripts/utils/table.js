export function* surroundingCells (table, cx, cy) {
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      if (row === 0 && col === 0) {
        continue;
      }
      const x = cx + col
      const y = cy + row
      if (table.hasOwnProperty(y) && table[y].hasOwnProperty(x)) {
        yield table[y][x];
      } 
    }
  }
}

export function* eachCellTable (table) {
	for (let y = 0; y < table.length; y++) {
  	for (let x = 0; x < table[y].length; x++) {
    	yield { x, y, value: table[y][x] };
    }
  }
}
