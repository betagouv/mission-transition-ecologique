import {
  BuildingProperty,
  MobilityStatus,
  Objective,
  PublicodeObjectives,
  PublicodesKeys,
  QuestionnaireRoute,
  Sector,
  SizeToWorkforce,
  WasteManagementStatus,
  YesNo
} from '../../../../common/src/questionnaire/types'
import { type QuestionnaireData, Program } from '../domain/types'
import { type PublicodesInputData, PublicodesQuestionnaireRoute, SectorToNAFSection, NAF1Letters } from './types'

/** preprocesses the data gathered from the questionnaire into variables
 * needed by publicodes */
export const preprocessInputForPublicodes = (
  questionnaireData: QuestionnaireData,
  programData: Program,
  currentDate: string
): PublicodesInputData => {
  const publicodesData: PublicodesInputData = {
    ...questionnaireData,
    [PublicodesKeys.CurrentDate]: currentDate,
    région: questionnaireData.region
  }

  if (questionnaireData.structure_size) {
    publicodesData[PublicodesKeys.Workforce] = SizeToWorkforce[questionnaireData.structure_size]
  }

  if (questionnaireData.codeNAF) {
    publicodesData[PublicodesKeys.CodeNAF] = enquotePublicodesLiteralString(questionnaireData.codeNAF)
  }

  let codeNAF1s: string[] = []
  if (questionnaireData.codeNAF1) {
    codeNAF1s = [questionnaireData.codeNAF1]
  } else {
    const sector = questionnaireData.sector as Sector
    codeNAF1s = SectorToNAFSection[sector]
  }
  NAF1Letters.forEach((NAF1) => {
    const publicodeNAF1Key = 'entreprise . code NAF niveau 1 . est ' + NAF1
    publicodesData[publicodeNAF1Key] = codeNAF1s.includes(NAF1) ? YesNo.Yes : YesNo.No
  })

  if (questionnaireData.priority_objective) {
    // "J'ai un objectif précis en tête"
    for (const objective of Object.values(Objective)) {
      const publicodeObjectiveKey = 'questionnaire . objectif prioritaire . est ' + objective
      publicodesData[publicodeObjectiveKey] = objective == questionnaireData.priority_objective ? YesNo.Yes : YesNo.No
    }
  } else {
    // "Je ne sais pas par où commencer"
    if (questionnaireData.recently_audited == YesNo.Yes) {
      publicodesData[PublicodeObjectives.EnvironmentalImpact] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.EnvironmentalImpact] = YesNo.Yes
    }

    if (questionnaireData.wastes_materials_objective == YesNo.No) {
      publicodesData[PublicodeObjectives.EcoDesign] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.EcoDesign] = YesNo.Yes
    }

    if (
      questionnaireData.wastes_management_objective == WasteManagementStatus.No ||
      questionnaireData.wastes_management_objective == WasteManagementStatus.NoMax
    ) {
      publicodesData[PublicodeObjectives.WasteManagement] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.WasteManagement] = YesNo.Yes
    }

    if (questionnaireData.water_reduction_objective == YesNo.No) {
      publicodesData[PublicodeObjectives.WaterConsumption] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.WaterConsumption] = YesNo.Yes
    }

    if (questionnaireData.building_property == BuildingProperty.Rents) {
      publicodesData[PublicodesKeys.BuildingOwner] = YesNo.No
    } else {
      publicodesData[PublicodesKeys.BuildingOwner] = YesNo.Yes
    }

    if (
      questionnaireData.sustainable_mobility_objective == MobilityStatus.No ||
      questionnaireData.sustainable_mobility_objective == MobilityStatus.NoMax
    ) {
      publicodesData[PublicodeObjectives.SustainableMobility] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.SustainableMobility] = YesNo.Yes
    }

    if (questionnaireData.energy_reduction_objective == YesNo.No) {
      publicodesData[PublicodeObjectives.EnergyPerformance] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.EnergyPerformance] = YesNo.Yes
    }
  }

  const route = questionnaireData.questionnaire_route
  publicodesData[PublicodesKeys.QuestionnaireRoute] = convertQuestionnaireRoute(route)

  if (programData['début de validité']) {
    publicodesData['dispositif . début de validité'] = programData['début de validité']
  }
  if (programData['fin de validité']) {
    publicodesData['dispositif . fin de validité'] = programData['fin de validité']
  }

  return publicodesData
}

const convertQuestionnaireRoute = (route: QuestionnaireRoute): PublicodesQuestionnaireRoute => {
  switch (route) {
    case QuestionnaireRoute.NoSpecificGoal:
      return PublicodesQuestionnaireRoute.NoSpecificGoal
    case QuestionnaireRoute.SpecificGoal:
      return PublicodesQuestionnaireRoute.SpecificGoal
  }
}

/** for publicodes to interpret a value as a literal string, it expects
 * extra pair of quotes, added by this function. Without it, it is interpreted as a reference to another rule
 */
const enquotePublicodesLiteralString = (value: string): string => {
  return `"${value}"`
}
