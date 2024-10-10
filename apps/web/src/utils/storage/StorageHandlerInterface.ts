import { StorageDataType } from '@/types/storageType'

export interface StorageHandlerInterface {
  setItem(key: string, value: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
  clear(): void
  getAll(): StorageDataType | null
}
