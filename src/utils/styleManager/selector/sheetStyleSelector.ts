import MindMapStyleSelector from './mindMapStyleSelector'
import { ClassType } from 'common/constants/styles'

export default class SheetStyleSelector extends MindMapStyleSelector {

  getClassName() {
    return ClassType.MAP
  }

}