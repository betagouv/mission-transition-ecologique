import { CompanyDataId, QuestionnaireDataKey } from '@/types/companyDataType'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  static getData() {
    return computed(() => this._storageHandler.getAll())
  }

  static setSiret(value: any) {
    this.setItem(CompanyDataId.Siret, value)
  }

  static setSize(value: string) {
    this.setItem(CompanyDataId.Size, value)
  }

  static setItem(key: QuestionnaireDataKey, value: string): void {
    this._storageHandler.setItem(key, value)
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

  static hasData() {
    const data = this.getData()
    return data ? Object.entries(data).some((datum) => datum !== null) : false
  }
}
