export interface CoverageProgram {
  id: string
  title: string
  projectIds: number[]
  aidType: string
  /** null = all metropolitan regions */
  regions: string[] | null
  /** null = all sectors */
  sectors: string[] | null
  minEmployees: number | null
  maxEmployees: number | null
  excludeMicroentrepreneur: boolean
}

export interface CoverageProject {
  id: number
  slug: string
  title: string
  mainTheme: string
}

export interface CoverageData {
  generatedAt: string
  projects: CoverageProject[]
  programs: CoverageProgram[]
}
