<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-hidden-md fr-hidden-lg fr-hidden-xl"><ProgramMobileFilter /></div>
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
      <p v-html="resume"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsedTrackStore } from '@/stores/usedTrack'
import { TrackId } from '@/types'
import Translation from '@/utils/translation'

const usedTrackStore = useUsedTrackStore()
const resume: string = Translation.t('programResults.resume', {
  effectif: Translation.t(
    'enterprise.structureSize.' + usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureWorkforce, 'structure_size')
  ),
  secteur:
    usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'secteur') ??
    usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(TrackId.Sectors, 'sector'),
  region:
    usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'region') ??
    usedTrackStore.findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureRegion, 'region')
})
</script>
