<template>
  <!-- QUESTIONNAIRE -->
  <client-only fallback-tag="div">
    <template #fallback>
      <div class="fr-container">
        <div class="fr-col-12 fr-col--middle fr-col-justify--center">
          <TeeSpinner />
        </div>
      </div>
    </template>

    <div
      ref="trackElement"
      class="fr-px-0"
    >
      <div
        :id="RouteName.Questionnaire"
        class="fr-container fr-pt-0v"
      >
        <!-- TRACKS INTERFACES -->
        <div
          ref="tee-app-tracks"
          class="fr-grid-row fr-grid-row-gutters fr-justify-center"
        >
          <!-- SIDEBAR MENU (FIL D'ARIANE)-->
          <div
            class="fr-mt-10v fr-col-md-4 fr-col-lg-3 fr-col-sm-hide"
            style="height: 100%"
          >
            <TrackSidebar />
          </div>

          <!-- TRACKS -->
          <div
            id="tee-app-tracks"
            class="fr-grid-row--center fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-9"
          >
            <div
              v-if="trackElement && usedTrackStore.current && trackStore.current"
              class="fr-p-0 fr-mb-0"
            >
              <TrackContent :track-element="trackElement" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import TrackContent from '@/components/questionnaire/track/TrackContent.vue'
import TrackSidebar from '@/components/questionnaire/track/TrackSidebar.vue'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'
import { MetaSeo } from '@/tools/metaSeo'

interface Props {
  trackId: TrackId
}
const props = defineProps<Props>()

const trackElement = ref<HTMLElement | null>(null)

const trackStore = useTrackStore()
const usedTrackStore = useUsedTrackStore()

onBeforeMount(() => {
  usedTrackStore.add(props.trackId, props.trackId)
})

useSeoMeta(
  MetaSeo.get(
    'Identifiez vos projets prioritaires',
    'Vous ne savez pas par où commencer ? En moins de 2 minutes, répondez à quelques questions pour identifier vos projets prioritaires et découvrir les financements disponibles pour votre entreprise.'
  )
)
onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
