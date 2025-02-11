import { FilterItemKeys, ProjectType, ThemeId } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import ProjectFilter from '@/tools/project/projectFilter'

export const useProjectStore = defineStore('project', () => {
  const currentProject = ref<ProjectType>()
  const projects = ref<ProjectType[]>([])
  const hasProjects = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  const filtersStore = useFiltersStore()

  function reset() {
    projects.value = []
    hasProjects.value = false
    hasError.value = false
  }

  function getProjectsByFilters(projects: ProjectType[]) {
    return projects.filter((project: ProjectType) => {
      return (
        ProjectFilter.byTheme(project, filtersStore.filters[FilterItemKeys.themeType] as ThemeId) &&
        ProjectFilter.byCompanyData(project, filtersStore.getCompanyDataSelected().value)
      )
    })
  }

  async function getLinkedProjectsFromCurrent() {
    const projectCurrent = currentProject.value
    if (hasProjects.value && projectCurrent) {
      return projects.value.filter((project) => {
        return projectCurrent.linkedProjects.includes(project.id)
      })
    }

    return []
  }

  return {
    projects,
    hasProjects,
    reset,
    hasError,
    currentProject,
    getLinkedProjectsFromCurrent,
    getProjectsByFilters
  }
})
