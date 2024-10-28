import { StorageDataType } from '@/types/storageType'

export interface StorageHandlerInterface {
  setItem(key: string, value: unknown): void
  getItem(key: string): unknown
  removeItem(key: string): void
  clear(): void
  getAll(): StorageDataType | null
}
