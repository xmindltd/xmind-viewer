import Layout from 'view/layoutEngine/layouts/layout'
import Cell from 'view/layoutEngine/layouts/cell'
import GridData from 'view/layoutEngine/layouts/gridData'
import Bounds from 'utils/bounds'
import Size from 'utils/size'

function isNumber(number) {
  return typeof number === 'number'
}

export class GridLayout extends Layout {

  numColumns: number

  makeColumnsEqualWidth: boolean

  horizontalSpacing: number = 0
  verticalSpacing: number = 0

  marginLeft: number = 0
  marginRight: number = 0
  marginTop: number = 0
  marginBottom: number = 0

  marginWidth: number = 0
  marginHeight: number = 0

  constructor(numColumns: number = 1, makeColumnsEqualWidth: boolean) {
    super()
    this.numColumns = numColumns
    this.makeColumnsEqualWidth = makeColumnsEqualWidth
  }

  private _getData(grid: any[], row: number, column: number, rowCount: number, columnCount: number, first: boolean): GridData | null {
    const cell = grid[row][column]
    if (cell) {
      const data = cell.getLayoutData()
      let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
      let vSpan = Math.max(1, data.verticalSpan)
      let i = first ? row + vSpan - 1 : row - vSpan + 1
      let j = first ? column + hSpan - 1 : column - hSpan + 1
      if (0 <= i && i < rowCount) {
        if (0 <= j && j < columnCount) {
          if (cell === grid[i][j]) return data
        }
      }
    }
    return null
  }

  protectedLayout(cell: Cell, move: boolean, bounds: Bounds, flushCache: boolean): Size {
    let { x, y, width, height } = bounds

    if (this.numColumns < 1) {
      return {
        width: this.marginLeft + this.marginWidth * 2 + this.marginRight,
        height: this.marginTop + this.marginHeight * 2 + this.marginBottom
      }
    }

    const children = cell.getChildren()
    let count = 0
    for (let i = 0; i < children.length; i++) {
      const cell = children[i]
      const data = cell.getLayoutData()
      if (!data || !data.exclude) {
        children[count++] = children[i]
      }
    }
    if (count === 0) {
      return {
        width: this.marginLeft + this.marginWidth * 2 + this.marginRight,
        height: this.marginTop + this.marginHeight * 2 + this.marginBottom
      }
    }

    for (let i = 0; i < count; i++) {
      const child = children[i]
      let data = child.getLayoutData()
      if (!data) child.setLayoutData(data = new GridData({}))
      if (flushCache) data.flushCache()
      data.computeSize(child, data.widthHint, data.heightHint, flushCache)
      if (data.grabExcessHorizontalSpace && data.minimumWidth > 0) {
        if (data.cacheWidth < data.minimumWidth) {
          let trim = 0
          data.cacheWidth = data.cacheHeight = -1
          data.computeSize(child, Math.max(0, data.minimumWidth - trim), data.heightHint, false)
        }
      }
      if (data.grabExcessVerticalSpace && data.minimumHeight > 0) {
        data.cacheHeight = Math.max(data.cacheHeight, data.minimumHeight)
      }
    }

    /* Build the grid */
    let row = 0, column = 0, rowCount = 0, columnCount = Math.min(count, this.numColumns)
    let grid = []
    for (let i = 0; i < count; i++) {
      const child = children[i]
      const data = child.getLayoutData()
      let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
      let vSpan = Math.max(1, data.verticalSpan)
      while (true) {
        let lastRow = row + vSpan
        if (lastRow >= grid.length) {
          grid = grid.slice(0, grid.length)
        }
        if (!grid[row]) {
          grid[row] = []
        }
        while (column < columnCount && grid[row][column]) {
          column++
        }
        let endCount = column + hSpan
        if (endCount <= columnCount) {
          let index = column
          while (index < endCount && !grid[row][index]) {
            index++
          }
          if (index === endCount) break
          column = index
        }
        if (column + hSpan >= columnCount) {
          column = 0
          row++
        }
      }
      for (let j = 0; j < vSpan; j++) {
        if (!grid[row + j]) {
          grid[row + j] = []
        }
        for (let k = 0; k < hSpan; k++) {
          grid[row + j][column + k] = child
        }
      }
      rowCount = Math.max(rowCount, row + vSpan)
      column += hSpan
    }

    /* Column widths */
    let availableWidth = width - this.horizontalSpacing * (columnCount - 1) - (this.marginLeft + this.marginWidth * 2 + this.marginRight)
    let expandCount = 0
    let widths = []
    let minWidths = []
    let expandColumn = []
    for (let i = 0; i < columnCount; i++) {
      widths[i] = 0
      minWidths[i] = 0
      expandColumn[i] = false
    }
    for (let j = 0; j < columnCount; j++) {
      for (let i = 0; i < rowCount; i++) {
        let data = this._getData(grid, i, j, rowCount, columnCount, true)
        if (data) {
          let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
          if (hSpan === 1) {
            let w = data.cacheWidth + data.horizontalIndent
            widths[j] = Math.max(isNumber(widths[j]) ? widths[j] : 0, w)
            if (data.grabExcessHorizontalSpace) {
              if (!expandColumn[j]) expandCount++
              expandColumn[j] = true
            }
            if (!data.grabExcessHorizontalSpace || data.minimumWidth !== 0) {
              w = !data.grabExcessHorizontalSpace || data.minimumWidth === -1 ? data.cacheWidth : data.minimumWidth
              w += data.horizontalIndent
              minWidths[j] = Math.max(isNumber(minWidths[j]) ? minWidths[j] : 0, w)
            }
          }
        }
      }
      for (let i = 0; i < rowCount; i++) {
        let data = this._getData(grid, i, j, rowCount, columnCount, false)
        if (data) {
          let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
          if (hSpan > 1) {
            let spanWidth = 0, spanMinWidth = 0, spanExpandCount = 0
            for (let k = 0; k < hSpan; k++) {
              spanWidth += widths[j - k]
              spanMinWidth += minWidths[j - k]
              if (expandColumn[j - k]) spanExpandCount++
            }
            if (data.grabExcessHorizontalSpace && spanExpandCount === 0) {
              expandCount++
              expandColumn[j] = true
            }
            let w = data.cacheWidth + data.horizontalIndent - spanWidth - (hSpan - 1) * this.horizontalSpacing
            if (w > 0) {
              if (this.makeColumnsEqualWidth) {
                let equalWidth = (w + spanWidth) / hSpan
                let remainder = (w + spanWidth) % hSpan, last = -1
                for (let k = 0; k < hSpan; k++) {
                  widths[last = j - k] = Math.max(equalWidth, widths[j - k])
                }
                if (last > -1) widths[last] += remainder
              } else {
                if (spanExpandCount === 0) {
                  widths[j] += w
                } else {
                  let delta = w / spanExpandCount
                  let remainder = w % spanExpandCount, last = -1
                  for (let k = 0; k < hSpan; k++) {
                    if (expandColumn[j - k]) {
                      widths[last = j - k] += delta
                    }
                  }
                  if (last > -1) widths[last] += remainder
                }
              }
            }
            if (!data.grabExcessHorizontalSpace || data.minimumWidth !== 0) {
              w = !data.grabExcessHorizontalSpace || data.minimumWidth === -1 ? data.cacheWidth : data.minimumWidth
              w += data.horizontalIndent - spanMinWidth - (hSpan - 1) * this.horizontalSpacing
              if (w > 0) {
                if (spanExpandCount === 0) {
                  minWidths[j] += w
                } else {
                  let delta = w / spanExpandCount
                  let remainder = w % spanExpandCount, last = -1
                  for (let k = 0; k < hSpan; k++) {
                    if (expandColumn[j - k]) {
                      minWidths[last = j - k] += delta
                    }
                  }
                  if (last > -1) minWidths[last] += remainder
                }
              }
            }
          }
        }
      }
    }
    if (this.makeColumnsEqualWidth) {
      let minColumnWidth = 0
      let columnWidth = 0
      for (let i = 0; i < columnCount; i++) {
        minColumnWidth = Math.max(minColumnWidth, minWidths[i])
        columnWidth = Math.max(columnWidth, widths[i])
      }
      columnWidth = width === -1 || expandCount === 0 ? columnWidth : Math.max(minColumnWidth, availableWidth / columnCount)
      for (let i = 0; i < columnCount; i++) {
        expandColumn[i] = expandCount > 0
        widths[i] = columnWidth
      }
    } else {
      if (width !== -1 && expandCount > 0) {
        let totalWidth = 0
        for (let i = 0; i < columnCount; i++) {
          totalWidth += widths[i]
        }
        let c = expandCount
        let delta = (availableWidth - totalWidth) / c
        let remainder = (availableWidth - totalWidth) % c
        let last = -1
        while (Math.abs(totalWidth - availableWidth) >= 1) {
          for (let j = 0; j < columnCount; j++) {
            if (expandColumn[j]) {
              if (widths[j] + delta > minWidths[j]) {
                widths[last = j] = widths[j] + delta
              } else {
                widths[j] = minWidths[j]
                expandColumn[j] = false
                c--
              }
            }
          }
          if (last > -1) widths[last] += remainder

          for (let j = 0; j < columnCount; j++) {
            for (let i = 0; i < rowCount; i++) {
              let data = this._getData(grid, i, j, rowCount, columnCount, false)
              if (data) {
                let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
                if (hSpan > 1) {
                  if (!data.grabExcessHorizontalSpace || data.minimumWidth !== 0) {
                    let spanWidth = 0, spanExpandCount = 0
                    for (let k = 0; k < hSpan; k++) {
                      spanWidth += widths[j - k]
                      if (expandColumn[j - k]) spanExpandCount++
                    }
                    let w = !data.grabExcessHorizontalSpace || data.minimumWidth === -1 ? data.cacheWidth : data.minimumWidth
                    w += data.horizontalIndent - spanWidth - (hSpan - 1) * this.horizontalSpacing
                    if (w > 0) {
                      if (spanExpandCount === 0) {
                        widths[j] += w
                      } else {
                        let delta2 = w / spanExpandCount
                        let remainder2 = w % spanExpandCount, last2 = -1
                        for (let k = 0; k < hSpan; k++) {
                          if (expandColumn[j - k]) {
                            widths[last2 = j - k] += delta2
                          }
                        }
                        if (last2 > -1) widths[last2] += remainder2
                      }
                    }
                  }
                }
              }
            }
          }
          if (c === 0) break
          totalWidth = 0
          for (let i = 0; i < columnCount; i++) {
            totalWidth += widths[i]
          }
          delta = (availableWidth - totalWidth) / c
          remainder = (availableWidth - totalWidth) % c
          last = -1
        }
      }
    }

    /* Wrapping */
    let flush = null
    let flushLength = 0
    if (width !== -1) {
      for (let j = 0; j < columnCount; j++) {
        for (let i = 0; i < rowCount; i++) {
          let data = this._getData(grid, i, j, rowCount, columnCount, false)
          if (data !== null) {
            if (data.heightHint === -1) {
              let child = grid[i][j]
              //TEMPORARY CODE
              let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
              let currentWidth = 0
              for (let k = 0; k < hSpan; k++) {
                currentWidth += widths[j - k]
              }
              currentWidth += (hSpan - 1) * this.horizontalSpacing - data.horizontalIndent
              if ((currentWidth !== data.cacheWidth && data.horizontalAlignment === -1) || (data.cacheWidth > currentWidth)) {
                let trim = 0
                data.cacheWidth = data.cacheHeight = -1
                data.computeSize(child, Math.max(0, currentWidth - trim), data.heightHint, false)
                if (data.grabExcessVerticalSpace && data.minimumHeight > 0) {
                  data.cacheHeight = Math.max(data.cacheHeight, data.minimumHeight)
                }
                if (!flush) flush = []
                flush[flushLength++] = data
              }
            }
          }
        }
      }
    }

    /* Row heights */
    let availableHeight = height - this.verticalSpacing * (rowCount - 1) - (this.marginTop + this.marginHeight * 2 + this.marginBottom)
    expandCount = 0
    let heights = []
    let minHeights = []
    let expandRow = []
    for (let i = 0; i < rowCount; i++) {
      heights[i] = 0
      minHeights[i] = 0
      expandRow[i] = false
    }
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        let data = this._getData(grid, i, j, rowCount, columnCount, true)
        if (data) {
          let vSpan = Math.max(1, Math.min(data.verticalSpan, rowCount))
          if (vSpan === 1) {
            let h = data.cacheHeight + data.verticalIndent
            heights[i] = Math.max(isNumber(heights[i]) ? heights[i] : 0, h)
            if (data.grabExcessVerticalSpace) {
              if (!expandRow[i]) expandCount++
              expandRow[i] = true
            }
            if (!data.grabExcessVerticalSpace || data.minimumHeight !== 0) {
              h = !data.grabExcessVerticalSpace || data.minimumHeight === -1 ? data.cacheHeight : data.minimumHeight
              h += data.verticalIndent
              minHeights[i] = Math.max(isNumber(minHeights[i]) ? minHeights[i] : 0, h)
            }
          }
        }
      }
      for (let j = 0; j < columnCount; j++) {
        let data = this._getData(grid, i, j, rowCount, columnCount, false)
        if (data) {
          let vSpan = Math.max(1, Math.min(data.verticalSpan, rowCount))
          if (vSpan > 1) {
            let spanHeight = 0, spanMinHeight = 0, spanExpandCount = 0
            for (let k = 0; k < vSpan; k++) {
              spanHeight += heights[i - k]
              spanMinHeight += minHeights[i - k]
              if (expandRow[i - k]) spanExpandCount++
            }
            if (data.grabExcessVerticalSpace && spanExpandCount === 0) {
              expandCount++
              expandRow[i] = true
            }
            let h = data.cacheHeight + data.verticalIndent - spanHeight - (vSpan - 1) * this.verticalSpacing
            if (h > 0) {
              if (spanExpandCount === 0) {
                heights[i] += h
              } else {
                let delta = h / spanExpandCount
                let remainder = h % spanExpandCount, last = -1
                for (let k = 0; k < vSpan; k++) {
                  if (expandRow[i - k]) {
                    heights[last = i - k] += delta
                  }
                }
                if (last > -1) heights[last] += remainder
              }
            }
            if (!data.grabExcessVerticalSpace || data.minimumHeight !== 0) {
              h = !data.grabExcessVerticalSpace || data.minimumHeight === -1 ? data.cacheHeight : data.minimumHeight
              h += data.verticalIndent - spanMinHeight - (vSpan - 1) * this.verticalSpacing
              if (h > 0) {
                if (spanExpandCount === 0) {
                  minHeights[i] += h
                } else {
                  let delta = h / spanExpandCount
                  let remainder = h % spanExpandCount, last = -1
                  for (let k = 0; k < vSpan; k++) {
                    if (expandRow[i - k]) {
                      minHeights[last = i - k] += delta
                    }
                  }
                  if (last > -1) minHeights[last] += remainder
                }
              }
            }
          }
        }
      }
    }
    if (height !== -1 && expandCount > 0) {
      let totalHeight = 0
      for (let i = 0; i < rowCount; i++) {
        totalHeight += heights[i]
      }
      let c = expandCount
      let delta = (availableHeight - totalHeight) / c
      let remainder = (availableHeight - totalHeight) % c
      let last = -1
      while (Math.abs(totalHeight - availableHeight) >= 1) {
        for (let i = 0; i < rowCount; i++) {
          if (expandRow[i]) {
            if (heights[i] + delta > minHeights[i]) {
              heights[last = i] = heights[i] + delta
            } else {
              heights[i] = minHeights[i]
              expandRow[i] = false
              c--
            }
          }
        }
        if (last > -1) heights[last] += remainder

        for (let i = 0; i < rowCount; i++) {
          for (let j = 0; j < columnCount; j++) {
            let data = this._getData(grid, i, j, rowCount, columnCount, false)
            if (data) {
              let vSpan = Math.max(1, Math.min(data.verticalSpan, rowCount))
              if (vSpan > 1) {
                if (!data.grabExcessVerticalSpace || data.minimumHeight !== 0) {
                  let spanHeight = 0, spanExpandCount = 0
                  for (let k = 0; k < vSpan; k++) {
                    spanHeight += heights[i - k]
                    if (expandRow[i - k]) spanExpandCount++
                  }
                  let h = !data.grabExcessVerticalSpace || data.minimumHeight === -1 ? data.cacheHeight : data.minimumHeight
                  h += data.verticalIndent - spanHeight - (vSpan - 1) * this.verticalSpacing
                  if (h > 0) {
                    if (spanExpandCount === 0) {
                      heights[i] += h
                    } else {
                      let delta2 = h / spanExpandCount
                      let remainder2 = h % spanExpandCount, last2 = -1
                      for (let k = 0; k < vSpan; k++) {
                        if (expandRow[i - k]) {
                          heights[last2 = i - k] += delta2
                        }
                      }
                      if (last2 > -1) heights[last2] += remainder2
                    }
                  }
                }
              }
            }
          }
        }
        if (c === 0) break
        totalHeight = 0
        for (let i = 0; i < rowCount; i++) {
          totalHeight += heights[i]
        }
        delta = (availableHeight - totalHeight) / c
        remainder = (availableHeight - totalHeight) % c
        last = -1
      }
    }

    /* Position the controls */
    if (move) {
      let gridY = y + this.marginTop + this.marginHeight
      for (let i = 0; i < rowCount; i++) {
        let gridX = x + this.marginLeft + this.marginWidth
        for (let j = 0; j < columnCount; j++) {
          let data = this._getData(grid, i, j, rowCount, columnCount, true)
          if (data) {
            let hSpan = Math.max(1, Math.min(data.horizontalSpan, columnCount))
            let vSpan = Math.max(1, data.verticalSpan)
            let cellWidth = 0, cellHeight = 0
            for (let k = 0; k < hSpan; k++) {
              cellWidth += widths[j + k]
            }
            for (let k = 0; k < vSpan; k++) {
              cellHeight += heights[i + k]
            }
            cellWidth += this.horizontalSpacing * (hSpan - 1)
            let childX = gridX + data.horizontalIndent
            let childWidth = Math.min(data.cacheWidth, cellWidth)
            switch (data.horizontalAlignment) {
              case GridData.CENTER:
                childX += Math.max(0, (cellWidth - data.horizontalIndent - childWidth) / 2)
                break
              case GridData.END:
                childX += Math.max(0, cellWidth - data.horizontalIndent - childWidth)
                break
              case GridData.FILL:
                childWidth = cellWidth - data.horizontalIndent
                break
            }
            cellHeight += this.verticalSpacing * (vSpan - 1)
            let childY = gridY + data.verticalIndent
            let childHeight = Math.min(data.cacheHeight, cellHeight)
            switch (data.verticalAlignment) {
              case GridData.CENTER:
                childY += Math.max(0, (cellHeight - data.verticalIndent - childHeight) / 2)
                break
              case GridData.END:
                childY += Math.max(0, cellHeight - data.verticalIndent - childHeight)
                break
              case GridData.FILL:
                childHeight = cellHeight - data.verticalIndent
                break
            }
            let child = grid[i][j]
            if (child) {
              // child.setBounds(childX, childY, childWidth, childHeight)
              child.setPosition({ x: childX, y: childY })
              child.setSize({ width: childWidth, height: childHeight })
            }
          }
          gridX += widths[j] + this.horizontalSpacing
        }
        gridY += heights[i] + this.verticalSpacing
      }
    }

    // clean up cache
    for (let i = 0; i < flushLength; i++) {
      flush[i].cacheWidth = flush[i].cacheHeight = -1
    }

    let totalDefaultWidth = 0
    let totalDefaultHeight = 0
    for (let i = 0; i < columnCount; i++) {
      totalDefaultWidth += widths[i]
    }
    for (let i = 0; i < rowCount; i++) {
      totalDefaultHeight += heights[i]
    }
    totalDefaultWidth += this.horizontalSpacing * (columnCount - 1) + this.marginLeft + this.marginWidth * 2 + this.marginRight
    totalDefaultHeight += this.verticalSpacing * (rowCount - 1) + this.marginTop + this.marginHeight * 2 + this.marginBottom
    return {
      width: totalDefaultWidth,
      height: totalDefaultHeight
    }
  }

}