import FontInfo from './fontInfo'
import { createCanvas } from 'canvas'

interface FontNode {
  content?: string,
  style?: FontInfo
}

const FONT_WEIGHT_STRING_TO_NUMBER = {
  'normal': 400,
  'regular': 400,
  'bold': 700
}

function str2NodesArr(s: string, fontInfo: FontInfo): FontNode[][] {
  const arr = s.split('\n')
  return arr.map((s) => (s === '') ? [] : [{ content: s, style: fontInfo }])
}

function getNodesSize(nodes: FontNode[]) {
  let width = 0
  let height = 0

  nodes.forEach((node) => {
    const { width: w, height: h } = getTextSize(node)
    width += w
    height = Math.max(height, h)
  })

  return { width, height }
}

function getTextSize(node: FontNode) {
  let fontWeight = node.style.fontWeight

  if (FONT_WEIGHT_STRING_TO_NUMBER[`${fontWeight}`.toLowerCase()]) {
    fontWeight = FONT_WEIGHT_STRING_TO_NUMBER[`${fontWeight}`.toLowerCase()]
  }

  let fontSize = <number>Number.parseInt(node.style.fontSize)
  const preFontSize = fontSize
  let ratio = 1
  if (fontSize < 12) {
    ratio = fontSize / 12
    fontSize = 12
  }

  const fontSizePx = fontSize + 'px'
  const fontStyle = node.style.fontStyle
  const fontFamily = node.style.fontFamily
  const fontArr = [fontStyle, fontWeight, fontSizePx, fontFamily]

  // const canvas = document.createElement('canvas')
  const canvas = createCanvas(200, 200)
  const ctx = canvas.getContext('2d')
  ctx.font = fontArr.filter(item => item).join(' ')

  const lines = node.content.split('\n')
  const widthArr = lines.map((line) => {
    return ctx.measureText(line).width
  })

  const width = Math.max(...widthArr) * ratio
  const height = lines.length * preFontSize
  return { width, height }
}

export {
  str2NodesArr,
  getNodesSize,
  getTextSize,
  FontNode,
}