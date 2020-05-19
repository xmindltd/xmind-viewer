import LeftAndRight from './leftAndRight'
import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import StructureClass from 'common/constants/structures'

export default class LogicLeft extends LeftAndRight {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    this.calcAttachedChildrenPosByDirection(branch, bounds, false)
  }

  getChildStructure() {
    return StructureClass.LOGIC_LEFT
  }

}