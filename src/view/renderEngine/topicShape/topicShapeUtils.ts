import BranchViewController from '../../../viewController/branchViewController'
import { Direction, TopicType } from '../../../common/constants/models'
import Bounds from '../../../utils/bounds'
import Position from '../../../utils/position'
import StructureClass from '../../../common/constants/structures'
import { isMapStructure } from '../../../structure/helper/structureUtils'
import { TopicShapeType, BranchConnection } from '../../../common/constants/styles'

enum LineFocusType {
  DIVER_LINE = 'diverLine', // Divergent Line
  ORDER_LINE = 'orderLine',
  FOCUS_LINE = 'focusLine',
}

const offsetPointCalcFnMap = {

  calcMapStructureStartPoint(parent: BranchViewController, child: BranchViewController): Position {

    const f = (() => {
      // critical value
      const y0 = 100
      // f(y1) = (p1 - p2) * k
      const y1 = 600
      // key point
      const k = 0.1
    
      /**
       * @param {Number} y - y-position
       * @param {Number} p1 - f(y0) === p1
       * @param {Number} p2 - approximation
       * */
      return function (y:number, p1:number, p2:number) {
        p1 = Math.abs(p1)
        const symb = p2 / Math.abs(p2)
        y = Math.abs(y)
        if (y < y0) {
          return symb * p1
        } else {
          p2 = Math.abs(p2)
          const c = p2
          const b = ((k * p1 + (1 - k) * p2) * y1 - (p1 - p2) * y0) / ((1 - k) * p1 + (k - 2) * p2)
          const a = (p1 - p2) * (y0 + b)
          return symb * (a / (y + b) + c)
        }
      }
    })()

    const topicBounds = parent.topicViewController.bounds
    const scale = 2 / 3

    const isRight = child.position.x - parent.position.x > 0
    const p1 = isRight ? (topicBounds.x + topicBounds.width) * scale : topicBounds.x * scale
    const p2 = isRight ? 0.1 : -0.1
    const offset = isRight ? topicBounds.x : -topicBounds.x
    const deltaX = f(child.position.y - parent.position.y, p1, p2) + offset

    return { x: deltaX, y: 0 }
  },

  calcSinusStartYPoint(parent: BranchViewController, child: BranchViewController): Position {
    const isMap = isMapStructure(parent)
    const topicBounds = parent.topicViewController.bounds
    const height = topicBounds.height - 5

    const isRight = child.position.x - parent.position.x > 0
    let offset = 0

    const attachedChildren = parent.getChildrenByType(TopicType.ATTACHED)
    if (!isMap) {
      const len = attachedChildren.length
      const index = attachedChildren.indexOf(child)
      const step = Math.min(height / (len + 1), 3)

      const mid = len % 2 ? Math.floor(len / 2) : len / 2 - 0.5
      offset = (index - mid) * step
    }

    if (!isMap && !isRight) {
      offset *= -1
    }

    return { x: 0, y: offset }
  }

}

export { LineFocusType, offsetPointCalcFnMap }

export const END_OFFSET = -1

export function getStartDirection(startBranch: BranchViewController, endBranch: BranchViewController) {
  switch(startBranch.structureClass) {
    case StructureClass.LOGIC_RIGHT:
      return Direction.RIGHT

    case StructureClass.LOGIC_LEFT:
      return Direction.LEFT

    case StructureClass.TREE_LEFT:
    case StructureClass.TREE_RIGHT:
    case StructureClass.ORG_CHART_DOWN:
    case StructureClass.TIMELINE_VERTICAL:
    case StructureClass.TIMELINE_HORIZONTAL_DOWN:
      return Direction.DOWN

    case StructureClass.ORG_CHART_UP:
    case StructureClass.TIMELINE_HORIZONTAL_UP:
      return Direction.UP

    default:
      if (!endBranch) return Direction.RIGHT
      return endBranch.position.x < startBranch.position.x ? Direction.LEFT : Direction.RIGHT
  }
}

export function getEndDirection(startBranch: BranchViewController, endBranch: BranchViewController): Direction {
  switch(startBranch?.structureClass) {
    case StructureClass.TREE_RIGHT:
    case StructureClass.LOGIC_RIGHT:
      return Direction.LEFT

    case StructureClass.TREE_LEFT:  
    case StructureClass.LOGIC_LEFT:
      return Direction.RIGHT

    case StructureClass.ORG_CHART_DOWN:
      return Direction.UP

    case StructureClass.ORG_CHART_UP:
      return Direction.DOWN

    default:
      return endBranch.position.x < startBranch.position.x ? Direction.RIGHT : Direction.LEFT
  }
}

export function getLineFocusType(branch: BranchViewController) {
  if (isMapStructure(branch)) {
    const shapeType = branch.topicShape.type
    const lineShape = branch.connectionViewController.lineShape
    if (isDivergentLine(shapeType, lineShape)) { return LineFocusType.DIVER_LINE }
    if (isOrderLine(shapeType, lineShape)) { return LineFocusType.ORDER_LINE }
    return LineFocusType.DIVER_LINE
  }
  return LineFocusType.FOCUS_LINE
}

function isDivergentLine(shapeType: TopicShapeType, lineShape: string) {
  if (shapeType === TopicShapeType.UNDERLINE) {
    if (lineShape === BranchConnection.CURVE) {
      return true
    }
  }
}

function isOrderLine(shapeType: TopicShapeType, lineShape: string) {
  if (shapeType === TopicShapeType.UNDERLINE) {
    return false
  }

  return lineShape === BranchConnection.BIGHT
}

export function getJointPosition(bounds: Bounds, dire: Direction): Position {
  const { x, y, width, height } = bounds
  switch (dire) {
    case Direction.LEFT: {
      return { x, y: 0 }
    }

    case Direction.RIGHT: {
      return { x: x + width, y: 0 }
    }

    case Direction.UP: {
      return { x: 0, y }
    }

    case Direction.DOWN: {
      return { x: 0, y: y + height}
    }
  }
}

export function calcUnderline(branch: BranchViewController) {
  const topic = branch.topicViewController
  const borderLineWidth = topic.view.borderWidth || 0
  const bounds = topic.shapeBounds
  return {
    x: 0,
    y: bounds.y + bounds.height - borderLineWidth / 2
  }
}

export function relativePosToRealPos(relative: Position, branch: BranchViewController): Position {
  const branchRealPos = branch.position

  return {
    x: relative.x + branchRealPos.x,
    y: relative.y + branchRealPos.y
  }
}

export function addPositionByDirection(pos: Position, dire: Direction, dx: number, dy = dx) {
  const newPos = Object.assign({}, pos)
  if (dire === Direction.LEFT) { newPos.x -= dx }
  if (dire === Direction.RIGHT) { newPos.x += dx }
  if (dire === Direction.UP) { newPos.y -= dy }
  if (dire === Direction.DOWN) { newPos.y += dy }

  return newPos
}

export function getFontSize(branch: BranchViewController) {
  return parseInt(branch.topicViewController.titleViewController.view.fontInfo.fontSize) || 0
}

export function getUnits(branch: BranchViewController) {
  return {
    fontSize: Math.min(50, parseInt(branch.topicViewController.titleViewController.view.fontInfo.fontSize) || 0),
    lm: branch.topicViewController.view.marginLeft || 0,
    rm: branch.topicViewController.view.marginRight || 0,
    tm: branch.topicViewController.view.marginTop || 0,
    bm: branch.topicViewController.view.marginBottom || 0,
    lw: branch.topicViewController.view.borderWidth || 0
  }
}