export interface LeadContact {
  phone: string
  email: string
}

export interface LeadContentItem {
  type: 'program' | 'project'
  title: string
  slug: string
  path: string
  themes: string[]
}

export interface LeadAction {
  datetime: string
  event: string
  label: string
}

export interface Lead {
  date: string
  siret: string
  denomination: string
  naf_section: string
  naf_code: string
  region: string
  workforce_min: number | null
  workforce_max: number | null
  first_seen: string
  last_seen: string
  time_spent_minutes: number
  themes: string[]
  content_visited: LeadContentItem[]
  contact: LeadContact
  actions: LeadAction[]
}

export type LeadsData = Lead[]
