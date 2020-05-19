import StructureClass from 'common/constants/structures'
import MapUnbalanced from 'structure/mapUnbalanced'
import AbstractStructure from 'structure/abstractStructure'
import LogicRight from 'structure/logicRight'
import LogicLeft from 'structure/logicLeft'
import OrgChartDown from 'structure/orgChartDown'
import OrgChartUp from 'structure/orgChartUp'
import TreeRight from 'structure/treeRight'
import TreeLeft from 'structure/treeLeft'
import TimelineVertical from 'structure/timelineVertical'
import FishboneLeftHeaded from 'structure/fishboneLeftHeaded'
import FishboneNENormal from 'structure/fishboneNENormal'
import FishboneSENormal from 'structure/fishboneSENormal'
import FishboneRightHeaded from 'structure/fishboneRightHeaded'
import FishboneNWNormal from 'structure/fishboneNWNormal'
import FishboneSWNormal from 'structure/fishboneSWNormal'
import TimelineHorizontal from 'structure/timelineHorizontal'
import TimelineHorizontalUp from 'structure/timelineHorizontalUp'
import TimelineHorizontalDown from 'structure/timelineHorizontalDown'
import MapClockWise from 'structure/mapClockWise'

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