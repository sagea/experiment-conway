export class Event {
  constructor() {
    this.callbacks = new Set()
  }
  emit (data) {
    for (let callback of this.callbacks) {
      callback(data)
    }
  }
  on (callback) {
    this.callbacks.add(callback)
    return () => this.off(callback)
  }
  off(callback) {
    this.callbacks.delete(callback)
  }
}
