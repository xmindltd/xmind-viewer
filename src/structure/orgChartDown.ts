import OrgChart from './orgChart'
import StructureClass from '../common/constants/structures'

export default class OrgChartDown extends OrgChart {

  protected isDown() {
    return true
  }

  getChildStructure() {
    return StructureClass.ORG_CHART_DOWN
  }

}