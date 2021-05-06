import Size from './size'
import Position from './position'

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export function isSameSize(size1: Size, size2: Size) {
  return stripNum(size1.width) === stripNum(size2.width) &&
    stripNum(size1.height) === stripNum(size2.height)
}

function stripNum(num: number, precision = 12): number {
  return +parseFloat(num && num.toPrecision(precision))
}

export function mergeArray(array: Bounds[]) {
  return array.reduce((pre, cur) => { return merge(pre, cur) })
}

export function merge(b1: Bounds, b2: Bounds): Bounds {
  const x = Math.min(b1.x, b2.x)
  const y = Math.min(b1.y, b2.y)
  const width = Math.max(b1.x + b1.width, b2.x + b2.width) - x
  const height = Math.max(b1.y + b1.height, b2.y + b2.height) - y
  return { x, y, width, height }
}

export function move(b: Bounds, pos: Position) {
  return {
    x: pos.x + b.x,
    y: pos.y + b.y,
    width: b.width,
    height: b.height
  }
}

export function toString(b: Bounds) {
  return `[ x: ${b.x}, y: ${b.y}, width: ${b.width}, height: ${b.height} ]`
}

export default Bounds