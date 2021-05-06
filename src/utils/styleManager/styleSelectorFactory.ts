import ViewController from '../../viewController/viewController'
import ViewControllerType from '../../common/constants/viewControllers'
import MindMapStyleSelector from './selector/mindMapStyleSelector'
import TopicStyleSelector from './selector/topicStyleSelector'
import SheetStyleSelector from './selector/sheetStyleSelector'

const topicStyleSelector = new TopicStyleSelector()
const sheetStyleSelector = new SheetStyleSelector()
const mindmapStyleSelector = new MindMapStyleSelector()

export function findStyleSelector(target: ViewController): MindMapStyleSelector {
  switch (target.type) {
    case ViewControllerType.BRANCH: {
      return topicStyleSelector
    }

    case ViewControllerType.SHEET: {
      return sheetStyleSelector
    }
  }

  return mindmapStyleSelector
}
