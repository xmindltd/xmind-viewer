import ViewController from 'viewController/viewController'
import { StyleKey } from 'common/constants/styles'
import View from 'view/view'
import { findStyleSelector } from './styleSelectorFactory'
import FontInfo from 'utils/fontInfo'

export function getStyleValue(target: ViewController, key: StyleKey): string {
  const selector = _getStyleSelector(target)
  return selector && selector.getStyleValue(target, key)
}

export function getFontInfo(target: ViewController): FontInfo {
  const selector = _getStyleSelector(target)
  return selector && selector.getFontInfo(target)
}

function _getStyleSelector(target: ViewController) {
  return findStyleSelector(target)
}