<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--center fr-justify-center">
      <div
        v-for="opt in options"
        :key="opt.value"
        class="fr-col-4 fr-mx-1v"
      >
        <ThemeCard :option="opt" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Theme from '../../../../common/src/theme/theme'
import { Project } from '../../../../common/src/project/types'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme as ThemeType } from '@/types'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'

const currentUsedTrack = useUsedTrackStore().current
const currentTrack = useTrackStore().current
console.log(currentTrack, currentUsedTrack)

const emit = defineEmits(['updateSelection'])

const options = computed<(string | { value: string; title: string; imgSrc: string; altImg: string; tags: TeeDsfrTagProps[] })[]>(() => {
  const options: (string | { value: string; title: string; imgSrc: string; altImg: string; tags: TeeDsfrTagProps[] })[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    console.log('option', option)
    const themeOption: ThemeType = Theme.getByValue(option.questionnaireData?.priority_objective)
    const projects: Project[] = Theme.getHighlightProjects(themeOption.highlightProjects)
    console.log(themeOption)
    if (option.label) {
      options.push({
        value: themeOption.value,
        title: themeOption.title,
        imgSrc: themeOption.image,
        altImg: themeOption.tagLabel,
        tags: projects.map((project: Project) => ({ label: project.nameTag }))
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
</script>
