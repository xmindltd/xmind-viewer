import AbstractStructure from './abstractStructure'
import BranchViewController from 'viewController/branchViewController'
import StructureClass from 'common/constants/structures'
import Bounds, { merge } from 'utils/bounds'
import { TopicType } from 'common/constants/models'
import { PADDING } from 'common/constants/layoutSettings'

export default class TimelineVertical extends AbstractStructure {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)

    if (children.length) {

      const childrenXR = bounds.x + bounds.width + bounds.x + PADDING
      const childrenXL = bounds.x + bounds.width + bounds.x - PADDING

      let yRightBefore = bounds.y + bounds.height
      let yRight = yRightBefore + PADDING
      let yLeftBefore = bounds.y + bounds.height
      let yLeft = yLeftBefore + PADDING
      
      let isRightWards = true
      children.forEach(child => {
        const isRight = this.isRightSide(branch, child, isRightWards)
        const topicHeight = child.topicViewController.bounds.height

        let y: number
        if (isRight) {
          y = yRight > yLeftBefore + PADDING ? yRight : yLeftBefore + PADDING
          child.position = { x: childrenXR - child.bounds.x, y: y - child.bounds.y }
          yRightBefore = y + topicHeight + PADDING
          yRight = y + child.bounds.height + PADDING
          isRightWards = false
        } else {
          y = yLeft > yRightBefore + PADDING ? yLeft : yRightBefore + PADDING
          child.position = { x: childrenXL - child.bounds.x - child.bounds.width, y: y - child.bounds.y }
          yLeftBefore = y + topicHeight + PADDING
          yLeft = y + child.bounds.height + PADDING
          isRightWards = true
        }
      })

      const childrenSize = super.getChildrenBounds(branch)
      const newBounds = merge(bounds, childrenSize)
      bounds.x = newBounds.x
      bounds.y = newBounds.y
      bounds.width = newBounds.width
      bounds.height = newBounds.height
    }
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController): StructureClass {
    const children = parent.getChildrenByType(TopicType.ATTACHED)

    let result = StructureClass.TREE_RIGHT
    let isRight = true
    children.forEach(c => {
      if (c === child) { 
        result = isRight ?  StructureClass.TREE_RIGHT : StructureClass.TREE_LEFT
      }
      isRight = !isRight
    })

    return result
  }

  private isRightSide(parent: BranchViewController, child: BranchViewController, isRightWards: boolean): boolean {
    if (isRightWards) {
      return true
    } else {
      return false
    }
  }

}