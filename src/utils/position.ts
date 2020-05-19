export default interface Position {
  x: number
  y: number
}

export function isSamePosition(position1: Position, position2: Position) {
  return position1.x === position2.x && position1.y === position2.y
}

export function diffPosition(from: Position, to: Position) {
  return {
    x: to.x - from.x,
    y: to.y - from.y
  }
}

export function normalizeVector(vector: Position, len = 1) {
  const d = Math.hypot(vector.x, vector.y)
  const ratio = d / len
  return {
    x: vector.x / ratio,
    y: vector.y / ratio
  }
}

export function addPosition(p1: Position, p2: Position) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  }
}

export function getPosition(x: number, y: number) {
  return { x, y }
}