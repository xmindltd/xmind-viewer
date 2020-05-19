import ViewController from './viewController'
import BranchViewController from './branchViewController'
import Sheet from 'model/sheet'
import ViewControllerType from 'common/constants/viewControllers'
import SheetView from 'view/sheetView'
import { getStyleValue } from 'utils/styleManager'
import { StyleKey } from 'common/constants/styles'

export default class SheetViewController extends ViewController {

  private readonly _sheet: Sheet
  private readonly _view: SheetView

  private _centralBranchViewController: BranchViewController
  private _multiLineColors: string
  private _bgColor: string

  constructor(sheet: Sheet) {
    super(null)
    this._sheet = sheet
    this._view = new SheetView()

    this._initStyle()
  }

  init() {
    this._centralBranchViewController = new BranchViewController(this._sheet.rootTopic, this)
    this._centralBranchViewController.sheetViewController = this
    this._centralBranchViewController.init()

    this._view.render({ bgColor: this._bgColor, bounds: this._centralBranchViewController.bounds })
  }

  private _initStyle() {
    this._multiLineColors = getStyleValue(this, StyleKey.MULTI_LINE_COLORS)
    this._bgColor = getStyleValue(this, StyleKey.FILL_COLOR)
  }

  get type() {
    return ViewControllerType.SHEET
  }

  get view(): SheetView {
    return this._view
  }

  get model() {
    return this._sheet
  }

  get multiLineColors() {
    return this._multiLineColors
  }

  hasMultiLineColors() {
    return this._multiLineColors && this._multiLineColors !== 'none'
  }

  get backgroundColor() {
    return this._bgColor
  }

  get centralBranchViewController() {
    return this._centralBranchViewController
  }

  get content() {
    return this.view.content
  }

  getCanvas() {
    return this.view.canvas
  }

  transform(x: number, y: number) {
    this.view.canvas.translate(x, y)
  }

}