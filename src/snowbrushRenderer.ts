import { SheetData } from 'model/sheet'
import SheetViewController from 'viewController/sheetViewController'
import { Svg } from '@svgdotjs/svg.js'
import { Workbook } from 'model/workbook'

export interface RenderOptions {
  sheetIndex?: number
}

export class SnowbrushRenderer {

  private _data: SheetData[]
  private _sheetViewController: SheetViewController

  constructor(data: SheetData[]) {
    if (!data) {
      throw new Error('Sheet data is required.')
    }

    if (data.length === 0) {
      throw new Error('The sheet data should not be empty.')
    }

    this._data = data
  }
  
  render(options: RenderOptions = { sheetIndex: 0 }) {
    const { sheetIndex } = options

    const workbook = new Workbook(this._data)
    const sheet = workbook.getSheetByIndex(sheetIndex)

    this._sheetViewController = new SheetViewController(sheet)
    this._sheetViewController.init()

    return this._sheetViewController.getCanvas()
  }

  get svg(): Svg {
    return this._sheetViewController?.getCanvas()
  }

  get bounds() {
    return this._sheetViewController?.centralBranchViewController.bounds
  }

  transform(x: number, y: number) {
    this._sheetViewController.transform(x, y)
  }

}