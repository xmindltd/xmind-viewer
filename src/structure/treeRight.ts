import TreeLeftAndRight from './treeLeftAndRight'
import StructureClass from '../common/constants/structures'

export default class TreeRight extends TreeLeftAndRight {

  getChildStructure() {
    return StructureClass.TREE_RIGHT    
  }

  isRight() {
    return true
  }

}