import {
  QuestionnaireRoute,
  StructureSize,
  BuildingProperty,
  WasteSorting,
  WastePriority,
  Objective,
  Sector,
  YesNo,
  MobilityPriority
} from '../../../../common/src/questionnaire/types'

export { type Program } from '@tee/data/src/type/program'
export { type Operators } from '../../../../data/src/generated/program'

export interface QuestionnaireData {
  questionnaire_route: QuestionnaireRoute
  structure_size: StructureSize
  sector?: Sector
  priority_objective?: Objective
  strategy_audits?: YesNo
  structure_building_property?: BuildingProperty
  energy_reduction_priority?: YesNo
  wastes_materials_priority?: YesNo
  sustainable_mobility_priority?: MobilityPriority
  strategy_audits_select?: string
  wastes_sorting?: WasteSorting
  wastes_priority?: WastePriority
  water_priority?: YesNo // TODO replace all "priorities" by "objective"

  siret?: string
  // below is data extracted from the SIREN database
  codeNAF?: string
  codeNAF1?: string
  ville?: string
  codePostal?: string
  region?: string
  denomination?: string
  secteur?: string
}
