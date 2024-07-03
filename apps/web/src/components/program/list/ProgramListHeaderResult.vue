<template>
  <div class="fr-grid-row fr-text-center fr-text-left-md">
    <div class="fr-col-12">
      <h1 class="fr-mb-4v fr-text--blue-france">Vos résultats</h1>
    </div>
<<<<<<<< HEAD:packages/web/src/components/questionnaire/result/list/ResultHeader.vue
    <div
      v-if="UsedTrack.isSpecificGoal()"
      class="fr-hidden fr-unhidden-md fr-mb-2v fr-col-12 fr-px-2v fr-px-md-0 fr-text--blue-france"
    >
      <p v-html="resume"></p>
========
    <div class="fr-mt-5v fr-col-12">
      <p
        class="fr-mb-0"
        style="color: #000091"
      >
        🎉 Félicitations, vous avez terminé !
      </p>
    </div>
    <div class="fr-mt-5v fr-col-12 fr-px-2v fr-px-md-0">
      <p v-html="resume" />
>>>>>>>> refs/heads/release/project:apps/web/src/components/program/list/ProgramListHeaderResult.vue
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackStructure from '@/utils/track/trackStructure'
import Translation from '@/utils/translation'
import UsedTrack from '@/utils/track/usedTrack'

const resume: string = Translation.t('programResults.resume', {
  effectif: Translation.t('enterprise.structureSize.' + TrackStructure.getSize()),
  secteur: TrackStructure.getSector(),
  region: TrackStructure.getRegion()
})
</script>
