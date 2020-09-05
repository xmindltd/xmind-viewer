import UnderlineTopicShape from './underlineTopicShape'
import BranchViewController from '../../../viewController/branchViewController'
import Size from '../../../utils/size'
import { getUnits } from './topicShapeUtils'
import StructureClass from '../../../common/constants/structures'
import { getBranchIndex, getParentBranch } from '../../../utils/branchUtils'
import { Direction } from '../../../common/constants/models'
import { ROTATED_TAN } from '../../../common/constants/layoutSettings'

export default class FishboneUnderlineTopicShape extends UnderlineTopicShape {

  getTopicMargins(branch: BranchViewController, size: Size) {
    let { lm, rm, tm, bm, lw } = getUnits(branch)

    const { hasOffsetX, dire } = this._getOffsetInfo(branch)
    if (hasOffsetX) {
      const offsetX = (size.height + tm + bm + lw) * ROTATED_TAN
      if (dire === Direction.RIGHT) {
        lm += offsetX
      } else if (dire === Direction.LEFT) {
        rm += offsetX
      }
    }

    return {
      top: lw,
      left: lm,
      bottom: lw,
      right: rm
    }
  }

  private _getOffsetInfo(branch: BranchViewController): { hasOffsetX: boolean, dire: Direction.LEFT | Direction.RIGHT } {
    let hasOffsetX = false
    let dire = null
    
    const parent = getParentBranch(branch)
    if (parent.getLayer() >= 2 && getBranchIndex(branch) !== 0) {
      const sc = branch.structureClass
      if (sc === StructureClass.FISHBONE_NE_NORMAL) {
        hasOffsetX = true
        dire = Direction.RIGHT
      } else if (sc === StructureClass.FISHBONE_NW_NORMAL) {
        hasOffsetX = true
        dire = Direction.LEFT
      }
    }
    
    return { hasOffsetX, dire }
  }

}