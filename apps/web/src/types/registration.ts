import { FieldType, EstablishmentFront, StructureSize } from '@/types'
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types'
export enum RegistrationDetailType {
  Siret = 'siret',
  Localisation = 'localisation',
  Activity = 'activity',
  Size = 'size'
}

export type RegistrationDetailElement = {
  icon: string
  title: string
  type: RegistrationDetailType
  tagLabel?: string
  fieldType: FieldType
  selectOptions?: DsfrSelectProps
}

export type RegisterProfile = {
  establishment: EstablishmentFront
  size: StructureSize | undefined
}
