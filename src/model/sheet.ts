import Topic, { TopicData, parseTopic } from './topic'
import Model, { ModelData } from './model'
import Theme, { ThemeData } from './theme'
import { StyleKey } from '../common/constants/styles'
import { StyleData } from './style'

export interface SheetData extends ModelData {
  title: string
  rootTopic: TopicData
  style?: StyleData
  // topicPositioning?: 'free' | 'fixed' ///'free', //or 'fixed'
  // topicOverlapping?: 'overlap' | 'none' ///'overlap', //or 'none'
  theme?: ThemeData
  // relationships?: [
  //   RelationshipData,
  //   RelationshipData
  // ]
  // legend?: LegendData
  // settings?: SheetSettingsData
}

export default class Sheet extends Model {

  private _rootTopic: Topic
  private _theme: Theme
  private readonly _data: SheetData

  constructor(data: SheetData) {
    super()

    this._data = data
    this.init()
  }

  private init() {
    this._rootTopic = parseTopic(this._data.rootTopic, this)
    this._theme = new Theme(this._data.theme)

    this.ownerSheet = this
  }

  get rootTopic(): Topic {
    return this._rootTopic
  }

  get theme(): Theme {
    return this._theme
  }

  getStyleValue(key: StyleKey): string {
    const style = this._data.style
    return style?.properties[key]
  }

}