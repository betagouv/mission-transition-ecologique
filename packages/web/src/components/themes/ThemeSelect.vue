<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="fr-col-4 fr-col-sm-6 fr-col-md-4 fr-col-xs-12"
      @click="updateSelectOption(opt)"
    >
      <ThemeCard
        v-if="projects"
        :is-selected="opt.value === themeSelectedOption?.value"
        :option="opt"
        :projects="projects"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Project, ProjectId } from '@tee/common/src/project/types'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { PublicodeObjective, TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme as ThemeType } from '@/types'
import Theme from '@/utils/theme'
import { useProjectStore } from '@/stores/project'

const currentTrack = useTrackStore().current
const projectStore = useProjectStore()
const projects = ref<Project[]>()
const themeSelectedOption = ref<ThemeOption>()
const emit = defineEmits(['updateSelection'])

export interface ThemeOption {
  value: string | undefined
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: ProjectId[]
  color: string | undefined
}
const options = computed<ThemeOption[]>(() => {
  const options: ThemeOption[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    const optionPublicodeObjective: PublicodeObjective | undefined = Theme.getPublicodeObjectiveByObjective(
      option.questionnaireData?.priority_objective
    )
    const themeOption: ThemeType | undefined = Theme.getByValue(optionPublicodeObjective)
    if (themeOption) {
      options.push({
        value: option.questionnaireData?.priority_objective,
        title: themeOption.title,
        color: themeOption.color,
        imgSrc: themeOption.image,
        altImg: themeOption.tagLabel,
        highlightProjects: themeOption.highlightProjects
      })
    }
  }
  return options
})

onBeforeMount(async () => {
  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    projects.value = projectResult.value
  }
})
const updateSelectOption = (opt: ThemeOption) => {
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
</script>
