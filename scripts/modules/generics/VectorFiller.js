export class VectorFiller {
	constructor() {
    this.map = new Map()
    this.cachedList = null
  }
  get list() {
    if (this.cachedList) {
      return this.cachedList
    }
    this.cachedList = []
    for (let [x, y] of this.map) {
      this.cachedList.push(x, y)
    }
    return this.cachedList
  }
  addMany(list) {
  	for (let [x, y] of list) {
    	this.add(x, y)
    }
  }
  add(x, y) {
  	let xm = this.map.get(x)
    if(!xm) {
      this.map.set(x, [y, y])
    } else {
	    xm[0] = Math.min(xm[0], y)
      xm[1] = Math.max(xm[1], y)
    }
  }
  pointInside(x, y) {
    let xm = this.map.get(x)
    return xm && xm[0] <= y && y <= xm[1]
  }
  calculate() {
  	let points = []
    for (let [x, [minY, maxY]] of this.map) {
    	if (minY === maxY) {
      	points.push(x, minY)
      } else {
        for (let y = minY; y <= maxY; y++) {
          points.push(x, y)
        }
      }
    }
    return points
  }
}
