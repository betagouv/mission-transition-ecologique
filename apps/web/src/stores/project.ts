import ProjectApi from '@/service/api/projectApi'
import ProjectFilters from '@/utils/project/projectFilters'
import { defineStore } from 'pinia'
import { Result } from 'true-myth'
import { computed, ref } from 'vue'
import { ProgramData, PublicodeObjective, Project } from '@/types'
import { Theme } from '@/utils/theme'

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

  function getProjectsByPublicodeObjectiveAndEligibility(
    projects: Project[],
    objectiveType?: PublicodeObjective,
    filteredPrograms?: ProgramData[]
  ): Project[] {
    return projects.filter((project: Project) => {
      const hasTheme = objectiveType
        ? ProjectFilters.filterProjectsByTheme(project, objectiveType)
        : project.themes.some((themeId) => Theme.getTags().some((theme) => theme.id === themeId))

      console.log('Has theme : ', hasTheme)
      return hasTheme && (filteredPrograms ? ProjectFilters.filterProjectsByEligibility(project, filteredPrograms) : true)
    })
  }

  function getProjectsByPublicodeObjective(projects: Project[], objectiveType?: PublicodeObjective): Project[] {
    return projects.filter((project: Project) => {
      return objectiveType ? ProjectFilters.filterProjectsByTheme(project, objectiveType) : true
    })
  }

  function getProjectsByObjective(projects: Project[], objectiveType: string): Project[] {
    return projects.filter((project: Project) => {
      return ProjectFilters.filterProgramsByTheme(project, objectiveType as PublicodeObjective)
    })
  }

  function getProjectsByEligibility(projects: Project[], filteredPrograms: ProgramData[]): Project[] {
    return projects.filter((project: Project) => {
      return filteredPrograms ? ProjectFilters.filterProjectsByEligibility(project, filteredPrograms) : true
    })
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
    getProjectsByPublicodeObjective,
    getProjectsByEligibility,
    getProjectsByPublicodeObjectiveAndEligibility,
    getProjectBySlug,
    getLinkedProjectsFromCurrent
  }
})
