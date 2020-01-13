import { TableMap } from '../tableWithMaps.js'
const { expect } = chai
const makeTableMapFromArray = (table) => {
  const tm = new TableMap()
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[y].length; x++) {
      if (table[y][x] === 1) {
        tm.set(x, y)
      }
    }
  }
  return tm
}
const makeCoordListFromTable = (table) => {
  let arr = []
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[y].length; x++) {
      if (table[y][x] === 1) {
        arr.push(x, y)
      }
    }
  }
  return arr
}
const sortCordList = (list) => {
  const newList = []
  for (let i = 0; i < list.length; i += 2) {
    newList.push([list[i], list[i + 1]])
  }
  return newList.sort(([ax, ay], [bx, by]) => {
    if (ax === bx) return ay - by
    return ax - bx
  }).flat()
}
describe('TEST UTILITIES', () => {
  it('makeCoordListFromTable', () => {
    expect(makeCoordListFromTable([
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ])).to.deep.equal([1, 1])
    expect(makeCoordListFromTable([
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ])).to.deep.equal([1, 0, 1, 1])
    expect(makeCoordListFromTable([
      [1, 1, 0],
      [0, 0, 0],
      [1, 0, 1],
    ])).to.deep.equal([0, 0, 1, 0, 0, 2, 2, 2])
  })
})
describe('TableMap', () => {
  describe('set', () => {
    it('should set live squares', () => {
      let map = new TableMap()
      map.set(0, 0, true)
      map.set(1, 2, true)
      expect(map.list).to.deep.equal([0, 0, 1, 2])
    })
  })
  describe('getActiveNeighborCount', () => {
    it('should get the active neighbor count', () => {
      const _1 = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]
      expect(makeTableMapFromArray(_1).getActiveNeighborCount(1, 1)).to.equal(0)
      expect(makeTableMapFromArray(_1).getActiveNeighborCount(0, 0)).to.equal(1)
      const _2 = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]
      expect(makeTableMapFromArray(_2).getActiveNeighborCount(1, 1)).to.equal(1)
      const _3 = [
        [0, 0, 0],
        [0, 1, 1],
        [0, 0, 1],
      ]
      expect(makeTableMapFromArray(_3).getActiveNeighborCount(1, 1)).to.equal(2)
      const _4 = [
        [0, 0, 1],
        [0, 1, 1],
        [0, 0, 1],
      ]
      expect(makeTableMapFromArray(_4).getActiveNeighborCount(1, 1)).to.equal(3)
      const _5 = [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 1],
      ]
      expect(makeTableMapFromArray(_5).getActiveNeighborCount(1, 1)).to.equal(4)
      const _6 = [
        [0, 0, 1],
        [0, 1, 1],
        [1, 1, 1],
      ]
      expect(makeTableMapFromArray(_6).getActiveNeighborCount(1, 1)).to.equal(5)
      const _7 = [
        [0, 0, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]
      expect(makeTableMapFromArray(_7).getActiveNeighborCount(1, 1)).to.equal(6)
      const _8 = [
        [1, 0, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]
 
      expect(makeTableMapFromArray(_8).getActiveNeighborCount(1, 1)).to.equal(7)
      expect(makeTableMapFromArray(_8).getActiveNeighborCount(1, 0)).to.equal(5)

      const _9 = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]
      expect(makeTableMapFromArray(_9).getActiveNeighborCount(1, 1)).to.equal(8)
    })
  })
  describe('isActive', () => {
    it('should return true if active and false if not', () => {
      const table = makeTableMapFromArray([
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
      ])
      expect(table.isActive(0, 0)).to.equal(false)
      expect(table.isActive(1, 0)).to.equal(false)
      expect(table.isActive(2, 0)).to.equal(true)

      expect(table.isActive(0, 1)).to.equal(false)
      expect(table.isActive(1, 1)).to.equal(true)
      expect(table.isActive(2, 1)).to.equal(false)
      
      expect(table.isActive(0, 2)).to.equal(false)
      expect(table.isActive(1, 2)).to.equal(true)
      expect(table.isActive(2, 2)).to.equal(true)
    })
  })
  describe('getAll', () => {
    it('should getAll active and inactive cells', () => {
      const getAll = (table) => Array.from(makeTableMapFromArray(table).getAll())
      expect(getAll([
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]).length).to.equal(9)
      expect(getAll([
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
      ]).length).to.equal(18)
      const stuff = getAll([
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ])
      expect(stuff.length).to.equal(12)
      expect(stuff).to.deep.include([0, 0, false])
      expect(stuff).to.deep.include([1, 0, false])
      expect(stuff).to.deep.include([2, 0, false])
      expect(stuff).to.deep.include([3, 0, false])

      expect(stuff).to.deep.include([0, 1, false])
      expect(stuff).to.deep.include([1, 1, true])
      expect(stuff).to.deep.include([2, 1, true])
      expect(stuff).to.deep.include([3, 1, false])

      expect(stuff).to.deep.include([0, 2, false])
      expect(stuff).to.deep.include([1, 2, false])
      expect(stuff).to.deep.include([2, 2, false])
      expect(stuff).to.deep.include([3, 2, false])
    })
  })
  describe('conway', () => {
    it('A cell should die if it has no neighbors', () => {
      const start = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]
      const table = makeTableMapFromArray(start)
      expect(table.conway().isActive(1, 1)).to.equal(false)
      expect(table.list).to.deep.equal(makeCoordListFromTable(start))
    })
    it('a cell should die if there are more than 3 neighbors', () => {
      const start = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]
      const table = makeTableMapFromArray(start)
      expect(table.conway().isActive(1, 1)).to.equal(false)
      expect(table.list).to.deep.equal(makeCoordListFromTable(start))
    })
    it('a cell should come alive if there are 3 neighbors', () => {
      const start = [
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
      ]
      const table = makeTableMapFromArray(start)
      expect(table.conway().isActive(0, 0)).to.equal(true)
      expect(table.list).to.deep.equal(makeCoordListFromTable(start))
    })
    it('a cell should stay alive if it has 2 or 3 neighbors', () => {
      const start = [
        [1, 0, 0, 1, 0],
        [1, 1, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]
      
      const table = makeTableMapFromArray(start)
      expect(table.conway().isActive(0, 1)).to.equal(true)
      expect(table.conway().isActive(4, 1)).to.equal(true)
      expect(table.list).to.deep.equal(makeCoordListFromTable(start))
    })
  })
  
})
