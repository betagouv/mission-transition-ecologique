<template>
  <ThemeFilter
    v-if="!hasError"
    :theme="theme as ThemeId"
  />
  <ThemeHeaderCard
    v-if="hasThemeCard && !hasError"
    :theme="theme as ThemeId"
    radius-corner="tr"
    radius-size="2-5v"
  />
</template>
<script setup lang="ts">
import { ThemeId } from '@tee/data'
import { computed } from 'vue'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { FilterItemKeys } from '@/types'
import { useFiltersStore } from '@/stores/filters'
interface Props {
  hasError: boolean
}

defineProps<Props>()

const { hasSpinner } = storeToRefs(useNavigationStore())

const filtersStore = useFiltersStore()

const theme = computed(() => {
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    return UsedTrack.getPriorityTheme()
  }

  if (filtersStore.hasThemeTypeSelected()) {
    return filtersStore.filters[FilterItemKeys.themeType]
  }

  return ''
})

const hasThemeCard = computed(() => {
  return (filtersStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())) && !hasSpinner.value
})
</script>
