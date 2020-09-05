import TopicShape from './topicShape'
import Bounds from '../../../utils/bounds'
import { TopicShapeType } from '../../../common/constants/styles'
import Size from '../../../utils/size'
import BranchViewController from '../../../viewController/branchViewController'
import { getUnits } from './topicShapeUtils'

export default class FishHeadToLeftTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.FISH_HEAD_TO_LEFT)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    return (
      `M ${bounds.x} ${bounds.y + bounds.y + bounds.height}` +
      `Q ${bounds.x + bounds.width / 3} ${bounds.y} ${bounds.x + bounds.width} ${bounds.y}` +
      `L ${bounds.x + bounds.width} ${bounds.y + bounds.height}`+
      `Q ${bounds.x + bounds.width / 3} ${bounds.y + bounds.height} ${bounds.x} ${bounds.y + bounds.y + bounds.height}` +
      `Z`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const headGapScale = 0.8
    const headHorScale = 0.3
    const headVerScale = 0.5

    const { lm, rm, tm, bm, lw } = getUnits(branch)
    const tbm = Math.max(tm, bm)
    const h = size.height
    const w = size.width
    const v = h * headVerScale
    const r = rm * headGapScale
    const l = w * headHorScale + lm
    return {
      top: v + tbm + lw,
      left: l + lw,
      bottom: v + tbm + lw,
      right: r + lw
    }
  }
  
}