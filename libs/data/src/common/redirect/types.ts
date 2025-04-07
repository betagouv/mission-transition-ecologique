export interface RedirectData {
  type: 'program' | 'project'
  id: number
  currentUrl: string
  oldUrls: string[]
}

export interface RedirectJson {
  project_redirects: Record<string, string>
  program_redirects: Record<string, string>
  project_rowid_to_url_mapping: Record<number, string>
  program_rowid_to_url_mapping: Record<number, string>
}
