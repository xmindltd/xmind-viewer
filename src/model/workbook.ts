import Sheet, { SheetData } from './sheet'

export class Workbook {

  private readonly _dataArr: SheetData[]
  private _sheets: Array<Sheet> = []

  constructor(dataArr: SheetData[]) {
    this._dataArr = dataArr

    for (const data of this._dataArr) {
      const sheet = new Sheet(data)
      this._sheets.push(sheet)
    }
  }

  getSheetByIndex(index: number) {
    const length = this._sheets.length
    if (!length || index > length) {
      throw new Error('Index out of range.')
    }
    return this._sheets[index]
  }

}