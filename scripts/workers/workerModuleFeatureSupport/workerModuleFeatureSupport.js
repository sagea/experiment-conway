export const checkSupport = async () => new Promise(resolve => {
  const worker = new Worker('./scripts/workers/workerModuleFeatureSupport/workerModuleFeatureSupport.worker.js', {
    type: 'module',
  })
  worker.addEventListener('message', () => {
    resolve(true)
    worker.terminate()
  })
  worker.addEventListener('error', (err) => {
    resolve(false)
    worker.terminate()
  })
})