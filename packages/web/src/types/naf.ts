export interface NafCode {
  tags: string[],
  NIV5: string,
  NIV4: string,
  NIV3: string,
  NIV2: string,
  NIV1: string,
  label_vf: string,
}

export interface Refs {
  NafCodes: NafCode[]
}
