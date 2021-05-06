import ViewController from '../../../viewController/viewController'
import { StyleKey, StyleLayer } from '../../../common/constants/styles'
import Theme from '../../../model/theme'
import Model from '../../../model/model'
import defaultStyles from '../defaultStyles'
import FontInfo from '../../fontInfo'
import * as LayeredStyleManager from '../layeredStyleManager/layeredStyleManager'

const SPECIAL_HANDLE_KEYS = [StyleKey.FONT_FAMILY]

export interface StyleOptions {
  ignoreDefault?: boolean,
}

export default class MindMapStyleSelector {

  getStyleValue(target: ViewController, key: StyleKey, options: StyleOptions = {}): string {
    key = this.handleKey(target, key)
    if (SPECIAL_HANDLE_KEYS.includes(key)) {
      return this._getSpecialHandleValue(target, key)
    }

    let value: string

    value = this.getLayeredStyleValue(target, StyleLayer.BEFORE_USER, key)
    if (this.isValidValue(value)) {
      return value
    }

    value = this.getUserStyleValue(target, key)
    if (this.isValidValue(value)) {
      return value
    }

    value = this.getParentStyleValue(target, key)
    if (this.isValidValue(value)) {
      return value
    }

    value = this.getLayeredStyleValue(target, StyleLayer.BEFORE_THEME, key)
    if (this.isValidValue(value)) {
      return value
    }

    value = this.getThemeStyleValue(target, key)
    if (this.isValidValue(value)) {
      return value
    }

    if (!options.ignoreDefault) {
      value = this.getDefaultStyleValue(target, key)
      if (this.isValidValue(value)) {
        return value
      }
    }
  }

  protected handleKey(target: ViewController, key: StyleKey): StyleKey {
    return key
  }

  private _getSpecialHandleValue(target: ViewController, key: StyleKey): string {
    if (key === StyleKey.FONT_FAMILY) {
      return this._getFontFamily(target)
    }
  }

  private _getFontFamily(target: ViewController): string {
    const key = StyleKey.FONT_FAMILY
    let fontFamily = []

    // fontFamily.push(this.getLayeredStyleValue(target, StyleLayer.BEFORE_USER, key))
    fontFamily.push(this.getThemeStyleValue(target, key))

    fontFamily = fontFamily.filter(item => item && item !== '$system$')
    fontFamily = fontFamily.concat(['Nunito Sans', 'Microsoft YaHei', 'PingFang SC', 'Microsoft JhengHei'])
    fontFamily = fontFamily.reduce((arr, item) => {
      return arr.concat(item.split(','))
    }, [])
    return fontFamily.map(item => {
      if (item[0] === "'" || item[0] === '"') {
        return item
      }
      return `'${item}'`
    }).concat(['sans-serif']).join(',')
  }

  protected getLayeredStyleValue(target: ViewController, layerName: StyleLayer, key: StyleKey): string {
    return LayeredStyleManager.getStyleValue(target, layerName, key)
  }

  protected getUserStyleValue(target: ViewController, key: StyleKey) {
    return this.getModel(target).getStyleValue(key)
  }

  protected getParentStyleValue(target: ViewController, key: StyleKey) {
    //TODO get layer before parent
    return ''
  }

  protected getThemeStyleValue(target: ViewController, key: StyleKey): string {
    const theme = this.getTheme(target)
    const style = theme && theme.getStyle(this.getSuggestedClassName(target))
    return style && style.getStyleValue(key)
  }

  protected getDefaultStyleValue(target: ViewController, key: StyleKey): string {
    const className = this.getSuggestedClassName(target)
    return defaultStyles.getStyleValue(className, key)
  }

  protected getSuggestedClassName(target: ViewController): string {
    return this.getClassName(target)
  }

  protected getClassName(target: ViewController): string {
    return ''
  }

  protected getTheme(target: ViewController): Theme {
    return this.getModel(target).ownerSheet.theme
  }

  protected getModel(target: ViewController): Model {
    return target.model
  }

  protected isValidValue(value: string) {
    return value && value !== ''
  }

  getFontInfo(target: ViewController): FontInfo {
    return {
      fontFamily: this.getStyleValue(target, StyleKey.FONT_FAMILY),
      fontSize: this.getStyleValue(target, StyleKey.FONT_SIZE),
      fontStyle: this.getStyleValue(target, StyleKey.FONT_STYLE),
      fontWeight: this.getStyleValue(target, StyleKey.FONT_WEIGHT),
      textColor: this.getStyleValue(target, StyleKey.TEXT_COLOR),
      textAlign: this.getStyleValue(target, StyleKey.TEXT_ALIGN),
      textDecoration: this.getStyleValue(target, StyleKey.TEXT_DECORATION),
      textTransform: this.getStyleValue(target, StyleKey.TEXT_TRANSFORM),
    }
  }

}