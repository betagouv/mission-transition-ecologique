import { CompanyDataId, QuestionnaireDataKey } from '@/types/companyDataType'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { StorageDataType } from '@/types/storageType'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data = ref<StorageDataType>(this._storageHandler.getAll() || {})

  static getData() {
    return this._data
  }

  static hasData() {
    return this._data ? Object.entries(this._data).some((datum) => datum !== null) : false
  }

  static setSiret(value: any) {
    this.setItem(CompanyDataId.Siret, value)
  }

  static setSize(value: string) {
    this.setItem(CompanyDataId.Size, value)
  }

  static setItem(key: QuestionnaireDataKey, value: string): void {
    this._storageHandler.setItem(key, value)
    this._updateData()
  }

  static getItem(key: QuestionnaireDataKey): string | null {
    return this._storageHandler.getItem(key)
  }

  static removeItem(key: QuestionnaireDataKey): void {
    this._storageHandler.removeItem(key)
  }

  static clear(): void {
    this._storageHandler.clear()
  }

  private static _updateData() {
    this._data.value = this._storageHandler.getAll() || {}
  }
}
