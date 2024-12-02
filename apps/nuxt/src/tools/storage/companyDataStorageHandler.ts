import CompanyDataStorage from '@/tools/storage/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'
import {
  CompanyDataStorageKey,
  EstablishmentFront,
  LegalCategory,
  type QuestionnaireData,
  QuestionnaireRoute,
  SiretValue,
  StructureSize,
  TrackId,
  type TrackOptionsUnion
} from '@/types'
import { CompanyDataType } from '@/types/companyDataType'
import { useUsedTrackStore } from '@/stores/usedTrack'

export class CompanyDataStorageHandler {
  static saveDataToStorage(data: CompanyDataType) {
    CompanyDataStorage.setCompanyData(data[CompanyDataStorageKey.Company])
    CompanyDataStorage.setSize(data[CompanyDataStorageKey.Size] as StructureSize)
  }

  static saveAndSetUsedTrackStore(data: CompanyDataType) {
    this.saveDataToStorage(data)
    useUsedTrackStore().setFromStorage()
  }

  static populateCompletedQuestionnaire(data: FlatArray<((QuestionnaireData | undefined)[] | undefined)[], 1>[]) {
    if (this.canUseCompanyData(data, CompanyDataStorageKey.Company as keyof QuestionnaireData)) {
      data.push(CompanyDataStorage.getCompanyData() as QuestionnaireData)
    }

    if (this.canUseCompanyData(data, CompanyDataStorageKey.Size)) {
      data.push({ [CompanyDataStorageKey.Size]: CompanyDataStorage.getSize() } as QuestionnaireData)
    }
  }

  static populateQuestionnaireData(questionnaireData: { [k: string]: any }) {
    if (CompanyDataStorage.hasData().value) {
      const companyData: CompanyDataType = CompanyDataStorage.getData().value
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== null) {
          if (this._canAddSizeToStorage(value as StructureSize, questionnaireData, key)) {
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
    useNavigationStore().updateSearchParam({
      name: TrackId.Siret,
      value: (CompanyDataStorage.getCompanyData() as EstablishmentFront)?.siret
    })

    if (CompanyDataStorage.getSize() === StructureSize.EI) {
      useNavigationStore().deleteSearchParam(TrackId.StructureWorkforce)
    } else {
      useNavigationStore().updateSearchParam({
        name: TrackId.StructureWorkforce,
        value: CompanyDataStorage.getSize()
      })
    }
  }

  static updateRouteFromStorage() {
    this.updateSearchParamFromStorage()
    useNavigationStore().replaceBrowserHistory()
  }

  static canUseCompanyData(data: (QuestionnaireData | undefined)[], key: keyof QuestionnaireData): boolean {
    if (CompanyDataStorage.hasItem(key as CompanyDataStorageKey)) {
      const storageItem = CompanyDataStorage.getItem(key as CompanyDataStorageKey)

      return (
        CompanyDataStorage.hasItem(key as CompanyDataStorageKey) &&
        !data.some((item) => item?.[key] === (typeof storageItem === 'string' ? storageItem : (storageItem as QuestionnaireData)?.[key]))
      )
    }

    return false
  }

  static setDataStorageFromTrack(trackId: TrackId, value: string | string[], selectedOptions: TrackOptionsUnion[]) {
    if (trackId === TrackId.Siret && value !== SiretValue.Wildcard && selectedOptions.length > 0) {
      const questionnaireData = selectedOptions[0].questionnaireData as EstablishmentFront
      CompanyDataStorage.setCompanyData(questionnaireData)
      if (questionnaireData.legalCategory === LegalCategory.EI) {
        CompanyDataStorage.setSize(StructureSize.EI)
      }
    }

    if (trackId === TrackId.StructureWorkforce) {
      CompanyDataStorage.setSize(value as StructureSize)
    }
  }

  static getTrackIdFromStorageKey(key: CompanyDataStorageKey): TrackId {
    switch (key) {
      case CompanyDataStorageKey.Company:
        return TrackId.Siret
      case CompanyDataStorageKey.Size:
        return TrackId.StructureWorkforce
    }
  }

  static getNextTrackStorage() {
    return CompanyDataStorage.hasSize() ? this._getQuestionnaireGoal() : TrackId.StructureWorkforce
  }

  private static _getQuestionnaireGoal() {
    const questionnaireChoice = useUsedTrackStore().getUsedTrack(TrackId.QuestionnaireRoute)?.selected[0].value
    return questionnaireChoice === QuestionnaireRoute.SpecificGoal ? TrackId.Goals : TrackId.BuildingProperty
  }

  private static _canAddSizeToStorage(size: StructureSize, questionnaireData: { [k: string]: any }, key: string) {
    return Object.values(StructureSize).includes(size) && questionnaireData[key] !== size && size !== StructureSize.EI
  }
}
