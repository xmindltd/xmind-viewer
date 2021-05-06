import StructureClass from '../../common/constants/structures'
import MapUnbalanced from '../mapUnbalanced'
import AbstractStructure from '../abstractStructure'
import LogicRight from '../logicRight'
import LogicLeft from '../logicLeft'
import OrgChartDown from '../orgChartDown'
import OrgChartUp from '../orgChartUp'
import TreeRight from '../treeRight'
import TreeLeft from '../treeLeft'
import TimelineVertical from '../timelineVertical'
import FishboneLeftHeaded from '../fishboneLeftHeaded'
import FishboneNENormal from '../fishboneNENormal'
import FishboneSENormal from '../fishboneSENormal'
import FishboneRightHeaded from '../fishboneRightHeaded'
import FishboneNWNormal from '../fishboneNWNormal'
import FishboneSWNormal from '../fishboneSWNormal'
import TimelineHorizontal from '../timelineHorizontal'
import TimelineHorizontalUp from '../timelineHorizontalUp'
import TimelineHorizontalDown from '../timelineHorizontalDown'
import MapClockWise from '../mapClockWise'

export default function getStructure(key: string): AbstractStructure {
  if (key === StructureClass.MAP_UNBALANCED) {
    return new MapUnbalanced()
  } else if (key === StructureClass.MAP_CLOCK_WISE) {
    return new MapClockWise()
  } else if (key === StructureClass.LOGIC_RIGHT) {
    return new LogicRight()
  } else if (key === StructureClass.LOGIC_LEFT) {
    return new LogicLeft()
  } else if (key === StructureClass.ORG_CHART_DOWN) {
    return new OrgChartDown()
  } else if (key === StructureClass.ORG_CHART_UP) {
    return new OrgChartUp()
  } else if (key === StructureClass.TREE_RIGHT) {
    return new TreeRight()
  } else if (key === StructureClass.TREE_LEFT) {
    return new TreeLeft()
  } else if (key === StructureClass.TIMELINE_VERTICAL) {
    return new TimelineVertical()
  } else if (key === StructureClass.TIMELINE_HORIZONTAL) {
    return new TimelineHorizontal()
  } else if (key === StructureClass.TIMELINE_HORIZONTAL_UP) { 
    return new TimelineHorizontalUp()
  } else if (key === StructureClass.TIMELINE_HORIZONTAL_DOWN) {
    return new TimelineHorizontalDown()
  } else if (key === StructureClass.FISHBONE_LEFT_HEADED) {
    return new FishboneLeftHeaded()
  } else if (key === StructureClass.FISHBONE_RIGHT_HEADED) {
    return new FishboneRightHeaded()
  } else if (key === StructureClass.FISHBONE_NE_NORMAL) {
    return new FishboneNENormal()
  } else if (key === StructureClass.FISHBONE_SE_NORMAL) {
    return new FishboneSENormal()
  } else if (key === StructureClass.FISHBONE_NW_NORMAL) {
    return new FishboneNWNormal()
  } else if (key === StructureClass.FISHBONE_SW_NORMAL) {
    return new FishboneSWNormal()
  }

  console.log(`Unsupported structure class: ${key}`)
}