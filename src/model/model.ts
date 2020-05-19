import Sheet from './sheet'
import { StyleKey } from 'common/constants/styles'

export interface ModelData {
  id: string
}

export default abstract class Model {

  ownerSheet: Sheet
  parent: Model

  constructor() {
  }

  getStyleValue(key: StyleKey): string {
    return null
  }

}