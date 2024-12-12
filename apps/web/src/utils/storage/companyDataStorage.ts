import { CompanyDataRegisterType, CompanyDataStorageKey, CompanyDataType, EstablishmentFront } from '@/types'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { StructureSize } from '@tee/common'
import { ref, Ref } from 'vue'

export class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data: Ref<CompanyDataType> = ref({
    [CompanyDataStorageKey.Company]: this.getCompanyDataFromStorage(),
    [CompanyDataStorageKey.Size]: this.getSize()
  })

  private static readonly _hasData: ComputedRef<boolean> = computed(() => {
    return this._data.value[CompanyDataStorageKey.Company] !== null && this._data.value[CompanyDataStorageKey.Size] !== null
  })

  public static getData(): Ref<CompanyDataType> {
    return this._data
  }

  public static isDataFull() {
    return computed(() => {
      const companyData = this.getCompanyData()

      if (!companyData) {
        return false
      }

      return this._isEstablishmentFront(companyData)
        ? this._isFill<typeof companyData>(companyData, ['denomination'])
        : this._isFill<typeof companyData>(companyData)
    })
  }

  private static _isFill<T extends NonNullable<CompanyDataRegisterType>>(companyData: T, exclude: (keyof T)[] = []): boolean {
    return Object.entries(companyData).every((value, key) => key in exclude || value !== null)
  }

  private static _isEstablishmentFront(value: NonNullable<CompanyDataRegisterType>): value is EstablishmentFront {
    return 'siret' in value
  }

  public static hasCompanyData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null
  }

  public static hasSiret() {
    if (!this._data.value[CompanyDataStorageKey.Company]) return false

    return !!(this._data.value[CompanyDataStorageKey.Company] as EstablishmentFront)?.siret
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

  public static getCompanyDataFromStorage(): CompanyDataType[CompanyDataStorageKey.Company] | null {
    return (this.getItem(CompanyDataStorageKey.Company) as CompanyDataType[CompanyDataStorageKey.Company]) || null
  }

  public static getCompanyData(): CompanyDataType[CompanyDataStorageKey.Company] | null {
    return this._data.value[CompanyDataStorageKey.Company]
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

  static updateData(): void {
    this._data.value[CompanyDataStorageKey.Company] = this.getCompanyDataFromStorage()
    this._data.value[CompanyDataStorageKey.Size] = this.getSize()
  }
}
