import View from 'view/view'
import ViewType from 'common/constants/views'
import { Path, SVG } from '@svgdotjs/svg.js'
import SheetView from './sheetView'

const MASK_BOUNDS = { x: -10000, y: -10000, width: 20000, height: 20000 }
export const MASK_OUTERD = `
  M ${MASK_BOUNDS.x} ${MASK_BOUNDS.y}
  L ${MASK_BOUNDS.x + MASK_BOUNDS.width} ${MASK_BOUNDS.y}
  L ${MASK_BOUNDS.x + MASK_BOUNDS.width} ${MASK_BOUNDS.y + MASK_BOUNDS.height}
  L ${MASK_BOUNDS.x} ${MASK_BOUNDS.y + MASK_BOUNDS.height}
`

export interface MaskInfo {
  d: string,
  transform: string
}

export interface ConnectionViewData {
  d: string,
  fill: string,
  stroke: string,
  strokeWidth: number,
  maskInfo?: MaskInfo
}

export default class ConnectionView extends View {

  type = ViewType.CONNECTION

  private readonly _svg: Path

  constructor() {
    super()
    this._svg = new Path().data('name', 'connection')
  }

  render(data: ConnectionViewData, parent: SheetView) {
    if (!parent) return

    const { d, fill, stroke, strokeWidth, maskInfo } = data

    this._svg.attr({ d })
    this._svg.attr({ fill })
    this._svg.attr({ stroke })
    this._svg.attr({ 'stroke-width': strokeWidth })

    if (maskInfo) {
      const masking = parent.canvas.clip()
      if (masking) {
        const clipRegion = SVG().path().attr({ 
          d: maskInfo.d,
          fill: 'black', 
          transform: maskInfo.transform,
          'clip-rule': 'evenodd' 
        })

        masking.add(clipRegion)
        this._svg.clipWith(masking)
      }
    }

    parent.appendChild(this)
  }

  get content() {
    return this._svg
  }

}