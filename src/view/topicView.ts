import View from './view'
import ViewType from '../common/constants/views'
import Position, { isSamePosition } from '../utils/position'
import { getTopicShape } from './renderEngine/topicShape'
import { G, Path } from '@svgdotjs/svg.js'

export default class TopicView extends View {

  type = ViewType.TOPIC

  topicShapeClass: string = 'org.xmind.topicShape.roundedRect'

  lineWidth: number
  lineCorner: number
  borderColor: string
  borderWidth: number

  marginTop: number
  marginLeft: number
  marginRight: number
  marginBottom: number

  minimumWidth: number

  private _lineColor: string
  lineColorDirty = false

  private _fillColor: string
  fillColorDirty = false

  private _topicShapePath: string
  topicShapePathDirty = false

  private _topicShapeGroupPosition: Position
  topicShapeGroupPositionDirty = false

  private _topicContentPosition: Position
  topicContentPositionDirty = false

  private _topicInnerElementPosition: Position
  topicInnerElementPositionDirty = false

  private readonly _svg: G
  private _topicShape: Path
  private _topicShapeFill: Path
  private _topicContent: G
  private _topicInnerElementGroup: G

  constructor() {
    super()
    this._svg = new G().data('name', 'topic')
    this._initSVGStructure()
  }

  private _initSVGStructure() {
    const topicShapeGroup = this._svg.group().data('name', 'topic-shape-group')
    this._topicShape = topicShapeGroup.path().data('name', 'topic-shape')
    this._topicShapeFill = topicShapeGroup.path().data('name', 'topic-shape-fill')

    this._topicContent = topicShapeGroup.group().data('name', 'topic-content')
    this._topicInnerElementGroup = this._topicContent.group().data('name', 'inner-element-group')
  }

  set lineColor(lineColor: string) {
    if (this._lineColor !== lineColor) {
      this._lineColor = lineColor
      this.lineColorDirty = true
    }
  }

  get lineColor() {
    return this._lineColor
  }

  set fillColor(fillColor: string) {
    if (this._fillColor !== fillColor) {
      this._fillColor = fillColor
      this.fillColorDirty = true
    }
  }

  get fillColor() {
    return this._fillColor
  }

  set topicShapeGroupPosition(topicShapeGroupPosition: Position) {
    const newPositionDirty = !this._topicShapeGroupPosition || !isSamePosition(this._topicShapeGroupPosition, topicShapeGroupPosition)
    if (newPositionDirty) {
      this.topicShapeGroupPositionDirty = newPositionDirty
    }
    this._topicShapeGroupPosition = { ...topicShapeGroupPosition }
  }

  set topicContentPosition(topicContentPosition: Position) {
    const newPositionDirty = !this._topicContentPosition || !isSamePosition(this._topicContentPosition, topicContentPosition)
    if (newPositionDirty) {
      this.topicContentPositionDirty = newPositionDirty
    }
    this._topicContentPosition = { ...topicContentPosition }
  }

  get topicContentPosition(): Position {
    return this._topicContentPosition
  }

  set topicInnerElementPosition(topicInnerElementPosition: Position) {
    const newPositionDirty = !this._topicInnerElementPosition || !isSamePosition(this._topicInnerElementPosition, topicInnerElementPosition)
    if (newPositionDirty) {
      this.topicInnerElementPositionDirty = newPositionDirty
    }
    this._topicInnerElementPosition = { ...topicInnerElementPosition }
  }

  set topicShapePath(path: string) {
    if (this._topicShapePath !== path) {
      this._topicShapePath = path
      this.topicShapePathDirty = true
    }
  }

  get topicShapePath(): string {
    return this._topicShapePath
  }

  get topicShape() {
    return getTopicShape(this.topicShapeClass)
  }

  render(parentView: View) {
    if (!parentView) return

    // Topic Shape
    if (this.topicShapePathDirty) {
      this._topicShape.attr({ d: this.topicShapePath })
    }

    if (this.fillColorDirty) {
      this._topicShape.attr({ fill: this.fillColor, stroke: this.borderColor })
    }
    this._topicShape.attr({ 'stroke-width': this.borderWidth })

    // Topic Shape Fill 
    // this._topicShapeFill.attr({ d: topicShapePath })
    this._topicShapeFill.attr({ fill: this.fillColor, stroke: '#ffffff' })

    if (this.topicContentPositionDirty) {
      //this.topicContentPosition
      this._topicContent.translate(this.topicContentPosition.x, this.topicContentPosition.y)
      this.topicContentPositionDirty = false
    }

    parentView.appendChild(this)
  }

  appendChild(view: View) {
    const { type, content } = view
    switch (type) {
      case ViewType.TOPIC_TITLE: {
        this._topicInnerElementGroup.add(content)
      }
    }
  }

  get content() {
    return this._svg
  }

}