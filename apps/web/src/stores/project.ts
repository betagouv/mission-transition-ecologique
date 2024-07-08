import ProjectApi from '@/service/api/projectApi'
import ProjectFilters from '@/utils/project/projectFilters'
import { defineStore } from 'pinia'
import { Result } from 'true-myth'
import { computed, ref } from 'vue'
import { PublicodeObjective, Project } from '@/types'

export const useProjectStore = defineStore('project', () => {
  const currentProject = ref<Project>()
  const hasProjects = ref<boolean>(false)

  const projects = computed(async () => {
    const result = await getProjects()
    if (result.isOk) {
      hasProjects.value = result.value.length > 0
    }

    return result
  })

  async function getProjects() {
    return await new ProjectApi().get()
  }

  function getProjectsByObjective(projects: Project[], objectiveType: string): Project[] {
    return projects.filter((project: Project) => {
      return ProjectFilters.filterProgramsByTheme(project, objectiveType as PublicodeObjective)
    })
  }

  async function getProjectBySlug(slug: string): Promise<Result<Project, Error>> {
    currentProject.value = undefined
    if (hasProjects.value) {
      const result = await projects.value
      if (result.isOk) {
        const program = result.value.find((program) => program.slug === slug)
        if (program) {
          currentProject.value = program
          return Result.ok(currentProject.value)
        }

        return Result.err(new Error('Project not found'))
      }

      return Result.err(result.error)
    }

    const result = await new ProjectApi().getOne(slug)
    if (result.isOk) {
      currentProject.value = result.value
    }

    return result
  }

  async function getLinkedProjectsFromCurrent() {
    const resultProjects = await projects.value
    const project = currentProject.value
    if (resultProjects.isOk && project) {
      return resultProjects.value.filter((resultProject) => {
        return project.linkedProjects.includes(resultProject.id)
      })
    }

    return []
  }

  return {
    projects,
    currentProject,
    getProjectsByObjective,
    getProjectById: getProjectBySlug,
    getLinkedProjectsFromCurrent
  }
})
