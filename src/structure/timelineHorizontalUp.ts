import AbstractStructure from './abstractStructure'
import BranchViewController from '../viewController/branchViewController'
import Bounds from '../utils/bounds'
import { TopicType } from '../common/constants/models'
import { PADDING } from '../common/constants/layoutSettings'
import Size from '../utils/size'
import StructureClass from '../common/constants/structures'

export default class TimelineHorizontalUp extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    let children = branch.getChildrenByType(TopicType.ATTACHED)

    if (children.length) {
      const childrenSize = this.getChildrenSize(branch)
      const lineCorner = branch.topicViewController.view.lineCorner
      const childrenX = bounds.x + bounds.width + PADDING
      const extendHeight = this._getExtendHeight(branch)

      let childrenY = bounds.y - lineCorner - extendHeight - PADDING
      children.reverse().forEach(child => {
        childrenY += child.bounds.y
        child.position = { x: childrenX - child.bounds.x, y: childrenY }
        childrenY -= child.bounds.height / 2 + PADDING
      })

      bounds.height += childrenSize.height
      bounds.width += bounds.x + childrenSize.width + PADDING
      bounds.y = childrenY + PADDING
    }
  }

  protected getChildrenSize(branch: BranchViewController): Size {
    const children = branch.getChildrenByType(TopicType.ATTACHED)

    let width = 0, height = 0
    if (children.length) {
      children.forEach(child => {
        height += child.bounds.height + PADDING
        width = Math.max(width, child.bounds.width)
      })

      height -= PADDING
    }
    return { width, height }
  }

  private _getExtendHeight(branch: BranchViewController): number {
    const parent = branch.parent
    if (parent instanceof BranchViewController) {
      const children = parent.getChildrenByType(TopicType.ATTACHED)
      const currentIndex = children.indexOf(branch)

      const nextTopicHeight = children[currentIndex + 1]?.topicViewController.bounds.height
      const currentTopicHeight = branch.topicViewController.bounds.height
      if (nextTopicHeight > currentTopicHeight) {
        return (nextTopicHeight - currentTopicHeight) / 2
      }
    }
    return 0
  }

  getChildStructure() {
    return StructureClass.LOGIC_RIGHT
  }

}