import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'
import {
  CompanyDataStorageKey,
  EstablishmentFront,
  type QuestionnaireData,
  SiretValue,
  StructureSize,
  TrackId,
  type TrackOptionsUnion
} from '@/types'
import { CompanyDataType } from '@/types/companyDataType'

export class CompanyDataStorageHandler {
  static populateCompletedQuestionnaire(data: FlatArray<((QuestionnaireData | undefined)[] | undefined)[], 1>[]) {
    if (this.canUseCompanyData(data, CompanyDataStorageKey.Siret)) {
      data.push(CompanyDataStorage.getSiret() as QuestionnaireData)
    }

    if (this.canUseCompanyData(data, CompanyDataStorageKey.Size)) {
      data.push({ [CompanyDataStorageKey.Size]: CompanyDataStorage.getSize() } as QuestionnaireData)
    }
  }

  static populateQuestionnaireData(questionnaireData: { [k: string]: any }) {
    if (CompanyDataStorage.hasData()) {
      const companyData: CompanyDataType = CompanyDataStorage.getData().value
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== null) {
          if (Object.values(StructureSize).includes(value as StructureSize) && questionnaireData[key] !== value) {
            questionnaireData[key] = value
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([k, v]) => {
              if (questionnaireData[k] !== v) {
                questionnaireData[k] = v
              }
            })
          }
        }
      })
    }
  }

  static updateSearchParamFromStorage() {
    if (CompanyDataStorage.hasSiret()) {
      useNavigationStore().updateSearchParam({
        name: TrackId.Siret,
        value: CompanyDataStorage.getSiret()?.siret
      })
    }

    if (CompanyDataStorage.hasSize()) {
      useNavigationStore().updateSearchParam({
        name: TrackId.StructureWorkforce,
        value: CompanyDataStorage.getSize()
      })
    }
  }

  static canUseCompanyData(data: (QuestionnaireData | undefined)[], key: CompanyDataStorageKey): boolean {
    if (CompanyDataStorage.hasItem(key)) {
      const storageItem = CompanyDataStorage.getItem(key)

      return (
        CompanyDataStorage.hasItem(key) &&
        !data.some((item) => item?.[key] === (typeof storageItem === 'string' ? storageItem : (storageItem as QuestionnaireData)?.[key]))
      )
    }

    return false
  }

  static setDataFromTrack(trackId: TrackId, value: string | string[], selectedOptions: TrackOptionsUnion[]) {
    if (trackId === TrackId.Siret && value !== SiretValue.Wildcard && selectedOptions.length > 0) {
      CompanyDataStorage.setSiret(selectedOptions[0].questionnaireData as EstablishmentFront)
    }

    if (trackId === TrackId.StructureWorkforce) {
      CompanyDataStorage.setSize(value as StructureSize)
    }
  }
}
