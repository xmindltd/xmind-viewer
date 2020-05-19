import TopicShape from './topicShape'
import { TopicShapeType } from 'common/constants/styles'
import Bounds from 'utils/bounds'
import BranchViewController from 'viewController/branchViewController'
import Size from 'utils/size'
import { getUnits } from './topicShapeUtils'
import { TOPIC_SHAPE_STACK_GAP } from 'common/constants/layoutSettings'

export default class StackTopicShape extends TopicShape {
  
  constructor() {
    super(TopicShapeType.STACK)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    const { x, y, width, height } = bounds
    const gap = TOPIC_SHAPE_STACK_GAP
    return (
      `M ${x} ${y}` +
      `L ${x + width - gap} ${y}` +
      `L ${x + width - gap} ${y + height - gap}` +
      `L ${x} ${y + height - gap}` +
      `z` +
      `M ${x + width - gap} ${y + gap}` +
      `L ${x + width} ${y + gap}` +
      `L ${x + width} ${y + height}` +
      `L ${x + gap} ${y + height}` +
      `L ${x + gap} ${y + height - gap}`
    )
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const { lm, rm, tm, bm, lw } = getUnits(branch)
    const gap = TOPIC_SHAPE_STACK_GAP
    return {
      top: tm,
      left: lm,
      bottom: bm + lw + gap,
      right: rm + gap
    }
  }

}