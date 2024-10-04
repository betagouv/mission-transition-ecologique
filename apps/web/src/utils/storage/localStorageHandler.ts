import { CompanyDataId, CompanyDataType, QuestionnaireDataKey } from '@/types/companyDataType'
import { StorageHandlerInterface } from '@/utils/storage/StorageHandlerInterface'

export class LocalStorageHandler implements StorageHandlerInterface {
  setItem(key: CompanyDataId, value: CompanyDataType[QuestionnaireDataKey]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log('Error while setting localStorage item', e)
    }
  }

  getItem(key: CompanyDataId): CompanyDataType[QuestionnaireDataKey] | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.log('Error while retrieving localStorage item', e)
      return null
    }
  }

  removeItem(key: CompanyDataId): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }

  getAll(): { [k in QuestionnaireDataKey]: CompanyDataType[QuestionnaireDataKey] } | null {
    try {
      return this.__parseLocalStorage()
    } catch (e) {
      console.log('Error while retrieving all localStorage items', e)
      return null
    }
  }

  __parseLocalStorage(): { [k in QuestionnaireDataKey]: CompanyDataType[QuestionnaireDataKey] } | null {
    return Object.fromEntries(Object.entries(localStorage).map(([key, value]) => [key, JSON.parse(value)])) as {
      [k in QuestionnaireDataKey]: CompanyDataType[QuestionnaireDataKey]
    }
  }
}
