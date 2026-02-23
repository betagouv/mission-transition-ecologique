import { CompanyData } from '@/tools/companyData'
import { ProjectManager } from '@/tools/project/projectManager'
import { FilterItemKeys, ProjectId, ProjectType, ThemeId } from '@/types'
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
      const companySelected = CompanyData.isCompanySelected()
      return (
        ProjectFilter.byTheme(project, filtersStore.filters[FilterItemKeys.themeType] as ThemeId) &&
        ProjectFilter.byCompanyData(project, companySelected)
      )
    })
  }

  async function getProjectsFromIds(ids: ProjectId[]) {
    if (projects.value.length === 0) {
      await new ProjectManager().getProjects()
    }

    return projects.value.filter((project) => {
      return ids.includes(project.id)
    })
  }

  const linkedProjects = computed(() => {
    const projectCurrent = currentProject.value
    if (hasProjects.value && projects.value.length > 0 && projectCurrent && projectCurrent.linkedProjects.length > 0) {
      return projects.value.filter((project) => {
        return projectCurrent.linkedProjects.includes(project.id)
      })
    }

    return []
  })

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
    linkedProjects,
    getProjectsByFilters,
    getProjectsFromIds
  }
})
