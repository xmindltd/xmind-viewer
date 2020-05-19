import MapClockWise from 'structure/mapClockWise'
import BranchViewController from 'viewController/branchViewController'
import Topic from 'model/topic'

export default class MapUnbalanced extends MapClockWise {

  protected calcRightSideCount(branch: BranchViewController) {
    const topic = branch.model
    let info: { rightSideCount: number }
    if (topic instanceof Topic) {
      info = topic.getUnbalancedInfo()
    }
    return info ? info.rightSideCount : super.calcRightSideCount(branch)
  }

}