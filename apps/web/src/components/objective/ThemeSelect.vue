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
import { ProgramData, Color } from '@/types'
import { Project } from '@tee/data'
import { useProjectStore } from '@/stores/project'
import { useProgramStore } from '@/stores/program'

const currentTrack = useTrackStore().current
const themeSelectedOption = ref<ThemeOption>()
const emit = defineEmits(['updateSelection'])
const projectStore = useProjectStore()
const projects = ref<Project[]>()
const programs = ref<ProgramData[]>()
const programStore = useProgramStore()
const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})
export interface ThemeOption {
  value: string | undefined
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: Project[]
  color: Color
  moreThanThree: boolean
}
const options = computed<ThemeOption[]>(() => {
  const options: ThemeOption[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    const objective = option.questionnaireData?.priority_objective
    const theme = Theme.getByValue(objective)
    const objectiveProjects = projects.value
      ? projectStore.getProjectsByObjectiveAndEligibility(projects.value, objective, filteredPrograms.value ?? undefined)
      : []
    const projectsInfos: { projects: Project[]; moreThanThree: boolean } = Theme.getPriorityProjects(objectiveProjects)
    if (theme) {
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
onBeforeMount(async () => {
  const projectResult = await projectStore.projects
  const programResult = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  if (programResult.isOk && projectResult.isOk) {
    projects.value = projectResult.value
    programs.value = programResult.value
  }
})
</script>
