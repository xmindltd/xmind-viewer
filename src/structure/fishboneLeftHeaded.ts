import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import StructureClass from 'common/constants/structures'
import { TopicType, Direction } from 'common/constants/models'
import { PADDING, ROTATED_COS, ROTATED_SIN } from 'common/constants/layoutSettings'
import { getUpSideBranches, isUpSideBranch } from './helper/structureUtils'
import { BranchConnection } from 'common/constants/styles'
import { getConnectionInfo } from 'view/lineRender/topicLineStyle'

export default class FishboneLeftHeaded extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)

    if (children.length > 0) {
      const parentTopicBounds = branch.topicViewController.shapeBounds

      const childrenX = bounds.x + bounds.width + PADDING
      const childrenY = (parentTopicBounds.y * 2 + parentTopicBounds.height) / 2
      const ups = getUpSideBranches(branch)

      let upSideHeight = 0
      let downSideHeight = 0
      let maxRight = 0
      let xUp = childrenX
      let xDown = childrenX
      let xUpBefore = bounds.x + bounds.width
      let xDownBefore = bounds.x + bounds.width

      children.forEach(child => {
        const childBounds = child.bounds
        const topicBounds = child.topicViewController.bounds
        
        let x: number
        if (ups.includes(child)) {
          x = Math.max(xUp, xDownBefore + PADDING)
          child.position = { x: x - childBounds.x, y: childrenY - PADDING - topicBounds.y - topicBounds.height }
          xUpBefore = x + topicBounds.height / ROTATED_COS + PADDING
          xUp = x + childBounds.width + PADDING
          maxRight = Math.max(maxRight, x - childBounds.x + childBounds.width + topicBounds.x)
          upSideHeight = Math.max(upSideHeight, childBounds.height)
        } else {
          x = Math.max(xDown, xUpBefore + PADDING)
          child.position = { x: x - childBounds.x, y: childrenY - topicBounds.y + PADDING}
          xDownBefore = x + topicBounds.height / ROTATED_COS + PADDING
          xDown = x + childBounds.width + PADDING
          maxRight = Math.max(maxRight, x - childBounds.x + childBounds.width + topicBounds.x)
          downSideHeight = Math.max(downSideHeight, childBounds.height)
        }
      })

      upSideHeight = Math.min(-upSideHeight, bounds.y)
      downSideHeight = Math.max(downSideHeight, bounds.y + bounds.height)

      bounds.y = upSideHeight + PADDING
      bounds.width = maxRight - bounds.x + PADDING / 2 
      bounds.height = downSideHeight - bounds.y
    }
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController) {
    if (isUpSideBranch(parent, child)) {
      return StructureClass.FISHBONE_NE_NORMAL
    } 
    return StructureClass.FISHBONE_SE_NORMAL
  }

  specialDeal(branch: BranchViewController, bounds: Bounds) {
    if (branch.getChildrenByType(TopicType.ATTACHED).length > 0) {
      branch.renderFishbone(Direction.LEFT, { x: bounds.x + bounds.width, y: 0 })
      bounds.width += branch.fishbondBounds.width
    }
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController) {
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)

    const tan = ROTATED_SIN / ROTATED_COS
    let start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)
    start.x = end.x - Math.abs(start.y - end.y) * tan
    
    const control = start
    return getConnectionInfo(BranchConnection.STRAIGHT, endBranch, { start, control, end }, false)
  }

}