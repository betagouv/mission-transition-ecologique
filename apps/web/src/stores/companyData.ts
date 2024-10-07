import { acceptHMRUpdate, defineStore } from 'pinia'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { QuestionnaireDataKey } from '@/types/companyDataType'
import { StorageHandlerInterface } from '@/utils/storage/StorageHandlerInterface'

const storageHandler: StorageHandlerInterface = new LocalStorageHandler()

export const useCompanyDataStore = defineStore('companyData', () => {
  function getData() {
    return storageHandler.getAll()
  }

  function setItem(key: QuestionnaireDataKey, value: string): void {
    storageHandler.setItem(key, value)
  }

  function getItem(key: QuestionnaireDataKey): string | null {
    return storageHandler.getItem(key)
  }

  function removeItem(key: QuestionnaireDataKey): void {
    storageHandler.removeItem(key)
  }

  function clear(): void {
    storageHandler.clear()
  }

  return {
    getData,
    setItem,
    getItem,
    removeItem,
    clear
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompanyDataStore, import.meta.hot))
}
