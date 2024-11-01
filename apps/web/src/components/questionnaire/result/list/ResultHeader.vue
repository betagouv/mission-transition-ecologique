<template>
  <div class="fr-grid-row fr-text-center fr-text-left-md">
    <div class="fr-col-12">
      <h1 class="fr-mb-4v fr-text--blue-france">Vos résultats</h1>
    </div>
    <div
      v-if="UsedTrack.isSpecificGoal() && hasRegisteredData"
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
import TrackStructure from '@/utils/track/trackStructure'
import Translation from '@/utils/translation'
import UsedTrack from '@/utils/track/usedTrack'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

const resume: string = Translation.t('programResults.resume', {
  effectif: Translation.t('enterprise.structureSize.' + (TrackStructure.getSize() ?? CompanyDataStorage.getSize() ?? '')),
  secteur: TrackStructure.getSectorShortLabel() ?? CompanyDataStorage.getSiret()?.secteur ?? '',
  region: TrackStructure.getRegion() ?? CompanyDataStorage.getSiret()?.region ?? ''
})

const hasRegisteredData = ref(CompanyDataStorage.hasData())

watchEffect(() => {
  hasRegisteredData.value = CompanyDataStorage.hasData()
})
</script>
