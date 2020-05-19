import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import { TopicType } from 'common/constants/models'
import Size from 'utils/size'
import { BranchConnection } from 'common/constants/styles'

export default abstract class LeftAndRight extends AbstractStructure {

  calcAttachedChildrenPosByDirection(branch: BranchViewController, bounds: Bounds, isRight: boolean) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    // let arrowWidth = 0

    const length = children.length
    if (length) {
      const topChild = children[0]
      const bottomChild = children[length - 1]

      const controlPosY = branch.topicShape.getControlPosition(branch, topChild).y - branch.position.y
      const topEndPosY = topChild.topicShape.getEndAnchorPosition(branch, topChild).y
      const bottomEndPosY = bottomChild.topicShape.getEndAnchorPosition(branch, bottomChild).y

      const spacingMajor = this.calcSpacingMajor(branch)
      const childrenSize = this.getChildrenSize(branch)
      let childrenX: number
      if (isRight) {
        childrenX = bounds.x + bounds.width + spacingMajor
      } else {
        childrenX = bounds.x - spacingMajor
        bounds.x = childrenX - childrenSize.width
      }

      let childrenY = (bottomChild.bounds.y + bottomChild.bounds.height - topEndPosY - bottomEndPosY - topChild.bounds.y - childrenSize.height) / 2 + topChild.bounds.y + controlPosY

      const spacingMinor = branch.view.spacingMinor || 0
      const lineWidth = branch.topicBorderWidth

      let currentChildY = childrenY
      children.forEach(child => {
        const y = currentChildY - child.bounds.y
        if (isRight) {
          child.position = { x: childrenX - child.bounds.x, y }
        } else {
          child.position = { x: childrenX - child.bounds.x - child.bounds.width, y }
        }
        currentChildY += child.bounds.height + spacingMinor + lineWidth
      })

      const maxBottom = Math.max(bounds.y + bounds.height, childrenY + childrenSize.height)
      bounds.y = Math.min(bounds.y, childrenY)
      bounds.height = maxBottom - bounds.y
      bounds.width = bounds.width + spacingMajor + childrenSize.width
    }
  }

  getChildrenSize(branch: BranchViewController): Size {
    const spacingMinor = branch.view.spacingMinor || 0
    const lineWidth = branch.topicViewController.view.borderWidth || 0
    let height = 0, width = 0

    const children = branch.getChildrenByType(TopicType.ATTACHED)
    children.forEach(child => {
      height += child.bounds.height + spacingMinor + lineWidth
      width = Math.max(width, child.bounds.width)
    })

    if (height > 0) {
      height -= (spacingMinor + lineWidth)
    }
    return { height, width }
  }

  protected calcSpacingMajor(branch: BranchViewController) {
    const spacingMajor = super.calcSpacingMajor(branch)
    const slantLines = [
      BranchConnection.CURVE, BranchConnection.STRAIGHT, BranchConnection.BIGHT,
      BranchConnection.FOLD, BranchConnection.ROUNDED_FOLD]
    const lineShape = branch.connectionViewController.lineShape as BranchConnection
    if (slantLines.includes(lineShape))
      return spacingMajor * 2
    return spacingMajor
  }

}