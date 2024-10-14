import { CompanyDataStorageKey } from '@/types/companyDataType'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { EstablishmentFront, StructureSize } from '@tee/common'
import { StorageDataType } from '@/types/storageType'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data = ref(this._updateData())

  static getData() {
    return this._data
  }

  static hasData() {
    return this._data.value ? Object.entries(this._data.value).some((datum) => datum !== null) : false
  }

  static setSiret(value: EstablishmentFront) {
    this.setItem(CompanyDataStorageKey.Siret, value)
  }

  static setSize(value: StructureSize) {
    this.setItem(CompanyDataStorageKey.Size, value)
  }

  static setItem(key: CompanyDataStorageKey, value: string | EstablishmentFront): void {
    this._storageHandler.setItem(key, value)
    this._updateData()
  }

  static getItem(key: CompanyDataStorageKey): string | EstablishmentFront | null {
    return this._storageHandler.getItem(key)
  }

  static removeItem(key: CompanyDataStorageKey): void {
    this._storageHandler.removeItem(key)
  }

  private static _updateData(): Ref<StorageDataType> {
    const siret = this.getItem(CompanyDataStorageKey.Siret)
    const size = this.getItem(CompanyDataStorageKey.Size)
    const data: Ref<StorageDataType> = ref({})

    if (siret) {
      data.value[CompanyDataStorageKey.Siret] = siret
    }

    if (size) {
      data.value[CompanyDataStorageKey.Size] = size
    }

    return data
  }
}
