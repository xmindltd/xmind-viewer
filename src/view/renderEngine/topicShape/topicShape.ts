import TopicViewController from 'viewController/topicViewController'
import Bounds from 'utils/bounds'
import Area from 'utils/area'
import Size from 'utils/size'
import BranchViewController from 'viewController/branchViewController'
import { LineFocusType, offsetPointCalcFnMap, getStartDirection, getEndDirection, relativePosToRealPos, addPositionByDirection, getLineFocusType, getJointPosition, calcUnderline } from './topicShapeUtils'
import { LINE_CONTROL_OFFSET } from 'common/constants/layoutSettings'
import { TopicShapeType, BranchConnection } from 'common/constants/styles'
import { Direction } from 'common/constants/models'

export default abstract class TopicShape {

  private _type: TopicShapeType

  constructor(type: TopicShapeType) {
    this._type = type
  }

  render(topicViewController: TopicViewController) {
    this.doRender(topicViewController)
    this.rotate(topicViewController)
  }

  protected doRender(topicViewController: TopicViewController) {
    const borderWidth = topicViewController.view.borderWidth || 0
    const drawBounds = this.getDrawBounds(topicViewController.shapeBounds, borderWidth)
    const topicShapePath = this.calcTopicShapePath(drawBounds)
    topicViewController.topicShapePath = topicShapePath
  }

  protected rotate(topicViewController: TopicViewController) {
    //TODO
  }

  protected abstract calcTopicShapePath(bounds: Bounds, corner?: number): string

  getTopicMargins(branchViewController: BranchViewController, size: Size): Area {
    const topicView = branchViewController.topicViewController.view
    const borderWidth = topicView.borderWidth
    return {
      top: topicView.marginTop + borderWidth,
      left: topicView.marginLeft + borderWidth,
      bottom: topicView.marginBottom + borderWidth,
      right: topicView.marginRight + borderWidth
    }
  }

  getDrawBounds(topicBounds: Bounds, topicBorderWidth: number): Bounds {
    const halfBorderWidth = topicBorderWidth / 2
    return {
      x: topicBounds.x + halfBorderWidth,
      y: topicBounds.y + halfBorderWidth,
      width: topicBounds.width - halfBorderWidth,
      height: topicBounds.height - halfBorderWidth
    }
  }

  getStartAnchorPosition(startBranch: BranchViewController, endBranch: BranchViewController) {
    const direction = getStartDirection(startBranch, endBranch)
    const baseRelativePos = getJointPosition(startBranch.topicViewController.shapeBounds, direction)
    const baseRealPos = relativePosToRealPos(baseRelativePos, startBranch)

    if (direction === Direction.DOWN || direction === Direction.UP) {
      return baseRealPos
    }

    const offsetPointCalcFnList = this.getOffsetPointCalcFnList(startBranch)
    const deltaPointList = offsetPointCalcFnList.map(fn => fn(startBranch, endBranch))
    return deltaPointList.reduce((p1, p2) => {
      return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
      }
    }, baseRealPos)
  }

  protected getOffsetPointCalcFnList(branch: BranchViewController) {
    const focusType = getLineFocusType(branch)
    if (focusType === LineFocusType.DIVER_LINE) {
      return [offsetPointCalcFnMap.calcMapStructureStartPoint]
    } else if (focusType === LineFocusType.ORDER_LINE) {
      return [offsetPointCalcFnMap.calcSinusStartYPoint]
    }

    return []
  }

  getEndAnchorPosition(startBranch: BranchViewController, endBranch: BranchViewController) {
    const dir = getEndDirection(startBranch, endBranch)
    const jointPosition = getJointPosition(endBranch.topicViewController.shapeBounds, dir)
    const pos = relativePosToRealPos(jointPosition, endBranch)

    if (this.type === TopicShapeType.UNDERLINE || 
        this.type === TopicShapeType.DOUBLE_UNDERLINE) {
      if (dir !== Direction.UP && dir !== Direction.DOWN) { 
        const deltaPos = calcUnderline(endBranch)
        return {
          x: pos.x + deltaPos.x,
          y: pos.y + deltaPos.y
        }
      }
    }

     return pos
  }

  getControlPosition(startBranch: BranchViewController, endBranch: BranchViewController) {
    const start = this.getStartAnchorPosition(startBranch, endBranch)

    const focusType = getLineFocusType(startBranch)
    if (focusType == LineFocusType.DIVER_LINE) {
      return start
    }

    const basePos = start
    const dire = getStartDirection(startBranch, endBranch)
    const offset = startBranch.connectionViewController.lineShape === BranchConnection.BIGHT ? 0 : LINE_CONTROL_OFFSET
    return addPositionByDirection(basePos, dire, offset)
  }

  get type() {
    return this._type
  }

}