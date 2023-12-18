export interface NafCode {
  [key: string]: string | string[]
  tags: string[]
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

export interface ComCode {
  [key: string]: string | null
  // Code commune
  COM: string
  // Libelle région
  REGION: string | null
}

export interface Refs {
  NafCodes: NafCode[]
  ComCodes: ComCode[]
}
