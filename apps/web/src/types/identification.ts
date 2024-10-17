import { FieldType, EstablishmentFront, StructureSize } from '@/types'
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types'
export enum RegisterDetailType {
  Siret = 'siret',
  Localisation = 'localisation',
  Activity = 'activity',
  Size = 'size'
}

export type RegisterDetails = {
  icon: string
  title: string
  type: RegisterDetailType
  tagLabel?: string
  editable: boolean
  fieldType: FieldType
  selectOptions?: DsfrSelectProps
}

export type RegisterProfile = {
  establishment: EstablishmentFront
  size: StructureSize | undefined
}
