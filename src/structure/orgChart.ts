import AbstractStructure from './abstractStructure'
import BranchViewController from '../viewController/branchViewController'
import Bounds from '../utils/bounds'
import { TopicType } from '../common/constants/models'
import { BranchConnection } from '../common/constants/styles'
import Size from '../utils/size'

export default abstract class OrgChart extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    const length = children.length

    if (length > 0) {
      const childrenSize = this.getChildrenSize(branch, children)

      const leftChild = children[0]
      const rightChild = children[length - 1]
      const controlPosX = branch.topicShape.getControlPosition(branch, leftChild).x - branch.position.x
      const leftEndPosX = leftChild.topicShape.getEndAnchorPosition(branch, leftChild).x
      const rightEndPosX = rightChild.topicShape.getEndAnchorPosition(branch, rightChild).x
      const childrenX = (rightChild.bounds.x + rightChild.bounds.width - leftEndPosX - rightEndPosX - leftChild.bounds.x - childrenSize.width) / 2 + leftChild.bounds.x + controlPosX
      bounds.x = Math.min(bounds.x, childrenX)

      const spacingMajor = this.calcSpacingMajor(branch)
      let childrenY: number
      if (this.isDown()) {
        childrenY = bounds.y + bounds.height + spacingMajor
      } else {
        childrenY = bounds.y - spacingMajor
        bounds.y = Math.min(bounds.y, childrenY - childrenSize.height)
      }

      const lineWidth = branch.topicViewController.view.borderWidth || 0
      let currentChildX = childrenX
      children.forEach(child => {
        const { x, y, width, height } = child.bounds
        
        const posX = currentChildX - x
        const posY = this.isDown() ? childrenY - y : childrenY - y - height
        child.position = { x: posX, y: posY }

        currentChildX += width + spacingMajor + lineWidth
      })

      bounds.width = Math.max(bounds.width, childrenSize.width)
      bounds.height = bounds.height + spacingMajor + childrenSize.height
    }
  }

  protected abstract isDown(): boolean

  protected calcSpacingMajor(branch: BranchViewController) {
    const spacingMajor = super.calcSpacingMajor(branch)
    const slantLines = [BranchConnection.CURVE, BranchConnection.BIGHT]
    const lineShape = branch.connectionViewController.lineShape as BranchConnection
    if (slantLines.includes(lineShape))
      return spacingMajor * 2
    return spacingMajor
  }

  protected getChildrenSize(parent: BranchViewController, children: BranchViewController[]): Size {
    const spacingMajor = this.calcSpacingMajor(parent)
    const lineWidth = parent.topicViewController.view.borderWidth || 0

    let height = 0, width = 0
    children.forEach(child => {
      height = Math.max(height, child.bounds.height)
      width += child.bounds.width + spacingMajor + lineWidth
    })

    if (width > 0) {
      width -= (spacingMajor + lineWidth)
    }

    return { height, width }
  }

}