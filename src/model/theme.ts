import Model, { ModelData } from './model'
import Style, { StyleData } from './style'
import { ClassType } from 'common/constants/styles'

export interface ThemeData extends ModelData {

  map?: StyleData,
  centralTopic?: StyleData,
  mainTopic?: StyleData,
  subTopic?: StyleData,

}

export default class Theme extends Model {

  private readonly _data: ThemeData
  private _props: Map<string, Style>

  constructor(data: ThemeData) {
    super()

    this._data = data
    this._props = new Map()

    this._init()
  }

  private _init() {
    for (let classType in ClassType) {
      const classTypeValue = ClassType[classType]
      const styleData = this._data[classTypeValue]
      if (styleData) {
        const style = new Style(styleData)
        this._props.set(classTypeValue, style)
      }
    }
  }

  getStyle(className: string) {
    return this._props.get(className)
  }

}