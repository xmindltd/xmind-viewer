import TopicShape from './topicShape'
import { TopicShapeType } from 'common/constants/styles'
import Bounds from 'utils/bounds'

export default class SingleBreakAngleTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.SINGLE_BREAK_ANGLE)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    const { x, y, width, height } = bounds
    const length = Math.min(20, Math.min(height / 5, width / 5))
    return (
      `M ${x} ${y}` +
      `L ${x + width - length} ${y}` +
      `L ${x + width} ${y + length}` +
      `L ${x + width} ${y + height}` +
      `L ${x} ${y + height}` +
      `z`
    ) 
  }
  
}