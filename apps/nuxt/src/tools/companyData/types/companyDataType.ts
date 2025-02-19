import { Region, CompanyActivityType, EstablishmentFront, StructureSize } from '@/types'

export enum CompanyDataStorageKey {
  Company = 'company',
  Size = 'structure_size'
}

export type CompanyDataRegisterType = EstablishmentFront | null

export type CompanyDataType = {
  [CompanyDataStorageKey.Company]: CompanyDataRegisterType
  [CompanyDataStorageKey.Size]: StructureSize | null
}

export type CompanyLocalisationType = {
  region: Region | undefined
  ville: string | undefined
  codePostal: string | undefined
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
  localisation: RegisterDetailLocalisation
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

export type RegisterDetailLocalisation = Omit<RegisterDetail, 'value'> & {
  value: CompanyLocalisationType | undefined
}
export type RegisterDetailActivity = Omit<RegisterDetail, 'value'> & { value: CompanyActivityType | undefined }
export type RegisterDetailUnion = RegisterDetail | RegisterDetailSize | RegisterDetailActivity | RegisterDetailLocalisation
