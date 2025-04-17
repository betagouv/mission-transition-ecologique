export type RedirectRepositoryType = {
  getByProgramSlug: (slug: string) => string | undefined
  getByProjectSlug: (slug: string) => string | undefined
}
