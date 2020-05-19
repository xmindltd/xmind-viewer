import TopicShape from './topicShape'
import { TopicShapeType } from 'common/constants/styles'
import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import Size from 'utils/size'

export default class EllipseRectTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.ELLIPSE_RECT)
  }

  protected calcTopicShapePath({ x, y, width, height }: Bounds) {
    const radius = height / 2
    const x0 = x + radius
    const x1 = x + width - radius
    const y0 = y
    const y1 = y + height
    
    const bezierWidth = radius / 0.75
    const outX0 = x0 - bezierWidth
    const outX1 = x1 + bezierWidth

    return (
      `M ${x0} ${y0}` +
      `C ${outX0} ${y0} ${outX0} ${y1} ${x0} ${y1}` +
      `L ${x1} ${y1}` +
      `C ${outX1} ${y1} ${outX1} ${y0} ${x1} ${y0}` +
      `L ${x0} ${y0}`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const { top, bottom } = super.getTopicMargins(branch, size)
    const borderWidth = branch.topicBorderWidth

    const newHeight = top + size.height + bottom
    const radius = newHeight / 2
    return {
      top,
      bottom,
      left: borderWidth + radius,
      right: borderWidth + radius
    }
  }

}