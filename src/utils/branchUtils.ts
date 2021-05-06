import BranchViewController from '../viewController/branchViewController'
import { TopicType } from '../common/constants/models'
import StructureClass from '../common/constants/structures'
import ViewControllerType from '../common/constants/viewControllers'
import { MaskInfo, MASK_OUTERD } from '../view/connectionView'

export function isAttachedBranch(branch: BranchViewController) {
  return branch?.model?.type === TopicType.ATTACHED
}

export function isRootBranch(branch: BranchViewController) {
  return branch?.parent?.type === ViewControllerType.SHEET
}

export function getBranchIndex(branch: BranchViewController) {
  if (branch && !branch.isCentralBranch()) {
    const parent = branch.parent
    if (parent instanceof BranchViewController) {
      return parent.getChildrenByType(branch.model.type).indexOf(branch)
    }
  }
  return -1
}

export function getBranchStructureClass(branch: BranchViewController) {
  const modelStructureClass = branch.model.structureClass
  if (branch.isCentralBranch()) {
    return modelStructureClass || StructureClass.MAP
  }

  const parent = branch.parent
  if (parent instanceof BranchViewController) {
    const parentStructure = parent.getStructureObject()

    const type = branch.model.type
    if (type === TopicType.ATTACHED) {
      return parentStructure.getChildStructure(parent, branch)
    }
  }
}

export function getParentBranch(branch: BranchViewController): BranchViewController {
  const parent = branch.parent
  return parent instanceof BranchViewController ? parent : null
}

export function getMaskInfo(branch: BranchViewController): MaskInfo {
  const innerD = branch.topicViewController.view.topicShapePath
  const d = `${innerD} ${MASK_OUTERD}`
  const transform = 'translate(0 0)'
  return { d, transform }
}