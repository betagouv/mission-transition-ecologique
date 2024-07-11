import ProjectApi from '@/service/api/projectApi'
import ProjectFilters from '@/utils/project/projectFilters'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { ProgramData, PublicodeObjective } from '@/types'
import { Project } from '@tee/data'

export const useProjectStore = defineStore('project', () => {
  const projects = computed(async () => {
    return await getProjects()
  })

  async function getProjects() {
    return await new ProjectApi().get()
  }

  function getProjectsByObjectiveAndEligibility(projects: Project[], objectiveType: string, filteredPrograms?: ProgramData[]): Project[] {
    return projects.filter((project: Project) => {
      return (
        ProjectFilters.filterProjectsByTheme(project, objectiveType as PublicodeObjective) &&
        (filteredPrograms ? ProjectFilters.filterProjectsByEligibility(project, filteredPrograms) : true)
      )
    })
  }

  function getProjectsByObjective(projects: Project[], objectiveType: string): Project[] {
    return projects.filter((project: Project) => {
      return ProjectFilters.filterProjectsByTheme(project, objectiveType as PublicodeObjective)
    })
  }

  function getProjectsByEligibility(projects: Project[], filteredPrograms: ProgramData[]): Project[] {
    return projects.filter((project: Project) => {
      return ProjectFilters.filterProjectsByEligibility(project, filteredPrograms)
    })
  }

  return {
    projects,
    getProjectsByObjective,
    getProjectsByEligibility,
    getProjectsByObjectiveAndEligibility
  }
})
