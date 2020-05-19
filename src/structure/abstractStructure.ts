import BranchViewController from 'viewController/branchViewController'
import Bounds, { mergeArray, move } from 'utils/bounds'
import StructureClass, { EXPOSED_ATTACHED_STRUCTURES } from 'common/constants/structures'
import { TopicType } from 'common/constants/models'
import { ConnectionInfo, getConnectionInfo } from 'view/lineRender/topicLineStyle'
import { BranchConnection } from 'common/constants/styles'
import { isOrgChartStructure } from 'structure/helper/structureUtils'

export default abstract class AbstractStructure {

  abstract calcAttachedChildrenPos(branch: BranchViewController, bounds: Bounds): void

  protected calcSpacingMajor(branch: BranchViewController) {
    return branch.view.spacingMajor || 0
  }

  protected getChildrenBounds(branch: BranchViewController) {
    const children = branch.getChildrenByType(TopicType.ATTACHED)
    return mergeArray(children.map(child => move(child.bounds, child.position)))
  }

  getChildStructure(parent: BranchViewController, child: BranchViewController): StructureClass {
    return parent && parent.structureClass as StructureClass
  }

  getAvailableChildStructure(parent: BranchViewController, child: BranchViewController) {
    return EXPOSED_ATTACHED_STRUCTURES
  }

  getAttachedConnectionInfo(startBranch: BranchViewController, endBranch: BranchViewController): ConnectionInfo {
    const start = startBranch.topicShape.getStartAnchorPosition(startBranch, endBranch)
    const control = startBranch.topicShape.getControlPosition(startBranch, endBranch)
    const end = endBranch.topicShape.getEndAnchorPosition(startBranch, endBranch)

    const lineShape = startBranch.connectionViewController.lineShape as BranchConnection
    const special = isOrgChartStructure(startBranch)
    
    return getConnectionInfo(lineShape, endBranch, { start, control, end }, special)
  }

  specialDeal(branch: BranchViewController, bounds: Bounds): void {}

}