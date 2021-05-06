import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import Bounds from '../../../utils/bounds'
import Size from '../../../utils/size'
import BranchViewController from '../../../viewController/branchViewController'
import { getFontSize, getLineFocusType, LineFocusType, offsetPointCalcFnMap, getStartDirection, addPositionByDirection, getEndDirection, relativePosToRealPos, getJointPosition, END_OFFSET } from './topicShapeUtils'
import { Direction } from '../../../common/constants/models'

export default class ParallelogramTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.PARALLELOGRAM)
  }
  
  protected calcTopicShapePath(bounds: Bounds) {
    return (
      `M ${bounds.x + bounds.y + bounds.height} ${bounds.y}` +
      `L ${bounds.x + bounds.width} ${bounds.y}` +
      `L ${bounds.x + bounds.width + bounds.y} ${bounds.y + bounds.height}` +
      `L ${bounds.x} ${bounds.y + bounds.height}` +
      `z`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const scale = 0.5
    const horScale = 0.5
    const verScale = 0.1

    const topicMargins = super.getTopicMargins(branch, size)
    const fontSize = getFontSize(branch)

    return {
      top: topicMargins.top + fontSize * verScale,
      left: topicMargins.left + Math.round(size.height * scale) + 1 + fontSize * horScale,
      bottom: topicMargins.bottom + fontSize * verScale,
      right: topicMargins.right + Math.round(size.height * scale) + 1 + fontSize * horScale
    }
  }

  protected getOffsetPointCalcFnList(branch: BranchViewController) {
    const focusType = getLineFocusType(branch)
    switch (focusType) {
      case LineFocusType.DIVER_LINE:
        return [offsetPointCalcFnMap.calcMapStructureStartPoint]
      case LineFocusType.ORDER_LINE:
        return [offsetPointCalcFnMap.calcSinusStartYPoint]
      default:
        return [this._calcParallelogram]
    }
  }

  private _calcParallelogram (parent: BranchViewController, child: BranchViewController) {
    const dir = getStartDirection(parent, child)
    const bounds = parent.topicViewController.shapeBounds
    const offsetX = -bounds.height / 4
    const originPos = { x: 0, y: 0 }
  
    return addPositionByDirection(originPos, dir, offsetX, 0)
  }

  getEndAnchorPosition(startBranch: BranchViewController, endBranch: BranchViewController) {
    const parent = endBranch.parent
    if (parent instanceof BranchViewController) {
      const dire = getEndDirection(startBranch, endBranch)
      const topicBounds = endBranch.topicViewController.shapeBounds
      const pos = relativePosToRealPos(getJointPosition(topicBounds, dire), endBranch)

      if (dire === Direction.UP || dire === Direction.DOWN) {
        return pos
      }

      const offset = -topicBounds.height / 4 + END_OFFSET
      return addPositionByDirection(pos, dire, offset)
    }
  }

}