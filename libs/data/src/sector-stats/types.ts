export interface CompanyRecord {
  naf_section: string
  naf_division: string
  naf_group: string
  naf_class: string
  naf_code: string
  region: string
  wf_min: number | null
  wf_max: number | null
  visited_projects: string[]
  visited_programs: string[]
  themes: string[]
  has_external_click: boolean
  has_opportunity: boolean
  external_click_operators: string[]
  opportunity_operators: string[]
  first_seen: string
}

export interface ContentMeta {
  title: string
  type: 'program' | 'project'
  themes: string[]
  operator?: string
}

export interface SectorStatsData {
  generated_at: string
  date_range: { first: string; last: string }
  companies: CompanyRecord[]
  content_meta: Record<string, ContentMeta>
}
