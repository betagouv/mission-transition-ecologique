import ProjectApi from '@/service/api/projectApi'
import ProjectFilter from '@/utils/project/projectFilter'
import { defineStore } from 'pinia'
import { Result } from 'true-myth'
import { computed, ref } from 'vue'
import { Project, type ProjectFilterQuery, QuestionnaireData, ThemeId } from '@/types'
import { Theme } from '@/utils/theme'
import { useUsedTrackStore } from './usedTrack'

export const useProjectStore = defineStore('project', () => {
  const currentProject = ref<Project>()
  const hasProjects = ref<boolean>(false)

  const eligibleProjects = computed(async () => {
    return await getFilteredProjects(useUsedTrackStore().getQuestionnaireData())
  })

  async function getFilteredProjects(questionnaireData: QuestionnaireData = {}) {
    const { codeNAF1, sector } = questionnaireData
    const filteredData: ProjectFilterQuery = {
      ...(codeNAF1 && { codeNAF1 }),
      ...(sector && { sector })
    }
    return await new ProjectApi(filteredData).get()
  }

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

  function getProjectsByTheme(projects: Project[], themeType?: ThemeId): Project[] {
    return projects.filter((project: Project) => {
      const hasTheme = themeType
        ? ProjectFilter.byTheme(project, themeType)
        : project.themes.some((themeId) => Theme.getTags().some(({ id }) => id === themeId))
      return hasTheme
    })
  }

  async function getProjectBySlug(slug: string): Promise<Result<Project, Error>> {
    currentProject.value = undefined
    if (hasProjects.value) {
      const result = await projects.value
      if (result.isOk) {
        const project = result.value.find((program) => program.slug === slug)
        if (project) {
          currentProject.value = project
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
    eligibleProjects,
    getProjectsByTheme,
    getProjectBySlug,
    getLinkedProjectsFromCurrent
  }
})
