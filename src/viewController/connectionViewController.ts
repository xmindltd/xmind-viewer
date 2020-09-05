import ViewController from './viewController'
import BranchViewController from './branchViewController'
import ViewControllerType from '../common/constants/viewControllers'
import ConnectionView, { ConnectionViewData } from '../view/connectionView'
import { isRootBranch, isAttachedBranch, getMaskInfo } from '../utils/branchUtils'
import { isMapStructure } from '../structure/helper/structureUtils'

export default class ConnectionViewController extends ViewController {

  private _startBranch: BranchViewController
  private _endBranch: BranchViewController
  private readonly _view: ConnectionView

  private _lineShape: string

  constructor(parent: BranchViewController) {
    super(parent)

    this._view = new ConnectionView()
  }

  get view(): ConnectionView {
    return this._view
  }

  get type() {
    return ViewControllerType.CONNECTION
  }

  get model() {
    return null
  }

  init() {
    const endBranch = this.endBranch
    const startBranch = this.startBranch
    if (startBranch && endBranch) {
      let data: ConnectionViewData = startBranch.getStructureObject().getAttachedConnectionInfo(startBranch, endBranch)
      if (isRootBranch(startBranch) && isAttachedBranch(endBranch) && isMapStructure(startBranch)) {
        data.maskInfo = getMaskInfo(startBranch)
      }
      
      this.view.render(data, endBranch.sheetViewController.view)
    }
  }

  set lineShape(lineShape: string) {
    this._lineShape = lineShape
  }

  get lineShape() {
    return this._lineShape
  }

  get endBranch(): BranchViewController {
    if (!this._endBranch && (this.parent instanceof BranchViewController)) {
      this._endBranch = this.parent
    }
    return this._endBranch
  }

  get startBranch(): BranchViewController {
    if (!this._startBranch) {
      const parent = this.endBranch?.parent
      if (parent instanceof BranchViewController) {
        this._startBranch = parent
      }
    }
    return this._startBranch
  }

}