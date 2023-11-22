export interface NafCode {
  tags: string[]
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

export interface ComCode {
  // Code commune
  COM: string
  // Libelle région
  REGION: string | null
}

export interface Refs {
  NafCodes: NafCode[]
  ComCodes: ComCode[]
}
