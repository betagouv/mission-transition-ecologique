<template>
  <DsfrSideMenu>
    <template
      v-for="category in usedCategories"
      :key="category"
    >
      <DsfrSideMenuList id="track-sidemenu">
        <DsfrSideMenuListItem :active="isCurrentCategory(category)">
          <DsfrSideMenuLink
            :active="isCurrentCategory(category)"
            :to="getRouteByCategory(category)"
            :class="getTextColorClass(category)"
            >&nbsp;
            {{ Translation.t(`categories.${category}`) }}
          </DsfrSideMenuLink>
        </DsfrSideMenuListItem>
      </DsfrSideMenuList>
    </template>
  </DsfrSideMenu>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeSidebar > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useNavigationStore } from '@/stores/navigation'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackCategory, TrackId } from '@/types'
import { groupBy } from '@/utils/helpers'
import { Theme } from '@/utils/theme'
import Translation from '@/utils/translation'
import { DsfrSideMenuLink, DsfrSideMenuList, DsfrSideMenuListItem } from '@gouvminint/vue-dsfr'
import { computed } from 'vue'

const trackStore = useTrackStore()
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()
const router = useRouter()

const usedTracksRegrouped = computed(() => {
  const usedTracksByCategory = groupBy(usedTrackStore.usedTracks, 'category')
  if (TrackCategory.ourHelp in usedTracksByCategory) {
    delete usedTracksByCategory[TrackCategory.ourHelp]
  }
  return usedTracksByCategory
})

const isCurrentCategory = (category: string) => {
  return usedTrackStore.current?.category === category
}

const getTextColorClass = (category: string) => {
  if (isCurrentCategory(category)) {
    const themeId = trackStore.getTrack(usedTrackStore.current?.id as TrackId)?.theme

    if (!themeId) {
      return
    }

    return 'fr-text--' + Theme.getColorById(themeId)
  }
}

const getRouteByCategory = (category: string) => {
  if (usedTracksRegrouped.value[category].length) {
    const trackId = usedTracksRegrouped.value[category].find(() => true)?.id
    if (trackId) {
      return router.resolve(navigationStore.routeByTrackId(trackId)).path
    }
  }
}

const usedCategories = computed(() => {
  return Object.keys(usedTracksRegrouped.value)
})
</script>
