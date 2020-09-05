import ViewController from './viewController'
import TopicViewController from './topicViewController'
import SheetViewController from './sheetViewController'
import ConnectionViewController from './connectionViewController'
import Topic from '../model/topic'
import ViewControllerType from '../common/constants/viewControllers'
import { TopicType, Direction } from '../common/constants/models'
import { StyleKey } from '../common/constants/styles'
import BranchView, { BranchViewBackboneData } from '../view/branchView'
import getStructure from '../structure/helper/allStructures'
import * as StyleManager from '../utils/styleManager'
import Bounds, { merge } from '../utils/bounds'
import Position from '../utils/position'
import StructureClass from '../common/constants/structures'
import branchLayout from '../utils/layoutUtil'

export default class BranchViewController extends ViewController {

  sheetViewController: SheetViewController
  topicViewController: TopicViewController
  connectionViewController: ConnectionViewController

  bounds: Bounds = { x: 0, y: 0, width: 0, height: 0 }
  fishbondBounds: Bounds
  position: Position = { x: 0, y: 0 }

  private readonly _view: BranchView
  private readonly _topic: Topic

  private _structureClass: string

  private _children: {
    [type: string]: Array<BranchViewController>
  }

  constructor(topic: Topic, parent: SheetViewController | BranchViewController) {
    super(parent)
    this._topic = topic
    this._children = {}

    this._view = new BranchView()
  }
  
  init() {
    this.connectionViewController = new ConnectionViewController(this)
    this._initStyle()
    
    this.topicViewController = new TopicViewController(this._topic, this)
    this.topicViewController.init()

    const addSubbranches = (type: TopicType) => {
      const topics = this.model.getChildrenByType(type)
      topics.forEach(topic => {
        const branch = new BranchViewController(topic, this)
        this._addSubbranch(branch, { type })
        branch.init()
      })
    }
    addSubbranches(TopicType.ATTACHED)

    branchLayout(this)

    if (this.isCentralBranch()) {
      this._initInner()
    }
  }

  private _initStyle() {
    this.view.spacingMajor = parseInt(StyleManager.getStyleValue(this, StyleKey.SPACING_MAJOR) || '0')
    this.view.spacingMinor = parseInt(StyleManager.getStyleValue(this, StyleKey.SPACING_MINOR) || '0')

    this.connectionViewController.lineShape = StyleManager.getStyleValue(this, StyleKey.LINE_CLASS)
  }

  private _addSubbranch(subbranch: BranchViewController, options: { type: TopicType }) {
    subbranch.sheetViewController = this.sheetViewController

    const type = options.type || TopicType.ATTACHED
    if (!this._children[type]) {
      this._children[type] = []
    }
    this._children[type].push(subbranch)
  }

  isCentralBranch(): boolean {
    return this.parent.type === ViewControllerType.SHEET
  }

  getStructureObject() {
    return getStructure(this.structureClass)
  }

  getLayer(): number {
    if (this.isCentralBranch()) {
      return 1
    }

    if (this.parent instanceof BranchViewController) {
      const parent = this.parent
      return parent.getLayer() + 1
    }

    return -1
  }

  getChildrenByType(type: TopicType): Array<BranchViewController> {
    return this._children[type] || []
  }

  renderFishbone(dire: Direction.LEFT | Direction.RIGHT, position: Position) {
    if (!dire || !position) return

    const topicBounds = this.topicViewController.bounds

    const data: BranchViewBackboneData = {
      position,
      direction: dire,
      topicBounds,
      lineWidth: parseInt(StyleManager.getStyleValue(this, StyleKey.LINE_WIDTH) || '0'),
      borderColor: StyleManager.getStyleValue(this, StyleKey.BORDER_LINE_COLOR),
      fillColor: StyleManager.getStyleValue(this, StyleKey.FILL_COLOR)
    }

    this.view.renderFishbone(data)

    this.fishbondBounds = {
      x: dire === Direction.LEFT ? 0 : -100,
      y: topicBounds.y,
      height: topicBounds.height,
      width: 100
    }
  }

  private _initInner() {
    this._updatePosition()

    this.bounds.x = this.position.x - this.bounds.width / 2
    this.bounds.y = this.position.y - this.bounds.height / 2

    this.getChildrenByType(TopicType.ATTACHED).forEach(child => {
      child._initInner()
    })

    if (this.parent instanceof BranchViewController) {
      this.parent.bounds = merge(this.bounds, this.parent.bounds)
    }

    this.connectionViewController.init()
    this.topicViewController.render()

    let position = { x: this.position.x, y: this.position.y }
    this.view.render(this.sheetViewController.view, { position })
  }

  private _updatePosition() {
    const parent = this.parent
    if (parent instanceof BranchViewController) {
      const parentPos = parent.position
      this.position.x += parentPos.x
      this.position.y += parentPos.y
    }
  }

  get structureClass() {
    if (!this._structureClass) {
      this._updateStructureClass()
    }
    return this._structureClass
  }

  private _updateStructureClass() {
    const modelStructureClass = this.model.structureClass as StructureClass

    if (this.isCentralBranch()) {
      this._structureClass = modelStructureClass || StructureClass.MAP
      return
    }

    const parent = this.parent
    if (parent instanceof BranchViewController) {
      const parentStructure = parent.getStructureObject()

      if (modelStructureClass) {
        const structures = parentStructure.getAvailableChildStructure(parent, this)
        if (structures.indexOf(modelStructureClass) > -1) {
          this._structureClass = modelStructureClass
          return
        }
      }

      this._structureClass = parentStructure.getChildStructure(parent, this)
    }
  }

  get topicShape() {
    return this.topicViewController.topicShape
  }

  get topicBorderWidth() {
    return this.topicViewController.view.borderWidth || 0
  }

  get type() {
    return ViewControllerType.BRANCH
  }

  get model(): Topic {
    return this._topic
  }

  get view(): BranchView {
    return this._view
  }

}