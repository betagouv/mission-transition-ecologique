import { CompanyDataStorageKey, CompanyDataType, ConvertedCommune, RegisterDetails, CompanyLocalisationType, Region, EstablishmentFront } from '@/types'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { StructureSize } from '@tee/common'
import { ref, Ref } from 'vue'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data: Ref<CompanyDataType> = ref({
    [CompanyDataStorageKey.Company]: this.getCompanyData(),
    [CompanyDataStorageKey.Size]: this.getSize()
  })

  private static readonly _isDataFull: ComputedRef<boolean> = computed(() => {
    return this._data.value[CompanyDataStorageKey.Company] !== null && this._data.value[CompanyDataStorageKey.Size] !== null
  })

  public static getData(): Ref<CompanyDataType> {
    return this._data
  }

  public static isDataFull() {
    return this._isDataFull
  }

  public static hasCompanyData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null
  }

  public static hasSiret() {
    if (!this._data.value[CompanyDataStorageKey.Company]) return false

    return (
      Object.hasOwn(this._data.value[CompanyDataStorageKey.Company], 'siret') &&
      (this._data.value[CompanyDataStorageKey.Company] as EstablishmentFront).siret !== null
    )
  }
  public static hasSize() {
    return this._data.value[CompanyDataStorageKey.Size] !== null
  }

  public static hasItem(key: CompanyDataStorageKey): boolean {
    return this._storageHandler.getItem(key) !== null
  }

  public static setCompanyData(value: CompanyDataType[CompanyDataStorageKey.Company]) {
    this.setItem(CompanyDataStorageKey.Company, value)
  }

  public static setSize(value: StructureSize) {
    this.setItem(CompanyDataStorageKey.Size, value)
  }

  public static setItem(key: CompanyDataStorageKey, value: CompanyDataType[CompanyDataStorageKey.Company] | StructureSize): void {
    this._storageHandler.setItem(key, value)
    this.updateData()
  }

  public static getItem(key: CompanyDataStorageKey): unknown {
    return this._storageHandler.getItem(key)
  }

  static convertLocalisation(geoInfos: ConvertedCommune): CompanyLocalisationType {
    return {
      region: geoInfos.region.nom as Region,
      ville: geoInfos.nom,
      codePostal: geoInfos.codePostal
    }
  }

  public static getCompanyData(): CompanyDataType[CompanyDataStorageKey.Company] | null {
    return (this.getItem(CompanyDataStorageKey.Company) as CompanyDataType[CompanyDataStorageKey.Company]) || null
  }

  public static getSize(): StructureSize | null {
    return (this.getItem(CompanyDataStorageKey.Size) as StructureSize) || null
  }

  public static removeData(): void {
    Object.values(CompanyDataStorageKey).forEach((key) => {
      this._storageHandler.removeItem(key)
    })
    this.updateData()
  }

  public static removeItem(key: CompanyDataStorageKey): void {
    this._storageHandler.removeItem(key)
    this.updateData()
  }

  static getSiretBasedCompanyData(
    company: CompanyDataType[CompanyDataStorageKey.Company],
    profileData: RegisterDetails
  ): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...company,
      ...profileData.localisation.value
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static getManualCompanyData(profileData: RegisterDetails): CompanyDataType[CompanyDataStorageKey.Company] {
    return {
      ...profileData.localisation.value,
      secteur: profileData.activity.value,
      denomination: `Entreprise : ${profileData.activity.value} - ${profileData.localisation.value?.codePostal}`
    } as CompanyDataType[CompanyDataStorageKey.Company]
  }

  static updateData(): void {
    this._data.value[CompanyDataStorageKey.Company] = this.getCompanyData()
    this._data.value[CompanyDataStorageKey.Size] = this.getSize()
  }
}
