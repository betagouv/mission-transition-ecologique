export type RedirectRepositoryType = {
  getProgramRedirect: (slug: string) => string | undefined
  getProjectRedirect: (slug: string) => string | undefined
}
