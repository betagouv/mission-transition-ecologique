import ProjectApi from '@/service/api/projectApi'
import ProjectFilters from '@/utils/project/projectFilters'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { ProgramData, PublicodeObjective } from '@/types'
import { Project } from '@tee/data'
import Theme from '@/utils/theme'

export const useProjectStore = defineStore('project', () => {
  const projects = computed(async () => {
    return await getProjects()
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

  function getProjectsByEligibility(projects: Project[], filteredPrograms: ProgramData[]): Project[] {
    return projects.filter((project: Project) => {
      return filteredPrograms ? ProjectFilters.filterProjectsByEligibility(project, filteredPrograms) : true
    })
  }

  return {
    projects,
    getProjectsByPublicodeObjective,
    getProjectsByEligibility,
    getProjectsByPublicodeObjectiveAndEligibility
  }
})
