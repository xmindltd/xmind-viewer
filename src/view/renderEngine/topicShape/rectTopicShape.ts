import Bounds from '../../../utils/bounds'
import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import { rect } from '../../../view/renderEngine/topicShape/brushes'

export default class RectTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.RECT)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    return rect(bounds)
  }

}