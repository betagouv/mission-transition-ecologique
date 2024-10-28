import { EstablishmentFront, StructureSize } from '@tee/common'
import { Region, Sector } from '@/types'

export enum CompanyDataStorageKey {
  Company = 'company',
  Size = 'structure_size'
}

export type ManualCompanyData = {
  region: Region
  secteur: Sector
  denomination: string
}

export type CompanyDataType = {
  [CompanyDataStorageKey.Company]: EstablishmentFront | null | ManualCompanyData
  [CompanyDataStorageKey.Size]: StructureSize | null
}
