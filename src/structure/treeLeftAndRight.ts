import AbstractStructure from './abstractStructure'
import Bounds from 'utils/bounds'
import Size from 'utils/size'
import BranchViewController from 'viewController/branchViewController'
import { BOUNDARY_GAP, PADDING } from 'common/constants/layoutSettings'
import { TopicType } from 'common/constants/models'

export default abstract class TreeLeftAndRight extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const spacingMajor = BOUNDARY_GAP
    const spacingMinor = branch.view.spacingMinor || 0
    const lineWidth = branch.topicViewController.view.borderWidth || 0
    const centerPadding = 30
    
    const childrenSize = this.getChildrenSize(branch)

    let childrenX = 0, childrenY = 0
    if (branch.isCentralBranch()) {
      childrenX += this.isRight() ? centerPadding : -centerPadding
    }
    childrenX += this.isRight() ? spacingMajor : -spacingMajor
    childrenY = bounds.y + bounds.height + PADDING

    if (!this.isRight()) {
      bounds.x = Math.min(childrenX - childrenSize.width, bounds.x)
    }

    const maxBottom = Math.max(bounds.y + bounds.height, childrenY + childrenSize.height)
    bounds.y = Math.min(bounds.y, childrenY)
    bounds.height = maxBottom - bounds.y
    bounds.width = Math.max(bounds.width, bounds.width / 2 + spacingMajor + childrenSize.width)

    branch.getChildrenByType(TopicType.ATTACHED).forEach(child => {
      if (this.isRight()) {
        child.position = { x: childrenX - child.bounds.x, y: childrenY - child.bounds.y }
      } else {
        child.position = { x: childrenX - child.bounds.x - child.bounds.width, y: childrenY - child.bounds.y }
      }
      childrenY += child.bounds.height + spacingMinor + lineWidth
    })
  } 

  protected getChildrenSize(branch: BranchViewController): Size {
    const spacingMinor = branch.view.spacingMinor || 0
    const lineWidth = branch.topicViewController.view.borderWidth || 0

    let height = 0, width = 0
    branch.getChildrenByType(TopicType.ATTACHED).forEach(child => {
      height += child.bounds.height + spacingMinor + lineWidth
      width += Math.max(width, child.bounds.width)
    })

    if (height > 0) {
      height -= (spacingMinor + lineWidth)
    }
    
    return {
      height: height,
      width: width
    }
  }

  protected abstract isRight(): boolean

}