import TopicShape from './topicShape'
import { TopicShapeType } from 'common/constants/styles'
import Bounds from 'utils/bounds'
import BranchViewController from 'viewController/branchViewController'
import Size from 'utils/size'
import { getUnits } from './topicShapeUtils'

export default class FishHeadToRightTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.FISH_HEAD_TO_RIGHT)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    return (
      `M ${bounds.x} ${bounds.y}` +
      `Q ${bounds.x + bounds.width / 4 * 3} ${bounds.y} ${bounds.x + bounds.width} ${bounds.y + bounds.y + bounds.height}` +
      `Q ${bounds.x + bounds.width / 4 * 3} ${bounds.y + bounds.height} ${bounds.x} ${bounds.y + bounds.height}` +
      `Z`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const headGapScale = 0.8
    const headHorScale = 0.3
    const headVerScale = 0.5

    const { lm, rm, tm, bm, lw } = getUnits(branch)
    const tbm = Math.max(tm, bm)

    let h = size.height
    let w = size.width
    let v = h * headVerScale
    let r = w * headHorScale + rm
    let l = lm * headGapScale
    return {
      top: v + tbm + lw,
      left: l + lw,
      bottom: v + tbm + lw,
      right: r + lw
    }
  }

}