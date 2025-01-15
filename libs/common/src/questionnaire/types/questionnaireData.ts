import {
  QuestionnaireRoute,
  StructureSize,
  BuildingProperty,
  WasteSortingStatus,
  WasteManagementStatus,
  YesNo,
  MobilityStatus
} from './types'

import { ThemeId } from '@tee/data'

export enum QuestionnaireDataEnum {
  questionnaire_route = 'questionnaire_route',
  priority_objective = 'priority_objective',
  building_property = 'building_property',
  energy_reduction_objective = 'energy_reduction_objective',
  recently_audited = 'recently_audited',
  sustainable_mobility_objective = 'sustainable_mobility_objective',
  wastes_management_objective = 'wastes_management_objective',
  wastes_materials_objective = 'wastes_materials_objective',
  wastes_sorting_objective = 'wastes_sorting_objective',
  water_reduction_objective = 'water_reduction_objective'
}

export interface QuestionnaireData {
  questionnaire_route?: QuestionnaireRoute
  region?: string

  structure_size?: StructureSize // optional for testing !
  priority_objective?: ThemeId

  building_property?: BuildingProperty
  sustainable_mobility_objective?: MobilityStatus
  wastes_management_objective?: WasteManagementStatus
  wastes_sorting_objective?: WasteSortingStatus
  wastes_materials_objective?: YesNo
  water_reduction_objective?: YesNo
  energy_reduction_objective?: YesNo

  recently_audited?: YesNo
  recent_audits?: string
  legalCategory?: string
  siret?: string
  codeNAF?: string
  codeNAF1?: string
  ville?: string
  codePostal?: string
  denomination?: string
  secteur?: string
  creationDate?: string
  onlyEligible?: boolean
}
