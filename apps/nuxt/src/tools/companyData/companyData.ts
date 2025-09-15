import { useCompanyDataStore } from '@/stores/companyData'
import { useFiltersStore } from '@/stores/filters'
import { CompanyDataStorage } from '@/tools/companyData/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'
import {
  CompanyDataRegisterType,
  CompanyDataStorageKey,
  EstablishmentFront,
  LegalCategory,
  type QuestionnaireData,
  RegisterDetails,
  Region,
  ConvertedCommune,
  CompanyLocalisationType,
  SiretValue,
  StructureSize,
  TrackId,
  type TrackOptionsUnion,
  CompanyActivityType
} from '@/types'
import { CompanyDataType } from '@/tools/companyData/types/companyDataType'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { CompanyDataValidator } from '@/tools/companyData/companyDataSchemaValidator'

export class CompanyData {
  static saveDataToStorage(data: CompanyDataType) {
    CompanyDataStorage.setCompany(data[CompanyDataStorageKey.Company] as CompanyDataRegisterType)
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
      ...this._patchCompanyData(company, profileData),
      structure_size: profileData.size.value,
      ...profileData.localisation.value,
      ...profileData.activity.value
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static getManualCompanyData(profileData: RegisterDetails): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...profileData.localisation.value,
      ...profileData.activity.value,
      structure_size: profileData.size.value,
      denomination: `Entreprise : ${profileData.activity.value?.secteur}`
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static get dataRef() {
    return CompanyDataStorage.getData()
  }

  static isDataFullComputed() {
    return computed(() => {
      const data = this.dataRef
      const companyData = data.value[CompanyDataStorageKey.Company]
      if (!companyData) {
        useCompanyDataStore().isDataFull = false
        return false
      }

      const isValid = CompanyDataValidator.validate(companyData)
      useCompanyDataStore().isDataFull = isValid
      return isValid
    })
  }

  static hasDataFull() {
    const data = this.dataRef
    const companyData = data.value[CompanyDataStorageKey.Company]
    if (!companyData) {
      return false
    }
    return CompanyDataValidator.validate(companyData)
  }

  static isDataFull() {
    this.setDataFull()
    return useCompanyDataStore().isDataFull
  }

  static setDataFull() {
    useCompanyDataStore().isDataFull = this.hasDataFull()
  }

  static isCompanySelected() {
    return useFiltersStore().companyDataSelected && useCompanyDataStore().isDataFull
  }

  static hasCompanyData() {
    return this.company !== null
  }

  static hasSiret() {
    if (!this.company) {
      return false
    }

    return !!(this.company as EstablishmentFront)?.siret
  }

  static hasSize() {
    return this.dataRef.value[CompanyDataStorageKey.Size] !== null
  }

  static resetData() {
    CompanyDataStorage.removeItem(CompanyDataStorageKey.Company)
    CompanyDataStorage.removeItem(CompanyDataStorageKey.Size)
    this.setDataFull()
  }

  static updateData() {
    CompanyDataStorage.updateData()
  }

  static saveAndSetUsedTrackStore(data: CompanyDataType) {
    this.saveDataToStorage(data)
    useFiltersStore().setCompanyDataSelected(true)
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
    if (this.isDataFull()) {
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
      const questionnaireData = selectedOptions[0].questionnaireData as CompanyDataRegisterType
      CompanyDataStorage.setCompany(this._patchCompanyData(questionnaireData) as CompanyDataRegisterType)
      if (questionnaireData?.legalCategory === LegalCategory.EI) {
        CompanyDataStorage.setSize(StructureSize.EI)
      }
    }

    if (trackId === TrackId.StructureWorkforce) {
      CompanyDataStorage.setSize(value as StructureSize)
    }
    if (trackId === TrackId.Sectors) {
      const activityData = (selectedOptions[0]?.questionnaireData as CompanyActivityType) || {}

      CompanyDataStorage.setCompany({
        ...this.company,
        ...activityData
      } as CompanyDataType[CompanyDataStorageKey.Company])
    }

    if (trackId === TrackId.StructureCity) {
      const localisationData = (selectedOptions[0]?.questionnaireData as CompanyLocalisationType) || {}
      CompanyDataStorage.setCompany({
        ...this.company,
        ...localisationData,
        denomination: `Entreprise : ${this.company?.secteur}`
      } as CompanyDataType[CompanyDataStorageKey.Company])
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

  static toString() {
    return CompanyData.hasCompanyData() ? JSON.stringify(CompanyData.company) : null
  }

  static _patchCompanyData(company: CompanyDataRegisterType, profileData?: RegisterDetails) {
    const denomination = this._getCompanyDenomination(company, profileData)
    return {
      ...company,
      denomination
    }
  }

  private static _getCompanyDenomination(company: CompanyDataRegisterType, profileData?: RegisterDetails) {
    if (company?.denomination && company.denomination.trim() !== '') {
      return company.denomination
    }

    if (company?.siret) {
      return 'SIRET : ' + company.siret
    }

    return `Entreprise : ${profileData?.activity?.value?.secteur ?? company?.secteur}`
  }

  private static _getQuestionnaireGoal() {
    return TrackId.BuildingProperty
  }

  private static _canAddSizeToStorage(size: StructureSize, questionnaireData: { [k: string]: any }, key: string) {
    return Object.values(StructureSize).includes(size) && questionnaireData[key] !== size && size !== StructureSize.EI
  }
}
