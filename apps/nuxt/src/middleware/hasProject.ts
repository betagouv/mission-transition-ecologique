import { ProjectManager } from '@/tools/project/projectManager'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.projectSlug) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not Found'
    })
  }

  const projectStore = useProjectStore()
  await new ProjectManager().getProjectBySlug(to.params.projectSlug as string)
  if (!projectStore.currentProject) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not Found'
    })
  }
})
