<template>
  <div class="fr-col-12">
    <div class="fr-grid-row fr-grid-row--center fr-mt-2w">
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
import { ThemeId } from '@/types'
import { computed } from 'vue'
import UsedTrack from '@/utils/track/usedTrack'
import { Theme } from '@/utils/theme'
import { useProgramStore } from '@/stores/program'

const programStore = useProgramStore()

const hasThemeCard = computed(() => {
  return programStore.hasThemeTypeSelected() || (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme())
})

const theme = computed(() => {
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    return Theme.getById(UsedTrack.getPriorityTheme())
  }

  if (programStore.hasThemeTypeSelected()) {
    return programStore.programFilters.themeTypeSelected
  }

  return ''
})
</script>
