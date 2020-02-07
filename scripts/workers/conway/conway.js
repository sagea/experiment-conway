
import { workerMethodCaller } from '../utils.js'
const worker = new Worker('./scripts/workers/conway/conway.worker.js', { type: 'module' })
const createCaller = workerMethodCaller(worker)

export const randomizeCaller = createCaller('randomize')
export const conwayCaller = createCaller('conway')
export const enableCellsCaller = createCaller('enableCells', true)
export const disableCellsCaller = createCaller('disableCells', true)

const processTableBuffer = (buffer) => new Int16Array(buffer)
export const randomize = async (options) => {
  const buffer = await randomizeCaller(options)
  return processTableBuffer(buffer)
}
export const conway = async () => {
  const buffer = await conwayCaller()
  return processTableBuffer(buffer)
}
export const enableCells = async (cells) => {
  const buffer = await enableCellsCaller(new Int16Array(cells).buffer)
  return processTableBuffer(buffer)
}

export const disableCells = async (cells) => {
  const buffer = await disableCellsCaller(new Int16Array(cells).buffer)
  return processTableBuffer(buffer)
}
