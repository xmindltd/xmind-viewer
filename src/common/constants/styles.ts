enum TopicShapeType {
  RECT = 'org.xmind.topicShape.rect',
  ROUNDED_RECT = 'org.xmind.topicShape.roundedRect',
  UNDERLINE = 'org.xmind.topicShape.underline',
  DOUBLE_UNDERLINE = 'org.xmind.topicShape.doubleunderline',
  ELLIPSE = 'org.xmind.topicShape.ellipse',
  ELLIPSE_RECT = 'org.xmind.topicShape.ellipserect',
  ELLIPTIC_RECTANGLE = 'org.xmind.topicShape.ellipticrectangle',
  DIAMOND = 'org.xmind.topicShape.diamond',
  CIRCLE = 'org.xmind.topicShape.circle',
  PARALLELOGRAM = 'org.xmind.topicShape.parallelogram',
  HEXAGON = 'org.xmind.topicShape.hexagon',
  ROUNDED_HEXAGON = 'org.xmind.topicShape.roundedhexagon',
  SINGLE_BREAK_ANGLE = 'org.xmind.topicShape.singlebreakangle',
  STACK = 'org.xmind.topicShape.stack',

  MATRIX_MAIN = 'org.xmind.topicShape.matrixMain',
  FISH_HEAD_TO_RIGHT = 'org.xmind.topicShape.fishHeadToRight',
  FISH_HEAD_TO_LEFT = 'org.xmind.topicShape.fishHeadToLeft',
  FISHBONE_ROATED_NW = 'org.xmind.topicShape.fishbone.NW.rotated',
  FISHBONE_ROATED_NE = 'org.xmind.topicShape.fishbone.NE.rotated',
  FISHBONE_ROATED_SW = 'org.xmind.topicShape.fishbone.SW.rotated',
  FISHBONE_ROATED_SE = 'org.xmind.topicShape.fishbone.SE.rotated',
  FISHBONE_NE_UNDERLINE = 'fishbone_ne_underline',
  FISHBONE_NW_UNDERLINE = 'fishbone_nw_underline'
}

enum ClassType {
  MAP = 'map',
  CENTRAL_TOPIC = 'centralTopic',
  MAIN_TOPIC = 'mainTopic',
  SUB_TOPIC = 'subTopic',
}

enum StyleKey {
  FONT_FAMILY = 'fo:font-family',
  FONT_SIZE = 'fo:font-size',
  FONT_STYLE = 'fo:font-style',
  FONT_WEIGHT = 'fo:font-weight',
  TEXT_COLOR = 'fo:color',
  TEXT_ALIGN = 'fo:text-align',
  TEXT_TRANSFORM = 'fo:text-transform',
  TEXT_DECORATION = 'fo:text-decoration',

  MARGIN_TOP = 'fo:margin-top',
  MARGIN_BOTTOM = 'fo:margin-bottom',
  MARGIN_LEFT = 'fo:margin-left',
  MARGIN_RIGHT = 'fo:margin-right',
  SPACING_MAJOR = 'spacing-major',
  SPACING_MINOR = 'spacing-minor',

  LINE_CLASS = 'line-class',
  LINE_COLOR = 'line-color',
  LINE_WIDTH = 'line-width',
  LINE_CORNER = 'line-corner',

  SHAPE_CLASS = 'shape-class',

  BORDER_LINE_COLOR = 'border-line-color',
  BORDER_LINE_WIDTH = 'border-line-width',

  FILL_COLOR = 'svg:fill',

  MULTI_LINE_COLORS = 'multi-line-colors',
}

enum StyleLayer {
  BEFORE_USER = 'beforeUser',
  BEFORE_THEME = 'beforeTheme',
}

enum BranchConnection {
  ROUNDED_ELBOW = 'org.xmind.branchConnection.roundedElbow',
  ELBOW = 'org.xmind.branchConnection.elbow',
  CURVE = 'org.xmind.branchConnection.curve',
  BIGHT = 'org.xmind.branchConnection.bight',
  STRAIGHT = 'org.xmind.branchConnection.straight',
  ROUNDED_FOLD = 'org.xmind.branchConnection.roundedfold',
  FOLD = 'org.xmind.branchConnection.fold',
  HORIZONTAL = 'org.xmind.branchConnection.timeline.horizontal',
}

enum TextTransform {
  MANUAL = 'manual',
  CAPITALIZE = 'capitalize',
  UPPER_CASE = 'uppercase',
  LOWER_CASE = 'lowercase'
}

export {
  TopicShapeType,
  ClassType,
  StyleKey,
  StyleLayer,
  BranchConnection,
  TextTransform,
}