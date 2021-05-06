import { BranchConnection } from '../../common/constants/styles'
import BranchViewController from '../../viewController/branchViewController'
import * as brushes from '../renderEngine/topicShape/brushes'
import Position from '../../utils/position'

export type LinePositions = {
  start: Position,
  control: Position,
  end: Position
}

export type ConnectionInfo = {
  d: string,
  fill: string,
  stroke: string,
  strokeWidth: number,
}

function getConnectionFunc(connection: BranchConnection): (branch: BranchViewController, linePositions: LinePositions, special: boolean) => ConnectionInfo {
  switch(connection) {
    case BranchConnection.CURVE: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor

        const d = special ? brushes.curveVertical(linePositions) : brushes.curveHorizon(linePositions)
        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth,
        }
      }
    }

    case BranchConnection.BIGHT: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor

        const d = special ? brushes.sinusVertical(linePositions) : brushes.sinusHorizon(linePositions)
        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.ROUNDED_ELBOW: {
      return (branch, linePositions, special) => {
        const tapered = false
        const corner = branch.topicViewController.view.lineCorner
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor

        const func = special ? brushes.roundedElbowVertical : brushes.roundedElbowHorizon
        const d = func(linePositions, corner)
        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.ELBOW: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor

        const d = special ? brushes.elbowVertical(linePositions) : brushes.elbowHorizon(linePositions)
        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.STRAIGHT: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor
        const d = brushes.straight(linePositions)

        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.FOLD: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor
        const d = special ? brushes.skewElbowVertical(linePositions) : brushes.skewElbowHorizon(linePositions)

        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.ROUNDED_FOLD: {
      return (branch, linePositions, special) => {
        const tapered = false
        const parent = branch.parent
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor
        const d = special ? brushes.hornVertical(linePositions) : brushes.hornHorizon(linePositions)

        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    case BranchConnection.HORIZONTAL: {
      return (branch, linePositions, special) => {
        const { start, end } = linePositions
        const tapered = false
        const lineWidth = parent instanceof BranchViewController ? parent.topicViewController.lineWidth : 1
        const lineColor = branch.topicViewController.view.lineColor
        const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`
        
        return {
          d,
          fill: tapered ? lineColor : 'none',
          stroke: lineColor,
          strokeWidth: tapered ? 0 : lineWidth
        }
      }
    }

    default: 
      return null
  }
}

export function getConnectionInfo(lineStyle: BranchConnection, branch: BranchViewController, linePositions: LinePositions, special: boolean): ConnectionInfo {
  let func = getConnectionFunc(lineStyle)
  if (!func) {
    console.log(`Unsupported topic line style: ${lineStyle}`)
    func = getConnectionFunc[BranchConnection.CURVE]
  }
  return func(branch, linePositions, special)
}
