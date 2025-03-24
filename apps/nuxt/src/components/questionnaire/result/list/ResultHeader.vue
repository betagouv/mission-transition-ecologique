<template>
  <div class="fr-grid-row fr-text-center fr-text-left-md">
    <div class="fr-col-12">
      <h1
        class="fr-mb-md-4v fr-text--blue-france"
        :class="isSpecificGoal ? 'fr-mb-0' : 'fr-mb-2v'"
      >
        Vos résultats
      </h1>
    </div>
    <div
      v-if="isSpecificGoal && hasRegisteredData"
      class="fr-hidden fr-unhidden-md fr-col-12 fr-px-2v fr-px-md-0 fr-text--blue-france"
    >
      <p
        class="fr-mb-0"
        v-html="resume"
      ></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackStructure from '@/tools/questionnaire/track/trackStructure'
import Translation from '@/tools/translation'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { CompanyData } from '@/tools/companyData'

const resume = computed<string>(() =>
  Translation.t('programResults.resume', {
    effectif: Translation.t('enterprise.structureSize.' + (TrackStructure.getSize() ?? CompanyData.size ?? '')),
    secteur: TrackStructure.getSector() ?? CompanyData.company?.secteur ?? '',
    region: TrackStructure.getRegion() ?? CompanyData.company?.region ?? ''
  })
)
const isSpecificGoal = UsedTrack.isSpecificGoal()
const hasRegisteredData = CompanyData.isDataFull()
</script>
