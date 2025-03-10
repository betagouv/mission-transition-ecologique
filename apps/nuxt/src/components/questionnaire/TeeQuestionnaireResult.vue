<template>
  <div
    :id="RouteName.QuestionnaireResult"
    class="fr-container--fluid fr-container--fluid--no-overflow"
  >
    <TeeDsfrBreadcrumb />
    <div
      v-if="hasSpinner"
      class="fr-grid-row fr-grid-row--center"
    >
      <TeeSpinner />
    </div>
    <div v-else>
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-text-center-md">
            <ResultHeader />
          </div>
        </div>
      </div>
      <ResultListInTabs v-if="UsedTrack.isNoSpecificGoal()" />
      <ResultList v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { MetaSeo } from '@/tools/metaSeo'
import { CompanyData } from '@/tools/companyData'

const companyName = CompanyData.company?.denomination
let secteurLabel
if (CompanyData.company?.secteur) {
  secteurLabel = 'du secteur ' + CompanyData.company?.secteur
} else {
  secteurLabel = 'de votre secteur'
}
if (companyName && !companyName.startsWith('Entreprise')) {
  useSeoMeta(
    MetaSeo.get(
      'Transition écologique - Aides adaptées à ' + companyName,
      "Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements disponible pour l'entreprise " +
        companyName
    )
  )
} else {
  useSeoMeta(
    MetaSeo.get(
      'Transition écologique - Aides et financements personnalisés',
      'Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements disponible pour les entreprises ' +
        secteurLabel
    )
  )
}

const hasSpinner = useNavigationStore().hasSpinner
</script>
