import ViewControllerType from '../common/constants/viewControllers'
import View from '../view/view'
import Model from '../model/model'

export default abstract class ViewController {

  private readonly _parent: ViewController

  constructor(parent: ViewController) {
    this._parent = parent
  }

  abstract get type(): ViewControllerType
  abstract get view(): View
  abstract get model(): Model

  get parent(): ViewController {
    return this._parent
  }

}