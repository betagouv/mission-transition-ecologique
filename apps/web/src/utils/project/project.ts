import { useProjectStore } from '@/stores/project'
import { Objective, ProgramData, Project as ProjectType } from '@/types'
import { ComputedRef, Ref } from 'vue'

export class Project {
  static readonly filter = (
    projects: Ref<ProjectType[] | undefined>,
    programs: Ref<ProgramData[] | undefined>,
    objective: ComputedRef<Objective | ''>
  ) => {
    return computed(() => {
      if (!projects.value) {
        return undefined
      }

      return useProjectStore().getProjectsByObjectiveAndEligibility(
        projects.value,
        objective.value !== '' ? objective.value : undefined,
        programs.value ?? undefined
      )
    })
  }

  static readonly sort = (projects: ComputedRef<ProjectType[] | undefined>): ComputedRef<ProjectType[]> => {
    return computed(() => {
      if (!projects.value) {
        return []
      }

      return projects.value.slice().sort((a, b) => {
        return a.priority - b.priority
      })
    })
  }
}
