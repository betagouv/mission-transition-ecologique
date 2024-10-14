import { StorageHandlerInterface } from '@/utils/storage/StorageHandlerInterface'
import { StorageDataType } from '@/types/storageType'
import { EstablishmentFront } from '@tee/common'

export class LocalStorageHandler implements StorageHandlerInterface {
  setItem(key: string, value: string | EstablishmentFront): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log('Error while setting localStorage item', e)
    }
  }

  getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.log('Error while retrieving localStorage item', e)
      return null
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }

  getAll(): StorageDataType | null {
    try {
      return this.__parseLocalStorage()
    } catch (e) {
      console.log('Error while retrieving all localStorage items', e)
      return null
    }
  }

  __parseLocalStorage(): StorageDataType | null {
    return Object.fromEntries(Object.entries(localStorage).map(([key, value]) => [key, JSON.parse(value)])) as {
      [k: string]: string
    }
  }
}
