export function whenChanged(callback) {
  const set = new WeakSet()
  return (value) => {
    if (!set.has(value)) {
      set.add(value)
      callback(value)
    }
  }
}

export function memory () {
  const set = new WeakSet()
  return (value, callback) => {
    if (!set.has(value)) {
      set.add(value)
      callback(value)
    }
  }
}
