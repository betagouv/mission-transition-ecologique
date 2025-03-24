export interface RedirectData {
  type: 'program' | 'project'
  id: number
  currentUrl: string
  oldUrls: string[]
}

export interface RedirectJson {
  project_redirects: { from: string[]; to: string }[]
  program_redirects: { from: string[]; to: string }[]
  project_rowid_to_url_mapping: Record<number, string>
  program_rowid_to_url_mapping: Record<number, string>
}
