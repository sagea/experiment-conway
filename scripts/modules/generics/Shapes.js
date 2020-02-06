import { VectorFiller } from './VectorFiller.js'
import { v, add, sub, scale, fromAngle, fromPoints, getAngle, shift, applyModifier } from './Vector.js'

export const pixelsTo = (from, to) => {
	const pixels = []
  const diffX = to[0] - from[0]
  const diffY = to[1] - from[1]
  if (diffX === 0 && diffY === 0) {
	  return [from]
  }
  const { ceil, max, abs, round: rounder } = Math	
  const totalItterations = ceil(max(abs(to[0] - from[0]), abs(to[1] - from[1])));
  for (let i = 0; i < totalItterations; i++) {
    const progress = i / totalItterations
    const x = from[0] + rounder(diffX * progress)
    const y = from[1] + rounder(diffY * progress)
    pixels.push([x, y])
  }
  return pixels
}
export const circle = (pos, radius, precision=15) => {
  const { round: rounder } = Math	
	let pixels = []
  const dp = Math.PI * 2;
  let last;
  for (let i = 0; i <= precision; i++) {
    const progress = i / precision
    const angle = dp * progress
    const y = Math.sin(angle) * radius
    const x = Math.cos(angle) * radius
    const now = [rounder(pos[0] + x), rounder(pos[1] + y)];
    pixels = [...pixels, ...pixelsTo(last || now, now)]
    last = now
  }
  return pixels
}
export const Path = (from, to, width=1) => {
  if (width === 1) {
    return pixelsTo(from, to);
  }
  const radius = width / 2;
  const hPI = Math.PI / 2;
  const angle = getAngle(fromPoints(to, from))
  const angleA = angle + hPI
  const angleB = angle - hPI
  
  const yo = applyModifier(
    scale(fromAngle(angleA), radius),
    Math.round,
  )
  
  const yo2 = applyModifier(
    scale(fromAngle(angleB), radius),
    Math.round,
  )
  const filler = new VectorFiller()
  filler.addMany(circle(from, radius))
  filler.addMany(circle(to, radius))
  filler.addMany(pixelsTo(add(from, yo), add(to, yo)))
  filler.addMany(pixelsTo(add(from, yo2), add(to, yo2)))
  return filler.calculate();
}
