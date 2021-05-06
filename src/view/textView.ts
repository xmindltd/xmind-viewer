import View from './view'
import { Tspan, G, Text } from '@svgdotjs/svg.js'
import FontInfo from '../utils/fontInfo'
import Size from '../utils/size'
import Bounds from '../utils/bounds'
import Position, { isSamePosition } from '../utils/position'
import TitleLayoutWorker from './layoutEngine/titleLayoutWorker'

const ALIGN_MAP = {
  'left': 'start',
  'center': 'middle',
  'right': 'end',
}

export default abstract class TextView extends View {

  private _text: string

  private _textFn: (tspan: Tspan) => void
  textFnDirty = false

  private _textSize: Size

  private _textPosition: Position
  textPositionDirty = false

  private readonly _svg: G
  private _titleText: Text

  fontInfo: FontInfo

  private _bounds: Bounds = { x: 0, y: 0, width: 0, height: 0 }

  constructor(contentName: string) {
    super()
    this._svg = new G().data('name', contentName)
  }

  set text(text: string) {
    if (this._text !== text) {
      this._text = text
    }
  }

  get text(): string {
    return this._text
  }

  set textFn(textFn: (tspan: Tspan) => void) {
    if (this._textFn !== textFn) {
      this._textFn = textFn
      this.textFnDirty = true
    }
  }

  get textFn(): (tspan: Tspan) => void {
    return this._textFn
  }

  set textSize(textSize: Size) {
    this._textSize = { ...textSize }
    Object.assign(this._bounds, this.textPosition, this._textSize)
  }

  get textSize() {
    return this._textSize
  }

  get bounds() {
    return this._bounds
  }

  set textPosition(textPosition: Position) {
    const newPositionDirty = !this._textPosition || !isSamePosition(this._textPosition, textPosition)
    if (newPositionDirty) {
      this.textPositionDirty = newPositionDirty
    }
    this._textPosition = { ...textPosition }
  }

  get textPosition() {
    return this._textPosition
  }

  render(parent: View) {
    if (!parent) return

    this._titleText = this._svg.text(this.text)

    const { textColor, textDecoration, textAlign, fontSize, fontFamily, fontWeight, fontStyle } = this.fontInfo

    if (this.textFnDirty) {
      this._titleText.text(this.textFn)
      this.textFnDirty = false
    }
    
    if (textColor) { this._titleText.attr({ fill: textColor }) }
    if (textDecoration) { this._titleText.attr({ 'text-decoration': textDecoration }) }
    if (textAlign) { this._titleText.attr({ 'text-anchor': ALIGN_MAP[textAlign] }) }
    if (fontSize) { this._titleText.attr({ 'font-size': fontSize }) }
    if (fontFamily) { this._titleText.attr({ 'font-family': fontFamily }) }
    if (fontWeight) { this._titleText.attr({ 'font-weight': fontWeight }) }
    if (fontStyle) { this._titleText.attr({ 'font-style': fontStyle }) }
    
    if (this.textPositionDirty) {
      this._titleText.translate(this.textPosition.x, this.textPosition.y)
      this.textPositionDirty = false
    }

    parent.appendChild(this)
  }

  get content() {
    return this._svg
  }

  get layoutWorker() {
    return new TitleLayoutWorker(this)
  }

}