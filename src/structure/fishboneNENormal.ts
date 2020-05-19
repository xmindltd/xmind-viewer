import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import Bounds, { merge } from 'utils/bounds'
import StructureClass from 'common/constants/structures'
import { TopicType } from 'common/constants/models'
import { COLLAPSE_GAP, PADDING, ROTATED_TAN } from 'common/constants/layoutSettings'
import { BranchConnection } from 'common/constants/styles'
import { getConnectionInfo } from 'view/lineRender/topicLineStyle'

export default class FishboneNENormal extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    if (children.length > 0) {
      const parentShapeBounds = branch.topicViewController.shapeBounds

      let curX = parentShapeBounds.x + parentShapeBounds.width + COLLAPSE_GAP
      let curY = parentShapeBounds.y + parentShapeBounds.height
      let preBranchHeight = parentShapeBounds.height
      children.reverse().forEach(child => {
        const childBounds = child.bounds
        const childTopicBounds = child.topicViewController.shapeBounds
        const selfTrailingBottom = childBounds.y + childBounds.height - childTopicBounds.y - childTopicBounds.height 
        const offsetY = preBranchHeight + selfTrailingBottom + PADDING
        const offsetX = offsetY * ROTATED_TAN

        curX += offsetX
        curY -= offsetY
        preBranchHeight = childTopicBounds.y + childTopicBounds.height - childBounds.y

        child.position = { x: curX - childTopicBounds.x, y: curY - childTopicBounds.y - childTopicBounds.height }
      })

      const childrenBounds = this.getChildrenBounds(branch)
      Object.assign(bounds, merge(bounds, childrenBounds))
    }
  }

  getChildStructure() {
    return StructureClass.FISHBONE_NE_NORMAL
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController) {
    const start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)
    const control = { x: start.x + COLLAPSE_GAP, y: start.y }
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)
    return getConnectionInfo(BranchConnection.STRAIGHT, endBranch, { start, control, end }, false)
  }

}