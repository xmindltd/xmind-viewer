import Cell from 'view/layoutEngine/layouts/cell'

export default abstract class LayoutData {

  widthHint: number = -1
  heightHint: number = -1

  cacheWidth: number = -1
  cacheHeight: number = -1

  defaultWhint: number = -1
  defaultHhint: number = -1
  defaultWidth: number = -1
  defaultHeight: number = -1

  currentWhint: number = -1
  currentHhint: number = -1
  currentWidth: number = -1
  currentHeight: number = -1

  computeSize(cell: Cell, wHint: number, hHint: number, flushCache: boolean) {
    if (this.cacheWidth !== -1 && this.cacheHeight !== -1) return

    if (wHint === this.widthHint && hHint === this.heightHint) {
      if (this.defaultWidth === -1 || this.defaultHeight === -1 || wHint !== this.defaultWhint || hHint !== this.defaultHhint) {
        const size = cell.getPreferredSize(wHint, hHint, flushCache)
        this.defaultWhint = wHint
        this.defaultHhint = hHint
        this.defaultWidth = size.width
        this.defaultHeight = size.height
      }
      this.cacheWidth = this.defaultWidth
      this.cacheHeight = this.defaultHeight
      return
    }

    if (this.currentWidth === -1 || this.currentHeight === -1 || wHint !== this.currentWhint || hHint !== this.currentHhint) {
      const size = cell.getPreferredSize(wHint, hHint, flushCache)
      this.currentWhint = wHint
      this.currentHhint = hHint
      this.currentWidth = size.width
      this.currentHeight = size.height
    }
    this.cacheWidth = this.currentWidth
    this.cacheHeight = this.currentHeight
  }

  flushCache() {
    this.cacheWidth = this.cacheHeight = -1
    this.defaultWidth = this.defaultHeight = -1
    this.currentWidth = this.currentHeight = -1
  }

}