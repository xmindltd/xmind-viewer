import TextViewController from './textViewController'
import TopicTitleView from '../view/topicTitleView'
import ViewControllerType from '../common/constants/viewControllers'
import * as StyleManager from '../utils/styleManager'
import TopicViewController from './topicViewController'

export default class TopicTitleViewController extends TextViewController {

  readonly type = ViewControllerType.TOPIC_TITLE

  private readonly _view: TopicTitleView

  constructor(parent: TopicViewController, title: string) {
    super(parent)

    this._view = new TopicTitleView()
    this.text = title

    this._initStyle()

    this.view.layout()
  }

  private _initStyle() {
    const branchViewController = this.parent.parent
    this.refreshFontInfo(StyleManager.getFontInfo(branchViewController))
  }

  get model() {
    return null
  }

  get view() {
    return this._view
  }

}