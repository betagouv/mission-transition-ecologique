export type ProgramFiltersType = {
  [FilterItemKeys.typeAid]: string[]
  [FilterItemKeys.themeType]: string
  [FilterItemKeys.operatorAid]: string[]
  [FilterItemKeys.regionAid]: string[]
  [FilterItemKeys.companyData]: boolean
  [key: string]: string | string[] | boolean
}

export enum FilterItemKeys {
  companyData = 'company-data',
  themeType = 'theme-type',
  typeAid = 'type-aid',
  operatorAid = 'operator-aid',
  regionAid = 'region-aid'
}
