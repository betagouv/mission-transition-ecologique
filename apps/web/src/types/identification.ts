import { EstablishmentFront, StructureSize } from '@/types'
export enum RegisterDetailType {
  Siret = 'siret',
  Localisation = 'localisation',
  Activity = 'activity',
  Size = 'size'
}

export type RegisterDetails = {
  icon: string
  title: string
  description?: string
  if?: boolean
  type: RegisterDetailType
  tagLabel?: string
}

export type RegisterProfile = {
  establishment: EstablishmentFront | undefined
  size: StructureSize | undefined
}
