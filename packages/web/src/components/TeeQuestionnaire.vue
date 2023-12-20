<template>
  <!-- QUESTIONNAIRE -->
  <div ref="trackElement" class="fr-container--fluid">
    <div
      v-show="!programs.programDetail"
      id="trackElement"
      :class="`fr-container--fluid ${tracks.currentStep && tracks.currentStep > 1 ? 'fr-pt-10v' : ''}`"
    >
      <!-- TRACKS INTERFACES -->
      <div ref="tee-app-tracks" class="fr-grid-row fr-grid-row-gutters fr-p-0 fr-justify-center">
        <!-- SIDEBAR MENU (FIL D'ARIANE)-->
        <div
          v-if="needSidebar && tracks.currentStep && tracks.currentStep > 1"
          class="fr-tee-add-padding fr-mt-4v fr-col-3 fr-col-md-4 fr-col-lg-4 fr-col-xl-2 fr-col-sm-hide"
          style="height: 100%"
        >
          <TeeSidebar />
        </div>

        <!-- TRACKS -->
        <div
          id="tee-app-tracks"
          :class="`${tracks.currentStep && tracks.currentStep > 1 ? 'fr-tee-add-padding' : ''} ${getColumnsWidth}`"
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
            <TeeTrack v-if="trackElement" :step="index + 1" :used-track="track" :track-element="trackElement" />
          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL RESULT CARD -->
    <div v-if="programs.programDetail" :class="`fr-container-fluid fr-px-6v fr-px-md-20v fr-mt-10v`">
      <div class="fr-grid-row fr-grid-row-gutters">
        <div class="fr-col">
          <TeeProgramDetail :program-id="programs.programDetail" :track-id="programs.programDetailConfig" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { tracksStore } from '@/stores/tracks'
import { programsStore } from '@/stores/programs'
import { navigationStore } from '@/stores/navigation'
import { TrackComponents, TrackId } from '@/types'
import TeeTrack from '@/components/tracks/TeeTrack.vue'
import TeeSidebar from '@/components/TeeSidebar.vue'
import TeeProgramDetail from '@/components/program/TeeProgramDetail.vue'
import { useDebugStore } from '@/stores/debug'

interface Props {
  seed: TrackId
  programId?: string
}
const props = defineProps<Props>()

const trackElement = ref<HTMLElement | null>(null)

const tracks = tracksStore()
const programs = programsStore()
const nav = navigationStore()
const debugStore = useDebugStore()

const router = useRouter()
const route = useRoute()

watch(
  () => tracks.usedTracks,
  () => {
    if (nav.routerReady) {
      if (tracks.currentStep) {
        nav.setCurrentStep(tracks.currentStep)
      }
      nav.setCurrentTrackId(tracks.currentTrackId as TrackId)
      nav.updateQueries(tracks.getAllUsedTracksValuesPairs)
    }
  }
)

const needSidebar = computed(() => {
  return tracks.seedTrack !== TrackId.Results && tracks.currentStep && tracks.currentStep > 1
})

const getColumnsWidth = computed(() => {
  const currentTrack = tracks.getLastTrack
  const colsStart = 'fr-col-12 fr-col-xl-12'
  const colsTracks = 'fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-6'
  const colsResults = 'fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-8'
  if (tracks.seedTrack === TrackId.Results || (tracks.currentStep === 1 && false)) {
    return colsStart
  } else if ((currentTrack && (currentTrack.component as TrackComponents)) === TrackComponents.Results) {
    return colsResults
  } else {
    return colsTracks
  }
})

const setupFromUrl = async () => {
  const programId = props.programId || (route.query['teeDetail'] as string | null)
  if (programId) {
    await nav.setCurrentDetailId(programId)
    programs.setDetailResult(programId, TrackId.Results)
  }

  nav.setCurrentTrackId(tracks.currentTrackId as TrackId)
  nav.updateQueries(tracks.getAllUsedTracksValuesPairs)
}

onBeforeMount(() => {
  // set first track at mount
  tracks.setSeedTrack(props.seed)
  tracks.addToUsedTracks(props.seed, props.seed)
})

onMounted(async () => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  await router.isReady()
  await setupFromUrl()

  // set detail program ID if any
  if (props.programId) {
    programs.setDetailResult(props.programId, props.seed)
    await nav.setCurrentDetailId(props.programId)
  }
})
</script>
