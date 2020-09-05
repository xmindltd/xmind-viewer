import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import Bounds from '../../../utils/bounds'
import BranchViewController from '../../../viewController/branchViewController'
import Size from '../../../utils/size'
import { getFontSize } from './topicShapeUtils'

export default class HexagonTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.HEXAGON)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    const { x, y, width, height} = bounds
    const x0 = x
    const x1 = width / 9 + x
    const x2 = width * 8 / 9 + x
    const x3 = width + x
    const y0 = y
    const y1 = y + height / 2
    const y2 = y + height

    return (
      `M ${x0} ${y1}` +
      `L ${x1} ${y0}` +
      `L ${x2} ${y0}` +
      `L ${x3} ${y1}` +
      `L ${x2} ${y2}` +
      `L ${x1} ${y2}` +
      'Z'
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const scale = 1 / 7
    const verScale = 0.1

    const horizonPadding = Math.round(scale * size.width)

    const topicMargins = super.getTopicMargins(branch, size)
    const fontSize = getFontSize(branch)
    const borderWidth = branch.topicBorderWidth

    return {
      top: topicMargins.top + fontSize * verScale,
      left: Math.max(horizonPadding + borderWidth, topicMargins.left),
      bottom: topicMargins.bottom + fontSize * verScale,
      right: Math.max(horizonPadding + borderWidth, topicMargins.right)
    }
  }

}