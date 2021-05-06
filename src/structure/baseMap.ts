import AbstractStructure from './abstractStructure'
import BranchViewController from '../viewController/branchViewController'
import { TopicType, Direction } from '../common/constants/models'
import { EXPOSED_ATTACHED_RIGHT_STRUCTURES, EXPOSED_ATTACHED_LEFT_STRUCTURES } from '../common/constants/structures'
import Bounds from '../utils/bounds'
import { mergeBounds } from './helper/structureUtils'
import { getBranchIndex, getParentBranch } from '../utils/branchUtils'
import { PADDING } from '../common/constants/layoutSettings'

const MIN_TOP_BOTTOM_SPACING = 80
const MAX_TOP_BOTTOM_SPACING = 180
const PARENT_TOPIC_THRESHOLD = 230

export default abstract class BaseMap extends AbstractStructure {

  getAvailableChildStructure(parent: BranchViewController, child: BranchViewController) {
    const index = getBranchIndex(child)
    const isRight = index < this.calcRightSideCount(parent)
    return isRight ? EXPOSED_ATTACHED_RIGHT_STRUCTURES : EXPOSED_ATTACHED_LEFT_STRUCTURES
  }

  protected calcSidePos(children: Array<BranchViewController>, dire: Direction, bounds: Bounds, spacingMajor: number, spacingMinor: number, isUpToDown: boolean) {
    if (dire !== Direction.RIGHT && dire !== Direction.LEFT) return
    if (!children || children.length === 0) return

    const minSumTopicSpacing = this.getMinSumTopicSpacing(children, bounds)
    let sumTopicSpacing = minSumTopicSpacing
    const yPosRelativeToFirstChild = [0]
    children.forEach((child, index) => {
      if (index === 0) return
      const prev = children[index - 1]
      const prevTopicBounds = prev.topicViewController.bounds
      const prevBounds = prev.bounds
      const prevYPos = yPosRelativeToFirstChild[index - 1]
      const topicBounds = child.topicViewController.bounds
      yPosRelativeToFirstChild[index] = Math.max(
        prevYPos + prevBounds.y + prevBounds.height + spacingMinor - child.bounds.y,
        prevYPos + prevTopicBounds.y + prevTopicBounds.height + sumTopicSpacing / (children.length - index) - topicBounds.y
      )

      sumTopicSpacing = sumTopicSpacing - (yPosRelativeToFirstChild[index] + topicBounds.y - (prevYPos + prevTopicBounds.y + prevTopicBounds.height))
    })

    const firstChild = children[0]
    const lastChild = children[children.length - 1]

    const parent = getParentBranch(firstChild)
    const firstChildEndPosY = firstChild.topicShape.getEndAnchorPosition(parent, firstChild).y
    const lastChildEndPosY = lastChild.topicShape.getEndAnchorPosition(parent, lastChild).y
    const parentPosRelativeToFirstChild = (firstChildEndPosY + yPosRelativeToFirstChild[0] + lastChildEndPosY + yPosRelativeToFirstChild[children.length - 1]) / 2
    let firstChildY: number
    if (firstChild === lastChild) {
      const firstChildTopicBounds = firstChild.topicViewController.bounds
      firstChildY = (isUpToDown ? -1 : 1) * minSumTopicSpacing / 2 - firstChildTopicBounds.y - (isUpToDown ? 1 : 0) * firstChildTopicBounds.height
    } else {
      firstChildY = -parentPosRelativeToFirstChild
    }

    let x: number
    if (dire === Direction.LEFT) {
      x = bounds.x - spacingMajor
    } else {
      x = bounds.x + bounds.width + spacingMajor
    }

    children.forEach((branch, index) => {
      const y = firstChildY + yPosRelativeToFirstChild[index]
      if (dire === Direction.LEFT) {
        branch.position = { x: x - branch.bounds.x - branch.bounds.width, y }
      } else {
        branch.position = { x: x - branch.bounds.x, y }
      }
    })
  }

  protected getMinSumTopicSpacing(children: Array<BranchViewController>, parentTopicBounds: Bounds) {
    let sumSpacing: number
    let topBottomSpacing = MIN_TOP_BOTTOM_SPACING
    if (parentTopicBounds.height > PARENT_TOPIC_THRESHOLD) {
      topBottomSpacing = Math.min(MAX_TOP_BOTTOM_SPACING, parentTopicBounds.height - PARENT_TOPIC_THRESHOLD + topBottomSpacing)
    }

    const len = children.length
    if (len <= 2) {
      sumSpacing = topBottomSpacing
    } else {
      sumSpacing = children.reduce((pre, cur, index) => {
        if (index !== 0 && index !== (children.length - 1)) {
          return pre// - cur.boundary.height
        } else {
          return pre
        }
      }, topBottomSpacing)
    }

    return sumSpacing
  }

  protected calcSpacingMajor(branch: BranchViewController) {
    // if branch connection fold.. 3 * padding
    return super.calcSpacingMajor(branch)
  }

  protected calcBounds(branch: BranchViewController, bounds: Bounds) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    return Object.assign(bounds, mergeBounds(children, bounds))
  }

  protected calcRightSideCount(branch: BranchViewController) {
    const children = branch?.getChildrenByType(TopicType.ATTACHED)
    const length = children.length
    if (length === 0) return 0

    let totalWeight = 0
    children.forEach(child => {
      totalWeight += this._getWeight(child)
    })

    const threshold = 200 * (Math.log(length) + 1)
    const _isWithinThreshold = (child: BranchViewController) => {
      return this._getWeight(child) < threshold
    }
    const halfWeight = totalWeight / 2
    
    let rightSideWeight = 0
    for (let i = 0; i < length; i++) {
      const blockWeight = this._getWeight(children[i])
      const newRightSideWeight = rightSideWeight + blockWeight
      if (newRightSideWeight >= halfWeight) {
        if (i === 0 && length === 2 && _isWithinThreshold(children[0]) && _isWithinThreshold(children[1])) {
          return 2
        }

        const lastIndex = i - 1
        if (lastIndex >= 0 && (newRightSideWeight - halfWeight > halfWeight - rightSideWeight)) {
          return i
        } 
        return i + 1
      }
      rightSideWeight = newRightSideWeight
    }

    return length
  }

  private _getWeight(branch: BranchViewController) {
    return branch.bounds?.height + PADDING / 2 * 3
  }

}