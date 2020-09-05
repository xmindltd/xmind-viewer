import TopicShape from './topicShape'
import { TopicShapeType } from '../../../common/constants/styles'
import Bounds from '../../../utils/bounds'
import BranchViewController from '../../../viewController/branchViewController'
import Size from '../../../utils/size'
import { getFontSize } from './topicShapeUtils'

const PROPORTION = 1
const CORNER_GAP = 2
const SHRINKAGE = 10
const HORIZONTAL_SCALE = 1
const VERTICAL_SCALE = 0.5

export default class EllipseTopicShape extends TopicShape {

  constructor() {
    super(TopicShapeType.ELLIPSE)
  }

  protected calcTopicShapePath(bounds: Bounds) {
    return 'M ' + bounds.x + ' ' + (bounds.y + bounds.y + bounds.height) +
      'A ' + (bounds.x + bounds.width) + ' ' + (bounds.y + bounds.height) + ' 0 1 1 ' + (bounds.x) + ' ' + (bounds.y + bounds.y + bounds.height + 0.001)
  }

  getTopicMargins(branch: BranchViewController, size: Size) {
    const k = PROPORTION
    const h = size.height * 0.5 + CORNER_GAP
    const w = size.width * 0.5 + CORNER_GAP

    const a = 1
    const b = 2 * (k * w + h) / k
    const c = 4 * w * h / k
    const d = 0
    const e = -w * w * h * h / (k * k)

    const l = this._newton([a, b, c, d, e], w / 2)
    const t = k * l

    const prefHeight = Math.round(t)
    const prefWidth = Math.round(l)

    const minHeight = Math.max(a, prefHeight - SHRINKAGE / 2)
    const minWidth = Math.max(a, prefWidth - SHRINKAGE)

    const topicMargins = super.getTopicMargins(branch, size)
    const fontSize = Math.min(50, getFontSize(branch))

    return {
      top:topicMargins.top + minHeight + fontSize * VERTICAL_SCALE,
      bottom:topicMargins.bottom + minHeight + fontSize * VERTICAL_SCALE,
      left:topicMargins.left + minWidth + fontSize * HORIZONTAL_SCALE,
      right:topicMargins.right + minWidth + fontSize * HORIZONTAL_SCALE
    }
  }

  private _newton(coefs: number[], x: number) {
    if (!coefs && coefs.length <= 1) {
      return
    }

    const MAX = 10000
    const EPS = 0.00000001

    let current = x
    let last = current
    let sig = 1
    let i = 0
    while (Math.abs(sig) > EPS) {
      i++
      if (i >= MAX) {
        break
      }

      current = last - this._f(coefs, last) / this._df(coefs, last)
      sig = current - last
      last = current
    }
    return current
  }
  
  private _f(coefs: number[], x: number) {
    const length = coefs.length
    let y = 0
    for (let i = 0; i < length; i++) {
      y += coefs[i] * Math.pow(x, length - 1 - i)
    }
    return y
  }

  private _df(coefs: number[], x: number) {
    const length = coefs.length
    let y = 0
    for (let i = 0; i < length; i++) {
      y += coefs[i] * (length - 1 - i) * Math.pow(x, coefs.length - 2 - i)
    }
    return y
  }

}