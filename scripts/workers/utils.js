
function uuid() {
  // Can't use uuid module since it doesn't have a browser module bundle
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-21963136
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}
const transfers = new WeakMap()
export const TransferObjects = (value, transferrableObjects) => {
  transfers.set(value, transferrableObjects)
  return value
}

export const workerMethodCreator = workerContext => (methodNameOrMethod, maybeMethod) => {
  let method;
  let methodName;
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

export const workerMethodCaller = worker => (
  methodName,
  transferArgs = false,
) => {
  return (...args) => {
    // todo: handle thrown errors inside a worker by rejecting
    return new Promise(resolve => {
      const callId = uuid()
      const call = ({ data: { event, id, returnValue } }) => {
        // nit: the event === methodName shouldn't matter since the uuid should be unique. But I am adding it just in case.
        if (id === callId && event === methodName) {
          resolve(returnValue)
          worker.removeEventListener('message', call)
        }
      }
      worker.addEventListener('message', call)
      worker.postMessage(
        {
          type: 'method',
          event: methodName,
          arguments: args,
          id: callId,
        },
        transferArgs ? args : [],
      )
    })
  }
}

export const workerMethodCaller2 = worker => () => {
  let map = new Map()
  return new Proxy({}, {
    get(obj, methodName) {
      if (map.has(methodName)) {
        return map.get(methodName)
      }
      const method = (...args) => {
        // todo: handle thrown errors inside a worker by rejecting
        return new Promise(resolve => {
          const callId = uuid()
          const call = ({ data: { type, event, id, returnValue } }) => {
            // nit: the event === methodName shouldn't matter since the uuid should be unique. But I am adding it just in case.
            if (type === 'method' && id === callId && event === methodName) {
              resolve(returnValue)
              worker.removeEventListener('message', call)
            }
          }
          worker.addEventListener('message', call)
          worker.postMessage(
            {
              type: 'method',
              event: methodName,
              arguments: args,
              id: callId,
            },
            [],
          )
        })
      }
      map.set(methodName, method);
      return method;
    }
  })
}

export const workerEventListener = (worker) => (eventName) => (callback) => {
  const method = ({data: {type, event, data }}) => {
    if (type === 'event' && eventName === event) {
      callback(data)
    }
  }
  worker.addEventListener('message', method)
  return () => worker.removeEventListener('message', method)
}
export const workerEventCreator = (workerContext) => 
  (eventName, transferArgs = false) => 
    (eventData, transferrableObjects=[]) => {
      workerContext.postMessage({
        type: 'event',
        event: eventName,
        data: eventData
      }, transferArgs ? transferrableObjects : [])
    }
