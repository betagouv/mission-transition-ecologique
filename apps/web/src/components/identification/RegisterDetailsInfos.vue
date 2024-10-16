<template>
  <div>
    <RegisterDetailElement
      v-for="detail in details"
      :key="detail.title"
      :detail-infos="detail"
    />
    <TeeDsfrButton
      class="fr-bg--yellow"
      label="Enregistrer et fermer"
    />
  </div>
</template>
<script setup lang="ts">
import { EstablishmentFront, RegistrationDetailType, RegistrationDetailElement } from '@/types'

interface Props {
  company: EstablishmentFront
}
defineProps<Props>()

const details: RegistrationDetailElement[] = [
  { title: 'Votre SIRET', icon: 'fr-icon-account-pin-circle-line', type: RegistrationDetailType.Siret },
  { title: 'Localisation', icon: 'fr-icon-map-pin-2-line', type: RegistrationDetailType.Localisation },
  { title: 'Activité', icon: 'fr-icon-briefcase-line', type: RegistrationDetailType.Activity },
  { title: 'Effectif', icon: 'fr-icon-team-line', type: RegistrationDetailType.Size }
]
</script>
