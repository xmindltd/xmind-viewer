import { StyleLayer, StyleKey, TopicShapeType, BranchConnection } from 'common/constants/styles'
import ViewController from 'viewController/viewController'
import StructureClass, { FISHBONE_NORMAL_STRUCTURES } from 'common/constants/structures'
import BranchViewController from 'viewController/branchViewController'
import { isRootBranch } from 'utils/branchUtils'
import { isLogicStructure, isTreeStructure, isOrgChartStructure } from 'structure/helper/structureUtils'

type TestFunction = (target: ViewController) => boolean

const descriptor = {

  beforeUser: [
    {
      type: StyleKey.SHAPE_CLASS,
      test: structureClassIs([StructureClass.FISHBONE_LEFT_HEADED]),
      value: TopicShapeType.FISH_HEAD_TO_LEFT
    },
    {
      type: StyleKey.SHAPE_CLASS,
      test: structureClassIs([StructureClass.FISHBONE_RIGHT_HEADED]),
      value: TopicShapeType.FISH_HEAD_TO_RIGHT
    },
    {
      type: StyleKey.SHAPE_CLASS,
      test: structureClassIs(FISHBONE_NORMAL_STRUCTURES),
      value: TopicShapeType.FISHBONE_NE_UNDERLINE
    },
    {
      type: StyleKey.LINE_CLASS,
      test: and(isRootBranch, structureClassIs([StructureClass.TIMELINE_VERTICAL])),
      value: BranchConnection.ROUNDED_ELBOW
    },
  ],

  beforeTheme: [
    {
      type: StyleKey.LINE_CLASS,
      test: and(isRootBranch, isLogicStructure),
      value: BranchConnection.ROUNDED_ELBOW
    },
    {
      type: StyleKey.LINE_CLASS,
      test: and(isRootBranch, isTreeStructure),
      value: BranchConnection.ROUNDED_ELBOW
    },
    {
      type: StyleKey.LINE_CLASS,
      test: and(isRootBranch, isOrgChartStructure),
      value: BranchConnection.ROUNDED_ELBOW
    },
  ]

}

function structureClassIs(scs: StructureClass[]): TestFunction {
  return (target: ViewController) => {
    if (target instanceof BranchViewController) {
      return scs.some(value => {
        return target.structureClass === value
      })
    }
    return false
  }
}

function and(...tfs: TestFunction[]) { 
  return (target: ViewController) => tfs.every(tf => tf(target)) 
}

export function getStyleValue(target: ViewController, layerName: StyleLayer, key: StyleKey): string {
  let value = null
  descriptor[layerName]?.forEach(result => {
    if (result.type === key && result.test && result.test(target)) {
      value = result.value
    }
  })
  return value
}