import Cell from '../../layoutEngine/layouts/cell'
import Size from '../../../utils/size'
import Bounds from '../../../utils/bounds'

export default abstract class Layout {

  computeSize(cell: Cell, wHint: number, hHint: number, flushCache: boolean): Size {
    const clientArea = {
      x: 0,
      y: 0,
      width: wHint,
      height: hHint
    }
    const size = this.protectedLayout(cell, true, clientArea, flushCache)
    if (wHint !== -1) size.width = wHint
    if (hHint !== -1) size.height = hHint
    return size
  }

  layout(cell: Cell, flushCache: boolean = true) {
    const bounds = { ...cell.getPosition(), ...cell.getSize() }
    this.protectedLayout(cell, true, bounds, flushCache)
  }

  protectedLayout(cell: Cell, move: boolean, bounds: Bounds, flushCache: boolean): Size {
    return {
      width: -1,
      height: -1
    }
  }

  flushCache(cell: Cell) {
    const data = cell.getLayoutData()
    data && data.flushCache()
  }

}