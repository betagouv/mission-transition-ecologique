import { EstablishmentFront, StructureSize, CompanyActivityType } from '@tee/common'
import { Region } from '@/types'

export enum CompanyDataStorageKey {
  Company = 'company',
  Size = 'structure_size'
}

export interface ManualCompanyData extends CompanyActivityType {
  region: Region
  denomination: string
}

export type CompanyDataType = {
  [CompanyDataStorageKey.Company]: EstablishmentFront | null | ManualCompanyData
  [CompanyDataStorageKey.Size]: StructureSize | null
}

export enum RegisterDetailType {
  Siret = 'siret',
  Localisation = 'localisation',
  Activity = 'activity',
  Size = 'size'
}

export type RegisterDetails = {
  [key: string]: RegisterDetailUnion
  siret: RegisterDetail
  activity: RegisterDetailActivity
  size: RegisterDetailSize
  localisation: RegisterDetail
}
export type RegisterDetail = {
  icon: string
  title: string
  value: string | undefined
  description?: string
  if?: boolean
  type: RegisterDetailType
  tagLabel?: string
}

export type RegisterDetailSize = Omit<RegisterDetail, 'value'> & {
  value: StructureSize | undefined | null
}
export type RegisterDetailActivity = Omit<RegisterDetail, 'value'> & { value: CompanyActivityType | undefined }
export type RegisterDetailUnion = RegisterDetail | RegisterDetailSize | RegisterDetailActivity
export type RegisterProfile = {
  establishment?: EstablishmentFront | undefined
  size: StructureSize | undefined
  localisation: string | undefined
  activity: string | undefined
}
