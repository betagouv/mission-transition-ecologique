import { CompanyDataStorageKey, CompanyDataType } from '@/types'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { StructureSize } from '@tee/common'
import { ref, Ref } from 'vue'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data: Ref<CompanyDataType> = ref({
    [CompanyDataStorageKey.Company]: this.getCompanyData(),
    [CompanyDataStorageKey.Size]: this.getSize()
  })

  private static readonly _hasData: ComputedRef<boolean> = computed(() => {
    return this._data.value[CompanyDataStorageKey.Company] !== null || this._data.value[CompanyDataStorageKey.Size] !== null
  })

  public static getData(): Ref<CompanyDataType> {
    return this._data
  }

  public static hasData() {
    return this._hasData
  }

  public static hasCompanyData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null
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

  static getCompanyData(): CompanyDataType[CompanyDataStorageKey.Company] | null {
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

  static updateData(): void {
    this._data.value[CompanyDataStorageKey.Company] = this.getCompanyData()
    this._data.value[CompanyDataStorageKey.Size] = this.getSize()
  }
}
