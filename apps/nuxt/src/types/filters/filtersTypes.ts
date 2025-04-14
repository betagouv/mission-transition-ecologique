import { ThemeType } from '@/types'

export type FiltersType = {
  [FilterItemKeys.themeType]: string | ThemeType
  [FilterItemKeys.typeAid]: string[]
  [FilterItemKeys.operatorAid]: string[]
  [key: string]: string | string[] | ThemeType
}

export enum FilterItemKeys {
  companyData = 'company-data',
  themeType = 'theme-type',
  typeAid = 'type-aid',
  operatorAid = 'operator-aid',
  regionAid = 'region-aid'
}
