import { acceptHMRUpdate, defineStore } from 'pinia'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { CompanyDataId, QuestionnaireDataKey } from '@/types/companyDataType'
import { StorageHandlerInterface } from '@/utils/storage/StorageHandlerInterface'

const storageHandler: StorageHandlerInterface = new LocalStorageHandler()

export const useCompanyDataStore = defineStore('companyData', () => {
  const siret = computed(() => {
    return storageHandler.getItem(CompanyDataId.Siret)
  })

  const size = computed(() => {
    return storageHandler.getItem(CompanyDataId.Size)
  })

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

  function getData() {
    return storageHandler.getAll()
  }

  return {
    siret,
    size,
    setItem,
    getItem,
    removeItem,
    clear,
    getData
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompanyDataStore, import.meta.hot))
}
