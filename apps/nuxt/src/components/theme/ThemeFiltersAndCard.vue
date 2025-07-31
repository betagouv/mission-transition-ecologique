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
import { computed } from 'vue'
import { FilterItemKeys, ThemeId } from '@/types'
import { useFiltersStore } from '@/stores/filters'
interface Props {
  hasError: boolean
}

defineProps<Props>()

const filtersStore = useFiltersStore()

const theme = computed(() => {
  if (filtersStore.hasThemeTypeSelected()) {
    return filtersStore.filters[FilterItemKeys.themeType]
  }

  return ''
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})
</script>
