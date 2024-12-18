import { ProjectType } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const currentProject = ref<ProjectType>()
  const projects = ref<ProjectType[]>([])
  const hasProjects = ref<boolean>(false)
  const hasError = ref<boolean>(false)

  function reset() {
    projects.value = []
    hasProjects.value = false
    hasError.value = false
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
    getLinkedProjectsFromCurrent
  }
})
