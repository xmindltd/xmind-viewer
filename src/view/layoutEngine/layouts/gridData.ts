import LayoutData from '../../layoutEngine/layouts/layoutData'

export default class GridData extends LayoutData {

  static BEGINNING = 1
  static CENTER = 2
  static END = 3
  static FILL = 4

  static VERTICAL_ALIGN_BEGINNING = 1 << 1
  static VERTICAL_ALIGN_CENTER = 1 << 2
  static VERTICAL_ALIGN_END = 1 << 3
  static VERTICAL_ALIGN_FILL = 1 << 4

  static HORIZONTAL_ALIGN_BEGINNING = 1 << 5
  static HORIZONTAL_ALIGN_CENTER = 1 << 6
  static HORIZONTAL_ALIGN_END = 1 << 7
  static HORIZONTAL_ALIGN_FILL = 1 << 8

  static GRAB_HORIZONTAL = 1 << 9
  static GRAB_VERTICAL = 1 << 10

  static FILL_VERTICAL = GridData.VERTICAL_ALIGN_FILL | GridData.GRAB_VERTICAL
  static FILL_HORIZONTAL = GridData.HORIZONTAL_ALIGN_FILL | GridData.GRAB_HORIZONTAL
  static FILL_BOTH = GridData.FILL_VERTICAL | GridData.FILL_HORIZONTAL

  horizontalAlignment: number
  horizontalIndent: number
  horizontalSpan: number

  verticalAlignment: number
  verticalIndent: number
  verticalSpan: number

  grabExcessHorizontalSpace: boolean
  grabExcessVerticalSpace: boolean

  widthHint: number
  minimumWidth: number

  heightHint: number
  minimumHeight: number

  exclude: boolean

  constructor({
    horizontalAlignment = GridData.BEGINNING,
    verticalAlignment = GridData.CENTER,
    horizontalSpan = 1,
    verticalSpan = 1,
    horizontalIndent = 0,
    verticalIndent = 0,
    grabExcessHorizontalSpace = false,
    grabExcessVerticalSpace = false,
    exclude = false,
    widthHint = -1,
    heightHint = -1,
    minimumWidth = 0,
    minimumHeight = 0
  }) {
    super()
    this.horizontalAlignment = horizontalAlignment
    this.verticalAlignment = verticalAlignment
    this.horizontalSpan = horizontalSpan
    this.verticalSpan = verticalSpan
    this.horizontalIndent = horizontalIndent
    this.verticalIndent = verticalIndent

    this.grabExcessHorizontalSpace = grabExcessHorizontalSpace
    this.grabExcessVerticalSpace = grabExcessVerticalSpace
    this.exclude = exclude

    this.widthHint = widthHint
    this.heightHint = heightHint

    this.minimumWidth = minimumWidth
    this.minimumHeight = minimumHeight
  }

}