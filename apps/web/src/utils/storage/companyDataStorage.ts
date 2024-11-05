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

  static getData(): Ref<CompanyDataType> {
    return this._data
  }

  static hasData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null || this._data.value[CompanyDataStorageKey.Size] !== null
  }

  static hasCompanyData() {
    return this._data.value[CompanyDataStorageKey.Company] !== null
  }

  static hasSize() {
    return this._data.value[CompanyDataStorageKey.Size] !== null
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

  static removeData(): void {
    this._storageHandler.removeItem(CompanyDataStorageKey.Company)
    this._storageHandler.removeItem(CompanyDataStorageKey.Size)
    this.updateData()
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
