export interface ContactInfoBodyAttributes {
  NOM: string
  PRENOM: string
  TEL: string
  SIRET?: string
  OPT_IN: boolean
  FORM_NEEDS: string
  PROJECT_NEEDS?: string
  PROJECT_SECTORS?: string[]
  USER_ROLES?: string
  USER_GOALS?: string
  STRUCTURE_SIZE?: string | number
  PROGRAM_ID: string
  ALL_RESPONSES: string
}

export type ContactUpdateAttributes = Partial<ContactInfoBodyAttributes> & { BPI_FRANCE: boolean }

export interface ContactInfo {
  email: string
  attributes: ContactInfoBodyAttributes
}

export interface ContactId {
  id: number
}
