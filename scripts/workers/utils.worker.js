const transfers = new WeakMap()

export const TransferObjects = (value, transferrableObjects) => {
  transfers.set(value, transferrableObjects)
  return value
}
  
export const workerMethodCreator = workerContext => (methodNameOrMethod, maybeMethod) => {
  let method
  let methodName
  if (typeof methodNameOrMethod === 'string') {
    method = maybeMethod
    methodName = methodNameOrMethod
  } else {
    method = methodNameOrMethod
    methodName = methodNameOrMethod.name
  }
  workerContext.addEventListener(
    'message',
    ({ data: { event, arguments: args, id } }) => {
      if (event === methodName) {
        Promise.resolve(method(...args)).then(returnValue => {
          const transferrableObjects = transfers.get(returnValue) || []
          workerContext.postMessage({ event: methodName, id, returnValue }, transferrableObjects)
        })
      }
    },
  )
}
