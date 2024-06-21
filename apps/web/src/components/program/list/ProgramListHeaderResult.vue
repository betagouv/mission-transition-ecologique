<template>
  <div class="fr-grid-row fr-text-center fr-text-left-md">
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
    <div class="fr-mt-5v fr-col-12 fr-px-2v fr-px-md-0">
      <p v-html="resume" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackStructure from '@/utils/track/trackStructure'
import Translation from '@/utils/translation'

const resume: string = Translation.t('programResults.resume', {
  effectif: Translation.t('enterprise.structureSize.' + TrackStructure.getSize()),
  secteur: TrackStructure.getSector(),
  region: TrackStructure.getRegion()
})
</script>
