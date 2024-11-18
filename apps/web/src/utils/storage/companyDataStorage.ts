import { CompanyDataStorageKey, CompanyDataType, ConvertedCommune, RegisterDetails, CompanyLocalisationType, Region } from '@/types'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { StructureSize } from '@tee/common'
import { ref, Ref } from 'vue'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data: Ref<CompanyDataType> = ref({ [CompanyDataStorageKey.Company]: null, [CompanyDataStorageKey.Size]: null })

  static getData(): Ref<CompanyDataType> {
    return this._data
  }

  static hasData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null || this._data.value[CompanyDataStorageKey.Size] !== null
  }

  static setCompany(value: CompanyDataType[CompanyDataStorageKey.Company]) {
    this.setItem(CompanyDataStorageKey.Company, value)
  }

  static setSize(value: StructureSize) {
    this.setItem(CompanyDataStorageKey.Size, value)
  }

  static setItem(key: CompanyDataStorageKey, value: CompanyDataType[CompanyDataStorageKey.Company] | StructureSize): void {
    this._storageHandler.setItem(key, value)
    this.updateData()
  }

  static getItem(key: CompanyDataStorageKey): unknown {
    return this._storageHandler.getItem(key)
  }

  static getCompanyData(): CompanyDataType[CompanyDataStorageKey.Company] | null {
    return (this.getItem(CompanyDataStorageKey.Company) as CompanyDataType[CompanyDataStorageKey.Company]) || null
  }

  static getSize(): StructureSize | null {
    return (this.getItem(CompanyDataStorageKey.Size) as StructureSize) || null
  }

  static convertLocalisation(geoInfos: ConvertedCommune): CompanyLocalisationType {
    return {
      region: geoInfos.region.nom as Region,
      ville: geoInfos.nom,
      codePostal: geoInfos.codePostal
    }
  }

  static getManualCompanyData(profileData: RegisterDetails): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...profileData.localisation.value,
      secteur: profileData.activity.value,
      denomination: `Entreprise : ${profileData.activity.value} - ${profileData.localisation.value?.codePostal}`
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static removeItem(key: CompanyDataStorageKey): void {
    this._storageHandler.removeItem(key)
    this.updateData()
  }

  static updateData(): void {
    this._data.value[CompanyDataStorageKey.Company] = this.getCompanyData()
    this._data.value[CompanyDataStorageKey.Size] = this.getSize()
  }
}
