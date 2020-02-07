const neighborArray = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1], [0, 1], [1, 1]
].flat()
const neighborArrayLength = neighborArray.length;
export class TableMap {
  constructor() {
    this.xMap = new Map()
    this.activeCallCount = 0
    this.cachedList = null
    this.cachedValues = null
  }
  get values () {
    this.calculateListAndValues()
    return this.cachedValues
  }
  get list () {
    this.calculateListAndValues()
    return this.cachedList
  }
  calculateListAndValues() {
    if (this.cachedList && this.cachedValues) {
      return
    }

    this.cachedList = []
    this.cachedValues = []
    for (let xEntries of this.xMap) {
      for (let yEntries of xEntries[1]) {
        // if (yEntries[1]) {
        this.cachedList.push(xEntries[0], yEntries[0])
        this.cachedValues.push(yEntries[1])
        // }
      }
    }
  }
  set(x, y, value = true) {
    if (this.has(x, y)) {
      return
    }
    this.xMap.set(
      x,
      (this.xMap.get(x) || new Map()).set(y, value)
    )
    this.cachedList = null
    this.cachedValues = null
  }
  delete(x, y) {
    const yMap = this.xMap.get(x)
    if (yMap) {
      yMap.delete(y)
      if (yMap.size === 0) {
        this.xMap.delete(x)
      }
      this.cachedList = null
      this.cachedValues = null
    }
  }
  has(x, y) {
    return this.xMap.has(x) && this.xMap.get(x).has(y)
  }
  isActive(x, y) {
    this.activeCallCount++;
    return (this.xMap.has(x) && this.xMap.get(x).get(y)) || false
  }
  getAll() {
    let table = new TableMap()
    const list = this.list;
    for (let i = 0; i < list.length; i+=2) {
      const x = list[i]
      const y = list[i + 1]
      for (let j = 0; j < neighborArrayLength; j+=2) {
        let ax = x + neighborArray[j]
        let ay = y + neighborArray[j + 1]
        table.set(ax, ay, this.isActive(ax, ay) || false)
      }
    }
    return table
  }
  evaluateActive(x, y) {
    let activeCount = 0
    for (let j = 0; j < neighborArrayLength; j+=2) {
      if (this.isActive(x + neighborArray[j], y + neighborArray[j + 1])) {
        activeCount++
      }
      if (activeCount > 3) {
        return false
      }
    }
    return activeCount < 2
      ? false
      : true
  }
  evaluateInactive(x, y) {
    let activeCount = 0;
    let inactiveCount = 0
    for (let j = 0; j < neighborArrayLength; j+=2) {
      if (this.isActive(x + neighborArray[j], y + neighborArray[j + 1])) {
        activeCount++
      } else {
        inactiveCount++
      }
      if (activeCount > 3 || inactiveCount > 5) {
        return false
      }
    }
    return activeCount === 3;
  }
  conway () {
    const table = new TableMap()
    for (let [x, y, active] of this.getAll()) {
      if (active && this.evaluateActive(x, y)) {
        table.set(x, y)
      } else if (!active && this.evaluateInactive(x, y)) {
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
