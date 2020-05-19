import Cell from 'view/layoutEngine/layouts/cell'
import TopicView from 'view/topicView'
import GridData from 'view/layoutEngine/layouts/gridData'
import Size from 'utils/size'
import TopicViewController from 'viewController/topicViewController'
import BranchViewController from 'viewController/branchViewController'
import TopicTitleViewController from 'viewController/topicTitleViewController'
import { getTextSize } from 'utils/stringNodes'
import { GridLayout } from './layouts/gridLayout'
import Layout from './layouts/layout'

interface TopicLayout {
  topicTitleCell: TopicTitleCell,
  topicTitleGroupCell: Cell,
  innerGroupCell: Cell,
  middleGroupCell: Cell,
  topicShapeGroupCell: Cell,
  topicShapePaddingGroupCell: Cell,
  topicCell: Cell,
}

export default class TopicLayoutWorker {

  private readonly _view: TopicView
  private _topicLayout: TopicLayout

  constructor(view: TopicView) {
    this._view = view
  }

  work(topicViewController: TopicViewController) {
    const view = this._view

    if (!this._topicLayout) {
      this._topicLayout = this._createTopicLayout(topicViewController)
    }

    const {
      topicTitleCell,
      topicTitleGroupCell,
      innerGroupCell,
      middleGroupCell,
      topicShapeGroupCell,
      topicShapePaddingGroupCell,
      topicCell
    } = this._topicLayout

    const topicShapeGroupSize = topicShapeGroupCell.getPreferredSize(-1, -1, true)
    topicShapeGroupCell.setSize(topicShapeGroupSize)

    topicShapePaddingGroupCell.setLayout(this._createTopicShapePaddingGridLayout(topicViewController, topicShapeGroupSize))

    view.minimumWidth = topicShapePaddingGroupCell.getPreferredSize(-1, -1, true).width

    const topicPreferredWidth = topicViewController.model.customWidth
    const titleViewController = topicViewController.titleViewController
    const iterChildren = (parent: Cell) => {
      for (let child of parent.getChildren()) {
        child.getPreferredSize(child.getSize().width, -1, true)
        iterChildren(child)
      }
    }
    if (topicPreferredWidth) {
      const applyWidth = topicPreferredWidth >= view.minimumWidth ? topicPreferredWidth : view.minimumWidth

      const topicShapePaddingGroupSize = topicShapePaddingGroupCell.getPreferredSize(applyWidth, -1, true)
      topicShapePaddingGroupCell.setSize(topicShapePaddingGroupSize)

      iterChildren(topicShapePaddingGroupCell)

      const topicTitleGroupSize = topicTitleGroupCell.getSize()
      if (titleViewController) {
        const topicTitleView = titleViewController.view
        topicTitleView.preferredSize = topicTitleGroupSize
        topicTitleView.layout()
        topicTitleCell.useDefaultMinTopicTitleWidth = false
      }

      const topicShapeGroupSize = topicShapeGroupCell.getPreferredSize(topicShapeGroupCell.getSize().width, -1, true)
      topicShapeGroupCell.setSize(topicShapeGroupSize)
    } else {
      if (titleViewController) {
        const topicTitleView = titleViewController.view
        topicTitleView.preferredSize = null
        topicTitleView.layout()
        topicTitleCell.useDefaultMinTopicTitleWidth = false
      }

      const topicShapeGroupSize = topicShapeGroupCell.getPreferredSize(-1, -1, true)
      topicShapeGroupCell.setSize(topicShapeGroupSize)

      iterChildren(topicShapeGroupCell)
    }

    topicShapePaddingGroupCell.setLayout(this._createTopicShapePaddingGridLayout(
      topicViewController,
      topicShapeGroupCell.getSize()
    ))

    const topicShapePaddingGroupSize = topicShapePaddingGroupCell.getPreferredSize(-1, -1, true)
    topicShapePaddingGroupCell.setSize(topicShapePaddingGroupSize)

    const topicSize = topicCell.getPreferredSize(topicShapePaddingGroupCell.getSize().width, -1, true)
    topicCell.setSize(topicSize)

    const topicView = topicViewController.view
    topicView.topicShapeGroupPosition = {
      x: topicShapePaddingGroupCell.getPosition().x,
      y: topicShapePaddingGroupCell.getPosition().y,
    }

    topicView.topicContentPosition = {
      x: topicShapeGroupCell.getPosition().x - topicShapePaddingGroupCell.getSize().width / 2,
      y: topicShapeGroupCell.getPosition().y - topicShapePaddingGroupCell.getSize().height / 2,
    }

    topicView.topicInnerElementPosition = {
      x: innerGroupCell.getPosition().x + middleGroupCell.getPosition().x,
      y: innerGroupCell.getPosition().y + middleGroupCell.getPosition().y,
    }

    if (titleViewController) {
      titleViewController.move(
        topicTitleGroupCell.getPosition().x,
        topicTitleGroupCell.getPosition().y
      )
    }

    topicViewController.shapeBounds = {
      x: -topicShapePaddingGroupCell.getSize().width / 2,
      y: -topicShapePaddingGroupCell.getSize().height / 2,
      ...topicShapePaddingGroupCell.getSize(),
    }

    topicViewController.bounds = {
      x: topicViewController.shapeBounds.x,
      y: topicViewController.shapeBounds.y,
      ...topicCell.getSize(),
    }

    //layoutSiblingsBranchViewInTimeLineHorizon(topicViewController)

    topicView.size = { ...topicViewController.bounds }

    //TODO
    topicView.topicShape.render(topicViewController)
  }

  private _createTopicLayout(topicViewController: TopicViewController): TopicLayout {
    const titleViewController = topicViewController.titleViewController
    const topicTitleCell = new TopicTitleCell(titleViewController)
    const topicTitleGroupCell = this._createTopicTitleGroupCell(titleViewController)
    topicTitleGroupCell.add(topicTitleCell)

    const innerGroupCell = this._createInnerGroupCell()
    innerGroupCell.add(topicTitleGroupCell)

    const middleGroupCell = this._createMiddleGroupCell()
    middleGroupCell.add(innerGroupCell)

    const topicShapeGroupCell = this._createTopicShapeGroupCell()
    topicShapeGroupCell.add(middleGroupCell)

    const topicShapePaddingGroupCell = this._createTopicShapePaddingGroupCell()
    topicShapePaddingGroupCell.add(topicShapeGroupCell)

    const topicCell = this._createTopicCell()
    topicCell.add(topicShapePaddingGroupCell)

    return {
      topicTitleCell,
      topicTitleGroupCell,
      innerGroupCell,
      middleGroupCell,
      topicShapeGroupCell,
      topicShapePaddingGroupCell,
      topicCell,
    }
  }

  private _createTopicTitleGroupCell(titleViewController: TopicTitleViewController): Cell {
    const cell = new Cell()
    const layout = new GridLayout(1, false)
    layout.horizontalSpacing = 0
    cell.setLayout(layout)

    cell.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.CENTER,
      grabExcessHorizontalSpace: true,
      exclude: !titleViewController
    }))
    return cell
  }

  private _createInnerGroupCell(): Cell {
    const cell = new Cell()

    const layout = new GridLayout(4, false)
    layout.horizontalSpacing = 10
    cell.setLayout(layout)

    cell.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.CENTER,
      grabExcessHorizontalSpace: true,
    }))
    return cell
  }

  private _createMiddleGroupCell(): Cell {
    const cell = new Cell()
    const layout = new GridLayout(3, false)
    layout.horizontalSpacing = 10
    cell.setLayout(layout)

    cell.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.FILL,
      grabExcessHorizontalSpace: true,
      grabExcessVerticalSpace: true
    }))
    return cell
  }

  private _createTopicShapeGroupCell(): Cell {
    const cell = new Cell()
    const layout = new GridLayout(1, false)
    layout.verticalSpacing = 10
    cell.setLayout(layout)

    cell.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.FILL,
      grabExcessHorizontalSpace: true,
      grabExcessVerticalSpace: true
    }))
    return cell
  }

  private _createTopicShapePaddingGroupCell(): Cell {
    const cell = new Cell()
    cell.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.FILL,
      grabExcessHorizontalSpace: true,
      grabExcessVerticalSpace: true
    }))
    return cell
  }

  private _createTopicShapePaddingGridLayout(topicViewController: TopicViewController, topicShapeGroupSize: Size): Layout {
    const contentBounds = {
      x: -topicShapeGroupSize.width / 2,
      y: -topicShapeGroupSize.height / 2,
      ...topicShapeGroupSize
    }

    const padding = topicViewController.topicShape.getTopicMargins(<BranchViewController>topicViewController.parent, contentBounds)

    const layout = new GridLayout(1, false)
    layout.marginTop = padding.top
    layout.marginLeft = padding.left
    layout.marginBottom = padding.bottom
    layout.marginRight = padding.right
    return layout
  }

  private _createTopicCell(): Cell {
    const cell = new Cell()
    const layout = new GridLayout(1, false)
    layout.verticalSpacing = 4
    cell.setLayout(layout)
    return cell
  }

}

class TopicTitleCell extends Cell {

  useDefaultMinTopicTitleWidth = true

  private _titleViewController: TopicTitleViewController

  constructor(titleViewController: TopicTitleViewController) {
    super()
    this._titleViewController = titleViewController
    this.setLayoutData(new GridData({
      horizontalAlignment: GridData.FILL,
      verticalAlignment: GridData.CENTER,
      grabExcessHorizontalSpace: true,
      exclude: !this._titleViewController
    }))
  }

  protectedCalcSize(wHint: number, hHint: number): Size {
    let size = { width: 0, height: 0 }
    if (this._titleViewController) {
      if (this.useDefaultMinTopicTitleWidth) {
        const fontInfo = this._titleViewController.view.fontInfo
        const minTitleSize = getTextSize({ content: 'AA', style: fontInfo })
        size.width = Math.max(minTitleSize.width, 0)
        size.height = Math.max(minTitleSize.height, 0)
      } else {
        const contentCalculatedBounds = this._titleViewController.bounds
        size.width = contentCalculatedBounds.width
        size.height = contentCalculatedBounds.height
        //TODO
      }
    }

    return size
  }

}