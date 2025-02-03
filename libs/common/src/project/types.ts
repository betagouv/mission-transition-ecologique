export interface ProjectFilterQuery {
  codeNAF1?: string
  onlyEligible?: boolean
  sortBy?: ProjectSortBy
}

export enum ProjectSortBy {
  SECTOR = 'sector',
  PRIORITY = 'priority'
}
