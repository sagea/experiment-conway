
import { workerMethodCaller2 } from '../utils.js'
const worker = new Worker('./scripts/workers/conway/conway.worker.js', {
  type: 'module'
});
// const createCaller = workerMethodCaller(worker);

// export const { randomize } = createCaller('randomize');
// export const { conway } = createCaller('conway');

export const { randomize, conway } = workerMethodCaller2(worker)();
