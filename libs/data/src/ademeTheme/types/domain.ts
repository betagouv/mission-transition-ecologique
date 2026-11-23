export interface AdemeTheme {
  id: number
  code: string
  // Code of the parent theme, null for a root theme
  parentCode: string | null
  label: string
}

export type AdemeThemeReferentialEntry = Omit<AdemeTheme, 'id'>
