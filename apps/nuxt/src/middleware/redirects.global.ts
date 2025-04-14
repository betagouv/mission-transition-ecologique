import { redirects } from '@tee/data/static'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    return
  }
  const { projectSlug, programId } = to.params
  if (programId) {
    const normalizedProgram = Array.isArray(programId) ? programId[0] : programId
    const newProgram = redirects.program_redirects[normalizedProgram]
    if (newProgram) {
      to.params.programId = newProgram
      return navigateTo(to, { redirectCode: 301 })
    }
  }
  if (projectSlug) {
    const normalizedProject = Array.isArray(projectSlug) ? projectSlug[0] : projectSlug
    const newProject = redirects.project_redirects[normalizedProject]
    if (newProject) {
      to.params.projectSlug = newProject
      return navigateTo(to, { redirectCode: 301 })
    }
  }
  return
})
