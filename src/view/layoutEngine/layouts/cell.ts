import Position from '../../../utils/position'
import Size from '../../../utils/size'
import Layout from '../../layoutEngine/layouts/layout'
import GridData from '../../layoutEngine/layouts/gridData'
import { isSameSize } from '../../../utils/bounds'

class Cell {

  private _parent: Cell
  private _children: Cell[]

  private _layout: Layout
  private _layoutData: GridData

  private _position: Position
  private _size: Size
  private _prefSize: Size


  constructor() {
    this._children = []
    this._position = { x: 0, y: 0 }
    this._size = { width: -1, height: -1 }
  }

  add(child: Cell) {
    this._children.push(child)
    child._parent = this
  }

  remove(child: Cell) {
    this._children.splice(this._children.indexOf(child))
    child._parent = null
  }

  removeAll() {
    this._children.forEach(child => {
      child._parent = null
      child.removeAll()
    })
    this._children.length = 0
  }

  getChildren(): Cell[] {
    return [...this._children]
  }

  setLayout(layout: Layout) {
    this._layout = layout
  }

  setLayoutData(layoutData: GridData) {
    this._layoutData = layoutData
  }

  getLayout(): Layout {
    return this._layout
  }

  getLayoutData(): GridData {
    return this._layoutData
  }

  protectedCalcSize(wHint: number, hHint: number): Size {
    return { width: 0, height: 0 }
  }

  setSize(size: Size) {
    // this.setPreferredSize(size)
    this._size = size
  }

  getSize(): Size {
    return this._prefSize ? this._prefSize : this._size
  }

  setPosition(position: Position) {
    this._position = position
  }

  getPosition(): Position {
    return this._position
  }

  getPreferredSize(wHint: number, hHint: number, flushCache: boolean): Size {
    if (this._prefSize) {
      return this._prefSize
    } else {
      return this._layout ? this._layout.computeSize(this, wHint, hHint, flushCache) : this.protectedCalcSize(wHint, hHint)
    }
  }

  setPreferredSize(preferredSize: Size) {
    if (this._prefSize && isSameSize(this._prefSize, preferredSize)) return
    this._prefSize = preferredSize
  }

}

export default Cell