<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="fr-col-3 fr-mx-1v"
    >
      <ThemeCard :option="opt" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Project } from '../../../../common/src/project/types'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme as ThemeType } from '@/types'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import Theme from '@/utils/theme'

const currentUsedTrack = useUsedTrackStore().current
const currentTrack = useTrackStore().current
console.log(currentTrack, currentUsedTrack)

const emit = defineEmits(['updateSelection'])

const options = computed<
  (string | { value: string; title: string; imgSrc: string; altImg: string; tags: TeeDsfrTagProps[]; color: string | undefined })[]
>(() => {
  const options: (
    | string
    | { value: string; title: string; imgSrc: string; altImg: string; tags: TeeDsfrTagProps[]; color: string | undefined }
  )[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    const optionPublicodeObjective = option.questionnaireData?.priority_objective
      ? Theme.getPublicodeObjectiveByObjective(option.questionnaireData?.priority_objective)
      : undefined
    if (optionPublicodeObjective) {
      const themeOption: ThemeType | undefined = Theme.getByValue(optionPublicodeObjective)
      const projects: Project[] = []
      if (option.label && themeOption) {
        options.push({
          value: themeOption.value,
          title: themeOption.title,
          color: themeOption.color,
          imgSrc: themeOption.image,
          altImg: themeOption.tagLabel,
          tags: projects.map((project: Project) => ({ label: project.nameTag, id: project.id, color: themeOption.color }))
        })
      }
    }
  }
  console.log(options)
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
</script>
