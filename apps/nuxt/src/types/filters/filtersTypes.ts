import { ThemeType } from '@/types'

export type FiltersType = {
  [FilterItemKeys.themeType]: string | ThemeType
  [FilterItemKeys.typeAid]: string[]
  [FilterItemKeys.operatorAid]: string[]
  [FilterItemKeys.regionAid]: string[]
  [FilterItemKeys.companyData]: boolean
  [key: string]: string | string[] | boolean | ThemeType
}

export enum FilterItemKeys {
  companyData = 'company-data',
  themeType = 'theme-type',
  typeAid = 'type-aid',
  operatorAid = 'operator-aid',
  regionAid = 'region-aid'
}
