import View from './view'
import ViewType from '../common/constants/views'
import { G } from '@svgdotjs/svg.js'
import Position from '../utils/position'
import { Direction } from '../common/constants/models'
import Bounds from '../utils/bounds'

export interface BranchViewData {
  position: Position
}

export interface BranchViewBackboneData extends BranchViewData {
  direction: Direction.LEFT | Direction.RIGHT
  topicBounds: Bounds
  lineWidth: number
  borderColor: string
  fillColor: string
}

export default class BranchView extends View {

  type = ViewType.BRANCH

  spacingMajor: number
  spacingMinor: number

  private readonly _svg: G

  constructor() {
    super()
    this._svg = new G().data('name', 'branch')
  }

  render(parentView: View, data: BranchViewData) {
    if (!parentView) return

    const { position } = data
    if (position) {
      this._svg.translate(position.x, position.y)
    }

    parentView.appendChild(this)
  }

  renderFishbone(data: BranchViewBackboneData) {
    const container = new G().data('name', 'fish-tail')
    const fishTailFill = container.path().data('name', 'fish-tail-fill')
    const fishTailBorder = container.path().data('name', 'fish-tail-border')
    const fishBackbone = container.path().data('name', 'fish-backbone')

    fishTailBorder.fill('none')

    const { topicBounds, direction, position, fillColor, lineWidth, borderColor } = data
    const TAIL_WIDTH = 80

    // Render Tail
    const tailWidth = direction === Direction.LEFT ? TAIL_WIDTH : -TAIL_WIDTH
    const d = `M 0 0 L ${tailWidth} ${topicBounds.y} L ${tailWidth} ${topicBounds.y + topicBounds.height} z`
    fishTailBorder.attr({ d })
    fishTailFill.attr({ d })

    // Render Backbone
    const delta = 0
    const baseX = topicBounds.x - position.x
    const x = direction === Direction.LEFT ? baseX + topicBounds.width : baseX
    fishBackbone.attr({ d: `M ${x} ${-delta} L 0 0 L ${x} ${delta} z` })

    // Set Style
    fishTailFill.attr({ 
      fill: fillColor,
      stroke: 'none',
      opacity: 1
    })

    const renderLineWidth = lineWidth > 0.5 ? lineWidth : 1

    let renderBorderColor = borderColor
    if (lineWidth <= 0.5 || borderColor === 'none') {
      renderBorderColor = fillColor
    }

    fishTailBorder.attr({ 
      stroke: renderBorderColor,
      'stroke-width': renderLineWidth
    })
    fishBackbone.attr({
      stroke: renderBorderColor,
      'stroke-width': renderLineWidth
    })

    // Other
    container.translate(position.x, position.y)
    this._svg.add(container)
  }

  appendChild(view: View) {
    switch (view.type) {
      case ViewType.TOPIC: {
        this._svg.add(view.content)
      }
    }
  }

  get content() {
    return this._svg
  }

}