import { StyleKey, ClassType } from '../../common/constants/styles'

const defaultStyles = {
  [ClassType.CENTRAL_TOPIC]: {
    // [StyleKey.FONT_FAMILY]: '$system$',
    [StyleKey.FONT_SIZE]: '28pt',
    [StyleKey.FONT_STYLE]: 'normal',
    [StyleKey.FONT_WEIGHT]: 'normal',
    [StyleKey.TEXT_ALIGN]: 'center',
    [StyleKey.TEXT_COLOR]: '#FFFFFF',
    [StyleKey.TEXT_TRANSFORM]: 'manual',
    [StyleKey.TEXT_DECORATION]: 'none',
    [StyleKey.SHAPE_CLASS]: 'org.xmind.topicShape.roundedRect',
    [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.curve',
    [StyleKey.LINE_CORNER]: '16pt',
    [StyleKey.LINE_COLOR]: '#333333',
    [StyleKey.LINE_WIDTH]: '2pt',
    [StyleKey.FILL_COLOR]: '#2A7AC2',
    [StyleKey.BORDER_LINE_COLOR]: 'none',
    [StyleKey.BORDER_LINE_WIDTH]: '0pt',
    [StyleKey.MARGIN_TOP]: '15pt',
    [StyleKey.MARGIN_BOTTOM]: '15pt',
    [StyleKey.MARGIN_LEFT]: '29pt',
    [StyleKey.MARGIN_RIGHT]: '29pt',
    [StyleKey.SPACING_MAJOR]: '50pt',
    [StyleKey.SPACING_MINOR]: '35pt'
  },

  [ClassType.MAIN_TOPIC]: {
    // [StyleKey.FONT_FAMILY]: '$system$',
    [StyleKey.FONT_SIZE]: '16pt',
    [StyleKey.FONT_STYLE]: 'normal',
    [StyleKey.FONT_WEIGHT]: 'normal',
    [StyleKey.TEXT_ALIGN]: 'left',
    [StyleKey.TEXT_COLOR]: '#333333',
    [StyleKey.TEXT_TRANSFORM]: 'manual',
    [StyleKey.TEXT_DECORATION]: 'none',
    [StyleKey.SHAPE_CLASS]: 'org.xmind.topicShape.roundedRect',
    [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.roundedElbow',
    [StyleKey.LINE_CORNER]: '8pt',
    [StyleKey.LINE_COLOR]: '#333333',
    [StyleKey.LINE_WIDTH]: '1pt',
    [StyleKey.FILL_COLOR]: '#E8E8E8',
    [StyleKey.BORDER_LINE_COLOR]: '#333333',
    [StyleKey.BORDER_LINE_WIDTH]: '1pt',
    // [StyleKey.SHAPE_CORNER]: '5pt',
    [StyleKey.MARGIN_LEFT]: '18pt',
    [StyleKey.MARGIN_RIGHT]: '18pt',
    [StyleKey.MARGIN_TOP]: '10pt',
    [StyleKey.MARGIN_BOTTOM]: '10pt',
    [StyleKey.SPACING_MAJOR]: '26pt',
    [StyleKey.SPACING_MINOR]: '6pt'
  },

  [ClassType.SUB_TOPIC]: {
    // [StyleKey.FONT_FAMILY]: '$system$',
    [StyleKey.FONT_SIZE]: '12pt',
    [StyleKey.FONT_STYLE]: 'normal',
    [StyleKey.FONT_WEIGHT]: 'normal',
    [StyleKey.TEXT_ALIGN]: 'center',
    [StyleKey.TEXT_COLOR]: '#0A0E16',
    [StyleKey.TEXT_TRANSFORM]: 'manual',
    [StyleKey.TEXT_DECORATION]: 'none',
    [StyleKey.SHAPE_CLASS]: 'org.xmind.topicShape.underline',
    [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.roundedElbow',
    [StyleKey.LINE_CORNER]: '8pt',
    [StyleKey.LINE_COLOR]: '#232323',
    [StyleKey.LINE_WIDTH]: '1pt',
    [StyleKey.FILL_COLOR]: 'none',
    [StyleKey.BORDER_LINE_COLOR]: '#232323',
    [StyleKey.BORDER_LINE_WIDTH]: '1pt',
    // [StyleKey.SHAPE_CORNER]: '3pt',
    [StyleKey.MARGIN_LEFT]: '6pt',
    [StyleKey.MARGIN_RIGHT]: '6pt',
    [StyleKey.MARGIN_TOP]: '6pt',
    [StyleKey.MARGIN_BOTTOM]: '6pt',
    [StyleKey.SPACING_MAJOR]: '26pt',
    [StyleKey.SPACING_MINOR]: '8pt'
  },

  // [CLASS_TYPE.CALLOUT_TOPIC]: {
  //   [StyleKey.FONT_WEIGHT]: 'normal',
  //   [StyleKey.TEXT_COLOR]: '#FFFFFF',
  //   [StyleKey.FONT_FAMILY]: '$system$',
  //   [StyleKey.FONT_STYLE]: 'italic',
  //   [StyleKey.FONT_SIZE]: '12pt',
  //   [StyleKey.TEXT_DECORATION]: 'none',
  //   [StyleKey.CALLOUT_SHAPE_CLASS]: 'org.xmind.calloutTopicShape.balloon.roundedRect',
  //   [StyleKey.BORDER_LINE_COLOR]: 'none',
  //   [StyleKey.BORDER_LINE_WIDTH]: '1pt',
  //   [StyleKey.SHAPE_CORNER]: '5pt',
  //   [StyleKey.FILL_COLOR]: '#333333',
  //   [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.curve',
  //   [StyleKey.LINE_COLOR]: '#333333',
  //   [StyleKey.LINE_WIDTH]: '1pt',
  //   [StyleKey.TEXT_ALIGN]: 'center',
  //   [StyleKey.TEXT_TRANSFORM]: 'manual',
  //   [StyleKey.LINE_CORNER]: '8pt',
  //   [StyleKey.MARGIN_LEFT]: '6pt',
  //   [StyleKey.MARGIN_RIGHT]: '6pt',
  //   [StyleKey.MARGIN_TOP]: '6pt',
  //   [StyleKey.MARGIN_BOTTOM]: '6pt',
  //   [StyleKey.SPACING_MAJOR]: '26pt',
  //   [StyleKey.SPACING_MINOR]: '8pt'
  // },

  // [CLASS_TYPE.FLOATING_TOPIC]: {
  //   [StyleKey.FONT_WEIGHT]: 'normal',
  //   [StyleKey.TEXT_COLOR]: '#FFFFFF',
  //   [StyleKey.FONT_FAMILY]: '$system$',
  //   [StyleKey.FONT_STYLE]: 'normal',
  //   [StyleKey.FONT_SIZE]: '14pt',
  //   [StyleKey.TEXT_DECORATION]: 'none',
  //   [StyleKey.SHAPE_CLASS]: 'org.xmind.topicShape.roundedRect',
  //   [StyleKey.SHAPE_CORNER]: '8pt',
  //   [StyleKey.FILL_COLOR]: '#333333',
  //   [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.roundedElbow',
  //   [StyleKey.LINE_COLOR]: '#333333',
  //   [StyleKey.LINE_WIDTH]: '1pt',
  //   [StyleKey.LINE_CORNER]: '8pt',
  //   [StyleKey.TEXT_ALIGN]: 'center',
  //   [StyleKey.TEXT_TRANSFORM]: 'manual',
  //   [StyleKey.BORDER_LINE_COLOR]: '#333333',
  //   [StyleKey.BORDER_LINE_WIDTH]: '0pt',
  //   [StyleKey.MARGIN_LEFT]: '11pt',
  //   [StyleKey.MARGIN_RIGHT]: '11pt',
  //   [StyleKey.MARGIN_TOP]: '11pt',
  //   [StyleKey.MARGIN_BOTTOM]: '11pt',
  //   [StyleKey.SPACING_MAJOR]: '26pt',
  //   [StyleKey.SPACING_MINOR]: '8pt'
  // },

  // [CLASS_TYPE.SUMMARY_TOPIC]: {
  //   [StyleKey.FONT_WEIGHT]: 'normal',
  //   [StyleKey.TEXT_COLOR]: '#FFFFFF',
  //   [StyleKey.FONT_FAMILY]: '$system$',
  //   [StyleKey.FONT_STYLE]: 'italic',
  //   [StyleKey.FONT_SIZE]: '14pt',
  //   [StyleKey.TEXT_DECORATION]: 'none',
  //   [StyleKey.SHAPE_CLASS]: 'org.xmind.topicShape.roundedRect',
  //   [StyleKey.SHAPE_CORNER]: '5pt',
  //   [StyleKey.FILL_COLOR]: '#333333',
  //   [StyleKey.MARGIN_LEFT]: '12pt',
  //   [StyleKey.MARGIN_RIGHT]: '12pt',
  //   [StyleKey.MARGIN_TOP]: '6pt',
  //   [StyleKey.MARGIN_BOTTOM]: '6pt',
  //   [StyleKey.LINE_CLASS]: 'org.xmind.branchConnection.roundedElbow',
  //   [StyleKey.LINE_COLOR]: '#232323',
  //   [StyleKey.LINE_CORNER]: '8pt',
  //   [StyleKey.LINE_WIDTH]: '1pt',
  //   [StyleKey.TEXT_ALIGN]: 'center',
  //   [StyleKey.TEXT_TRANSFORM]: 'manual',
  //   [StyleKey.SPACING_MAJOR]: '26pt',  //8
  //   [StyleKey.SPACING_MINOR]: '8pt',  //1
  //   [StyleKey.BORDER_LINE_COLOR]: 'none',
  //   [StyleKey.BORDER_LINE_WIDTH]: '1pt'
  // },

  // [CLASS_TYPE.BOUNDARY]: {
  //   [StyleKey.SHAPE_CLASS]: 'org.xmind.boundaryShape.roundedRect',
  //   [StyleKey.SHAPE_CORNER]: '20pt',
  //   [StyleKey.FILL_COLOR]: '#D5E9FC',
  //   [StyleKey.LINE_COLOR]: '#2A7AC2',
  //   [StyleKey.LINE_WIDTH]: '2pt',
  //   [StyleKey.LINE_PATTERN]: 'dash',
  //   [StyleKey.OPACITY]: '0.2',
  //   [StyleKey.FONT_FAMILY]: '$system$',
  //   [StyleKey.FONT_WEIGHT]: 'normal',
  //   [StyleKey.TEXT_COLOR]: '#333333',
  //   [StyleKey.FONT_STYLE]: 'italic',
  //   [StyleKey.FONT_SIZE]: '12pt',
  //   [StyleKey.MARGIN_LEFT]: '10pt',
  //   [StyleKey.MARGIN_RIGHT]: '10pt',
  //   [StyleKey.MARGIN_TOP]: '6pt',
  //   [StyleKey.MARGIN_BOTTOM]: '6pt',
  //   [StyleKey.TEXT_DECORATION]: 'none',
  //   [StyleKey.TEXT_ALIGN]: 'left',
  //   [StyleKey.TEXT_TRANSFORM]: 'manual'
  // },

  // [CLASS_TYPE.RELATIONSHIP]: {
  //   [StyleKey.SHAPE_CLASS]: 'org.xmind.relationshipShape.curved',
  //   [StyleKey.LINE_COLOR]: '#2A7AC2',
  //   [StyleKey.LINE_WIDTH]: '2pt',
  //   [StyleKey.LINE_PATTERN]: 'dash',
  //   [StyleKey.ARROW_BEGIN_CLASS]: 'org.xmind.arrowShape.none',
  //   [StyleKey.ARROW_END_CLASS]: 'org.xmind.arrowShape.triangle',
  //   [StyleKey.FONT_FAMILY]: '$system$',
  //   [StyleKey.FONT_WEIGHT]: 'normal',
  //   [StyleKey.TEXT_COLOR]: '#333333',
  //   [StyleKey.FONT_STYLE]: 'italic',
  //   [StyleKey.FONT_SIZE]: '12pt',
  //   [StyleKey.TEXT_DECORATION]: 'none',
  //   [StyleKey.TEXT_ALIGN]: 'center',
  //   [StyleKey.TEXT_TRANSFORM]: 'manual'
  // },

  // [CLASS_TYPE.SUMMARY]: {
  //   [StyleKey.SHAPE_CLASS]: 'org.xmind.summaryShape.square',
  //   [StyleKey.LINE_COLOR]: '#007ac8',
  //   [StyleKey.LINE_WIDTH]: '2pt',
  //   [StyleKey.LINE_PATTERN]: 'solid',
  //   [StyleKey.LINE_CORNER]: '8pt'
  // },

  // [CLASS_TYPE.MAP]: {
  //   [StyleKey.FILL_COLOR]: '#ffffff',
  //   [StyleKey.GRADIENT_COLOR]: 'none'
  // },

  getStyleValue: function (className: string, key: StyleKey) {
    return defaultStyles[className] && defaultStyles[className][key]
  },

  hasClass: function (className: string) {
    return !!defaultStyles[className]
  }

}

export default defaultStyles
