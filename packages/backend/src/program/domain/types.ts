import {
  QuestionnaireRoute,
  StructureSize,
  BuildingProperty,
  WasteSortingStatus,
  WasteManagementStatus,
  Objective,
  Sector,
  YesNo,
  MobilityStatus
} from '../../../../common/src/questionnaire/types'

export { type Program } from '@tee/data/src/type/program'
export { type Operators } from '../../../../data/src/generated/program'

export interface QuestionnaireData {
  questionnaire_route: QuestionnaireRoute
  structure_size: StructureSize
  region: string

  sector?: Sector
  priority_objective?: Objective

  building_property?: BuildingProperty
  sustainable_mobility_objective?: MobilityStatus
  wastes_management_objective?: WasteManagementStatus
  wastes_sorting_objective?: WasteSortingStatus
  wastes_materials_objective?: YesNo
  water_reduction_objective?: YesNo
  energy_reduction_objective?: YesNo

  recently_audited?: YesNo
  recent_audits?: string

  siret?: string
  // below is data extracted from the SIREN database
  codeNAF?: string
  codeNAF1?: string
  ville?: string
  codePostal?: string
  denomination?: string
  secteur?: string
}
