import LeftAndRight from './leftAndRight'
import BranchViewController from '../viewController/branchViewController'
import Bounds from '../utils/bounds'
import StructureClass from '../common/constants/structures'

export default class LogicRight extends LeftAndRight {

  calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds) {
    this.calcAttachedChildrenPosByDirection(branch, bounds, true)
  }

  getChildStructure() {
    return StructureClass.LOGIC_RIGHT
  }

}