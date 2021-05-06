import { LinePositions } from '../../../view/lineRender/topicLineStyle'
import Bounds from '../../../utils/bounds'
import Position, { diffPosition, normalizeVector, addPosition } from '../../../utils/position'

const SKEW_ELBOW_RATIO = 2 / 3
const HORN_RATIO = 1 / 2

export function curveHorizon({ start, control, end }: LinePositions, padding = 0) {
  const dx = end.x - control.x
  const controlX = dx / 5 + control.x
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `Q ${controlX} ${end.y} ${end.x - padding} ${end.y}`
  )
}

export function curveVertical ({ start, control, end }: LinePositions, padding = 0) {
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `Q ${end.x} ${control.y} ${end.x} ${end.y - padding}`
  )
}

export function sinusHorizon({ start, control, end }: LinePositions) {
  const dx = end.x - control.x
  const flexX = (end.x + control.x) / 2
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `C ${end.x - dx / 4} ${control.y} ${flexX} ${end.y} ${end.x} ${end.y}`
  )
}

export function sinusVertical ({ start, control, end }: LinePositions) {
  const dy = end.y - control.y
  const flexY = (end.y + control.y) / 2
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `C ${control.x} ${end.y - dy / 4} ${end.x} ${flexY} ${end.x} ${end.y}`
  )
}

export function rect(bounds: Bounds) {
  return 'M ' + bounds.x + ' ' + bounds.y +
    'L ' + (bounds.x + bounds.width) + ' ' + bounds.y +
    'L ' + (bounds.x + bounds.width) + ' ' + (bounds.y + bounds.height) +
    'L ' + bounds.x + ' ' + (bounds.y + bounds.height) +
    'z'
}

export function roundedElbowHorizon ({ start, control, end }: LinePositions, corner: number) {
  const linear = Math.abs(control.y - end.y) < corner ? 0 : 1
  const hor = end.x > control.x ? 1 : -1
  const ver = end.y > control.y ? 1 : -1

  const flexPos = { x: control.x, y: end.y }
  corner = Math.min(corner, Math.abs(end.x - control.x))
  const bFlexPos = { x: flexPos.x, y: flexPos.y - ver * corner * linear }
  const aFlexPos = { x: flexPos.x + hor * corner, y: flexPos.y }
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${bFlexPos.x} ${bFlexPos.y}` +
    `Q ${flexPos.x} ${flexPos.y} ${aFlexPos.x} ${aFlexPos.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function roundedElbowVertical ({ start, control, end }: LinePositions, corner: number) {
  const linear = Math.abs(control.x - end.x) < corner ? 0 : 1
  const hor = end.x > control.x ? 1 : -1
  const ver = end.y > control.y ? 1 : -1

  const flexPos = { x: end.x, y: control.y }
  corner = Math.min(corner, Math.abs(end.y - control.y))
  const bFlexPos = { x: flexPos.x - hor * corner * linear, y: flexPos.y }
  const aFlexPos = { x: flexPos.x, y: flexPos.y + ver * corner }
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${bFlexPos.x} ${bFlexPos.y}` +
    `Q ${flexPos.x} ${flexPos.y} ${aFlexPos.x} ${aFlexPos.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function elbowVertical ({ start, control, end }: LinePositions) {
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${end.x} ${control.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function elbowHorizon ({ start, control, end }: LinePositions) {
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${control.x} ${end.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function straight ({ start, control, end }: LinePositions) {
  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function skewElbowVertical ({ start, control, end }: LinePositions) {
  const flexPos = {
    x: end.x,
    y: (end.y - control.y) * SKEW_ELBOW_RATIO + control.y
  }

  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${flexPos.x} ${flexPos.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function skewElbowHorizon ({ start, control, end }: LinePositions) {
  const flexPos = {
    x: (end.x - control.x) * SKEW_ELBOW_RATIO + control.x,
    y: end.y
  }

  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${flexPos.x} ${flexPos.y}` +
    `L ${end.x} ${end.y}`
  )
}

export function hornHorizon ({ start, control, end }: LinePositions) {
  const flexPos = {
    x: (end.x - control.x) * HORN_RATIO + control.x,
    y: end.y
  }
  return _horn(flexPos, { start, control, end })
}

export function hornVertical ({ start, control, end }: LinePositions) {
  const flexPos = {
    x: end.x,
    y: (end.y - control.y) * HORN_RATIO + control.y
  }
  return _horn(flexPos, { start, control, end })
}

function _horn (flexPos: Position, { start, control, end }: LinePositions) {
  const dx = Math.abs(end.x - control.x)
  const dy = Math.abs(end.y - control.y)

  const corner = Math.min(dx, dy) / 4
  const flexes = _flexCornerEaseIn(control, flexPos, end, corner)

  return (
    `M ${start.x} ${start.y}` +
    `L ${control.x} ${control.y}` +
    `L ${flexes[0].x} ${flexes[0].y}` +
    `Q ${flexPos.x} ${flexPos.y} ${flexes[1].x} ${flexes[1].y}` +
    `L ${end.x} ${end.y}`
  )
}

function _flexCornerEaseIn (start: Position, flex: Position, end: Position, corner: number) {
  let v1 = diffPosition(flex, start)
  let v2 = diffPosition(flex, end)
  v1 = normalizeVector(v1, corner * 2)
  v2 = normalizeVector(v2, corner)
  return [
    addPosition(flex, v1),
    addPosition(flex, v2)
  ]
}