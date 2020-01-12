
import { workerMethodCaller, workerEventListener } from '../utils.js'
const worker = new Worker('./scripts/workers/conway/conway.worker.js', {
  type: 'module'
});
const createCaller = workerMethodCaller(worker)
// const createListener = workerEventListener(worker)

export const randomizeCaller = createCaller('randomize')
export const conwayCaller = createCaller('conway')

const processTableBuffer = (buffer) => new Int16Array(buffer)
export const randomize = async (options) => {
  const buffer = await randomizeCaller(options)
  return processTableBuffer(buffer)
}
export const conway = async () => {
  const buffer = await conwayCaller()
  return processTableBuffer(buffer)
}
// export const tableUpdatedEvent = createListener('TableUpdated')
