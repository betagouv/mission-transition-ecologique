import { StorageDriver } from './storageDriverType'
import { createStorage } from 'unstorage'

export class FsStorageDriver implements StorageDriver {
  constructor(private store: ReturnType<typeof createStorage<string>>) {}

  async getItem(key: string): Promise<string | null> {
    return this.store.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.store.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    await this.store.removeItem(key)
  }

  async clear(): Promise<void> {
    await this.store.clear()
  }
}
