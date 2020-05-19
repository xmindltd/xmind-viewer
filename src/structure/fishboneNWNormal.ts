import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import Bounds, { merge } from 'utils/bounds'
import { TopicType } from 'common/constants/models'
import StructureClass from 'common/constants/structures'
import { COLLAPSE_GAP, PADDING, ROTATED_TAN } from 'common/constants/layoutSettings'
import { getConnectionInfo } from 'view/lineRender/topicLineStyle'
import { BranchConnection } from 'common/constants/styles'

export default class FishboneNWNormal extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    if (children.length > 0) {
      const parentTopicBounds = branch.topicViewController.shapeBounds

      let curX = parentTopicBounds.x - COLLAPSE_GAP
      let curY = parentTopicBounds.y + parentTopicBounds.height
      let preBranchHeight = parentTopicBounds.height
      children.reverse().forEach(child => {
        const childBounds = child.bounds
        const topicBounds = child.topicViewController.shapeBounds
        const selfTrailingBottom = childBounds.y + childBounds.height - topicBounds.y - topicBounds.height
        const offsetY = preBranchHeight + selfTrailingBottom + PADDING
        const offsetX = offsetY * ROTATED_TAN

        curX -= offsetX
        curY -= offsetY
        child.position = { x: curX - topicBounds.x - topicBounds.width, y: curY - topicBounds.y - topicBounds.height }
        preBranchHeight = topicBounds.y + topicBounds.height - childBounds.y
      })

      const childrenBounds = this.getChildrenBounds(branch)
      Object.assign(bounds, merge(bounds, childrenBounds))
    }
  }

  getChildStructure() {
    return StructureClass.FISHBONE_NW_NORMAL
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController) {
    const start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)
    const control = { x: start.x - COLLAPSE_GAP, y: start.y }
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)
    return getConnectionInfo(BranchConnection.STRAIGHT, endBranch, { start, control, end }, false)
  }
  
}