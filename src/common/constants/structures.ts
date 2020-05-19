enum StructureClass {
  MAP = 'org.xmind.ui.map',
  MAP_UNBALANCED = 'org.xmind.ui.map.unbalanced',
  MAP_CLOCK_WISE = 'org.xmind.ui.map.clockwise',
  LOGIC_LEFT = 'org.xmind.ui.logic.left',
  LOGIC_RIGHT = 'org.xmind.ui.logic.right',
  ORG_CHART_UP = 'org.xmind.ui.org-chart.up',
  ORG_CHART_DOWN = 'org.xmind.ui.org-chart.down',
  TREE_RIGHT = 'org.xmind.ui.tree.right',
  TREE_LEFT = 'org.xmind.ui.tree.left',
  TIMELINE_VERTICAL = 'org.xmind.ui.timeline.vertical',
  TIMELINE_HORIZONTAL = 'org.xmind.ui.timeline.horizontal',
  TIMELINE_HORIZONTAL_UP = 'org.xmind.ui.timeline.horizontal.up',
  TIMELINE_HORIZONTAL_DOWN = 'org.xmind.ui.timeline.horizontal.down',
  FISHBONE_LEFT_HEADED = 'org.xmind.ui.fishbone.leftHeaded',
  FISHBONE_RIGHT_HEADED = 'org.xmind.ui.fishbone.rightHeaded',
  FISHBONE_NE_NORMAL = 'org.xmind.ui.fishbone.structure.NE.normal',
  FISHBONE_SE_NORMAL = 'org.xmind.ui.fishbone.structure.SE.normal',
  FISHBONE_NW_NORMAL = 'org.xmind.ui.fishbone.structure.NW.normal',
  FISHBONE_SW_NORMAL = 'org.xmind.ui.fishbone.structure.SW.normal',
}

export default StructureClass

export const EXPOSED_STRUCTURES = [
  StructureClass.MAP,
  StructureClass.MAP_UNBALANCED,
  StructureClass.LOGIC_LEFT,
  StructureClass.LOGIC_RIGHT,
  StructureClass.ORG_CHART_UP,
  StructureClass.ORG_CHART_DOWN,
  StructureClass.TREE_LEFT,
  StructureClass.TREE_RIGHT,
  StructureClass.TIMELINE_VERTICAL,
  StructureClass.TIMELINE_HORIZONTAL,
  StructureClass.FISHBONE_LEFT_HEADED,
  StructureClass.FISHBONE_RIGHT_HEADED,
]

export const EXPOSED_ATTACHED_STRUCTURES = EXPOSED_STRUCTURES.filter(item => {
  return item.indexOf('org.xmind.ui.map') !== 0
})

export const EXPOSED_ATTACHED_RIGHT_STRUCTURES = EXPOSED_ATTACHED_STRUCTURES.filter(item => {
  return item.indexOf(StructureClass.LOGIC_LEFT) !== 0
})

export const EXPOSED_ATTACHED_LEFT_STRUCTURES = EXPOSED_ATTACHED_STRUCTURES.filter(item => {
  return item.indexOf(StructureClass.LOGIC_RIGHT) !== 0
})

export const FISHBONE_NORMAL_STRUCTURES = [
  StructureClass.FISHBONE_NE_NORMAL,
  StructureClass.FISHBONE_SE_NORMAL,
  StructureClass.FISHBONE_NW_NORMAL,
  StructureClass.FISHBONE_SW_NORMAL
]