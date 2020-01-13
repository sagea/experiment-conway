
function uuid() {
  // Can't use uuid module since it doesn't have a browser module bundle
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-21963136
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
      return v.toString(16)
  })
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
