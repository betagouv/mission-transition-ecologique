import { useUsedTrackStore } from '@/stores/usedTrack'
import { CompanyData } from '@/tools/companyData'
import Navigation from '@/tools/navigation'
import { TrackId, TrackOptions } from '@/types'
import { LegalCategory, StructureSize } from '@tee/common'
import { QuestionnaireData as QuestionnaireDataType } from '@/types'

export class QuestionnaireData {
  static get(): QuestionnaireDataType {
    const usedTracks = useUsedTrackStore().usedTracks
    const questionnaireData: { [k: string]: any } = {}
    usedTracks.forEach((usedTrack) => {
      usedTrack.selected.forEach((trackOptions: TrackOptions) => {
        const questionnaireDatum = trackOptions.questionnaireData || {}

        Object.entries(questionnaireDatum).forEach(([key, value]) => {
          questionnaireData[key] = value as unknown
        })

        if (usedTrack.id === TrackId.Siret && questionnaireDatum.legalCategory === LegalCategory.EI) {
          questionnaireData.structure_size = StructureSize.EI
        }
      })
    })
    const navigation = Navigation.getInstance()
    if (!navigation.isCatalog() && !navigation.isCatalogProgramDetail() && !navigation.isHomepage()) {
      questionnaireData.onlyEligible = true
    } else if (navigation.isCatalogPrograms()) {
      questionnaireData.onlyEligible = false
    }

    questionnaireData.is_questionnaire = navigation.isQuestionnaire()

    CompanyData.populateQuestionnaireData(questionnaireData)

    return questionnaireData
  }
}
