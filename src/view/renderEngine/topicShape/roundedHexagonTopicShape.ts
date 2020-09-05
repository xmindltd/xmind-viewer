import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import Bounds from '../../../utils/bounds'
import { getPosition } from '../../../utils/position'
import { flexCorner } from './brushesHelper'
import BranchViewController from '../../../viewController/branchViewController'
import Size from '../../../utils/size'
import { getFontSize } from './topicShapeUtils'

export default class RoundedHexagonTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.ROUNDED_HEXAGON)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    const { x, y, width, height } = bounds
    const x0 = x
    const x1 = x + width / 2
    const x2 = x + width
    let peak = Math.min(height / 6, width * 0.2)
    const y0 = y + peak
    const y1 = y + height - peak
    const corner = 4

    const p0 = getPosition(x0, y0)
    const p1 = getPosition(x2, y0)
    const p2 = getPosition(x2, y1)
    const p3 = getPosition(x0, y1)
    const pu = getPosition(x1, y0 - peak)
    const pd = getPosition(x1, y1 + peak)

    const lt = flexCorner(p3, p0, pu, corner)
    const rt = flexCorner(pu, p1, p2, corner)
    const rb = flexCorner(p1, p2, pd, corner)
    const lb = flexCorner(pd, p3, p0, corner)

    const up = flexCorner(p0, pu, p1, corner)
    const down = flexCorner(p2, pd, p3, corner)

    return (
      `M ${lt[0].x} ${lt[0].y}` +
      `Q ${x0} ${y0} ${lt[1].x} ${lt[1].y}` +
      `L ${up[0].x} ${up[0].y}` +
      `Q ${pu.x} ${pu.y} ${up[1].x} ${up[1].y}` +
      `L ${rt[0].x} ${rt[0].y}` +
      `Q ${x2} ${y0} ${rt[1].x} ${rt[1].y}` +
      `L ${rb[0].x} ${rb[0].y}` +
      `Q ${x2} ${y1} ${rb[1].x} ${rb[1].y}` +
      `L ${down[0].x} ${down[0].y}` +
      `Q ${pd.x} ${pd.y} ${down[1].x} ${down[1].y}` +
      `L ${lb[0].x} ${lb[0].y}` +
      `Q ${x0} ${y1} ${lb[1].x} ${lb[1].y}` +
      'Z'
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const verScale = 0.1
    let peak = Math.min(0.5 * size.height, size.width * 0.2)
    peak = Math.round(peak)

    const topicMargins = super.getTopicMargins(branch, size)
    
    const borderWidth = branch.topicBorderWidth
    const fontSize = getFontSize(branch)
    
    return {
      top: Math.max(topicMargins.top, peak + borderWidth) + fontSize * verScale,
      left: topicMargins.left,
      bottom: Math.max(topicMargins.bottom, peak + borderWidth) + fontSize * verScale,
      right: topicMargins.right
    }
  }
}