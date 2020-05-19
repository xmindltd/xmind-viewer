import TopicShape from './topicShape'
import Bounds from 'utils/bounds'
import { TopicShapeType } from 'common/constants/styles'

export default class RoundedRectTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.ROUNDED_RECT)
  }

  protected calcTopicShapePath(bounds: Bounds, corner: number = 8): string {
    const x1 = bounds.x
    const x2 = bounds.x + bounds.width
    const y1 = bounds.y
    const y2 = bounds.y + bounds.height
    return 'M ' + (x1 + corner) + ' ' + y1 +
      'L ' + (x2 - corner) + ' ' + y1 +
      'Q ' + x2 + ' ' + y1 +
      '  ' + x2 + ' ' + (y1 + corner) +
      'L ' + x2 + ' ' + (y2 - corner) +
      'Q ' + x2 + ' ' + y2 +
      '  ' + (x2 - corner) + ' ' + y2 +
      'L ' + (x1 + corner) + ' ' + y2 +
      'Q ' + x1 + ' ' + y2 +
      '  ' + x1 + ' ' + (y2 - corner) +
      'L ' + x1 + ' ' + (y1 + corner) +
      'Q ' + x1 + ' ' + y1 +
      '  ' + (x1 + corner) + ' ' + y1
  }

}