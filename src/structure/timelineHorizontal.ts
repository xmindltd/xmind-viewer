import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import Bounds, { merge } from 'utils/bounds'
import { TopicType } from 'common/constants/models'
import { PADDING } from 'common/constants/layoutSettings'
import StructureClass from 'common/constants/structures'
import { isUpSideBranch } from './helper/structureUtils'
import { getConnectionInfo, ConnectionInfo } from 'view/lineRender/topicLineStyle'
import { BranchConnection } from 'common/constants/styles'

export default class TimelineHorizontal extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)

    if (children.length) {
      let xUp = bounds.x + bounds.width + PADDING
      let xDown = xUp
      // let lastBoundsX = xUp
      const startPos = branch.topicShape.getStartAnchorPosition(branch, null)
      const baseY = startPos.y - branch.position.y
      
      const extendWidth = 70
      let isUpSide = true
      children.forEach((child: BranchViewController, index: number) => {
        let x: number
        if (index === 0) {
          x = xUp
          xUp = x + child.bounds.width + + extendWidth + PADDING
        } else {
          const preBrother = children[index - 1]
          
          if (isUpSide) {
            const preBrotherTopicLatestBoundsX = xDown - preBrother.bounds.width + preBrother.topicViewController.bounds.width + PADDING
            x = Math.max(preBrotherTopicLatestBoundsX, xUp)
            xUp = x + child.bounds.width + extendWidth + PADDING
          } else {
            const preBrotherTopicLatestBoundsX = xUp - preBrother.bounds.width + preBrother.topicViewController.bounds.width + PADDING
            x = Math.max(preBrotherTopicLatestBoundsX, xDown)
            xDown = x + child.bounds.width + extendWidth + PADDING
          }
        }

        // lastBoundsX = x + child.bounds.width + PADDING
        isUpSide = !isUpSide

        const childEndPos = child.topicShape.getEndAnchorPosition(branch, child)
        child.position = { x: x - child.bounds.x, y: baseY - (childEndPos.y - child.position.y) }
      })

      const childrenBounds = this.getChildrenBounds(branch)
      Object.assign(branch, merge(bounds, childrenBounds))
    }
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController) {
    return isUpSideBranch(parent, child) ? StructureClass.TIMELINE_HORIZONTAL_UP : StructureClass.TIMELINE_HORIZONTAL_DOWN
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController): ConnectionInfo {
    const start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)

    const children = startBranch.getChildrenByType(TopicType.ATTACHED)
    const index = children.indexOf(endBranch)
    if (index > 0) {
      const beforeBranch = children[index - 1]
      const end = beforeBranch.topicShape.getEndAnchorPosition(startBranch, beforeBranch)
      const width = beforeBranch.topicViewController.bounds.width
      start.x = end.x + width
    }
    
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)
    return getConnectionInfo(BranchConnection.HORIZONTAL, endBranch, { start, control: null, end }, false)
  }

}