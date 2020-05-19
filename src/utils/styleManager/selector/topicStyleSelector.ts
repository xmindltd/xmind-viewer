import MindMapStyleSelector, { StyleOptions } from './mindMapStyleSelector'
import View from 'view/view'
import ViewController from 'viewController/viewController'
import BranchViewController from 'viewController/branchViewController'
import { ClassType, StyleKey } from 'common/constants/styles'
import { isAttachedBranch, getBranchIndex, getParentBranch } from 'utils/branchUtils'

export default class TopicStyleSelector extends MindMapStyleSelector {

  protected getClassName(target: ViewController): string {
    if (target instanceof BranchViewController) {
      const layer = target.getLayer()
      if (layer === 1) {
        return ClassType.CENTRAL_TOPIC
      } else if (isAttachedBranch(target)) {
        return layer === 2 ? ClassType.MAIN_TOPIC : ClassType.SUB_TOPIC
      }
    }
    return ''
  }

  protected getParentStyleValue(target: ViewController, key: StyleKey) {
    let value = super.getParentStyleValue(target, key)
    if (this.isValidValue(value)) {
      return value
    }

    if (target instanceof BranchViewController) {
      switch (key) {
        case StyleKey.LINE_COLOR: {
          return this._getMultiLineColors(target) ||
            this.getThemeStyleValue(target, key) ||
            this._getStyleValueFromParent(target, key, { ignoreDefault: true })
        }

        case StyleKey.BORDER_LINE_COLOR: {
          return this.getThemeStyleValue(target, key) ||
            this.getStyleValue(target, StyleKey.LINE_COLOR, { ignoreDefault: true })
        }

        case StyleKey.BORDER_LINE_WIDTH: {
          return this.getThemeStyleValue(target, key) ||
            this.getStyleValue(target, StyleKey.LINE_WIDTH, { ignoreDefault: true }) ||
            this._getStyleValueFromParent(target, StyleKey.LINE_WIDTH, { ignoreDefault: true })
        }

        case StyleKey.LINE_WIDTH: {
          return this.getThemeStyleValue(target, key) ||
            this._getStyleValueFromParent(target, key, { ignoreDefault: true }) || 
            this.getDefaultStyleValue(target, key)
        }

      }
    }
  }

  private _getStyleValueFromParent(target: BranchViewController, key: StyleKey, options: StyleOptions = {}) {
    const parent = getParentBranch(target)
    return parent && this.getStyleValue(parent, key, options)
  }

  private _getMultiLineColors(target: BranchViewController) {
    if (target.isCentralBranch()) return

    const sheet = target.sheetViewController
    if (sheet.hasMultiLineColors()) {
      let ancestor = target
      while (this.getClassName(ancestor) !== ClassType.MAIN_TOPIC) {
        ancestor = ancestor.parent as BranchViewController
        if (!ancestor) {
          return
        }
      }

      const colors = sheet.multiLineColors.split(' ')
      const indexInParent = getBranchIndex(ancestor)
      indexInParent < 0 ? 0 : indexInParent
      return colors[indexInParent % colors.length]
    }
  }

}