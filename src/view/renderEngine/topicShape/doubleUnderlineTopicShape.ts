import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import Bounds from '../../../utils/bounds'
import BranchViewController from '../../../viewController/branchViewController'
import Size from '../../../utils/size'
import { getUnits } from './topicShapeUtils'

export default class DoubleUnderlineTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.DOUBLE_UNDERLINE)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    const padding = 5
    const { x, y, width, height } = bounds
    return (
      `M ${x} ${y + height - padding}` +
      `L ${x + width} ${y + height - padding}` +
      `M ${x} ${y + height}` +
      `L ${x + width} ${y + height}`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const { lm, rm, tm, bm, lw } = getUnits(branch)
    return {
      top: tm,
      left: lm,
      bottom: bm + lw,
      right: rm
    }
  }

}