import BranchViewController from 'viewController/branchViewController'
import Bounds from 'utils/bounds'
import BaseMap from 'structure/baseMap'
import { TopicType, Direction } from 'common/constants/models'
import StructureClass from 'common/constants/structures'
import LeftAndRight from 'structure/leftAndRight'
import TreeLeftAndRight from 'structure/treeLeftAndRight'
import OrgChart from 'structure/orgChart'

export function isMapStructure(branch: BranchViewController) {
  return branch?.getStructureObject() instanceof BaseMap
}

export function isLogicStructure(branch: BranchViewController) {
  return branch?.getStructureObject() instanceof LeftAndRight
}

export function isTreeStructure(branch: BranchViewController) {
  return branch?.getStructureObject() instanceof TreeLeftAndRight
}

export function isOrgChartStructure(branch: BranchViewController) {
  return branch?.getStructureObject() instanceof OrgChart
}

export function isFishboneStructure(branch: BranchViewController) {
  return branch?.structureClass?.includes('org.xmind.ui.fishbone')
}

export function isFishHeadStructure(branch: BranchViewController) {
  const sc = branch.structureClass
  return sc?.includes('org.xmind.ui.fishbone.leftHeaded') ||
    sc?.includes('org.xmind.ui.fishbone.rightHeaded')
}

export function getFishboneStructureHorizontalDire(branch: BranchViewController): Direction.LEFT | Direction.RIGHT {
  if (isFishboneStructure(branch)) {
    const sc = branch.structureClass
    if (sc === StructureClass.FISHBONE_NE_NORMAL || sc === StructureClass.FISHBONE_SE_NORMAL) {
      return Direction.RIGHT
    } else if (sc === StructureClass.FISHBONE_NW_NORMAL || sc === StructureClass.FISHBONE_SW_NORMAL) {
      return Direction.LEFT
    }
  }
  return null
}

export function mergeBounds(branches: Array<BranchViewController>, bounds: Bounds) {
  const newBounds = Object.assign({}, bounds)
  const maxRight = branches.reduce((maxValue, branch) => Math.max(maxValue, branch.position.x), newBounds.x + newBounds.width)
  newBounds.x = branches.reduce((minValue, branch) => Math.min(minValue, branch.position.x), newBounds.x)
  newBounds.width = maxRight - newBounds.x

  const maxBottom = branches.reduce((maxValue, branch) => Math.max(maxValue, branch.position.y), newBounds.y + newBounds.height)
  newBounds.y = branches.reduce((minValue, branch) => Math.min(minValue, branch.position.y), newBounds.y)
  newBounds.height = maxBottom - newBounds.y
  return newBounds
}

export function getUpSideBranches(branch: BranchViewController): BranchViewController[] {
  const children = branch?.getChildrenByType(TopicType.ATTACHED)
  if (children?.length > 0) {
    const ups: BranchViewController[] = []
    let upWards = true
    children.forEach(child => {
      if (upWards) {
        ups.push(child)
      } 
      upWards = !upWards
    })
    return ups
  }
  return []
}

export function isUpSideBranch(parent: BranchViewController, child: BranchViewController): boolean {
  const children = parent.getChildrenByType(TopicType.ATTACHED)
  if (children.length > 0) {
    let upWards = true
    return children.some(c => {
      if (c === child) {
        return upWards
      }
      upWards = !upWards
    })
  }

  return false
}