import { CompanyDataStorage } from '@/tools/companyData/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'
import {
  CompanyDataRegisterType,
  CompanyDataStorageKey,
  EstablishmentFront,
  LegalCategory,
  ManualCompanyData,
  type QuestionnaireData,
  RegisterDetails,
  QuestionnaireRoute,
  Sector,
  Region,
  ConvertedCommune,
  CompanyLocalisationType,
  SiretValue,
  StructureSize,
  TrackId,
  type TrackOptionsUnion
} from '@/types'
import { CompanyDataType } from '@/tools/companyData/types/companyDataType'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { CompanyDataValidator } from '@/tools/companyData/companyDataSchemaValidator'

export class CompanyData {
  static saveDataToStorage(data: CompanyDataType) {
    CompanyDataStorage.setCompany(data[CompanyDataStorageKey.Company])
    CompanyDataStorage.setSize(data[CompanyDataStorageKey.Size] as StructureSize)
  }

  static get company(): CompanyDataRegisterType {
    return CompanyDataStorage.getData().value[CompanyDataStorageKey.Company]
  }

  static get size(): StructureSize | null {
    return CompanyDataStorage.getData().value[CompanyDataStorageKey.Size]
  }

  static convertLocalisation(geoInfos: ConvertedCommune): CompanyLocalisationType {
    return {
      region: geoInfos.region.nom as Region,
      ville: geoInfos.nom,
      codePostal: geoInfos.codePostal
    }
  }

  static getSiretBasedCompanyData(
    company: CompanyDataType[CompanyDataStorageKey.Company],
    profileData: RegisterDetails
  ): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...company,
      structure_size: profileData.size.value,
      ...profileData.localisation.value
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static getManualCompanyData(profileData: RegisterDetails): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...profileData.localisation.value,
      secteur: profileData.activity.value,
      structure_size: profileData.size.value,
      denomination: `Entreprise : ${profileData.activity.value} - ${profileData.localisation.value?.region}`
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static get dataRef() {
    return CompanyDataStorage.getData()
  }

  static isDataFull() {
    return computed(() => {
      const companyData = this.company

      if (!companyData) {
        return false
      }

      return CompanyDataValidator.validate(companyData)
    })
  }

  static hasCompanyData() {
    return this.company !== null
  }

  static hasSiret() {
    if (!this.company) return false

    return !!(this.company as EstablishmentFront)?.siret
  }
  static hasSize() {
    return this.dataRef.value[CompanyDataStorageKey.Size] !== null
  }

  static resetData() {
    CompanyDataStorage.removeItem(CompanyDataStorageKey.Company)
    CompanyDataStorage.removeItem(CompanyDataStorageKey.Size)
  }

  static updateData() {
    CompanyDataStorage.updateData()
  }

  static saveAndSetUsedTrackStore(data: CompanyDataType) {
    this.saveDataToStorage(data)
    useUsedTrackStore().setFromStorage()
  }

  static populateCompletedQuestionnaire(data: FlatArray<((QuestionnaireData | undefined)[] | undefined)[], 1>[]) {
    if (this.canUseCompanyData(data, CompanyDataStorageKey.Company as keyof QuestionnaireData)) {
      data.push(this.company as QuestionnaireData)
    }

    if (this.canUseCompanyData(data, CompanyDataStorageKey.Size)) {
      data.push({ [CompanyDataStorageKey.Size]: this.size } as QuestionnaireData)
    }
  }

  static populateQuestionnaireData(questionnaireData: { [k: string]: any }) {
    if (this.isDataFull().value) {
      const companyData: CompanyDataType = this.dataRef.value
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
      value: (this.company as EstablishmentFront)?.siret
    })

    useNavigationStore().updateSearchParam({
      name: TrackId.StructureWorkforce,
      value: this.size
    })
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
      CompanyDataStorage.setCompany(questionnaireData)
      if (questionnaireData.legalCategory === LegalCategory.EI) {
        CompanyDataStorage.setSize(StructureSize.EI)
      }
    }

    if (trackId === TrackId.StructureWorkforce) {
      CompanyDataStorage.setSize(value as StructureSize)
    }

    if (trackId === TrackId.Sectors) {
      CompanyDataStorage.setCompany({
        ...this.company,
        secteur: value as Sector
      } as ManualCompanyData)
    }

    if (trackId === TrackId.StructureCity) {
      const localisationData = (selectedOptions[0]?.questionnaireData as CompanyLocalisationType) || {}
      CompanyDataStorage.setCompany({
        ...this.company,
        ...localisationData,
        denomination: `Entreprise : ${this.company?.secteur} - ${value}`
      } as ManualCompanyData)
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
    return this.hasSize() ? this._getQuestionnaireGoal() : TrackId.StructureWorkforce
  }

  private static _getQuestionnaireGoal() {
    if (useUsedTrackStore().getUsedTrack(TrackId.QuestionnaireRoute)?.selected.length) {
      const questionnaireChoice = useUsedTrackStore().getUsedTrack(TrackId.QuestionnaireRoute)?.selected[0].value
      return questionnaireChoice === QuestionnaireRoute.SpecificGoal ? TrackId.Goals : TrackId.BuildingProperty
    }
  }

  private static _canAddSizeToStorage(size: StructureSize, questionnaireData: { [k: string]: any }, key: string) {
    return Object.values(StructureSize).includes(size) && questionnaireData[key] !== size && size !== StructureSize.EI
  }
}
