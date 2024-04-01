import { QuestionnaireRoute, SizeToWorkforce, WastePriority } from '../../../../common/src/questionnaire/types'
import { type QuestionnaireData, Program } from '../domain/types'
import { type PublicodesInputData, PublicodesKeys, PublicodesQuestionnaireRoute } from './types'
import { Sector, SectorToNAFSection, NAF1Letters, YesNo, PublicodeObjectives } from '../../../../data/src/type/publicodesTypes'

/** preprocesses the data gathered from the questionnaire into variables
 * needed by publicodes */
export const preprocessInputForPublicodes = (
  questionnaireData: QuestionnaireData,
  programData: Program,
  currentDate: string
): PublicodesInputData => {
  const publicodesData: PublicodesInputData = {
    [PublicodesKeys.CurrentDate]: currentDate,
    [PublicodesKeys.Workforce]: SizeToWorkforce[questionnaireData.structure_size]
  }

  if (questionnaireData.siret) publicodesData[PublicodesKeys.CodeNAF] = enquotePublicodesLiteralString(questionnaireData.codeNAF as string)
  publicodesData

  if (questionnaireData.siret) {
    const codeNAF1 = questionnaireData.codeNAF1 as string
    // if we have the exact section value from the SIREN database
    // we put one value to Oui and all the others to No
    NAF1Letters.forEach((NAF1) => {
      const publicodeNAF1Key = 'entreprise . code NAF niveau 1 . est ' + NAF1
      publicodesData[publicodeNAF1Key] = codeNAF1 == NAF1 ? 'oui' : 'non'
    })
  } else {
    // if we have the section value from the sector,
    // we put some value to Oui as they are probable
    // but we don't put any value to No as we are not certain they are false.
    const sector = questionnaireData.sector as Sector
    SectorToNAFSection[sector].map((NAF1) => {
      const publicodeNAF1Key = 'entreprise . code NAF niveau 1 . est ' + NAF1
      publicodesData[publicodeNAF1Key] = 'oui'
    })
  }

  if (questionnaireData.priority_objective) {
    // priority objective = 1 objective to 'oui',
    // all the others to 'non'
  } else {
    // here we set an objective only if we have specific data about this objectif
    // at least this would be logical.
    // right now we are strictly encoding the previous logic
    // which vary from objective to objective.

    if (questionnaireData.strategy_audits == YesNo.Yes) {
      publicodesData[PublicodeObjectives.EnvironmentalImpact] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.EnvironmentalImpact] = YesNo.Yes
    }

    if (questionnaireData.wastes_materials_priority == YesNo.No) {
      publicodesData[PublicodeObjectives.EcoDesign] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.EcoDesign] = YesNo.Yes
    }

    if (questionnaireData.wastes_priority == WastePriority.No || questionnaireData.wastes_priority == WastePriority.NoMax) {
      publicodesData[PublicodeObjectives.WasteManagement] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.WasteManagement] = YesNo.Yes
    }

    if (questionnaireData.water_priority == YesNo.No) {
      publicodesData[PublicodeObjectives.WaterConsumption] = YesNo.No
    } else {
      publicodesData[PublicodeObjectives.WaterConsumption] = YesNo.Yes
    }
  }

  // only if full questionnaire !
  if (questionnaireData['structure_building_property']) {
    if (questionnaireData['structure_building_property'].includes('owns')) {
      publicodesData[PublicodesKeys.BuildingOwner] = 'oui'
    } else {
      publicodesData[PublicodesKeys.BuildingOwner] = 'non'
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
