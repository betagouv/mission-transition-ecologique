<template>
  <!-- QUESTIONNAIRE -->
  <div
    ref="trackElement"
    class="fr-container--fluid"
  >
    <div
      id="trackElement"
      :class="`fr-container--fluid ${needSidebar ? 'fr-pt-0v' : ''}`"
    >
      <!-- TRACKS INTERFACES -->
      <div
        ref="tee-app-tracks"
        class="fr-grid-row fr-grid-row-gutters fr-justify-center"
      >
        <!-- SIDEBAR MENU (FIL D'ARIANE)-->
        <div
          v-if="needSidebar"
          class="fr-tee-add-padding fr-mt-10v fr-col-3 fr-col-md-4 fr-col-lg-4 fr-col-xl-2 fr-col-sm-hide"
          style="height: 100%"
        >
          <TeeSidebar />
        </div>

        <!-- TRACKS -->
        <div
          id="tee-app-tracks"
          :class="`${getColumnsWidth}`"
          class="fr-grid-row--center"
        >
          <div
            v-for="(track, index) in tracks.usedTracks"
            :key="track.id"
            :style="`${
              tracks.getTrackBgColor(track.id as TrackId)
                ? 'padding: 0px; background-color:' + tracks.getTrackBgColor(track.id as TrackId)
                : ''
            }`"
            :class="`fr-p-0 fr-mb-${debugStore.is ? '12v' : '0'}`"
          >
            <TeeTrack
              v-if="trackElement && !track.completed"
              :step="index + 1"
              :used-track="track"
              :track-element="trackElement"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useTracksStore } from '@/stores/tracks'
import { navigationStore } from '@/stores/navigation'
import { TrackId } from '@/types'
import TeeTrack from '@/components/tracks/TeeTrack.vue'
import TeeSidebar from '@/components/TeeSidebar.vue'
import { useDebugStore } from '@/stores/debug'

interface Props {
  seed?: TrackId
}
const props = defineProps<Props>()

const trackElement = ref<HTMLElement | null>(null)

const tracks = useTracksStore()
const nav = navigationStore()
const debugStore = useDebugStore()
const router = useRouter()

watch(
  () => tracks.usedTracks,
  () => {
    if (nav.routerReady) {
      if (tracks.currentStep) {
        nav.setCurrentStep(tracks.currentStep)
      }
      nav.setCurrentTrackId(tracks.currentTrackId)
      nav.updateQueries(tracks.getAllUsedTracksValuesPairs)
    }
  }
)

const needSidebar = computed(() => {
  return tracks.currentStep && tracks.currentStep > 1
})

const getColumnsWidth = computed(() => {
  // const colsStart = 'fr-col-12 fr-col-xl-12'
  return 'fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-6'
  // if (tracks.currentStep === 1) {
  //   return colsStart
  // } else {
  //   return colsTracks
  // }
})

const setupFromUrl = () => {
  nav.setCurrentTrackId(tracks.currentTrackId)
  nav.updateQueries(tracks.getAllUsedTracksValuesPairs)
}

onBeforeMount(() => {
  // set first track at mount
  if (props.seed) {
    tracks.setSeedTrack(props.seed)
    tracks.addToUsedTracks(props.seed, props.seed)
  }
})

onMounted(async () => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  await router.isReady()
  setupFromUrl()
})
</script>
