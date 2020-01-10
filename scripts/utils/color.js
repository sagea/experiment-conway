export function* cycleColors (colors) {
  if (!Array.isArray(colors)) {
    throw new Error('Missing colors array')
  }
  let i = 0;
  while(true) {
    i = i >= colors.length ? 0: i + 1;

    yield colors[i]
  }

}