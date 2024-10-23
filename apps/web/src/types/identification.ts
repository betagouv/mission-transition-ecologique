import { EstablishmentFront, StructureSize, Sector } from '@/types'
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

export type RegisterDetailSize = Omit<RegisterDetail, 'value'> & { value: StructureSize | undefined }
export type RegisterDetailActivity = Omit<RegisterDetail, 'value'> & { value: Sector | undefined }
export type RegisterDetailUnion = RegisterDetail | RegisterDetailSize | RegisterDetailActivity
export type RegisterProfile = {
  establishment?: EstablishmentFront | undefined
  size: StructureSize | undefined
  localisation: string | undefined
  activity: Sector | string | undefined
}
