<template>
  <div class="fr-grid-row fr-grid-row--no-gutters fr-pt-3v">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="fr-col-4 fr-col-sm-6 fr-col-md-4 fr-col-xs-12 fr-p-1v"
      @click="selectOption(opt)"
    >
      <ThemeCard :option="opt" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme } from '@/utils/theme'
import { ProgramData, Color, Objective } from '@/types'
import { Project } from '@tee/data'
import { useProjectStore } from '@/stores/project'
import { useProgramStore } from '@/stores/program'
import { useNavigationStore } from '@/stores/navigation'
import ProgramFilter from '@/utils/program/programFilter'

const currentTrack = useTrackStore().current
const themeSelectedOption = ref<ThemeOption>()
const emit = defineEmits(['updateSelection'])
const projectStore = useProjectStore()
const projects = ref<Project[]>()
const programs = ref<ProgramData[]>()
const programStore = useProgramStore()

export interface ThemeOption {
  value: string | undefined
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: Project[]
  color: Color
  moreThanThree: boolean
}

const filterPrograms = (objective: Objective) => {
  return programs.value?.filter((program) => ProgramFilter.byObjective(program, objective))
}

const options = computed<ThemeOption[]>(() => {
  const options: ThemeOption[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    const theme = Theme.getByValue(option.questionnaireData?.priority_objective)
    if (theme && projects.value) {
      const objectiveProjects = projectStore.getProjectsByObjectiveAndEligibility(projects.value, theme.value, filterPrograms(theme.value))
      const projectsInfos: { projects: Project[]; moreThanThree: boolean } = Theme.getPriorityProjects(objectiveProjects)
      options.push({
        value: option.questionnaireData?.priority_objective,
        title: theme.title,
        color: theme.color,
        imgSrc: theme.image,
        altImg: theme.tagLabel,
        highlightProjects: projectsInfos.projects,
        moreThanThree: projectsInfos.moreThanThree
      })
    }
  }
  return options
})

const selectOption = (opt: ThemeOption) => {
  const selectedOptionIndex = currentTrack?.options?.findIndex((option) => option.value === opt.value)
  const selectedOption =
    selectedOptionIndex !== undefined && selectedOptionIndex !== -1 ? currentTrack?.options?.[selectedOptionIndex] : undefined
  if (selectedOption) {
    useUsedTrackStore().setCurrentSelectedOptions([selectedOption])
  }
  themeSelectedOption.value = opt
  const data = {
    option: selectedOption,
    index: selectedOptionIndex,
    remove: selectedOption === undefined
  } as TrackOptionItem
  emit('updateSelection', data)
}

const hasError = ref<boolean>(false)

onBeforeMount(async () => {
  useNavigationStore().hasSpinner = true

  const projectResult = await projectStore.projects
  const programResult = await programStore.programsByUsedTracks
  if (programResult.isOk && projectResult.isOk) {
    projects.value = projectResult.value
    programs.value = programResult.value
  } else {
    hasError.value = true
  }
  useNavigationStore().hasSpinner = false
})
</script>
