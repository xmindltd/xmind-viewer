import TextView from 'view/textView'
import ViewType from 'common/constants/views'

export default class TopicTitleView extends TextView {

  type = ViewType.TOPIC_TITLE

  constructor() {
    super('topic-title-text-group')
  }

  layout() {
    this.layoutWorker.work()
  }

}