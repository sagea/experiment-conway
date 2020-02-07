
export const v = (x, y) => [x, y]
export const add = (a, b) => {
	a = typeof a === 'number' ? v(a, a): a
  b = typeof b === 'number' ? v(b, b): b
  return v(a[0] + b[0], a[1] + b[1])
}
export const sub = (a, b) => {
	a = typeof a === 'number' ? v(a, a): a
  b = typeof b === 'number' ? v(b, b): b

  return v(a[0] - b[0], a[1] - b[1])
}
export const scale = (a, amount) => v(a[0] * amount, a[1] * amount)
export const fromAngle = (angle) => v(
	Math.cos(angle),
  Math.sin(angle)
)
export const fromPoints = (a, b) => sub(b, a)
export const getAngle = (a) => Math.atan2(a[1], a[0])
export const shift = (a) => v(a[1], a[0])
export const applyModifier = (a, xm, ym=xm) => v(xm(a[0]), ym(a[1]))
