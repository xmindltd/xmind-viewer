import TopicShape from './topicShape'
import Bounds from '../../../utils/bounds'
import BranchViewController from '../../../viewController/branchViewController'
import { LineFocusType, offsetPointCalcFnMap, getLineFocusType, calcUnderline } from './topicShapeUtils'
import { TopicShapeType } from '../../../common/constants/styles'
import Size from '../../../utils/size'

export default class UnderlineTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.UNDERLINE)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    return 'M ' + ' ' + bounds.x + ' ' + (bounds.y + bounds.height) +
      'L ' + (bounds.x + bounds.width) + ' ' + (bounds.y + bounds.height) + 'z'
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const topicMargins = super.getTopicMargins(branch, size)

    const borderWidth = branch.topicBorderWidth
    return {
      top: topicMargins.top,
      left: topicMargins.left,
      bottom: topicMargins.bottom - borderWidth,
      right: topicMargins.right
    }
  }

  getDrawBounds(topicBounds: Bounds, topicBorderWidth: number): Bounds {
    const bounds = Object.assign({}, topicBounds)
    bounds.height -= topicBorderWidth / 2
    return bounds
  }

  protected getOffsetPointCalcFnList(branch: BranchViewController) {
    const focusType = getLineFocusType(branch)
    switch (focusType) {
      case LineFocusType.DIVER_LINE:
        return [offsetPointCalcFnMap.calcMapStructureStartPoint]

      case LineFocusType.ORDER_LINE:
        return [offsetPointCalcFnMap.calcSinusStartYPoint]

      default:
        return [calcUnderline]
    }
  }

}