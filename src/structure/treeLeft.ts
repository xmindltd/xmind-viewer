import TreeLeftAndRight from './treeLeftAndRight'
import StructureClass from 'common/constants/structures'

export default class TreeLeft extends TreeLeftAndRight {

	getChildStructure() {
		return StructureClass.TREE_LEFT
	}

	isRight() {
		return false
	}

}