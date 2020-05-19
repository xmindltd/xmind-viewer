import View from './view'
import ViewType from 'common/constants/views'
import { G, Svg, SVG } from '@svgdotjs/svg.js'
import Bounds from 'utils/bounds'

export default class SheetView extends View {

  type = ViewType.SHEET

  readonly canvas: Svg

  private _content: G
  private _branchContainer: G
  private _connectionContainer: G

  constructor() {
    super()
    
    this.canvas = SVG()
    this._content = this.canvas.group().data('name', 'sheet')
    this._connectionContainer = this._content.group().data('name', 'connection-container')
    this._branchContainer = this._content.group().data('name', 'branch-container')
  }

  render(options: { bgColor: string, bounds: Bounds }) {
    if (!options) return

    const { bgColor, bounds } = options
    if (bgColor) {
      this.canvas.node.style.backgroundColor = bgColor
    }

    if (bounds) {
      const PADDING = 10
      this.canvas.width(bounds.width + PADDING)
      this.canvas.height(bounds.height + PADDING)

      const OFFSET = 5
      this._content.translate(-bounds.x, -bounds.y + OFFSET)
    }
  }

  appendChild(view: View) {
    const { type, content } = view
    if (type === ViewType.BRANCH) {
      this._branchContainer.add(content)
    } else if (type === ViewType.CONNECTION) {
      this._connectionContainer.add(content)
    }
  }

  get content(): G {
    return this._content
  }

}