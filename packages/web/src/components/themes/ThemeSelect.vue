<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="fr-col-4 fr-col-sm-6 fr-col-md-4 fr-col-xs-12"
    >
      <ThemeCard
        v-if="projects"
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

const currentUsedTrack = useUsedTrackStore().current
const currentTrack = useTrackStore().current
console.log(currentTrack, currentUsedTrack)
const projectStore = useProjectStore()
const projects = ref<Project[]>()
const emit = defineEmits(['updateSelection'])

export interface ThemeObjective {
  value: string
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: ProjectId[]
  color: string | undefined
}
const options = computed<ThemeObjective[]>(() => {
  const options: ThemeObjective[] = []
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
        value: themeOption.value,
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

const value = computed({
  get() {
    return currentUsedTrack?.selected.find(() => true)?.value as string | undefined
  },
  set(value: string | undefined) {
    const selectedOptionIndex = currentTrack?.options?.findIndex((option) => option.value === value)
    const selectedOption =
      selectedOptionIndex !== undefined && selectedOptionIndex !== -1 ? currentTrack?.options?.[selectedOptionIndex] : undefined

    if (selectedOption) {
      useUsedTrackStore().setCurrentSelectedOptions([selectedOption])
    }

    const data = {
      option: selectedOption,
      index: selectedOptionIndex,
      remove: selectedOption === undefined
    } as TrackOptionItem
    emit('updateSelection', data)
  }
})

onBeforeMount(async () => {
  const projectResult = await projectStore.projects
  if (projectResult.isOk) {
    projects.value = projectResult.value
  }
})
</script>
