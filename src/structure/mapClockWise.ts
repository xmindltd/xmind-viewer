import BaseMap from 'structure/baseMap'
import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import { TopicType, Direction } from 'common/constants/models'
import StructureClass from 'common/constants/structures'

export default class MapClockWise extends BaseMap {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    if (branch.isCentralBranch()) {
      const children = branch.getChildrenByType(TopicType.ATTACHED)
      if (children.length) {
        const spacingMajor = this.calcSpacingMajor(branch)
        const spacingMinor = branch.view.spacingMinor || 0
        const rightSideCount = this.calcRightSideCount(branch)

        const rightSideChildren = children.slice(0, rightSideCount)
        this.calcSidePos(rightSideChildren, Direction.RIGHT, bounds, spacingMajor, spacingMinor, true)

        const leftSideChildren = children.slice(rightSideCount).reverse()
        this.calcSidePos(leftSideChildren, Direction.LEFT, bounds, spacingMajor, spacingMinor, false)

        this.calcBounds(branch, bounds)
      }
    }
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController) {
    const index = parent.getChildrenByType(child.model.type).indexOf(child)
    if (index < this.calcRightSideCount(parent)) {
      return StructureClass.LOGIC_RIGHT
    }
    return StructureClass.LOGIC_LEFT
  }

}