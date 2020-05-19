import Position, { addPosition, diffPosition, normalizeVector } from 'utils/position'

export function flexCorner(start: Position, flex: Position, end: Position, corner: number) {
  let v1 = diffPosition(flex, start)
  let v2 = diffPosition(flex, end)
  v1 = normalizeVector(v1, corner)
  v2 = normalizeVector(v2, corner)
  return [
    addPosition(flex, v1),
    addPosition(flex, v2)
  ]
}