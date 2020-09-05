import Model, { ModelData } from './model'
import { StyleKey } from '../common/constants/styles'

export interface StyleData extends ModelData {
  properties: any
  styleId: string
}

export default class Style extends Model {

  private readonly _data: StyleData

  constructor(data: StyleData) {
    super()
    this._data = data
  }

  getStyleValue(key: StyleKey) {
    return this._data.properties[key]
  }

}