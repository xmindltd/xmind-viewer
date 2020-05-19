import { TopicShapeType } from 'common/constants/styles'
import TopicShape from './topicShape'
import RoundedRectTopicShape from 'view/renderEngine/topicShape/roundedRectTopicShape'
import UnderlineTopicShape from './underlineTopicShape'
import RectTopicShape from './rectTopicShape'
import EllipseTopicShape from './ellipseTopicShape'
import EllipseRectTopicShape from './ellipseRectTopicShape'
import DiamondTopicShape from './diamondTopicShape'
import CircleTopicShape from './circleTopicShape'
import ParallelogramTopicShape from './parallelogramTopicShape'
import HexagonTopicShape from './hexagonTopicShape'
import RoundedHexagonTopicShape from './roundedHexagonTopicShape'
import DoubleUnderlineTopicShape from './doubleUnderlineTopicShape'
import EllpticRectangleTopicShape from './ellipticRectangleTopicShape'
import SingleBreakAngleTopicShape from './singleBreakAngleTopicShape'
import StackTopicShape from './stackTopicShape'
import FishHeadToLeftTopicShape from './fishHeadToLeftTopicShape'
import FishboneUnderlineTopicShape from './fishboneUnderlineTopicShape'
import FishHeadToRightTopicShape from './fishHeadToRightTopicShape'

const TopicShapes = {
  [TopicShapeType.ROUNDED_RECT]: new RoundedRectTopicShape(),
  [TopicShapeType.UNDERLINE]: new UnderlineTopicShape(),
  [TopicShapeType.RECT]: new RectTopicShape(),
  [TopicShapeType.ELLIPSE]: new EllipseTopicShape(),
  [TopicShapeType.ELLIPSE_RECT]: new EllipseRectTopicShape(),
  [TopicShapeType.DIAMOND]: new DiamondTopicShape(),
  [TopicShapeType.CIRCLE]: new CircleTopicShape(),
  [TopicShapeType.PARALLELOGRAM]: new ParallelogramTopicShape(),
  [TopicShapeType.HEXAGON]: new HexagonTopicShape(),
  [TopicShapeType.ROUNDED_HEXAGON]: new RoundedHexagonTopicShape(),
  [TopicShapeType.DOUBLE_UNDERLINE]: new DoubleUnderlineTopicShape(),
  [TopicShapeType.ELLIPTIC_RECTANGLE]: new EllpticRectangleTopicShape(),
  [TopicShapeType.SINGLE_BREAK_ANGLE]: new SingleBreakAngleTopicShape(),
  [TopicShapeType.STACK]: new StackTopicShape(),
  [TopicShapeType.FISH_HEAD_TO_LEFT]: new FishHeadToLeftTopicShape(),
  [TopicShapeType.FISH_HEAD_TO_RIGHT]: new FishHeadToRightTopicShape(),
  [TopicShapeType.FISHBONE_NE_UNDERLINE]: new FishboneUnderlineTopicShape(),
  [TopicShapeType.FISHBONE_NW_UNDERLINE]: new FishboneUnderlineTopicShape(),
}

export function getTopicShape(topicShapeClass: string): TopicShape {
  if (!TopicShapes[topicShapeClass]) {
    console.log(`Unsupported topic shape class: ${topicShapeClass}`)
    return new RoundedRectTopicShape()
  }
  return TopicShapes[topicShapeClass]
}