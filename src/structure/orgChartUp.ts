import OrgChart from './orgChart'
import StructureClass from 'common/constants/structures'

export default class OrgChartUp extends OrgChart {

  protected isDown() {
    return false
  }

  getChildStructure() {
    return StructureClass.ORG_CHART_UP
  }

}