


self.TableMap = (() => {
  class TableMap {
    constructor(arrayBuffer) {
      this.xMap = new Map()
      this.list = []
    }
    clone() {
      const map = new TableMap()
      for (let [x, y] of this.list) {
        map.set(x, y)
      }
      return map
    }
    set(x, y, value = true) {
      if (this.has(x, y)) {
        return
      }
      this.xMap.set(
        x,
        (this.xMap.get(x) || new Map()).set(y, value)
      )
      this.list.push(x, y)
    }
    has(x, y) {
      return this.xMap.has(x) && this.xMap.get(x).has(y)
    }
    isActive(x, y) {
      return (this.xMap.has(x) && this.xMap.get(x).get(y)) || false
    }
    getAll() {
      let table = new TableMap()
      for (let i = 0; i < this.list.length; i+=2) {
        const x = this.list[i]
        const y = this.list[i + 1]
        for (let row = -1; row <= 1; row++) {
          for (let col = -1; col <= 1; col++) {
            let ax = x + col
            let ay = y + row
            table.set(ax, ay, this.isActive(ax, ay) || false)
          }
        }
      }
      return table
    }
    getActiveNeighborCount(x, y) {
      let count = 0
      for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
          if (row === 0 && col === 0) {
            continue
          }
          if (this.isActive(x + col, y + row)) {
            count++
          }
        }
      }
      return count
    }
    conway () {
      const table = new TableMap()
      for (let [x, y, active] of this.getAll()) {
        const neighborCount = this.getActiveNeighborCount(x, y)
        if (shouldSurvive(active, neighborCount)) {
          table.set(x, y)
        }
      }
      return table
    }
    get buffer() {
      return new Int16Array(this.list).buffer
    }
    *[Symbol.iterator]() {
      for (let [x, yMap] of this.xMap) {
        for (let [y, active] of yMap) {
          yield [x, y, active]
        }
      }
    }
  }
  
  function shouldSurvive(active, neighborCount) {
    if (active && neighborCount < 2) {
      // cell becomes inactive
      return false
    } else if (active && (neighborCount == 2 || neighborCount === 3)) {
      // cell stays active
      return true
    } else if (active && neighborCount > 3) {
      // cell becomes inactive
      return false
    } else if (!active && neighborCount === 3) {
      // cell becomes active
      return true
    }
    return false
  }
  return {
    TableMap
  }
}) ()
