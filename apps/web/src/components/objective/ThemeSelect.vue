<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="fr-col-4 fr-col-sm-6 fr-col-md-4 fr-col-xs-12"
      @click="updateSelectOption(opt)"
    >
      <ThemeCard
        :is-selected="opt.value === themeSelectedOption?.value"
        :option="opt"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme } from '@/utils/theme'
import { Color } from '@/types'
import { ProjectId } from '@tee/data'

const currentTrack = useTrackStore().current
const themeSelectedOption = ref<ThemeOption>()
const emit = defineEmits(['updateSelection'])

export interface ThemeOption {
  value: string | undefined
  title: string
  imgSrc: string
  altImg: string
  highlightProjects: ProjectId[]
  color: Color
}
const options = computed<ThemeOption[]>(() => {
  const options: ThemeOption[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    if (option.questionnaireData?.priority_objective) {
      const optionPublicodeObjective = Theme.getPublicodeObjectiveByObjective(option.questionnaireData?.priority_objective)
      if (optionPublicodeObjective) {
        const themeOption = Theme.getByValue(optionPublicodeObjective)
        if (themeOption) {
          options.push({
            value: option.questionnaireData?.priority_objective,
            title: themeOption.title,
            color: themeOption.color,
            imgSrc: themeOption.image,
            altImg: themeOption.tagLabel,
            highlightProjects: []
          })
        }
      }
    }
  }
  return options
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
