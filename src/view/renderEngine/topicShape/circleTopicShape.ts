import TopicShape from './topicShape'
import { TopicShapeType } from 'common/constants/styles'
import Bounds from 'utils/bounds'
import Size from 'utils/size'
import BranchViewController from 'viewController/branchViewController'
import { getFontSize } from './topicShapeUtils'

export default class CircleTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.CIRCLE)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    let cx = bounds.x + bounds.x + bounds.width
    let cy = bounds.y + bounds.y + bounds.height
    let r = bounds.x + bounds.width
    return (
      `M ${cx} ${cy}` +
      `m ${-r} 0` +
      `a ${r}, ${r} 0 1, 0 ${r * 2}, 0` +
      `a ${r}, ${r} 0 1, 0 ${-r * 2}, 0` +
      `z`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const scale = 0.3
    const width = size.width
    const height = size.height
    const dr = Math.sqrt(width * width + height * height)

    const topicMargins = super.getTopicMargins(branch, size)
    const fontSize = getFontSize(branch)
    const borderWidth = branch.topicBorderWidth

    let margin = (topicMargins.left + topicMargins.top) / 2

    return {
      top: (dr - height) / 2 + margin + borderWidth + fontSize * scale,
      left: (dr - width) / 2 + margin + borderWidth + fontSize * scale,
      bottom: (dr - height) / 2 + margin + borderWidth + fontSize * scale,
      right: (dr - width) / 2 + margin + borderWidth + fontSize * scale
    }
  }
  
}