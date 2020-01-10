export function whenChanged (callback) {
  const set = new WeakSet()
  return (value) => {
    if (!set.has(value)) {
      set.add(value)
      callback(value)
    }
  }
}
