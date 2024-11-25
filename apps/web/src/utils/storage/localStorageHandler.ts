import { StorageHandlerInterface } from '@/utils/storage/storageHandlerInterface'
import { StorageDataType } from '@/types/storageType'

export class LocalStorageHandler implements StorageHandlerInterface {
  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log('Error while setting localStorage item', e)
    }
  }

  getItem(key: string): unknown {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
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
      return this._parseLocalStorage()
    } catch (e) {
      return null
    }
  }

  _parseLocalStorage(): StorageDataType | null {
    return Object.fromEntries(Object.entries(localStorage).map(([key, value]) => [key, JSON.parse(value)])) as {
      [k: string]: string
    }
  }
}
