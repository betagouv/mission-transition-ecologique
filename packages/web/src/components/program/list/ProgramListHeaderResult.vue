<template>
  <div class="fr-grid-row">
    <div class="fr-col-12">
      <h3
        class="fr-mb-2v"
        style="color: #000091; font-size: 2.75rem"
      >
        Vos résultats
      </h3>
    </div>
    <div class="fr-mt-5v fr-col-12">
      <p
        class="fr-mb-0"
        style="color: #000091"
      >
        🎉 Félicitations, vous avez terminé !
      </p>
    </div>
    <div class="fr-mt-5v fr-col-12">
      <p>
        {{ resume }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import Translation from '@/utils/translation'

const useUsedTrack = useUsedTrackStore()
const resume: string = Translation.t('programResults.resume', {
  effectif: useUsedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureWorkforce, 'structure_size')?.toString(),
  secteur: useUsedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.Sectors, 'sector'),
  region: useUsedTrack.findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureRegion, 'region')
})
</script>
