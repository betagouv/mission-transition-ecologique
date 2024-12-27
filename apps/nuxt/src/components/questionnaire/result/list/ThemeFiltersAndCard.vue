<template>
  <div class="fr-col-12">
    <div class="fr-grid-row fr-grid-row--center fr-mt-md-2w">
      <div class="fr-container fr-px-0 fr-px-md-3w">
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-mt-3v">
          <ThemeFilter :theme="theme as ThemeId" />
        </div>
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
          <ThemeHeaderCard
            v-if="hasThemeCard"
            :theme="theme as ThemeId"
            radius-corner="tr"
            radius-size="2-5v"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FilterItemKeys, ThemeId } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const theme = computed(() => {
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    return UsedTrack.getPriorityTheme()
  }

  if (filtersStore.hasThemeTypeSelected()) {
    return filtersStore.filters[FilterItemKeys.themeType]
  }

  return ''
})
</script>
