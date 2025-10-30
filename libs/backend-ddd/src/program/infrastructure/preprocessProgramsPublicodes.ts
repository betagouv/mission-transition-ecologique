import { type ProgramType } from '@tee/data'
import { type PublicodesInputData } from './types'
import {
  QuestionnaireChecker,
  PublicodeObjective,
  PublicodesKeys,
  QuestionnaireData,
  SizeToWorkforce,
  YesNo,
  StructureSize,
  NAF1Letters
} from '@tee/common'

/** preprocesses the data gathered from the questionnaire into variables
 * needed by publicodes */
export const preprocessInputForPublicodes = (
  questionnaireData: QuestionnaireData,
  programData: ProgramType,
  currentDate: string
): PublicodesInputData => {
  const publicodesData: PublicodesInputData = {
    ...questionnaireData,
    [PublicodesKeys.CurrentDate]: currentDate
  }

  setRegion(publicodesData, questionnaireData)
  setLegalCategory(publicodesData, questionnaireData)
  setStructureSize(publicodesData, questionnaireData)
  setCodeNAF(publicodesData, questionnaireData)
  setCodeNaf1(publicodesData, questionnaireData)
  setObjectives(publicodesData, questionnaireData)
  setDateValidity(publicodesData, programData)

  return publicodesData
}

const setRegion = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  if (questionnaireData.region) {
    publicodesData['région'] = questionnaireData.region
  }
}

const setLegalCategory = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  if (questionnaireData.structure_size) {
    if (questionnaireData.structure_size === StructureSize.EI) {
      publicodesData[PublicodesKeys.isMicroEntrepreneur] = YesNo.Yes
    } else {
      publicodesData[PublicodesKeys.isMicroEntrepreneur] = YesNo.No
    }
  }
}

const setStructureSize = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  if (questionnaireData.structure_size) {
    if (questionnaireData.structure_size !== StructureSize.EI) {
      publicodesData[PublicodesKeys.Workforce] = SizeToWorkforce[questionnaireData.structure_size]
    }
  }
}
const setCodeNAF = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  if (questionnaireData.codeNAF) {
    publicodesData[PublicodesKeys.CodeNAF] = enquotePublicodesLiteralString(questionnaireData.codeNAF)
  }
}
const setCodeNaf1 = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  let codeNAF1s: string[] = []
  if (questionnaireData.codeNAF1) {
    codeNAF1s = [questionnaireData.codeNAF1]
  } else {
    codeNAF1s = [...NAF1Letters]
  }

  if (!codeNAF1s) {
    return
  }

  NAF1Letters.forEach((NAF1) => {
    const publicodeNAF1Key = 'entreprise . code NAF niveau 1 . est ' + NAF1
    publicodesData[publicodeNAF1Key] = codeNAF1s.includes(NAF1) ? YesNo.Yes : YesNo.No
  })
}

const setObjectives = (publicodesData: PublicodesInputData, questionnaireData: QuestionnaireData) => {
  publicodesData[PublicodeObjective.EnvironmentalImpact] = QuestionnaireChecker.isEnvironmentalImpact(questionnaireData.recently_audited)
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.EcoDesign] = QuestionnaireChecker.isEcoDesign(questionnaireData.wastes_materials_objective)
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.WasteManagement] = QuestionnaireChecker.isWasteManagement(questionnaireData.wastes_management_objective)
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.WaterConsumption] = QuestionnaireChecker.isWaterConsumption(questionnaireData.water_reduction_objective)
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.SustainableMobility] = QuestionnaireChecker.isSustainableMobility(
    questionnaireData.sustainable_mobility_objective
  )
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.EnergyPerformance] = QuestionnaireChecker.isEnergyPerformance(
    questionnaireData.energy_reduction_objective
  )
    ? YesNo.Yes
    : YesNo.No

  publicodesData[PublicodeObjective.Biodiversity] = YesNo.Yes

  publicodesData[PublicodeObjective.BuildingRenovation] = QuestionnaireChecker.isBuildingProperty(questionnaireData.building_property)
    ? YesNo.Yes
    : YesNo.No
}
const setDateValidity = (publicodesData: PublicodesInputData, programData: ProgramType) => {
  if (programData['début de validité']) {
    publicodesData['dispositif . début de validité'] = programData['début de validité']
  }
  if (programData['fin de validité']) {
    publicodesData['dispositif . fin de validité'] = programData['fin de validité']
  }
}

/** for publicodes to interpret a value as a literal string, it expects
 * extra pair of quotes, added by this function. Without it, it is interpreted as a reference to another rule
 */
const enquotePublicodesLiteralString = (value: string): string => {
  return `"${value}"`
}
