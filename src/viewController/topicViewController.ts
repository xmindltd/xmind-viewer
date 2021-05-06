import { StyleKey } from '../common/constants/styles'
import ViewControllerType from '../common/constants/viewControllers'
import Topic from '../model/topic'
import * as StyleManager from '../utils/styleManager'
import TopicView from '../view/topicView'
import ViewController from './viewController'
import TopicTitleViewController from './topicTitleViewController'
import Bounds from '../utils/bounds'
import BranchViewController from './branchViewController'
import TopicLayoutWorker from '../view/layoutEngine/topicLayoutWorker'

export default class TopicViewController extends ViewController {

  readonly titleViewController: TopicTitleViewController
  shapeBounds: Bounds
  bounds: Bounds

  private readonly _topic: Topic
  private readonly _view: TopicView

  constructor(topic: Topic, parent: BranchViewController) {
    super(parent)

    this._topic = topic
    this._view = new TopicView()

    this._initStyle()

    this.titleViewController = new TopicTitleViewController(this, this._topic.title)
  }

  init() {
    const layoutworker = new TopicLayoutWorker(this.view)
    layoutworker.work(this)
  }

  render() {
    this.titleViewController.render()
    this.view.render(this.parent.view)
  }

  private _initStyle() {
    const parent = this.parent
    if (!parent) return

    this.view.topicShapeClass = StyleManager.getStyleValue(parent, StyleKey.SHAPE_CLASS)
    this.view.fillColor = StyleManager.getStyleValue(parent, StyleKey.FILL_COLOR)
    this.view.lineColor = StyleManager.getStyleValue(parent, StyleKey.LINE_COLOR)
    this.view.lineCorner = parseInt(StyleManager.getStyleValue(parent, StyleKey.LINE_CORNER) || '0')
    this.view.lineWidth = parseInt(StyleManager.getStyleValue(parent, StyleKey.LINE_WIDTH) || '0')
    this.view.borderColor = StyleManager.getStyleValue(parent, StyleKey.BORDER_LINE_COLOR)
    this.view.borderWidth = parseInt(StyleManager.getStyleValue(parent, StyleKey.BORDER_LINE_WIDTH) || '0')

    this.view.marginTop = parseInt(StyleManager.getStyleValue(parent, StyleKey.MARGIN_TOP) || '0')
    this.view.marginLeft = parseInt(StyleManager.getStyleValue(parent, StyleKey.MARGIN_LEFT) || '0')
    this.view.marginRight = parseInt(StyleManager.getStyleValue(parent, StyleKey.MARGIN_RIGHT) || '0')
    this.view.marginBottom = parseInt(StyleManager.getStyleValue(parent, StyleKey.MARGIN_BOTTOM) || '0')
  }

  protected createView(): TopicView {
    return new TopicView()
  }

  get model() {
    return this._topic
  }

  set topicShapePath(path: string) {
    this.view.topicShapePath = path
  }

  get topicShape() {
    return this.view.topicShape
  }

  get lineWidth() {
    return this.view.lineWidth
  }

  get view(): TopicView {
    return this._view
  }

  get type() {
    return ViewControllerType.TOPIC
  }

}