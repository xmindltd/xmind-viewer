import AbstractStructure from './abstractStructure'
import BranchViewController from '../viewController/branchViewController'
import Bounds from '../utils/bounds'
import { isUpSideBranch, getUpSideBranches } from './helper/structureUtils'
import StructureClass from '../common/constants/structures'
import { TopicType, Direction } from '../common/constants/models'
import { PADDING, ROTATED_COS, ROTATED_SIN } from '../common/constants/layoutSettings'
import { getConnectionInfo } from '../view/lineRender/topicLineStyle'
import { BranchConnection } from '../common/constants/styles'

export default class FishboneRightHeaded extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)

    if (children.length > 0) {
      const ups = getUpSideBranches(branch)
      const parentTopicBounds = branch.topicViewController.bounds

      let upSideHeight = 0
      let downSideHeight = 0
      let xUp = bounds.x - PADDING
      let xDown = bounds.x - PADDING
      let xUpBefore = bounds.x
      let xDownBefore = bounds.x
      let maxLeft = 0

      children.forEach(child => {
        const branchBounds = child.bounds
        const topicBounds = child.topicViewController.bounds
        
        let x: number
        if (ups.includes(child)) {
          x = Math.min(xUp, xDownBefore - PADDING)
          child.position = { x: x - branchBounds.x - branchBounds.width, y: - PADDING - topicBounds.height / 2 }
          xUpBefore = x - parentTopicBounds.height / ROTATED_COS - PADDING
          xUp = x - branchBounds.width - PADDING
        } else {
          x = Math.min(xDown, xUpBefore - PADDING)
          child.position = { x: x - branchBounds.x - branchBounds.width, y: PADDING + topicBounds.height / 2 }
          xDownBefore = x - parentTopicBounds.height / ROTATED_COS - PADDING;
          xDown = x - branchBounds.width - PADDING;
        }

        maxLeft = Math.min(maxLeft, x - branchBounds.width)
      })

      bounds.x = maxLeft
      bounds.y = Math.min(bounds.y, -upSideHeight)
      bounds.width = parentTopicBounds.x + parentTopicBounds.width - maxLeft
      bounds.height = Math.min(downSideHeight, parentTopicBounds.y + parentTopicBounds.height) - bounds.y
    }
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController) {
    if (isUpSideBranch(parent, child)) {
      return StructureClass.FISHBONE_NW_NORMAL
    } else {
      return StructureClass.FISHBONE_SW_NORMAL
    }
  }

  specialDeal(branch: BranchViewController, bounds: Bounds) {
    if (branch.getChildrenByType(TopicType.ATTACHED).length > 0) {
      branch.renderFishbone(Direction.RIGHT, { x: bounds.x, y: 0 })
      const fishTailWidth = branch.fishbondBounds.width
      bounds.width += fishTailWidth
      bounds.x -= fishTailWidth
    }
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController) {
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)

    const tan = ROTATED_SIN / ROTATED_COS
    let start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)
    start.x = end.x + Math.abs(start.y - end.y) * tan
    
    const control = start
    return getConnectionInfo(BranchConnection.STRAIGHT, endBranch, { start, control, end }, false)
  }
  
}