import TextView from 'view/textView'
import { str2NodesArr, getNodesSize } from 'utils/stringNodes'
import FontInfo from 'utils/fontInfo'
import { Text } from '@svgdotjs/svg.js'
import { TextTransform } from 'common/constants/styles'

const ATTR_MAP = {
  'fontFamily': 'font-family',
  'fontSize': 'font-size',
  'fontWeight': 'font-weight',
  'fontStyle': 'font-style',
  'textColor': 'fill',
  'textDecoration': 'text-decoration'
}

const transToAttr = (info: FontInfo) => {
  const attr = {}

  Object.keys(info)
    .filter((key) => ATTR_MAP[key])
    .map((key) => {
      attr[ATTR_MAP[key]] = info[key]
    })

  return attr
}

export default class TitleLayoutWorker {

  private readonly _view: TextView

  constructor(view: TextView) {
    this._view = view
  }

  work() {
    const view = this._view
    let text = view.text

    const fontInfo = view.fontInfo
    if (fontInfo.fontSize) {
      fontInfo.fontSize = String(Number.parseInt(fontInfo.fontSize || '0'))
    }

    text = this._getTransformedText(fontInfo.textTransform, text)

    let nodesArr = str2NodesArr(text, fontInfo)
    nodesArr = nodesArr.map(nodes => {
      if (nodes.length > 0) { return nodes }
      return [{content: '', style: fontInfo}]
    })

    const lineHeight = Math.floor(Number.parseInt(fontInfo.fontSize || '0') * 1.34)

    view.textFn = ((add: Text) => {
      nodesArr.forEach((nodes, j) => {
        const dy = (j === 0) ? parseInt(fontInfo.fontSize || '0') : lineHeight
        nodes.forEach((node, i) => {
          const attr = transToAttr(node.style)
          const tspan = add.tspan('\u200E' + node.content).attr(attr)
          if (i === 0) { tspan.dy(dy).x(0) }
        })
      })
    })

    const height = nodesArr.length * lineHeight
    const width = nodesArr.reduce((maxWidth, nodes) => {
      const { width } = getNodesSize(nodes)
      return Math.max(maxWidth, width)
    }, 0)

    view.textSize = { width, height }
  }

  private _getTransformedText(textTransform: string, text: string) {
    switch(textTransform) {
      case TextTransform.MANUAL:
        return text
      case TextTransform.CAPITALIZE:
        return text.replace(/\w\S*/g, txt => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
      case TextTransform.UPPER_CASE:
        return text.toUpperCase()
      case TextTransform.LOWER_CASE: 
        return text.toLowerCase()
      default:
        return text
    }
  }
  
}