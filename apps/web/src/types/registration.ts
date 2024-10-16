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
}
