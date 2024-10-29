import { CompanyDataStorageKey, CompanyDataType } from '@/types/companyDataType'
import { LocalStorageHandler } from '@/utils/storage/localStorageHandler'
import { EstablishmentFront, StructureSize } from '@tee/common'
import { ref, Ref } from 'vue'

export default class CompanyDataStorage {
  private static readonly _storageHandler = new LocalStorageHandler()

  private static readonly _data: Ref<CompanyDataType> = ref({
    [CompanyDataStorageKey.Siret]: this.getSiret(),
    [CompanyDataStorageKey.Size]: this.getSize()
  })

  static getData(): Ref<CompanyDataType> {
    return this._data
  }

  static hasData() {
    return this._data.value[CompanyDataStorageKey.Siret] !== null || this._data.value[CompanyDataStorageKey.Size] !== null
  }

  static hasSiret() {
    return this._data.value[CompanyDataStorageKey.Siret] !== null
  }

  static hasSize() {
    return this._data.value[CompanyDataStorageKey.Size] !== null
  }

  static setSiret(value: EstablishmentFront) {
    this.setItem(CompanyDataStorageKey.Siret, value)
  }

  static setSize(value: StructureSize) {
    this.setItem(CompanyDataStorageKey.Size, value)
  }

  static setItem(key: CompanyDataStorageKey, value: string | EstablishmentFront | StructureSize): void {
    this._storageHandler.setItem(key, value)
    this._updateData()
  }

  static getItem(key: CompanyDataStorageKey): unknown {
    return this._storageHandler.getItem(key)
  }

  static getSiret(): EstablishmentFront | null {
    return (this.getItem(CompanyDataStorageKey.Siret) as EstablishmentFront) || null
  }

  static getSize(): StructureSize | null {
    return (this.getItem(CompanyDataStorageKey.Size) as StructureSize) || null
  }

  static removeItem(key: CompanyDataStorageKey): void {
    this._storageHandler.removeItem(key)
    this._updateData()
  }

  private static _updateData(): void {
    this._data.value[CompanyDataStorageKey.Siret] = this.getSiret()
    this._data.value[CompanyDataStorageKey.Size] = this.getSize()
  }
}
